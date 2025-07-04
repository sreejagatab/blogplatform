/**
 * Platform Integration Test Suite
 * Tests all major platform adapters for proper functionality
 */

import { platformManager } from './platform-manager';
import { BlogPost } from './types';

interface TestResult {
  platform: string;
  success: boolean;
  error?: string;
  capabilities?: any;
  adaptedContent?: any;
}

export class PlatformIntegrationTester {
  private mockPost: BlogPost = {
    id: 'test-post-1',
    title: 'Test Blog Post: The Future of Web Development',
    content: `
      Web development is evolving rapidly with new technologies and frameworks emerging constantly. 
      In this comprehensive guide, we'll explore the latest trends and best practices that every 
      developer should know in 2024.

      ## Key Technologies to Watch

      1. **AI-Powered Development Tools** - Revolutionizing how we write code
      2. **Edge Computing** - Bringing computation closer to users
      3. **WebAssembly** - High-performance web applications
      4. **Progressive Web Apps** - Native-like experiences on the web

      The future looks bright for web developers who stay current with these emerging technologies.
      What are your thoughts on these trends? Share your experience in the comments!

      #WebDevelopment #Technology #AI #Programming #WebDev #TechTrends
    `,
    excerpt: 'Explore the latest trends and best practices in web development for 2024.',
    slug: 'future-of-web-development-2024',
    status: 'PUBLISHED',
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'test-author',
    categoryId: 'tech',
    featuredImage: 'https://example.com/featured-image.jpg',
    tags: ['web-development', 'technology', 'ai', 'programming'],
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    shareCount: 45
  };

