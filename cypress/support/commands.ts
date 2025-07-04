/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for the blog platform

Cypress.Commands.add('visitAndWaitForLoad', (url: string) => {
  cy.visit(url)
  cy.get('body').should('be.visible')
  cy.wait(1000) // Wait for any animations or loading
})

Cypress.Commands.add('checkPagePerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    // Check Core Web Vitals
    expect(navigation.loadEventEnd - navigation.loadEventStart).to.be.lessThan(3000) // LCP < 3s
    expect(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).to.be.lessThan(1000) // FCP < 1s
  })
})

Cypress.Commands.add('checkSEOElements', () => {
  // Check essential SEO elements
  cy.get('head title').should('exist').and('not.be.empty')
  cy.get('head meta[name="description"]').should('exist').and('have.attr', 'content').and('not.be.empty')
  cy.get('head meta[property="og:title"]').should('exist')
  cy.get('head meta[property="og:description"]').should('exist')
  cy.get('head meta[name="viewport"]').should('exist')
})

declare global {
  namespace Cypress {
    interface Chainable {
      visitAndWaitForLoad(url: string): Chainable<void>
      checkPagePerformance(): Chainable<void>
      checkSEOElements(): Chainable<void>
    }
  }
}
