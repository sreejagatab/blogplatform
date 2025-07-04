const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/blog',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
  ];

  const results = [];

  for (const url of urls) {
    console.log(`Auditing ${url}...`);
    try {
      const runnerResult = await lighthouse(url, options);
      const report = runnerResult.lhr;
      
      const scores = {
        url,
        performance: Math.round(report.categories.performance.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        seo: Math.round(report.categories.seo.score * 100),
        coreWebVitals: {
          lcp: report.audits['largest-contentful-paint']?.displayValue || 'N/A',
          fid: report.audits['max-potential-fid']?.displayValue || 'N/A',
          cls: report.audits['cumulative-layout-shift']?.displayValue || 'N/A',
        }
      };
      
      results.push(scores);
      console.log(`✅ ${url}:`);
      console.log(`  Performance: ${scores.performance}/100`);
      console.log(`  Accessibility: ${scores.accessibility}/100`);
      console.log(`  Best Practices: ${scores.bestPractices}/100`);
      console.log(`  SEO: ${scores.seo}/100`);
      console.log(`  LCP: ${scores.coreWebVitals.lcp}`);
      console.log(`  FID: ${scores.coreWebVitals.fid}`);
      console.log(`  CLS: ${scores.coreWebVitals.cls}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
      results.push({
        url,
        error: error.message,
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0
      });
    }
  }

  await chrome.kill();

  // Save results to file
  const reportPath = path.join(__dirname, '..', 'lighthouse-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📊 Full report saved to: ${reportPath}`);

  // Check if all scores meet the quality gate (>90)
  const qualityGatePassed = results.every(result => 
    !result.error && 
    result.performance >= 90 && 
    result.accessibility >= 90 && 
    result.bestPractices >= 90 && 
    result.seo >= 90
  );

  console.log('\n🎯 QUALITY GATE RESULTS:');
  console.log(`Performance > 90: ${qualityGatePassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (!qualityGatePassed) {
    console.log('\n📋 Issues to fix:');
    results.forEach(result => {
      if (result.error) {
        console.log(`  ${result.url}: ${result.error}`);
      } else {
        if (result.performance < 90) console.log(`  ${result.url}: Performance ${result.performance}/100`);
        if (result.accessibility < 90) console.log(`  ${result.url}: Accessibility ${result.accessibility}/100`);
        if (result.bestPractices < 90) console.log(`  ${result.url}: Best Practices ${result.bestPractices}/100`);
        if (result.seo < 90) console.log(`  ${result.url}: SEO ${result.seo}/100`);
      }
    });
  }

  return qualityGatePassed;
}

if (require.main === module) {
  runLighthouseAudit()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Lighthouse audit failed:', error);
      process.exit(1);
    });
}

module.exports = runLighthouseAudit;
