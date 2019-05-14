describe("Home page", () => {
    const username = 'dev1@lodev.xyz';
    const password = 'secret';

    it('Go to home page', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();

        cy.url().should('include', '/')
        cy.get('h1').should('contain', 'Dashboard');
        cy.get('h2').should('contain', 'Reports');
        cy.get('h2').should('contain', 'Environments');

    });

});
