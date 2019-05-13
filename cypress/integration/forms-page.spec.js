describe('Forms Page', () => {
    const username = 'dev1@lodev.xyz';
    const password = 'secret';

    afterEach(() => {
        cy.get('[data-cy=logout]').click();
        cy.get('input[name=username]').should('exist');
        cy.get('input[name=password]').should('exist');
        cy.clearLocalStorage();
    });
    it('displays forms for dev environment', () => {
        cy.visit("http://localhost:3000");

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
    });
    it('navigate to environment/logout log back in and check url is back to /', () => {
        cy.visit("http://localhost:3000");

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
