describe("Home page", () => {
    const username = 'dev1@lodev.xyz';
    const password = 'secret';

    after(() => {
        cy.get('[data-cy=logout]').click();

        cy.get('input[name=username]').should('exist');
        cy.get('input[name=password]').should('exist');
        cy.clearLocalStorage();
    });

    it('Go to home page', () => {
        cy.visit("http://localhost:3000");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();

        cy.url().should('include', '/')
        cy.get('h1').should('contain', 'Dashboard');
        cy.get('h2').should('contain', 'Reports');
        cy.get('h2').should('contain', 'Environments');

    });

});
