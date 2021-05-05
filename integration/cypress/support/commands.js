// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Cypress.on('uncaught:exception', (err, runnable) => {
//     return false
// });

import 'cypress-file-upload';
import 'cypress-drag-drop';

const username = 'cypressuser@local.cop.homeoffice.gov.uk';
const password = 'secret';

import Dexie from 'dexie';

const formindexdb = new Dexie('form');
formindexdb.version(1).stores({
    form: 'id, path, schema'
});


beforeEach(() => {

    formindexdb.form.clear().then(() => {
        console.log("Draft data cleared");
    });

    cy.visit("/");

    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('form').submit();

    cy.wait(500);

});

afterEach(() => {
    cy.getCookie("skipLogout").then((cookie) => {
       if (!cookie)  {
           cy.get('[data-cy=logout]').click();
       } else {
           cy.visit("/logout")
       }
    });
    cy.clearLocalStorage();
    cy.clearCookies();
});
