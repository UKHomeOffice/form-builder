const Chance = require('chance');
const chance = new Chance();

describe("Promote form", () => {
   it('can promote a form from one environment to another', () => {

      cy.get('[data-cy=forms-menu]').should('exist');
      cy.get('div[role="listbox"]').click();

      cy.get('[data-cy=local-form-menu]').should('exist');
      cy.get('[data-cy=local-form-menu]').click();


      cy.get('[data-cy=create-form]').click();
      cy.url().should('include', '/forms/local/create');
      cy.get('[data-cy=form-builder]').click();
      cy.url().should('include', '/forms/local/create/builder');

      const formTitle = `${chance.word({ length: 5 })} ${chance.word({ length: 5 })} ${chance.word({ length: 5 })}`;
      cy.setCookie("formTitle", formTitle);

      cy.get('input[name=title]').type(formTitle);
      cy.get("[data-type=textfield]").trigger("mousedown", { which: 1 })
      cy.get(".drag-container").trigger("mousemove").trigger("mouseup");
      cy.get("button[ref=saveButton]").click();
      cy.get('[data-cy=persist-form]').click();


   });
});
