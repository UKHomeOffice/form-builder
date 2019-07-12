const Chance = require('chance');
const chance = new Chance();

describe('Duplicate form', () => {
    it('can create duplicate form', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/local/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/local/create/builder');

        const formTitle = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;
        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", {which: 1})
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.visit("/forms/local");

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);

        cy.get('[data-cy=preview-form]').click();

        cy.wait(1000);
        cy.url().should('include', '/preview');

        cy.get("[data-cy=duplicate]").click();
        cy.wait(1000);

        const newTitle = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;
        cy.get('input[name=title]').clear();
        cy.get('input[name=title]').type(newTitle);

        cy.get('[data-cy=persist-form]').click();

        cy.wait(1000);

        cy.get('input[name=search-title]').type(newTitle);

        cy.wait(500);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1);

        cy.get('[data-cy="delete-form"]').click();
        cy.get('[data-cy="confirm-delete"]').click();

        cy.wait(500);


    });
});
