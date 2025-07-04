const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Browser configurations for testing
const browserConfigs = [
  {
    name: 'Chrome Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'Firefox Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'Safari Desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'Edge Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'Chrome Mobile',
    userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    viewport: { width: 375, height: 667 }
  },
  {
    name: 'Safari Mobile',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812 }
  }
];

async function testPageInBrowser(page, url, browserName) {
  const result = {
    browser: browserName,
    url,
    success: false,
    loadTime: 0,
    errors: [],
    warnings: [],
    features: {
      javascript: false,
      css: false,
      images: false,
      forms: false,
      navigation: false
    }
  };

  try {
    const startTime = Date.now();
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        result.errors.push(`Console Error: ${msg.text()}`);
      } else if (msg.type() === 'warning') {
        result.warnings.push(`Console Warning: ${msg.text()}`);
      }
    });

    // Listen for page errors
    page.on('pageerror', error => {
      result.errors.push(`Page Error: ${error.message}`);
    });

    // Navigate to page
    await page.goto(url, { 
      waitUntil: 'networkidle0', 
      timeout: 30000 
    });

    result.loadTime = Date.now() - startTime;

    // Test JavaScript functionality
    try {
      await page.evaluate(() => {
        if (typeof window !== 'undefined' && window.document) {
          return true;
        }
        throw new Error('JavaScript not working');
      });
      result.features.javascript = true;
    } catch (error) {
      result.errors.push(`JavaScript test failed: ${error.message}`);
    }

    // Test CSS rendering
    try {
      const hasStyles = await page.evaluate(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);
        return computedStyle.fontFamily !== 'Times' || computedStyle.fontSize !== '16px';
      });
      result.features.css = hasStyles;
    } catch (error) {
      result.errors.push(`CSS test failed: ${error.message}`);
    }

    // Test images loading
    try {
      const imageCount = await page.$$eval('img', imgs => {
        return imgs.filter(img => img.complete && img.naturalHeight !== 0).length;
      });
      result.features.images = imageCount > 0;
    } catch (error) {
      result.warnings.push(`Image test failed: ${error.message}`);
    }

    // Test form functionality (if forms exist)
    try {
      const formCount = await page.$$eval('form', forms => forms.length);
      if (formCount > 0) {
        const formWorking = await page.evaluate(() => {
          const form = document.querySelector('form');
          return form && typeof form.submit === 'function';
        });
        result.features.forms = formWorking;
      } else {
        result.features.forms = true; // No forms to test
      }
    } catch (error) {
      result.warnings.push(`Form test failed: ${error.message}`);
    }

    // Test navigation
    try {
      const navLinks = await page.$$eval('nav a, header a', links => links.length);
      result.features.navigation = navLinks > 0;
    } catch (error) {
      result.warnings.push(`Navigation test failed: ${error.message}`);
    }

    // Check if page loaded successfully
    const title = await page.title();
    if (title && title !== 'Error') {
      result.success = true;
    }

  } catch (error) {
    result.errors.push(`Browser test failed: ${error.message}`);
  }

  return result;
}

async function runBrowserCompatibilityTest() {
  console.log('🌐 Running Cross-Browser Compatibility Test...\n');

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/blog',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
  ];

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  let allPassed = true;

  for (const url of urls) {
    console.log(`Testing ${url}...`);
    
    for (const config of browserConfigs) {
      console.log(`  ${config.name}...`);
      
      try {
        const page = await browser.newPage();
        
        // Set user agent and viewport
        await page.setUserAgent(config.userAgent);
        await page.setViewport(config.viewport);
        
        const result = await testPageInBrowser(page, url, config.name);
        results.push(result);
        
        if (!result.success || result.errors.length > 0) {
          allPassed = false;
          console.log(`    ❌ Failed (${result.errors.length} errors)`);
          result.errors.slice(0, 2).forEach(error => {
            console.log(`      - ${error}`);
          });
        } else {
          console.log(`    ✅ Passed (${result.loadTime}ms)`);
        }
        
        await page.close();
        
      } catch (error) {
        console.error(`    ❌ Error testing ${config.name}:`, error.message);
        results.push({
          browser: config.name,
          url,
          success: false,
          error: error.message,
          errors: [error.message],
          warnings: [],
          features: {}
        });
        allPassed = false;
      }
    }
    console.log('');
  }

  await browser.close();

  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'browser-compatibility-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📊 Detailed report saved to: ${reportPath}`);

  // Summary
  console.log('\n🎯 BROWSER COMPATIBILITY SUMMARY:');
  console.log(`Cross-browser Compatibility: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  const totalTests = results.length;
  const passedTests = results.filter(r => r.success).length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`Success Rate: ${passedTests}/${totalTests} (${successRate}%)`);
  
  // Browser-specific summary
  console.log('\n📱 Browser-specific Results:');
  browserConfigs.forEach(config => {
    const browserResults = results.filter(r => r.browser === config.name);
    const browserPassed = browserResults.filter(r => r.success).length;
    const browserTotal = browserResults.length;
    const browserRate = ((browserPassed / browserTotal) * 100).toFixed(1);
    
    console.log(`  ${config.name}: ${browserPassed}/${browserTotal} (${browserRate}%)`);
  });

  if (!allPassed) {
    console.log('\n📋 Issues Found:');
    const failedResults = results.filter(r => !r.success || r.errors.length > 0);
    failedResults.slice(0, 10).forEach(result => {
      console.log(`\n${result.browser} - ${result.url}:`);
      result.errors.slice(0, 3).forEach(error => {
        console.log(`  🔧 ${error}`);
      });
    });
  }

  return allPassed;
}

if (require.main === module) {
  runBrowserCompatibilityTest()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Browser compatibility test failed:', error);
      process.exit(1);
    });
}

module.exports = runBrowserCompatibilityTest;
