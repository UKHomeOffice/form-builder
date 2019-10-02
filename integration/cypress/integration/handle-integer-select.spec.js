describe('Integer select values', () => {
    it('can handle integer select values', () => {
        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();


        cy.get('[data-cy=create-form]').click();

        cy.url().should('include', '/forms/dev/create');

        cy.fixture('selectForm.json').then(fileContent => {
            const asJson = JSON.stringify(fileContent);
            cy.get('[data-cy="file-upload-input"]').upload(
                {fileContent: asJson, fileName: 'form.json', mimeType: 'text/plain'},
                {subjectType: 'input', force: true},
            );
            cy.url().should('include', '/forms/dev/create/file-upload');

            cy.get('[data-cy=persist-form]').click();

            cy.wait(1000);

            cy.url().should('include', '/forms/dev');

            cy.get('input[name=search-title]').type("selectWithInteger").wait(1000);


            cy.get('[data-cy=forms-table]').should('exist');
            cy.get('[data-cy=form-table-data]').should('exist');
            cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1)

            cy.wait(1000);

            cy.get('[data-cy=preview-form]').click();
            cy.url().should('include', '/preview');

            cy.wait(2000);

            cy.get('.formio-component-selectOne').find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .click({force: true}).wait(1000);

            cy.wait(1000);


            const selectedChoiceText = 'One B';

            cy.get('.formio-component-selectTwo').find('.choices__list--dropdown .choices__list')
                .children()
                .first()
                .click({force: true}).wait(1000);

            cy.get('button[name="data[submit]"]').click().wait(1000);

            cy.get('.formio-component-selectTwo').find('.choices__list--dropdown .choices__list')
            .children()
            .first()
            .should($item => {
                expect($item).to.contain(selectedChoiceText);
            });

            cy.get('select[name="data[selectTwo]"]').contains(selectedChoiceText);
        });
    });
});