const Chance = require('chance');
const chance = new Chance();

describe("Gov UK preview", () => {
    it ('can show GDS preview button', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/local/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/local/create/builder');

        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.setCookie("formTitle", formTitle);

        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/local');

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);

        cy.get('[data-cy=preview-form]').click();
        cy.url().should('include', '/preview');

        cy.get('[data-cy=govUKPreview]').should('exist');
    });

    it ('can show GDS preview ', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/local/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/local/create/builder');

        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.setCookie("formTitle", formTitle);

        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/local');

        cy.wait(1000);

        cy.request({
            url: `http://formio.lodev.xyz/form?title=${formTitle}`,
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body.length).to.eq(1);
            const formId = resp.body[0]._id;
            cy.visit(`/forms/local/${formId}/preview/gov-uk`);

            cy.get('.govuk-input').should('exist');
            cy.get('.govuk-button').should('exist');
            cy.setCookie("skipLogout", "true");
        });
    });
});
