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

afterEach(() => {
    cy.getCookie("formTitle").then((cookie) => {
        if (cookie && cookie.value) {
            const formTitle = cookie.value;
            cy.request({
                method: 'POST', url: `http://formio.lodev.xyz/user/login`,
                headers: {
                    "Content-Type": "application/json"
                },
                body: {
                    "data": {
                        "email": "me@lodev.xyz",
                        "password": "secret"
                    }
                }
            }).then((response) => {
                const token = response.headers['x-jwt-token'];
                cy.request({
                    url: `http://formio.lodev.xyz/form?title=${formTitle}`,
                    method: 'GET',
                    headers: {
                        "x-jwt-token": token
                    }
                }).then((resp) => {
                    expect(resp.status).to.eq(200);
                    const id = resp.body[0]._id;
                    cy.request({
                        url: `http://formio.lodev.xyz/form/${id}`,
                        method: 'DELETE',
                        headers: {
                            "x-jwt-token": token
                        }
                    }).then((resp) => {
                        expect(resp.status).to.eq(200);
                    });
                });
            });
        }
    })

    cy.get('[data-cy=logout]').click();
    cy.clearLocalStorage();
    cy.clearCookies();
});
