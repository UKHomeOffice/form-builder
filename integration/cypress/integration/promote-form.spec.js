const Chance = require('chance');
const chance = new Chance();

describe('Promote Form', () => {

    it('can promote form', () => {

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

        cy.get('input[name=search-title]').type(formTitle).wait(2000);

        cy.get('[data-cy="promote-form"]').click();

        cy.url().should('contains', '/promote');

        cy.get('[data-cy="promote-next-env"]').click();
        cy.get('label[class="switch-off btn btn-info"]').first().click();

        cy.get('[data-cy="promote-confirm-step"]').click();
        cy.get('[data-cy="promotion-confirm"]').click();

        cy.wait(3000);


        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=devA-form-menu]').should('exist');
        cy.get('[data-cy=devA-form-menu]').click();

        cy.get('input[name=search-title]').type(formTitle);
        cy.wait(1000);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1);

        cy.wait(1000);

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();

        cy.get('input[name=search-title]').clear().type(formTitle);
        cy.wait(1000);

        cy.get('[data-cy="delete-form"]').click();
        cy.get('[data-cy="confirm-delete"]').click();

        cy.wait(1000);
        cy.get('input[name=search-title]').clear();
        cy.get('input[name=search-title]').type(formTitle);

        cy.get('[data-cy=form-table-data]').should('empty');

    });
});
