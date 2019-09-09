const Chance = require('chance');
const chance = new Chance();

describe("Create form using upload", () => {

    it('can upload file and create form', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();

        cy.url().should('include', '/forms/dev/create');

        cy.fixture('form.json').then(fileContent => {
            const asJson = JSON.stringify(fileContent);
            cy.get('[data-cy="file-upload-input"]').upload(
                {fileContent: asJson, fileName: 'form.json', mimeType: 'text/plain'},
                {subjectType: 'input', force: true},
            );
            cy.url().should('include', '/forms/dev/create/file-upload');

            const newTitle = chance.word({ length: 5 });

            cy.get('input[name=title]').type(newTitle);

            cy.get('[data-cy=persist-form]').click();

            cy.wait(1000);

            cy.url().should('include', '/forms/dev');

            cy.get('input[name=search-title]').type(newTitle);

            cy.wait(1000);

            cy.get('[data-cy=forms-table]').should('exist');
            cy.get('[data-cy=form-table-data]').should('exist');
            cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1)

            cy.get('[data-cy="delete-form"]').click();

            cy.get('[data-cy="confirm-delete"]').click();

            cy.get('input[name=search-title]').clear();
            cy.get('input[name=search-title]').type(newTitle);

            cy.get('[data-cy=form-table-data]').should('empty');

        });
    });
});
