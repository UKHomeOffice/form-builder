const Chance = require('chance');
const chance = new Chance();

describe('Create Comment ', () => {

    it('can create a comment for form', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');

        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/dev');

        cy.get('input[name=search-title]').type(formTitle);


        cy.wait(1000);

        cy.get('[data-cy=preview-form]').click();

        cy.wait(1000);

        cy.url().should('include', '/preview');
        cy.get('[data-rb-event-key=comments]').click();
        cy.get('textarea[id="comment"]').type('Hello this is a comment');
        cy.get('[data-cy=addComment]').click();

        cy.wait(1000);

        cy.contains('1 comment');
        cy.contains('Hello this is a comment');

        cy.wait(1000);

        cy.visit('/forms/dev');
        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(2000);

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
