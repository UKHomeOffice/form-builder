const Chance = require('chance');
const chance = new Chance();

describe('Create Form with subform', () => {

    it('can create a new form', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');

        const subFormTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
        cy.get('input[name=title]').type(subFormTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/dev');

        cy.get('button[aria-label="close"]').click();


        cy.get('input[name=search-title]').type(subFormTitle);

        cy.wait(1000);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1);


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/dev/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/dev/create/builder');


        const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;

        cy.get('input[name=title]').type(formTitle);
        cy.get('button[aria-controls="group-premium"]').click();

        cy.get("[data-key=form]").trigger("mousedown", { which: 1 })
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");

        cy.wait(2000);

        cy.get('a[href="#form"]').click();

        cy.get('input[name="data[reference]"]').uncheck();

        cy.wait(1000);

        cy.get('div[tabIndex=0]').click();

        cy.get('input[role=textbox]').type(subFormTitle);

        cy.wait(1000);

        cy.get('div[data-id="1"]').click();

        cy.get('button[ref=saveButton]').click();

        cy.get('[data-cy=persist-form]').click();

        cy.get('button[aria-label="close"]').click();

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);


        cy.get('[data-cy=preview-form]').click();

        cy.wait(1000);

        cy.contains('Text Field');
        cy.contains('Submit');

        const randomInput = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;

        cy.get('input[type=text]').type(randomInput);
        cy.get('button[ref=button]').click();


        cy.get('button[data-cy=backTodev]').click();

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);

        cy.get('[data-cy="delete-form"]').click();
        cy.get('[data-cy="confirm-delete"]').click();

        cy.get('button[aria-label="close"]').click();

        cy.wait(1000);
        cy.get('input[name=search-title]').clear();
        cy.get('input[name=search-title]').type(subFormTitle);

        cy.wait(1000);

        cy.get('[data-cy="delete-form"]').click();
        cy.get('[data-cy="confirm-delete"]').click();

        cy.get('button[aria-label="close"]').click();

        cy.wait(1000);

    });
});
