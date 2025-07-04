describe('Homepage', () => {
  beforeEach(() => {
    cy.visitAndWaitForLoad('/')
  })

  it('should load the homepage successfully', () => {
    cy.get('h1').should('be.visible')
    cy.get('nav').should('be.visible')
    cy.get('footer').should('be.visible')
  })

  it('should have proper SEO elements', () => {
    cy.checkSEOElements()
  })

  it('should have good performance metrics', () => {
    cy.checkPagePerformance()
  })

  it('should display navigation menu', () => {
    cy.get('nav').within(() => {
      cy.contains('Home').should('be.visible')
      cy.contains('Blog').should('be.visible')
      cy.contains('About').should('be.visible')
      cy.contains('Contact').should('be.visible')
    })
  })

  it('should have working newsletter signup', () => {
    cy.get('input[type="email"]').first().should('be.visible')
    cy.get('button').contains(/subscribe/i).should('be.visible')
  })

  it('should be responsive', () => {
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('nav').should('be.visible')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('nav').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1280, 720)
    cy.get('nav').should('be.visible')
  })

  it('should have accessible elements', () => {
    // Check for proper heading hierarchy
    cy.get('h1').should('exist')
    
    // Check for alt text on images
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt')
    })
    
    // Check for proper link text
    cy.get('a').each(($link) => {
      cy.wrap($link).should('not.be.empty')
    })
  })

  it('should navigate to blog page', () => {
    cy.contains('Blog').click()
    cy.url().should('include', '/blog')
  })

  it('should navigate to about page', () => {
    cy.contains('About').click()
    cy.url().should('include', '/about')
  })
})
