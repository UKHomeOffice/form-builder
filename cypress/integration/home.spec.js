describe("Home page", () => {

    it('Go to home page', () => {

        cy.url().should('include', '/')
        cy.get('h1').should('contain', 'Dashboard');
        cy.get('h2').should('contain', 'Reports');
        cy.get('h2').should('contain', 'Environments');

    });

});
