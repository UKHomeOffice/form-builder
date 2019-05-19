const Chance = require('chance');

const username = 'dev1@lodev.xyz';
const password = 'secret';

const chance = new Chance();

describe('Create Form', () => {

    it('can create a new form', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/local/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/local/create/builder');

        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/local');

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
});
