const Chance = require('chance');
const chance = new Chance();

describe('Form to wizard', () => {
   it('can change wizard to form and still see submit button on form', () => {
       cy.get('[data-cy=forms-menu]').should('exist');
       cy.get('[data-cy=forms-menu]').click();

       cy.get('[data-cy=dev-form-menu]').should('exist');
       cy.get('[data-cy=dev-form-menu]').click();

       cy.get('[data-cy=create-form]').click();
       cy.url().should('include', '/forms/dev/create');
       cy.get('[data-cy=form-builder]').click();
       cy.url().should('include', '/forms/dev/create/builder');

       cy.get('[data-cy=displayType]').select('Wizard');

       cy.wait(500);

       cy.get('[data-cy=displayType]').select('Form');

       cy.get('button[type=submit]').should("exist");

       cy.wait(500);

   });

   it('can edit wizard to form and have submit button', () => {
       cy.get('[data-cy=forms-menu]').should('exist');
       cy.get('[data-cy=forms-menu]').click();

       cy.get('[data-cy=dev-form-menu]').should('exist');
       cy.get('[data-cy=dev-form-menu]').click();

       cy.get('[data-cy=create-form]').click();
       cy.url().should('include', '/forms/dev/create');
       cy.get('[data-cy=form-builder]').click();
       cy.url().should('include', '/forms/dev/create/builder');

       cy.get('[data-cy=displayType]').select('Wizard');

       cy.wait(500);


       const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
       cy.get('input[name=title]').type(formTitle);

       cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
       cy.get(".drag-container .formio-builder-components").trigger("mousemove").trigger("mouseup");

       cy.wait(500);

       cy.get("button[ref=saveButton]").click();
       cy.get('[data-cy=persist-form]').click();

       cy.url().should('include', '/forms/dev');

       cy.get('input[name=search-title]').type(formTitle);

       cy.wait(1000);

       cy.get('[data-cy="edit-form"]').click();

       cy.wait(500);

       cy.url().should('contains', '/edit');

       cy.get('[data-cy=displayType]').select('Form');
       cy.wait(1000);

       cy.get('button[type=submit]').should("exist");

       cy.get('[data-cy=persist-form]').click();

       cy.wait(1000);

       cy.visit('/forms/dev');

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
