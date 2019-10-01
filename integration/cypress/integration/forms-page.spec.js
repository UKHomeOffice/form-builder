describe('Forms Page', () => {

    it('displays forms for dev environment', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();

        cy.url().should('include', '/forms/dev');

        cy.contains('Current environment context: Development');

        cy.wait(1000);

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 0)

    });

    it('can search for form title', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();

        cy.url().should('include', '/forms/dev');

        cy.wait(1000);

        cy.get('input[name=search-title]').type("a");

        cy.wait(1000);
        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1)

    });

    it('redirect to / if environment context not set', () => {

        const username = 'cypressuser@lodev.xyz';
        const password = 'secret';

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.wait(1000);

        cy.get('[data-cy=dev-form-menu]').should('exist');
        cy.get('[data-cy=dev-form-menu]').click();

        cy.wait(1000);

        cy.url().should('include', '/forms/dev');

        cy.get('[data-cy=logout]').click();

        cy.wait(1000);

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();

        cy.wait(500);

        cy.url().should('include', '/')
    });

});
