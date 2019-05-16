const username = 'dev1@lodev.xyz';
const password = 'secret';

describe("Create form using upload", () => {
    it('can upload file and create form', () => {
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

        cy.fixture('form.json').then(fileContent => {
            const asJson = JSON.stringify(fileContent);
            cy.get('[data-cy="file-upload-input"]').upload(
                {fileContent: asJson, fileName: 'form.json', mimeType: 'text/plain'},
                {subjectType: 'input', force: true},
            );
            cy.url().should('include', '/forms/local/create/file-upload');

            cy.get('input[name=title]').type("{end} new form for testing");

            cy.get('[data-cy=persist-form]').click();

            cy.wait(1000);

            cy.url().should('include', '/forms/local');

            cy.get('input[name=search-title]').type("Apples and Oranges new form for testing");

            cy.wait(1000);

            cy.get('[data-cy=forms-table]').should('exist');
            cy.get('[data-cy=form-table-data]').should('exist');
            cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1)

            cy.get('[data-cy="delete-form"]').click();

            cy.get('[data-cy="confirm-delete"]').click();

            cy.get('input[name=search-title]').clear();
            cy.get('input[name=search-title]').type("Apples and Oranges new form for testing");

            cy.get('[data-cy=form-table-data]').should('empty');

        });
    });
});
