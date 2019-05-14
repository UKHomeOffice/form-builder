describe('Forms Page', () => {
    const username = 'dev1@lodev.xyz';
    const password = 'secret';

    afterEach(() => {
        cy.get('[data-cy=logout]').click();
        cy.clearLocalStorage();
        cy.wait(500);
    });
    it('displays forms for dev environment', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy="forms-menu"]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy="dev-form-menu"]').should('exist');
        cy.get('[data-cy="dev-form-menu"]').click();

        cy.url().should('include', '/forms/dev');

        cy.get('h2').should('contain', 'Current environment context');
        cy.get('[data-cy="context-label"]').should('contain', 'Development');

        cy.get('[data-cy="forms-table"]').should('exist');
        cy.get('[data-cy="form-table-data"]').should('exist');
        cy.get('[data-cy="form-table-data"]').find('tr').its('length').should('be.gte', 0)

    });

    it('can search for form title', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy="forms-menu"]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy="dev-form-menu"]').should('exist');
        cy.get('[data-cy="dev-form-menu"]').click();

        cy.url().should('include', '/forms/dev');

        cy.get('input').type("User");

        cy.wait(500);
        cy.get('[data-cy="forms-table"]').should('exist');
        cy.get('[data-cy="form-table-data"]').should('exist');
        cy.get('[data-cy="form-table-data"]').find('tr').its('length').should('be.gte', 1)

    });

    it('redirect to / if environment context not set', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy="forms-menu"]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy="dev-form-menu"]').should('exist');
        cy.get('[data-cy="dev-form-menu"]').click();

        cy.url().should('include', '/forms/dev');

        cy.get('[data-cy=logout]').click();

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();

        cy.url().should('include', '/')
    });

});
