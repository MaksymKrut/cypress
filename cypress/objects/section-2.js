const Section2 = {
  literals: {
    todoResponse: null,
  },
  elements: {
    networkCallButton: '#network-call-button',
    newTabButton: '#new-tab-button',
    fileDownloadButton: '#file-download-button',
  },
  actions: {
    clickNetworkCallButton () {
      cy.intercept('GET', '/todos/*').as('todos')
      cy.get(Section2.elements.networkCallButton).click()
      cy.wait('@todos', { timeout: 60000 })
        .then(({ request, response }) => {
          Section2.literals.todoResponse = response
        })
    },
    assertTodoResponseStatus () {
      const response = Section2.literals.todoResponse

      if (!response) {
        throw new Error('Response was not received!')
      }

      expect(response.statusCode).to.eq(200)
    },
    assertTodoResponseObject () {
      const response = Section2.literals.todoResponse

      if (!response) {
        throw new Error('Response was not received!')
      }

      expect(response.body, 'response body').to.deep.equal({
        id: 1,
        title: 'Abnormally long network call!',
      })
    },
    assertFileDownloaded () {
      cy.task('getFilesNames', 'cypress/downloads').then((names) => {
        expect(names).to.include('js-logo.jpg')
      })
    },
  },
}

module.exports = { Section2 }
