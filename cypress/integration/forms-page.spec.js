describe('Forms Page', () => {
    const username = 'dev1@lodev.xyz';
    const password = 'secret';

    it('displays forms for local environment', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();

        cy.url().should('include', '/forms/local');

        cy.get('h2').should('contain', 'Current environment context');
        cy.get('[data-cy=context-label]').should('contain', 'Local');

        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 0)

    });

    it('can search for form title', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();

        cy.url().should('include', '/forms/local');

        cy.get('input[name=search-title]').type("User");

        cy.wait(1000);
        cy.get('[data-cy=forms-table]').should('exist');
        cy.get('[data-cy=form-table-data]').should('exist');
        cy.get('[data-cy=form-table-data]').find('tr').its('length').should('be.gte', 1)

    });

    it('redirect to / if environment context not set', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();

        cy.url().should('include', '/forms/local');

        cy.get('[data-cy=logout]').click();

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();

        cy.url().should('include', '/')
    });

});
