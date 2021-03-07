const data = require('../fixtures/data.json')
const { Section1 } = require('../objects/section-1')

describe('Coverage for section 1 - Tables', () => {
  it('Assert that the table is not visible', () => {
    cy.visit(`${data.baseUrl}/section-1`)
    cy.url().should('include', 'section-1')
    cy.get(Section1.elements.table).should('not.be.visible')
  })

  it('After clicking the "Show table" button, assert the table is visible', () => {
    cy.get(Section1.elements.showTable).contains('Show table').click()
    cy.get(Section1.elements.table).should('be.visible')
  })

  it('Assert that the table is 5 columns wide', () => {
    cy.get(Section1.elements.tableHeader).find('th').should('have.length', 5)
  })

  it('Assert that the table is 10 rows long, excluding the first(header) row', () => {
    cy.get(Section1.elements.tableHeader).siblings().should('have.length', 10)
  })

  it('Assert that an admin has the ID of 1', () => {
    cy.get(Section1.elements.tableHeader).siblings().contains('th', 'admin').then((elem) => {
      assert.equal(elem.siblings().eq(0).text(), 1, 'Admin record has wrong id number!')
    })
  })

  it('Assert that at least 5 entries have the role "user"', () => {
    let totalUsers = 0

    cy.get(Section1.elements.tableHeader).siblings().each((elem) => {
      let name = elem.find('th').siblings().eq(4).text()

      if (name.includes('user')) {
        totalUsers += 1
      }
    }).then(() => {
      expect(totalUsers).to.be.at.least(5)
    })
  })

  it('Assert there are exactly 3 people older than 60 years old', () => {
    let peopleOver60 = 0

    cy.get(Section1.elements.tableHeader).siblings().each((elem) => {
      let date = elem.find('th').siblings().eq(3).text()
      let years = new Date(new Date() - new Date(date)).getFullYear() - 1970

      if (years >= 60) {
        peopleOver60 += 1
      }
    }).then(() => {
      expect(peopleOver60).to.equal(3)
    })
  })
})

describe('Coverage for section 1 - Forms', () => {
  it('Assert that the form is not visible', () => {
    cy.visit(`${data.baseUrl}/section-1`)
    cy.url().should('include', 'section-1')
    cy.get(Section1.elements.form).should('not.be.visible')
  })

  it('After clicking the "Show form" button, assert that the form is visible', () => {
    cy.get(Section1.elements.showForm).contains('Show Form').click()
    cy.get(Section1.elements.form).should('be.visible')
  })

  it('Fill in the "Name" and "Age" inputs, and assert that both inputs are filled', () => {
    cy.getElByDataId('fullName').type('Maria Mustermann', { force: true }).should('have.value', 'Maria Mustermann')
    cy.getElByDataId('age').type(26, { force: true }).should('have.value', 26)
  })

  it('Select "Female" from the select option, and assert that the value is "female"', () => {
    cy.get(Section1.elements.formGender).select('female')
    cy.get(Section1.elements.formGender).should('have.value', 'female')
  })

  it('Tick the "Nurse" checkbox and assert that the value "nurse" is true', () => {
    cy.get(Section1.elements.formNurse).not('[disabled]').check().should('be.checked')
  })

  it('Click on the "Submit" button and assert that there is an alert window showing with the text "Form submitted!"', () => {
    cy.get(Section1.elements.formSubmit).click()
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Form submitted!')
    })
  })
})
