/**
 * WebSocket Service for Real-time Updates
 * Provides real-time communication for analytics, notifications, and live updates
 */

import { EventEmitter } from 'events';

export interface WebSocketMessage {
  type: 'analytics_update' | 'alert' | 'notification' | 'metric' | 'connection_status';
  data: any;
  timestamp: Date;
  userId?: string;
  postId?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastPing: Date;
  reconnectAttempts: number;
  latency: number;
}

class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private isManuallyDisconnected = false;
  private subscriptions: Set<string> = new Set();
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    lastPing: new Date(),
    reconnectAttempts: 0,
    latency: 0
  };

  constructor(private wsUrl?: string) {
    super();
    
    // Use environment variable or default to localhost
    this.wsUrl = wsUrl || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
  }

  /**
   * Connect to WebSocket server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          resolve();
          return;
        }

        this.isManuallyDisconnected = false;
        this.ws = new WebSocket(this.wsUrl!);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.connectionStatus.isConnected = true;
          this.connectionStatus.reconnectAttempts = this.reconnectAttempts;
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          
          this.startPing();
          this.resubscribeAll();
          
          this.emit('connected', this.connectionStatus);
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.connectionStatus.isConnected = false;
          this.stopPing();
          
          this.emit('disconnected', { 
            code: event.code, 
            reason: event.reason,
            status: this.connectionStatus 
          });

          if (!this.isManuallyDisconnected && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        // Connection timeout
        setTimeout(() => {
          if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
            this.ws.close();
            reject(new Error('WebSocket connection timeout'));
          }
        }, 10000);

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManuallyDisconnected = true;
    this.stopPing();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.connectionStatus.isConnected = false;
    this.emit('disconnected', { manual: true, status: this.connectionStatus });
  }

  /**
   * Send message to server
   */
  send(message: Omit<WebSocketMessage, 'timestamp'>): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return false;
    }

    try {
      const fullMessage: WebSocketMessage = {
        ...message,
        timestamp: new Date()
      };

      this.ws.send(JSON.stringify(fullMessage));
      return true;
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
      return false;
    }
  }

  /**
   * Subscribe to real-time analytics for specific posts
   */
  subscribeToAnalytics(postIds: string[]): boolean {
    postIds.forEach(postId => this.subscriptions.add(`analytics:${postId}`));
    
    return this.send({
      type: 'analytics_update',
      data: {
        action: 'subscribe',
        postIds
      }
    });
  }

  /**
   * Unsubscribe from analytics
   */
  unsubscribeFromAnalytics(postIds: string[]): boolean {
    postIds.forEach(postId => this.subscriptions.delete(`analytics:${postId}`));
    
    return this.send({
      type: 'analytics_update',
      data: {
        action: 'unsubscribe',
        postIds
      }
    });
  }

  /**
   * Subscribe to notifications
   */
  subscribeToNotifications(): boolean {
    this.subscriptions.add('notifications');
    
    return this.send({
      type: 'notification',
      data: {
        action: 'subscribe'
      }
    });
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN && this.connectionStatus.isConnected;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Update latency for ping messages
      if (message.type === 'connection_status' && message.data.type === 'pong') {
        const now = new Date();
        this.connectionStatus.latency = now.getTime() - this.connectionStatus.lastPing.getTime();
        this.connectionStatus.lastPing = now;
        return;
      }

      // Emit specific events based on message type
      this.emit('message', message);
      this.emit(message.type, message.data);

      // Emit post-specific events
      if (message.postId) {
        this.emit(`${message.type}:${message.postId}`, message.data);
      }

    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    this.connectionStatus.reconnectAttempts = this.reconnectAttempts;

    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${this.reconnectDelay}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // Exponential backoff
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
      });
    }, this.reconnectDelay);
  }

  private startPing(): void {
    this.stopPing();
    
    this.pingTimer = setInterval(() => {
      if (this.isConnected()) {
        this.connectionStatus.lastPing = new Date();
        this.send({
          type: 'connection_status',
          data: { type: 'ping' }
        });
      }
    }, 30000); // Ping every 30 seconds
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private resubscribeAll(): void {
    // Re-establish all subscriptions after reconnection
    const analyticsSubscriptions = Array.from(this.subscriptions)
      .filter(sub => sub.startsWith('analytics:'))
      .map(sub => sub.replace('analytics:', ''));

    if (analyticsSubscriptions.length > 0) {
      this.subscribeToAnalytics(analyticsSubscriptions);
    }

    if (this.subscriptions.has('notifications')) {
      this.subscribeToNotifications();
    }
  }
}

// Create singleton instance
let wsService: WebSocketService | null = null;

export const getWebSocketService = (): WebSocketService => {
  if (!wsService) {
    wsService = new WebSocketService();
  }
  return wsService;
};

// Utility functions
export const connectWebSocket = () => getWebSocketService().connect();
export const disconnectWebSocket = () => getWebSocketService().disconnect();
export const subscribeToRealTimeAnalytics = (postIds: string[]) => 
  getWebSocketService().subscribeToAnalytics(postIds);
export const isWebSocketConnected = () => getWebSocketService().isConnected();

// React hook for WebSocket connection
export const useWebSocket = () => {
  const ws = getWebSocketService();
  
  return {
    connect: () => ws.connect(),
    disconnect: () => ws.disconnect(),
    send: (message: Omit<WebSocketMessage, 'timestamp'>) => ws.send(message),
    subscribe: (event: string, callback: (data: any) => void) => {
      ws.on(event, callback);
      return () => ws.off(event, callback);
    },
    subscribeToAnalytics: (postIds: string[]) => ws.subscribeToAnalytics(postIds),
    unsubscribeFromAnalytics: (postIds: string[]) => ws.unsubscribeFromAnalytics(postIds),
    subscribeToNotifications: () => ws.subscribeToNotifications(),
    isConnected: () => ws.isConnected(),
    getStatus: () => ws.getConnectionStatus()
  };
};
