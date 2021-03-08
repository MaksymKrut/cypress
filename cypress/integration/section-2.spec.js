const data = require('../fixtures/data.json')
const { Section2 } = require('../objects/section-2')

describe('Coverage for section 2 - Http: Waiting for network calls', () => {
  it('Click on the following button to trigger an abnormally long network call(+10sec)', () => {
    cy.visit(`${data.baseUrl}/section-2`)
    cy.url().should('include', 'section-2')
    Section2.actions.clickNetworkCallButton()
  })

  it('Assert the status of the answer', () => {
    Section2.actions.assertTodoResponseStatus()
  })

  it('Assert the payload of the returned object', () => {
    Section2.actions.assertTodoResponseObject()
  })

  it('Assert that the UI shows an alert message and its content should equal "Abnormally long network call!"', () => {
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Abnormally long network call!')
    })
  })
})

describe('Coverage for section 2 - Browser API: Opening a new tab', () => {
  it('Click on the following button to trigger a new tab opening', () => {
    cy.get(Section2.elements.newTabButton).parent().should('have.attr', 'target', '_blank')
    cy.get(Section2.elements.newTabButton).parent().invoke('removeAttr', 'target')
    cy.get(Section2.elements.newTabButton).parent().should('not.have.attr', 'target', '_blank').click()
  })

  it(`Assert that the button does what's it's supposed to do`, () => {
    cy.url().should('not.include', 'section-2')
  })
})

describe('Coverage for section 2 - Browser API: Downloading a file', () => {
  it('Click on the following button to trigger a file download', () => {
    cy.visit(`${data.baseUrl}/section-2`)
    cy.get(Section2.elements.fileDownloadButton).should('be.visible').click()
  })

  it(`Assert that the button does what's it's supposed to do`, () => {
    // Assert necessary attributes
    cy.get(Section2.elements.fileDownloadButton).should('have.attr', 'href', '/assets/img/javascript-logo.png')
    cy.get(Section2.elements.fileDownloadButton).should('have.attr', 'download', 'true')
    // Assert file download with plugin
    cy.downloadFile('http://192.168.1.127:8080/assets/img/javascript-logo.png', 'cypress/downloads', 'js-logo.jpg')
  })

  it('Assert the details of the file downloaded', () => {
    Section2.actions.assertFileDownloaded()
  })
})
