const Chance = require('chance');
const chance = new Chance();

describe('Form to wizard', () => {
   it('can change wizard to form and still see submit button on form', () => {
       cy.get('[data-cy=forms-menu]').should('exist');
       cy.get('div[role="listbox"]').click();

       cy.get('[data-cy=local-form-menu]').should('exist');
       cy.get('[data-cy=local-form-menu]').click();


       cy.get('[data-cy=create-form]').click();
       cy.url().should('include', '/forms/local/create');
       cy.get('[data-cy=form-builder]').click();
       cy.url().should('include', '/forms/local/create/builder');

       cy.get('[data-cy=displayType]').click();
       cy.get('div[role=option]').contains("Wizard").click();

       cy.wait(500);

       cy.get('[data-cy=displayType]').click();
       cy.get('div[role=option]').contains("Form").click();

       cy.get('button[type=submit]').should("exist");

       cy.wait(500);

   });

   it('can edit wizard to form and have submit button', () => {
       cy.get('[data-cy=forms-menu]').should('exist');
       cy.get('div[role="listbox"]').click();

       cy.get('[data-cy=local-form-menu]').should('exist');
       cy.get('[data-cy=local-form-menu]').click();


       cy.get('[data-cy=create-form]').click();
       cy.url().should('include', '/forms/local/create');
       cy.get('[data-cy=form-builder]').click();
       cy.url().should('include', '/forms/local/create/builder');

       cy.get('[data-cy=displayType]').click();
       cy.get('div[role=option]').contains("Wizard").click();

       cy.wait(500);


       const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
       cy.get('input[name=title]').type(formTitle);
       cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 });
       cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
       cy.get("button[ref=saveButton]").click();
       cy.get('[data-cy=persist-form]').click();

       cy.url().should('include', '/forms/local');

       cy.get('input[name=search-title]').type(formTitle);

       cy.wait(1000);

       cy.get('[data-cy="edit-form"]').click();
       cy.url().should('contains', '/edit');

       cy.get('[data-cy=displayType]').click();
       cy.get('div[role=option]').contains("Form").click();

       cy.get('button[type=submit]').should("exist");

       cy.get('[data-cy=persist-form]').click();

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

   })
});
