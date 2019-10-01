import qs from "querystring";

const Chance = require('chance');
const chance = new Chance();


const tokenData = qs.stringify({
    grant_type: 'password',
    client_id: 'www',
    username: 'cypressuser@lodev.xyz',
    password: 'secret'
});


describe("Gov UK preview", () => {
    it ('can show GDS preview button', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');

        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.setCookie("formTitle", formTitle);

        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/dev');

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);

        cy.get('[data-cy=preview-form]').click();
        cy.url().should('include', '/preview');

        cy.get('[data-cy=govUKPreview]').should('exist');
    });

    it ('can show GDS preview ', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');

        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.setCookie("formTitle", formTitle);

        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();

        cy.wait(1000);

        cy.url().should('include', '/forms/dev');

        cy.wait(1000);

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
                    'Authorization' : `Bearer ${accessToken}`
                }
            }).then((resp) => {
                expect(resp.status).to.eq(200);
                expect(resp.body.forms.length).to.eq(1);
                const formId = resp.body.forms[0].id;
                cy.visit(`/forms/dev/${formId}/preview/gov-uk`);

                cy.get('.govuk-input').should('exist');
                cy.get('.govuk-button').should('exist');
                cy.setCookie("skipLogout", "true");
            });
        });


    });
});