  async runFullIntegrationTest(): Promise<TestResult[]> {
    console.log('🚀 Starting Platform Integration Test Suite...');
    
    const results: TestResult[] = [];
    const platforms = platformManager.getAvailablePlatforms();
    
    console.log(`📋 Testing ${platforms.length} platform adapters...`);

    for (const platformName of platforms) {
      try {
        console.log(`\n🔍 Testing ${platformName}...`);
        const result = await this.testPlatform(platformName);
        results.push(result);
        
        if (result.success) {
          console.log(`✅ ${platformName}: PASSED`);
        } else {
          console.log(`❌ ${platformName}: FAILED - ${result.error}`);
        }
      } catch (error) {
        console.log(`💥 ${platformName}: ERROR - ${error}`);
        results.push({
          platform: platformName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    this.printTestSummary(results);
    return results;
  }

  private async testPlatform(platformName: string): Promise<TestResult> {
    try {
      const adapter = platformManager.getAdapter(platformName);
      
      if (!adapter) {
        return {
          platform: platformName,
          success: false,
          error: 'Adapter not found'
        };
      }

      // Test 1: Get capabilities
      const capabilities = adapter.getCapabilities();
      if (!capabilities) {
        return {
          platform: platformName,
          success: false,
          error: 'Failed to get capabilities'
        };
      }

      // Test 2: Content adaptation
      const adaptedContent = await adapter.adaptContent(this.mockPost);
      if (!adaptedContent || !adaptedContent.content) {
        return {
          platform: platformName,
          success: false,
          error: 'Failed to adapt content'
        };
      }

      // Test 3: Validate adapted content length
      if (adaptedContent.content.length > capabilities.maxContentLength) {
        return {
          platform: platformName,
          success: false,
          error: `Adapted content exceeds max length (${adaptedContent.content.length} > ${capabilities.maxContentLength})`
        };
      }

      // Test 4: Status check (without authentication)
      const status = await adapter.getStatus();
      if (!status) {
        return {
          platform: platformName,
          success: false,
          error: 'Failed to get status'
        };
      }

      return {
        platform: platformName,
        success: true,
        capabilities,
        adaptedContent: {
          title: adaptedContent.title,
          contentLength: adaptedContent.content.length,
          hashtagCount: adaptedContent.hashtags?.length || 0,
          hasMedia: (adaptedContent.mediaUrls?.length || 0) > 0
        }
      };

    } catch (error) {
      return {
        platform: platformName,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private printTestSummary(results: TestResult[]): void {
    const passed = results.filter(r => r.success).length;
    const failed = results.length - passed;
    const passRate = ((passed / results.length) * 100).toFixed(1);

    console.log('\n' + '='.repeat(60));
    console.log('📊 PLATFORM INTEGRATION TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Platforms Tested: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Pass Rate: ${passRate}%`);
    console.log('='.repeat(60));

    if (failed > 0) {
      console.log('\n❌ FAILED PLATFORMS:');
      results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  • ${r.platform}: ${r.error}`);
        });
    }

    if (passed > 0) {
      console.log('\n✅ SUCCESSFUL PLATFORMS:');
      results
        .filter(r => r.success)
        .forEach(r => {
          console.log(`  • ${r.platform}: Content adapted (${r.adaptedContent?.contentLength} chars, ${r.adaptedContent?.hashtagCount} hashtags)`);
        });
    }

    console.log('\n🎉 Integration test completed!');
  }

  async testSpecificPlatform(platformName: string): Promise<TestResult> {
    console.log(`🔍 Testing specific platform: ${platformName}`);
    const result = await this.testPlatform(platformName);
    
    console.log('\n' + '='.repeat(40));
    console.log(`📊 ${platformName.toUpperCase()} TEST RESULT`);
    console.log('='.repeat(40));
    
    if (result.success) {
      console.log('✅ Status: PASSED');
      console.log(`📝 Content Length: ${result.adaptedContent?.contentLength} chars`);
      console.log(`🏷️  Hashtags: ${result.adaptedContent?.hashtagCount}`);
      console.log(`🖼️  Has Media: ${result.adaptedContent?.hasMedia ? 'Yes' : 'No'}`);
      
      if (result.capabilities) {
        console.log('\n📋 Platform Capabilities:');
        console.log(`  • Max Content Length: ${result.capabilities.maxContentLength}`);
        console.log(`  • Supports Images: ${result.capabilities.supportsImages ? 'Yes' : 'No'}`);
        console.log(`  • Supports Video: ${result.capabilities.supportsVideo ? 'Yes' : 'No'}`);
        console.log(`  • Supports Hashtags: ${result.capabilities.supportsHashtags ? 'Yes' : 'No'}`);
        console.log(`  • Supports Scheduling: ${result.capabilities.supportsScheduling ? 'Yes' : 'No'}`);
      }
    } else {
      console.log('❌ Status: FAILED');
      console.log(`💥 Error: ${result.error}`);
    }
    
    console.log('='.repeat(40));
    
    return result;
  }

  async validatePlatformHealth(): Promise<{ [platform: string]: boolean }> {
    console.log('🏥 Validating Platform Health...');
    
    const platforms = platformManager.getAvailablePlatforms();
    const healthStatus: { [platform: string]: boolean } = {};
    
    for (const platformName of platforms) {
      try {
        const adapter = platformManager.getAdapter(platformName);
        if (adapter) {
          const status = await adapter.getStatus();
          healthStatus[platformName] = status.isOnline !== false; // Consider undefined as healthy for testing
        } else {
          healthStatus[platformName] = false;
        }
      } catch (error) {
        healthStatus[platformName] = false;
      }
    }
    
    const healthyCount = Object.values(healthStatus).filter(Boolean).length;
    const totalCount = Object.keys(healthStatus).length;
    
    console.log(`🏥 Platform Health: ${healthyCount}/${totalCount} platforms healthy`);
    
    return healthStatus;
  }
}

// Export singleton instance
export const platformTester = new PlatformIntegrationTester();

// Export test functions for easy access
export const runPlatformTests = () => platformTester.runFullIntegrationTest();
export const testPlatform = (platform: string) => platformTester.testSpecificPlatform(platform);
export const checkPlatformHealth = () => platformTester.validatePlatformHealth();
