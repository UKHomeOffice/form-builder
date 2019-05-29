const Chance = require('chance');
const chance = new Chance();

describe("Edit form", () => {

    it('can edit a form', () => {

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
        cy.get('[data-cy=persist-form]').click();


        cy.url().should('include', '/forms/local');

        cy.get('input[name=search-title]').type(formTitle);

        cy.wait(1000);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1);

        cy.wait(500);

        cy.request({
            url: `http://formio.lodev.xyz/form?title=${formTitle}`,
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body.length).to.eq(1);
            console.log(JSON.stringify(resp.body));
            expect(resp.body[0].components.length).to.eq(0);
        });


        cy.get('[data-cy="edit-form"]').click();

        cy.url().should('contains', '/edit');

        cy.get("[data-type=textfield]").trigger("mousedown", {which: 1});
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();

        cy.get('[data-cy=persist-form]').click();

        cy.url().should('include', '/forms/local');

        cy.request({
            url: `http://formio.lodev.xyz/form?title=${formTitle}`,
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body.length).to.eq(1);
            expect(resp.body[0].components.length).to.eq(2);
        });

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
