const username = 'dev1@lodev.xyz';
const password = 'secret';

it('redirected to home page if context not set and requested form builder', () => {
    cy.visit("/forms/dev/create/builder");

    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('form').submit();

    cy.wait(500);

    cy.url().should('include', '/')

});
it('unable to create form in non editable environment', () => {
    cy.visit("/");

    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('form').submit();


    cy.get('[data-cy=forms-menu]').should('exist');
    cy.get('div[role="listbox"]').click();

    cy.get('[data-cy=demo-form-menu]').should('exist');
    cy.get('[data-cy=demo-form-menu]').click();

    cy.url().should('include', '/forms/demo');

    cy.get('h2').should('contain', 'Current environment context');
    cy.get('[data-cy=context-label]').should('contain', 'Demo');

    cy.visit("/forms/demo/create");


    cy.get('[data-cy=not-allowed-to-create]').should('exist');
    cy.contains('Environment context does not allow creation of forms directly');

});

it('unable to create form in non editable environment using builder URL', () => {
    cy.visit("/");

    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('form').submit();


    cy.get('[data-cy=forms-menu]').should('exist');
    cy.get('div[role="listbox"]').click();

    cy.get('[data-cy=demo-form-menu]').should('exist');
    cy.get('[data-cy=demo-form-menu]').click();

    cy.url().should('include', '/forms/demo');

    cy.get('h2').should('contain', 'Current environment context');
    cy.get('[data-cy=context-label]').should('contain', 'Demo');

    cy.visit("/forms/demo/create/builder");

    cy.get('[data-cy=not-allowed-to-create]').should('exist');
    cy.contains('Environment context does not allow creation of forms directly');

});

it('unable to create form in non editable environment using file upload', () => {
    cy.visit("/");

    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('form').submit();


    cy.get('[data-cy=forms-menu]').should('exist');
    cy.get('div[role="listbox"]').click();

    cy.get('[data-cy=demo-form-menu]').should('exist');
    cy.get('[data-cy=demo-form-menu]').click();

    cy.url().should('include', '/forms/demo');

    cy.get('h2').should('contain', 'Current environment context');
    cy.get('[data-cy=context-label]').should('contain', 'Demo');

    cy.visit("/forms/demo/create/file-upload");

    cy.get('[data-cy=not-allowed-to-create]').should('exist');
    cy.contains('Environment context does not allow creation of forms directly');

});
