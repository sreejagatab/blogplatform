const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runAccessibilityAudit() {
  console.log('🔍 Running Accessibility Audit...\n');

  const urls = [
    'http://localhost:3000',
    'http://localhost:3000/blog',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
    'http://localhost:3000/auth/signin',
  ];

  const results = [];
  let allPassed = true;

  for (const url of urls) {
    console.log(`Auditing ${url}...`);
    
    try {
      // Run axe-core CLI audit
      const command = `npx axe-core ${url} --tags wcag2a,wcag2aa,wcag21aa --reporter json`;
      const output = execSync(command, { encoding: 'utf8', timeout: 30000 });
      const report = JSON.parse(output);
      
      const violations = report.violations || [];
      const passes = report.passes || [];
      const incomplete = report.incomplete || [];
      
      const result = {
        url,
        violations: violations.length,
        passes: passes.length,
        incomplete: incomplete.length,
        violationDetails: violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          nodes: v.nodes.length
        }))
      };
      
      results.push(result);
      
      if (violations.length > 0) {
        allPassed = false;
        console.log(`❌ ${url}: ${violations.length} violations found`);
        violations.forEach(violation => {
          console.log(`  - ${violation.id}: ${violation.description} (${violation.impact})`);
        });
      } else {
        console.log(`✅ ${url}: No accessibility violations`);
      }
      
      console.log(`  Passes: ${passes.length}, Incomplete: ${incomplete.length}\n`);
      
    } catch (error) {
      console.error(`❌ Error auditing ${url}:`, error.message);
      results.push({
        url,
        error: error.message,
        violations: -1,
        passes: 0,
        incomplete: 0
      });
      allPassed = false;
    }
  }

  // Save detailed results
  const reportPath = path.join(__dirname, '..', 'accessibility-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📊 Detailed report saved to: ${reportPath}`);

  // Summary
  console.log('\n🎯 ACCESSIBILITY AUDIT SUMMARY:');
  console.log(`WCAG 2.1 AA Compliance: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  const totalViolations = results.reduce((sum, r) => sum + (r.violations > 0 ? r.violations : 0), 0);
  const totalPasses = results.reduce((sum, r) => sum + r.passes, 0);
  
  console.log(`Total Violations: ${totalViolations}`);
  console.log(`Total Passes: ${totalPasses}`);
  
  if (!allPassed) {
    console.log('\n📋 Critical Issues to Fix:');
    results.forEach(result => {
      if (result.violations > 0) {
        console.log(`\n${result.url}:`);
        result.violationDetails.forEach(violation => {
          if (violation.impact === 'critical' || violation.impact === 'serious') {
            console.log(`  🚨 ${violation.id}: ${violation.description}`);
            console.log(`     Help: ${violation.helpUrl}`);
          }
        });
      }
    });
  }

  return allPassed;
}

// Manual accessibility checklist
function displayManualChecklist() {
  console.log('\n📋 MANUAL ACCESSIBILITY CHECKLIST:');
  console.log('Please verify the following manually:');
  console.log('');
  console.log('✓ Keyboard Navigation:');
  console.log('  - All interactive elements are keyboard accessible');
  console.log('  - Tab order is logical and intuitive');
  console.log('  - Focus indicators are visible and clear');
  console.log('  - No keyboard traps exist');
  console.log('');
  console.log('✓ Screen Reader Compatibility:');
  console.log('  - All images have appropriate alt text');
  console.log('  - Form labels are properly associated');
  console.log('  - Headings create a logical document structure');
  console.log('  - ARIA labels are used where appropriate');
  console.log('');
  console.log('✓ Visual Design:');
  console.log('  - Color contrast meets WCAG AA standards (4.5:1 for normal text)');
  console.log('  - Information is not conveyed by color alone');
  console.log('  - Text can be resized up to 200% without loss of functionality');
  console.log('  - Content reflows properly on mobile devices');
  console.log('');
  console.log('✓ Interactive Elements:');
  console.log('  - Links have descriptive text');
  console.log('  - Buttons have clear purposes');
  console.log('  - Error messages are clear and helpful');
  console.log('  - Form validation is accessible');
}

if (require.main === module) {
  runAccessibilityAudit()
    .then(passed => {
      displayManualChecklist();
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Accessibility audit failed:', error);
      process.exit(1);
    });
}

module.exports = runAccessibilityAudit;
