describe('Authentication', () => {
  it('should display sign in page', () => {
    cy.visit('/auth/signin')
    cy.get('h1').contains('Sign In').should('be.visible')
    cy.get('button').contains('Admin User').should('be.visible')
    cy.get('button').contains('Editor User').should('be.visible')
    cy.get('button').contains('Viewer User').should('be.visible')
  })

  it('should login with demo admin account', () => {
    cy.visit('/auth/signin')
    cy.get('button').contains('Admin User').click()
    cy.url().should('include', '/admin', { timeout: 10000 })
    cy.get('h1, h2').should('contain.text', 'Dashboard').or('contain.text', 'Admin')
  })

  it('should login with email input', () => {
    cy.visit('/auth/signin')
    cy.get('input[type="email"]').type('admin@blogplatform.com')
    cy.get('button').contains('Sign In').click()
    cy.url().should('include', '/admin', { timeout: 10000 })
  })

  it('should show OAuth login options', () => {
    cy.visit('/auth/signin')
    cy.get('button').contains('Sign in with Google').should('be.visible')
    cy.get('button').contains('Sign in with GitHub').should('be.visible')
  })

  it('should redirect to admin after login', () => {
    cy.loginAsDemo('admin')
    cy.url().should('include', '/admin')
    cy.get('nav, aside').should('contain.text', 'Dashboard').or('contain.text', 'Posts')
  })

  it('should handle unauthorized access', () => {
    cy.visit('/admin', { failOnStatusCode: false })
    cy.url().should('include', '/auth/signin')
  })

  it('should logout successfully', () => {
    cy.loginAsDemo('admin')
    cy.get('button, a').contains(/logout|sign out/i).click()
    cy.url().should('not.include', '/admin')
  })
})
