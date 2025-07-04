'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Share2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Monitor,
  Users,
  FileText,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

interface Platform {
  name: string;
  displayName: string;
  category: string;
  capabilities: {
    maxContentLength: number;
    supportsImages: boolean;
    supportsVideo: boolean;
    supportsHashtags: boolean;
    supportsMentions: boolean;
    supportsScheduling: boolean;
  };
}

interface PlatformHealth {
  isOnline: boolean;
  responseTime?: number;
  lastChecked: string;
  errorMessage?: string;
}

interface DistributionJob {
  id: string;
  postId: string;
  platforms: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  results: Record<string, any>;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

interface PlatformDistributionHubProps {
  postId?: string;
  onDistribute?: (jobId: string) => void;
}

export function PlatformDistributionHub({ postId, onDistribute }: PlatformDistributionHubProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformHealth, setPlatformHealth] = useState<Record<string, PlatformHealth>>({});
  const [isDistributing, setIsDistributing] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [jobs, setJobs] = useState<DistributionJob[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  
  // Fetch platforms on component mount
  useEffect(() => {
    fetchPlatforms();
    fetchPlatformHealth();
  }, []);
  
  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/platforms');
      const data = await response.json();
      setPlatforms(data.platforms || []);
    } catch (error) {
      console.error('Error fetching platforms:', error);
      toast.error('Failed to load platforms');
    }
  };
  
  const fetchPlatformHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const response = await fetch('/api/platforms/health');
      const data = await response.json();
      setPlatformHealth(data.platforms || {});
    } catch (error) {
      console.error('Error fetching platform health:', error);
      toast.error('Failed to check platform health');
    } finally {
      setIsLoadingHealth(false);
    }
  };
  
  const handleDistribute = async () => {
    if (!postId || selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }
    
    setIsDistributing(true);
    
    try {
      const scheduledFor = scheduledDate && scheduledTime 
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : undefined;
      
      const response = await fetch('/api/posts/distribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          platforms: selectedPlatforms,
          scheduledFor
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Distribution failed');
      }
      
      toast.success(`Distribution job created: ${data.job.id}`);
      
      if (onDistribute) {
        onDistribute(data.job.id);
      }
      
      // Reset form
      setSelectedPlatforms([]);
      setScheduledDate('');
      setScheduledTime('');
      
    } catch (error) {
      console.error('Error distributing post:', error);
      toast.error(error instanceof Error ? error.message : 'Distribution failed');
    } finally {
      setIsDistributing(false);
    }
  };
  
  const filteredPlatforms = platforms.filter(platform => 
    selectedCategory === 'all' || platform.category === selectedCategory
  );
  
  const categories = [
    { value: 'all', label: 'All Platforms', icon: Monitor },
    { value: 'social', label: 'Social Media', icon: Users },
    { value: 'blogging', label: 'Blogging', icon: FileText },
    { value: 'professional', label: 'Professional', icon: Briefcase },
  ];
  
  const getHealthBadgeColor = (health: PlatformHealth) => {
    if (!health) return 'secondary';
    return health.isOnline ? 'default' : 'destructive';
  };
  
  const getHealthIcon = (health: PlatformHealth) => {
    if (!health) return <AlertCircle className="h-3 w-3" />;
    return health.isOnline ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Distribution Hub</h2>
          <p className="text-muted-foreground">
            Distribute your content across multiple platforms
          </p>
        </div>
        <Button 
          onClick={fetchPlatformHealth} 
          variant="outline" 
          disabled={isLoadingHealth}
        >
          {isLoadingHealth ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Monitor className="h-4 w-4 mr-2" />
          )}
          Check Health
        </Button>
      </div>
      
      <Tabs defaultValue="distribute" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribute">Distribute</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Select Platforms
              </CardTitle>
              <CardDescription>
                Choose platforms to distribute your content to
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="category">Filter by category:</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlatforms.map(platform => {
                  const health = platformHealth[platform.name];
                  const isSelected = selectedPlatforms.includes(platform.name);
                  
                  return (
                    <Card 
                      key={platform.name} 
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPlatforms(prev => 
                            prev.filter(p => p !== platform.name)
                          );
                        } else {
                          setSelectedPlatforms(prev => [...prev, platform.name]);
                        }
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{platform.displayName}</CardTitle>
                          <Checkbox 
                            checked={isSelected}
                            disabled
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {platform.category}
                          </Badge>
                          <Badge 
                            variant={getHealthBadgeColor(health)}
                            className="text-xs flex items-center gap-1"
                          >
                            {getHealthIcon(health)}
                            {health?.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Max length: {platform.capabilities.maxContentLength.toLocaleString()}</div>
                          <div className="flex flex-wrap gap-1">
                            {platform.capabilities.supportsImages && (
                              <Badge variant="secondary" className="text-xs">Images</Badge>
                            )}
                            {platform.capabilities.supportsVideo && (
                              <Badge variant="secondary" className="text-xs">Video</Badge>
                            )}
                            {platform.capabilities.supportsHashtags && (
                              <Badge variant="secondary" className="text-xs">Hashtags</Badge>
                            )}
                            {platform.capabilities.supportsScheduling && (
                              <Badge variant="secondary" className="text-xs">Scheduling</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule Distribution
              </CardTitle>
              <CardDescription>
                Optionally schedule the distribution for later
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled-date">Date</Label>
                  <Input
                    id="scheduled-date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled-time">Time</Label>
                  <Input
                    id="scheduled-time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleDistribute}
              disabled={!postId || selectedPlatforms.length === 0 || isDistributing}
              size="lg"
              className="min-w-32"
            >
              {isDistributing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Distributing...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Distribute ({selectedPlatforms.length})
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Distribution Jobs</CardTitle>
              <CardDescription>
                Track the status of your distribution jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No distribution jobs yet</p>
                <p className="text-sm">Jobs will appear here after you distribute content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure your platform connections and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Platform settings coming soon</p>
                <p className="text-sm">Connect and configure your social media accounts</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
