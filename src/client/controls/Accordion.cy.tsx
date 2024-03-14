/// <reference types="cypress"/>

import React from 'react';
import Accordion from './Accordion';
import "app/client/controls/Accordion.css";

describe('<Accordion />', () => {
  it('Initially closed (default)', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Accordion header="Test accordion">
      <div className="content">
        <div className="hello">Hello</div>
        <div className="world">World</div>
      </div>
    </Accordion>);

    cy.get(".accordion.open").should("not.exist");

    cy.get(".accordion-content").should("not.exist");

    cy.get(".content").should("not.exist");
    cy.get(".content .hello").should("not.exist");
    cy.get(".content .world").should("not.exist");
  });

  it('Initially closed (explicit)', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Accordion header="Test accordion" open={false}>
      <div className="content">
        <div className="hello">Hello</div>
        <div className="world">World</div>
      </div>
    </Accordion>);

    cy.get(".accordion.open").should("not.exist");

    cy.get(".accordion-content").should("not.exist");

    cy.get(".content").should("not.exist");
    cy.get(".content .hello").should("not.exist");
    cy.get(".content .world").should("not.exist");
  });

  it('Initially open', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Accordion header="Test accordion" open={true}>
      <div className="content">
        <div className="hello">Hello</div>
        <div className="world">World</div>
      </div>
    </Accordion>);

    cy.get(".accordion.open").should("exist");

    cy.get(".accordion-content").should("exist");

    cy.get(".content").should("exist");
    cy.get(".content .hello").should("exist");
    cy.get(".content .world").should("exist");
  });

  it('React content in header', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Accordion header={<span>The header <button>click me</button></span>}
                          open={true}>
      <div className="content">
        <div className="hello">Hello</div>
        <div className="world">World</div>
      </div>
    </Accordion>);

    cy.get(".accordion.open span button").should("have.text", "click me");
  });

  it('Clicking opens and closes it', () => {
    cy.mount(<Accordion header="Test accordion" open={true}>
      <div className="content">
        <div className="hello">Hello</div>
        <div className="world">World</div>
      </div>
    </Accordion>);

    cy.get(".accordion.open h1").should("exist").click();

    cy.get(".accordion.closed h1").should("exist").click();

    cy.get(".accordion.open h1").should("exist");
  });

});