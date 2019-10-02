const Chance = require('chance');
const chance = new Chance();

describe("Schema form", () => {
    it('can preview a form', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');

        const formTitle = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;

        cy.setCookie("formTitle", formTitle);

        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", {which: 1})
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();

        cy.url().should('include', '/forms/dev');

        cy.get('input[name=search-title]').type(formTitle);
        cy.wait(1000);

        cy.get('[data-cy=preview-form]').click();

        cy.url().should('include', '/preview');

        cy.get('[data-cy=viewSchema]').click();

        cy.get('.jsoneditor-tree').should('exist');

        cy.get('div[title="object containing 12 items"]').should('exist');

        cy.get('[data-cy=closeSchemaView]').click({multiple: true});

    });
});

