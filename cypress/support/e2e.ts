// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch
  win.fetch = function (...args) {
    return originalFetch.apply(this, args)
  }
})

// Custom command to login with demo user
Cypress.Commands.add('loginAsDemo', (userType: 'admin' | 'editor' | 'viewer' = 'admin') => {
  const emails = {
    admin: 'admin@blogplatform.com',
    editor: 'editor@blogplatform.com',
    viewer: 'viewer@blogplatform.com'
  }
  
  cy.visit('/auth/signin')
  cy.get('input[type="email"]').type(emails[userType])
  cy.get('button').contains('Sign In').click()
  cy.url().should('include', '/admin')
})

// Custom command to check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe()
  cy.checkA11y()
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsDemo(userType?: 'admin' | 'editor' | 'viewer'): Chainable<void>
      checkA11y(): Chainable<void>
    }
  }
}
