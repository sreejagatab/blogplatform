const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function checkSEOElements(page, url) {
  const seoData = {
    url,
    title: null,
    metaDescription: null,
    metaKeywords: null,
    h1Tags: [],
    h2Tags: [],
    images: [],
    links: [],
    openGraph: {},
    twitterCard: {},
    structuredData: [],
    issues: [],
    score: 0
  };

  try {
    // Get basic meta information
    seoData.title = await page.$eval('title', el => el.textContent).catch(() => null);
    seoData.metaDescription = await page.$eval('meta[name="description"]', el => el.getAttribute('content')).catch(() => null);
    seoData.metaKeywords = await page.$eval('meta[name="keywords"]', el => el.getAttribute('content')).catch(() => null);

    // Get heading structure
    seoData.h1Tags = await page.$$eval('h1', els => els.map(el => el.textContent.trim()));
    seoData.h2Tags = await page.$$eval('h2', els => els.map(el => el.textContent.trim()));

    // Get images without alt text
    seoData.images = await page.$$eval('img', imgs => 
      imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: !!img.alt
      }))
    );

    // Get internal and external links
    seoData.links = await page.$$eval('a[href]', links => 
      links.map(link => ({
        href: link.href,
        text: link.textContent.trim(),
        isExternal: link.href.startsWith('http') && !link.href.includes('localhost'),
        hasText: !!link.textContent.trim()
      }))
    );

    // Get Open Graph tags
    const ogTags = await page.$$eval('meta[property^="og:"]', metas => 
      metas.reduce((acc, meta) => {
        acc[meta.getAttribute('property')] = meta.getAttribute('content');
        return acc;
      }, {})
    );
    seoData.openGraph = ogTags;

    // Get Twitter Card tags
    const twitterTags = await page.$$eval('meta[name^="twitter:"]', metas => 
      metas.reduce((acc, meta) => {
        acc[meta.getAttribute('name')] = meta.getAttribute('content');
        return acc;
      }, {})
    );
    seoData.twitterCard = twitterTags;

    // Get structured data
    const structuredData = await page.$$eval('script[type="application/ld+json"]', scripts => 
      scripts.map(script => {
        try {
          return JSON.parse(script.textContent);
        } catch {
          return null;
        }
      }).filter(Boolean)
    );
    seoData.structuredData = structuredData;

  } catch (error) {
    seoData.issues.push(`Error extracting SEO data: ${error.message}`);
  }

  return seoData;
}

function analyzeSEO(seoData) {
  let score = 100;
  const issues = [];

  // Title checks
  if (!seoData.title) {
    issues.push('Missing page title');
    score -= 15;
  } else if (seoData.title.length < 30 || seoData.title.length > 60) {
    issues.push(`Title length (${seoData.title.length}) should be 30-60 characters`);
    score -= 5;
  }

  // Meta description checks
  if (!seoData.metaDescription) {
    issues.push('Missing meta description');
    score -= 15;
  } else if (seoData.metaDescription.length < 120 || seoData.metaDescription.length > 160) {
    issues.push(`Meta description length (${seoData.metaDescription.length}) should be 120-160 characters`);
    score -= 5;
  }

  // H1 checks
  if (seoData.h1Tags.length === 0) {
    issues.push('Missing H1 tag');
    score -= 10;
  } else if (seoData.h1Tags.length > 1) {
    issues.push(`Multiple H1 tags found (${seoData.h1Tags.length}). Should have only one.`);
    score -= 5;
  }

  // Image alt text checks
  const imagesWithoutAlt = seoData.images.filter(img => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
    score -= Math.min(10, imagesWithoutAlt.length * 2);
  }

  // Link text checks
  const linksWithoutText = seoData.links.filter(link => !link.hasText);
  if (linksWithoutText.length > 0) {
    issues.push(`${linksWithoutText.length} links missing descriptive text`);
    score -= Math.min(5, linksWithoutText.length);
  }

  // Open Graph checks
  const requiredOG = ['og:title', 'og:description', 'og:type', 'og:url'];
  const missingOG = requiredOG.filter(tag => !seoData.openGraph[tag]);
  if (missingOG.length > 0) {
    issues.push(`Missing Open Graph tags: ${missingOG.join(', ')}`);
    score -= missingOG.length * 3;
  }

  // Twitter Card checks
  if (!seoData.twitterCard['twitter:card']) {
    issues.push('Missing Twitter Card meta tag');
    score -= 5;
  }

  // Structured data checks
  if (seoData.structuredData.length === 0) {
    issues.push('No structured data found');
    score -= 10;
  }

  return {
    score: Math.max(0, score),
    issues
  };
}

async function runSEOAudit() {
  console.log('🔍 Running SEO Audit...\n');

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/blog',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
  ];

  const browser = await puppeteer.launch({ headless: true });
  const results = [];
  let allPassed = true;

  for (const url of urls) {
    console.log(`Auditing ${url}...`);
    
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      const seoData = await checkSEOElements(page, url);
      const analysis = analyzeSEO(seoData);
      
      const result = {
        ...seoData,
        score: analysis.score,
        issues: [...seoData.issues, ...analysis.issues]
      };
      
      results.push(result);
      
      if (result.score < 90) {
        allPassed = false;
        console.log(`❌ ${url}: SEO Score ${result.score}/100`);
        result.issues.forEach(issue => {
          console.log(`  - ${issue}`);
        });
      } else {
        console.log(`✅ ${url}: SEO Score ${result.score}/100`);
      }
      
      await page.close();
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
      results.push({
        url,
        error: error.message,
        score: 0,
        issues: [error.message]
      });
      allPassed = false;
    }
  }

  await browser.close();

  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'seo-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Detailed report saved to: ${reportPath}`);

  // Summary
  console.log('\n🎯 SEO AUDIT SUMMARY:');
  console.log(`SEO Score > 90: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  console.log(`Average SEO Score: ${avgScore.toFixed(1)}/100`);
  
  if (!allPassed) {
    console.log('\n📋 Priority Issues to Fix:');
    results.forEach(result => {
      if (result.score < 90) {
        console.log(`\n${result.url} (Score: ${result.score}/100):`);
        result.issues.slice(0, 5).forEach(issue => {
          console.log(`  🔧 ${issue}`);
        });
      }
    });
  }

  return allPassed;
}

if (require.main === module) {
  runSEOAudit()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('SEO audit failed:', error);
      process.exit(1);
    });
}

module.exports = runSEOAudit;
