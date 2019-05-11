describe("Home page", () =>{
    it('Go to home page and be presented with keycloak', () => {
        cy.visit("http://localhost:3000")
    })
});
