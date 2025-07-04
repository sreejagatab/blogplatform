describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsDemo('admin')
  })

  it('should display admin dashboard', () => {
    cy.url().should('include', '/admin')
    cy.get('h1, h2').should('be.visible')
    cy.get('nav, aside').should('be.visible')
  })

  it('should show navigation menu', () => {
    cy.get('nav, aside').within(() => {
      cy.contains('Dashboard').should('be.visible')
      cy.contains('Posts').should('be.visible')
      cy.contains('Categories').should('be.visible')
      cy.contains('Media').should('be.visible')
      cy.contains('Analytics').should('be.visible')
    })
  })

  it('should navigate to posts management', () => {
    cy.contains('Posts').click()
    cy.url().should('include', '/admin/posts')
    cy.get('h1, h2').should('contain.text', 'Posts')
  })

  it('should navigate to categories management', () => {
    cy.contains('Categories').click()
    cy.url().should('include', '/admin/categories')
    cy.get('h1, h2').should('contain.text', 'Categories')
  })

  it('should navigate to media management', () => {
    cy.contains('Media').click()
    cy.url().should('include', '/admin/media')
    cy.get('h1, h2').should('contain.text', 'Media')
  })

  it('should navigate to analytics', () => {
    cy.contains('Analytics').click()
    cy.url().should('include', '/admin/analytics')
    cy.get('h1, h2').should('contain.text', 'Analytics')
  })

  it('should display user profile information', () => {
    cy.get('nav, header').should('contain.text', 'Admin User')
  })

  it('should be responsive in admin area', () => {
    // Test mobile viewport
    cy.viewport(375, 667)
    cy.get('nav, aside').should('exist')
    
    // Test tablet viewport
    cy.viewport(768, 1024)
    cy.get('nav, aside').should('be.visible')
    
    // Test desktop viewport
    cy.viewport(1280, 720)
    cy.get('nav, aside').should('be.visible')
  })
})
