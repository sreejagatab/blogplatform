const puppeteer = require('puppeteer');

async function testAdminClickableElements() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Starting Admin Clickable Elements Test...');
    
    // Navigate to the homepage first
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('✅ Homepage loaded');
    
    // Try to access admin directly (will redirect to signin)
    console.log('🔐 Testing admin access...');
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2' });
    
    // Check if redirected to signin
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/signin')) {
      console.log('✅ Admin properly redirects to signin when not authenticated');
      
      // Test signin page elements
      console.log('🔍 Testing signin page clickable elements...');
      
      // Check for signin form elements
      const signinElements = await page.evaluate(() => {
        const elements = [];
        
        // Find all clickable elements
        const clickables = document.querySelectorAll('button, a, input[type="submit"], [role="button"]');
        clickables.forEach(el => {
          if (el.offsetParent !== null) { // visible elements only
            elements.push({
              tag: el.tagName.toLowerCase(),
              text: el.textContent.trim(),
              type: el.type || '',
              href: el.href || '',
              id: el.id || '',
              className: el.className || ''
            });
          }
        });
        
        return elements;
      });
      
      console.log('📋 Signin page clickable elements:');
      signinElements.forEach(el => {
        console.log(`  - ${el.tag}: "${el.text}" ${el.href ? `(${el.href})` : ''}`);
      });
      
      // Try demo login page instead
      console.log('🎭 Attempting to use demo login page...');

      try {
        await page.goto('http://localhost:3000/demo', { waitUntil: 'networkidle2' });
        console.log('✅ Demo page loaded');

        // Wait for demo login buttons to load
        await page.waitForSelector('button', { timeout: 5000 });

        // Find and click the Admin login button
        const adminButton = await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find(btn => btn.textContent.includes('Login as ADMIN'));
        });

        if (adminButton) {
          await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const adminBtn = buttons.find(btn => btn.textContent.includes('Login as ADMIN'));
            if (adminBtn) adminBtn.click();
          });

          console.log('✅ Admin login button clicked');

          // Wait for navigation to admin
          await page.waitForTimeout(5000);

          const newUrl = page.url();
          console.log('Current URL after demo login:', newUrl);

          if (newUrl.includes('/admin') && !newUrl.includes('/auth')) {
            console.log('🎉 Successfully logged into admin via demo!');
            await testAdminDashboard(page);
          } else {
            console.log('❌ Demo login failed or redirected elsewhere');
          }
        } else {
          console.log('❌ Admin login button not found on demo page');
        }
      } catch (error) {
        console.log('❌ Error during demo login attempt:', error.message);
      }
    } else {
      console.log('⚠️ Admin page accessible without authentication - potential security issue');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

async function testAdminDashboard(page) {
  console.log('🏠 Testing Admin Dashboard...');
  
  try {
    // Wait for dashboard to load
    await page.waitForSelector('.admin-dashboard, [data-testid="admin-dashboard"], h1', { timeout: 10000 });
    
    // Test sidebar navigation
    console.log('📋 Testing sidebar navigation...');
    const sidebarLinks = await page.evaluate(() => {
      const links = [];
      const sidebarElements = document.querySelectorAll('nav a, .sidebar a, [data-testid="sidebar"] a');
      
      sidebarElements.forEach(link => {
        if (link.offsetParent !== null) {
          links.push({
            text: link.textContent.trim(),
            href: link.href,
            pathname: new URL(link.href).pathname
          });
        }
      });
      
      return links;
    });
    
    console.log(`Found ${sidebarLinks.length} sidebar links:`);
    sidebarLinks.forEach(link => {
      console.log(`  - ${link.text}: ${link.pathname}`);
    });
    
    // Test each admin page
    for (const link of sidebarLinks) {
      if (link.pathname.startsWith('/admin')) {
        await testAdminPage(page, link);
      }
    }
    
    // Test dashboard specific elements
    console.log('🎯 Testing dashboard specific elements...');
    
    const dashboardElements = await page.evaluate(() => {
      const elements = [];
      
      // Find buttons, links, and interactive elements
      const clickables = document.querySelectorAll('button, a, [role="button"], [onclick]');
      clickables.forEach(el => {
        if (el.offsetParent !== null) {
          elements.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim(),
            href: el.href || '',
            className: el.className || '',
            role: el.getAttribute('role') || ''
          });
        }
      });
      
      return elements;
    });
    
    console.log(`Found ${dashboardElements.length} clickable elements on dashboard`);
    
  } catch (error) {
    console.log('❌ Error testing admin dashboard:', error.message);
  }
}

async function testAdminPage(page, linkInfo) {
  console.log(`🔍 Testing admin page: ${linkInfo.text} (${linkInfo.pathname})`);
  
  try {
    await page.goto(linkInfo.href, { waitUntil: 'networkidle2', timeout: 15000 });
    
    // Check if page loaded successfully
    const title = await page.title();
    const isError = title.toLowerCase().includes('not found') || 
                   title.toLowerCase().includes('404') ||
                   title.toLowerCase().includes('error');
    
    if (isError) {
      console.log(`❌ BROKEN PAGE: ${linkInfo.text} -> ${linkInfo.pathname} (Error page)`);
      return;
    }
    
    // Test clickable elements on this page
    const pageElements = await page.evaluate(() => {
      const elements = [];
      const clickables = document.querySelectorAll('button, a, input[type="submit"], [role="button"]');
      
      clickables.forEach(el => {
        if (el.offsetParent !== null) {
          elements.push({
            tag: el.tagName.toLowerCase(),
            text: el.textContent.trim(),
            type: el.type || '',
            href: el.href || '',
            disabled: el.disabled || false
          });
        }
      });
      
      return elements;
    });
    
    console.log(`  ✅ Page loaded: ${linkInfo.text}`);
    console.log(`  📊 Found ${pageElements.length} clickable elements`);
    
    // Log any broken internal links
    const brokenLinks = pageElements.filter(el => 
      el.href && 
      el.href.includes('localhost:3000') && 
      !el.href.includes('#') &&
      el.tag === 'a'
    );
    
    if (brokenLinks.length > 0) {
      console.log(`  🔗 Internal links to test: ${brokenLinks.length}`);
    }
    
  } catch (error) {
    console.log(`❌ ERROR loading ${linkInfo.text}: ${error.message}`);
  }
}

testAdminClickableElements();
