describe("Unauthorized Access", () => {
    it('Go to home page', () => {
        const username ="dev2";
        const password  = "secret";

        cy.get('[data-cy=logout]').click();

        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();

        cy.wait(500);
        cy.url().should('include', '/unauthorized');

        cy.get('.header').should('exist');
        cy.get(".header").contains("403");
    });
});
