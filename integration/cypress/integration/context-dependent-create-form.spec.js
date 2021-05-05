const username = 'dev1@local.cop.homeoffice.gov.uk';
const password = 'secret';

describe("Non editable environment cannot create new forms", () => {
    it('redirected to home page if context not set and requested form builder', () => {
        cy.visit("/forms/dev/create/builder");
        cy.url().should('include', '/')

    });
    it('unable to create form in non editable environment', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();


        cy.get('[data-cy=devA-form-menu]').should('exist');
        cy.get('[data-cy=devA-form-menu]').click();

        cy.url().should('include', '/forms/devA');

        cy.contains('Current environment context: Development A');

        cy.visit("/forms/devA/create");

        cy.wait(1000);

        cy.get('[data-cy=not-allowed-to-create]').should('exist');
        cy.contains('Development A context does not allow creation of forms directly');

    });

    it('unable to create form in non editable environment using builder URL', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=devA-form-menu]').should('exist');
        cy.get('[data-cy=devA-form-menu]').click();

        cy.url().should('include', '/forms/devA');

        cy.contains('Current environment context: Development A');

        cy.visit("/forms/devA/create/builder");

        cy.wait(1000);

        cy.get('[data-cy=not-allowed-to-create]').should('exist');
        cy.contains('Development A context does not allow creation of forms directly');

    });

    it('unable to create form in non editable environment using file upload', () => {

        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('[data-cy=forms-menu]').click();

        cy.get('[data-cy=devA-form-menu]').should('exist');
        cy.get('[data-cy=devA-form-menu]').click();

        cy.url().should('include', '/forms/devA');

        cy.contains('Current environment context: Development A');

        cy.visit("/forms/devA/create/file-upload");

        cy.wait(1000);

        cy.get('[data-cy=not-allowed-to-create]').should('exist');
        cy.contains('Development A context does not allow creation of forms directly');

    });
});

