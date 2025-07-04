const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function checkSecurityHeaders(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 10000
    }, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

async function runSecurityAudit() {
  console.log('🔒 Running Security Headers Audit...\n');

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/blog',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
    'http://localhost:3000/auth/signin',
  ];

  const requiredHeaders = {
    'x-frame-options': {
      name: 'X-Frame-Options',
      expected: ['DENY', 'SAMEORIGIN'],
      description: 'Prevents clickjacking attacks'
    },
    'x-content-type-options': {
      name: 'X-Content-Type-Options',
      expected: ['nosniff'],
      description: 'Prevents MIME type sniffing'
    },
    'referrer-policy': {
      name: 'Referrer-Policy',
      expected: ['strict-origin-when-cross-origin', 'strict-origin', 'no-referrer'],
      description: 'Controls referrer information'
    },
    'x-xss-protection': {
      name: 'X-XSS-Protection',
      expected: ['1; mode=block', '0'],
      description: 'XSS protection (legacy but still useful)'
    },
    'content-security-policy': {
      name: 'Content-Security-Policy',
      expected: null, // Will check if present
      description: 'Prevents XSS and data injection attacks'
    },
    'strict-transport-security': {
      name: 'Strict-Transport-Security',
      expected: null, // Will check if present for HTTPS
      description: 'Enforces HTTPS connections'
    },
    'permissions-policy': {
      name: 'Permissions-Policy',
      expected: null, // Will check if present
      description: 'Controls browser features access'
    }
  };

  const results = [];
  let allPassed = true;

  for (const url of urls) {
    console.log(`Auditing ${url}...`);
    
    try {
      const response = await checkSecurityHeaders(url);
      const headers = response.headers;
      
      const result = {
        url,
        statusCode: response.statusCode,
        securityHeaders: {},
        missing: [],
        warnings: []
      };

      // Check each required header
      for (const [headerKey, config] of Object.entries(requiredHeaders)) {
        const headerValue = headers[headerKey.toLowerCase()];
        
        if (headerValue) {
          result.securityHeaders[config.name] = headerValue;
          
          // Validate header value if expected values are defined
          if (config.expected && !config.expected.some(expected => 
            headerValue.toLowerCase().includes(expected.toLowerCase())
          )) {
            result.warnings.push({
              header: config.name,
              value: headerValue,
              expected: config.expected,
              description: config.description
            });
          }
        } else {
          result.missing.push({
            header: config.name,
            description: config.description
          });
          
          // HSTS is only required for HTTPS
          if (headerKey !== 'strict-transport-security' || url.startsWith('https:')) {
            allPassed = false;
          }
        }
      }

      results.push(result);
      
      if (result.missing.length > 0 || result.warnings.length > 0) {
        console.log(`❌ ${url}: Security issues found`);
        result.missing.forEach(missing => {
          console.log(`  Missing: ${missing.header} - ${missing.description}`);
        });
        result.warnings.forEach(warning => {
          console.log(`  Warning: ${warning.header} has unexpected value: ${warning.value}`);
        });
      } else {
        console.log(`✅ ${url}: All security headers present and valid`);
      }
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
      results.push({
        url,
        error: error.message,
        securityHeaders: {},
        missing: [],
        warnings: []
      });
      allPassed = false;
    }
  }

  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📊 Detailed report saved to: ${reportPath}`);

  // Summary
  console.log('\n🎯 SECURITY AUDIT SUMMARY:');
  console.log(`Security Headers: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  const totalMissing = results.reduce((sum, r) => sum + r.missing.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  
  console.log(`Total Missing Headers: ${totalMissing}`);
  console.log(`Total Warnings: ${totalWarnings}`);
  
  // Security best practices checklist
  console.log('\n📋 SECURITY BEST PRACTICES CHECKLIST:');
  console.log('✓ Security Headers (automated check above)');
  console.log('✓ HTTPS Enforcement (check in production)');
  console.log('✓ Input Validation (manual review required)');
  console.log('✓ Authentication Security (NextAuth.js configured)');
  console.log('✓ Rate Limiting (implemented in middleware)');
  console.log('✓ CORS Configuration (check API routes)');
  console.log('✓ Environment Variables (check .env files are not committed)');
  console.log('✓ Dependencies Security (run npm audit)');

  return allPassed;
}

if (require.main === module) {
  runSecurityAudit()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Security audit failed:', error);
      process.exit(1);
    });
}

module.exports = runSecurityAudit;
