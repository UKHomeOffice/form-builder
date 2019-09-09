import qs from "querystring";

const Chance = require('chance');
const chance = new Chance();

const tokenData = qs.stringify({
    grant_type: 'password',
    client_id: 'www',
    username: 'cypressuser@lodev.xyz',
    password: 'secret'
});

describe("Edit form", () => {

    it('can edit a form', () => {
        cy.wait(1000);

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');


        const formTitle = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;
        cy.get('input[name=title]').type(formTitle);
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/dev');

        cy.wait(2000);

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(2000);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1);

        cy.wait(500);

        cy.request({
            method: 'POST',
            url: 'https://keycloak.elf79.dev/auth/realms/elf/protocol/openid-connect/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: tokenData
        }).then((resp) => {
                const accessToken = resp.body.access_token;
                cy.request({
                    url: `http://localhost:4000/form?filter=title__eq__${formTitle}`,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                }).then((resp) => {
                    expect(resp.status).to.eq(200);
                    expect(resp.body.forms.length).to.eq(1);
                    expect(resp.body.forms[0].components.length).to.be.eq(1);
                });
            });

        cy.get('[data-cy="edit-form"]').click();

        cy.url().should('contains', '/edit');

        cy.wait(2000);

        cy.get("[data-type=textfield]").trigger("mousedown", {which: 1});
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();

        cy.get('[data-cy=persist-form]').click();

        cy.url().should('include', '/forms/dev');


        cy.request({
                method: 'POST',
                url: 'https://keycloak.elf79.dev/auth/realms/elf/protocol/openid-connect/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: tokenData
            }
        ).then((resp) => {
            const accessToken = resp.body.access_token;
            cy.request({
                url: `http://localhost:4000/form?filter=title__eq__${formTitle}`,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }).then((resp) => {
                expect(resp.status).to.eq(200);
                expect(resp.body.forms.length).to.eq(1);
                expect(resp.body.forms[0].components.length).to.eq(2);
            });
        });


        cy.visit("/forms/dev");

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1);

        cy.get('[data-cy="delete-form"]').click();
        cy.get('[data-cy="confirm-delete"]').click();

        cy.wait(1000);
        cy.get('input[name=search-title]').clear();
        cy.get('input[name=search-title]').type(formTitle);

        cy.get('[data-cy=form-table-data]').should('empty');

    });
})  ;
