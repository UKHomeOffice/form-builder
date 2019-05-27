const Chance = require('chance');
const chance = new Chance();

describe("Preview form", () => {
    it('can preview a form', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/local/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/local/create/builder');

        const formTitle = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;

        cy.setCookie("formTitle", formTitle);

        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", {which: 1})
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/local');

        cy.get('input[name=search-title]').type(formTitle);
        cy.wait(1000);

        cy.get('[data-cy=preview-form]').click();

        cy.url().should('include', '/preview');

        const randomInput = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;

        cy.get('input[ref=input]').type(randomInput);
        cy.get('button[ref=button]').click();

        cy.get('.pretty-json-container').should('exist');

        cy.get('.node-ellipsis').click({multiple: true});

        cy.get(".object-meta-data").contains("3 items");

        cy.get('.node-ellipsis').click({multiple: true});

        cy.get('.object-meta-data').contains("2 items");

        cy.get(".string-value").contains(randomInput);

    });
});

