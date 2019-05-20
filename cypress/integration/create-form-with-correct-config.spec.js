const Chance = require('chance');
const username = 'dev1@lodev.xyz';
const password = 'secret';
const chance = new Chance();

describe('Create new form with correct configuration', () => {
    it('can create a form with anonymous submission access and no actions', () => {
        cy.visit("/");

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('form').submit();


        cy.get('[data-cy=forms-menu]').should('exist');
        cy.get('div[role="listbox"]').click();

        cy.get('[data-cy=local-form-menu]').should('exist');
        cy.get('[data-cy=local-form-menu]').click();


        cy.get('[data-cy=create-form]').click();
        cy.url().should('include', '/forms/local/create');
        cy.get('[data-cy=form-builder]').click();
        cy.url().should('include', '/forms/local/create/builder');

        const formTitle = `${chance.word({length: 5})} ${chance.word({length: 5})} ${chance.word({length: 5})}`;
        cy.get('input[name=title]').type(formTitle);
        cy.get("[data-type=textfield]").trigger("mousedown", {which: 1})
        cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
        cy.get("button[ref=saveButton]").click();
        cy.get('[data-cy=persist-form]').click();


        cy.request({
            method: 'POST', url: `http://formio.lodev.xyz/user/login`,
            headers: {
                "Content-Type" : "application/json"
            },
            body: {
                "data": {
                    "email": "me@lodev.xyz",
                    "password": "secret"
                }
            }
        }).then((response) => {
            const token = response.headers['x-jwt-token'];
            cy.request({
                method: 'GET',
                headers: {
                    'x-jwt-token': token
                },
                url: `http://formio.lodev.xyz/form?title=${formTitle}`
            }).then((formGetResponse) => {
                expect(formGetResponse.status).to.eq(200);
                expect(formGetResponse.body.length).to.eq(1);
                //submission access present
                expect(formGetResponse.body[0].submissionAccess.length).to.eq(8);
                const formId = formGetResponse.body[0]._id;
                cy.request({
                    method: 'GET',
                    headers: {
                        'x-jwt-token': token
                    },
                    url: `http://formio.lodev.xyz/form/${formId}/action`
                }).then((actionsResponse) => {
                    //validate no actions associated with form
                    expect(actionsResponse.status).to.eq(200);
                    expect(actionsResponse.body.length).to.eq(0);
                });
            });
        });
    });
});
n
