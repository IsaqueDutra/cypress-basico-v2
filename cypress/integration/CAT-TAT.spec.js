/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function () {
    const THREE_SECOND_IN_MS = 3000
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function () {
        cy.title()
            .should('be.equal', 'Central de Atendimento ao Cliente TAT')

    })

    it('Preenchendo campos obrigatorios do formulario', function () {
        Cypress._.times(2, function () {
            cy.clock()

            cy.get('input[name="firstName"]').type('Cat')
            cy.get('input[name="lastName"]').type('TAT')
            cy.get('#email').type('Cattat@gmail.com')
            cy.get('#open-text-area').type('Teste de envio')
            cy.get('.button').click()

            cy.get('.success').should('be.visible')
            cy.tick(THREE_SECOND_IN_MS)
            cy.get('.success').should('not.be.visible')
        })
    })

    it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.clock()
        cy.get('.button').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECOND_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('Valida telefone vazio', function () {
        cy.get('#phone').type('teste')
        cy.get('#phone').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('input[name="firstName"]').type('Cat')
        cy.get('input[name="lastName"]').type('TAT')
        cy.get('input[type="checkbox"][value="phone"]').click()
        cy.get('#email').type('Cattat@gmail.com')
        cy.get('#open-text-area').type('Teste de envio')
        cy.get('.button').click()
        cy.get('.error').click().should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('input[name="firstName"]').type('Cat').should('have.value', 'Cat')
        cy.get('input[name="lastName"]').type('TAT').should('have.value', 'TAT')
        cy.get('#email').type('Cattat@gmail.com').should('have.value', 'Cattat@gmail.com')
        cy.get('#phone').type('1122334455').should('have.value', '1122334455')

        cy.get('input[name="firstName"]').clear().should('have.value', '')
        cy.get('input[name="lastName"]').clear().should('have.value', '')
        cy.get('#email').clear().should('have.value', '')
        cy.get('#phone').clear().should('have.value', '')

    })
    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').click().should('be.visible')
    })

    it('Usando contains no formulario', function () {
        cy.get('input[name="firstName"]').type('Cat')
        cy.get('input[name="lastName"]').type('TAT')
        cy.get('#email').type('Cattat@gmail.com')
        cy.get('#open-text-area').type('Teste de envio')
        cy.contains('.button', 'Enviar').click()
        cy.get('.success').click().should('be.visible')
    })

    it('Seleciona um produto (youtube) por seu texto', function () {
        cy.get('#product').select('youtube').should('have.value', 'youtube')
    });

    it('Seleciona um produto (Mentoria) por seu texto', function () {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    });
    it('Seleciona um produto (blog) por seu texto', function () {
        cy.get('#product').select('blog').should('have.value', 'blog')
    });
    it('Marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"][value = "feedback"]').check().should('have.value', 'feedback')
    });

    it('Marca cada tipo de atendimento', function () {
        cy.get('input[type="radio"')
            .should('have.length', 3)
            .each(function ($radio) {
                cy.wrap($radio).check()
            })
    });

    it('marca ambos check box, depois desmarca o último', function () {
        cy.get('input[type="checkbox"]')
            .check()
            .last()
            .uncheck()
            .should('not.be.checked')
    });

    it('seleciona um arquivo da pasta fixtures ', function () {

        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })

    })
    it('seleciona um arquivo simulando um drag-and-drop ', function () {

        cy.get('#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })

    });
    it('seleciona um arquivo utilizando uma fixture para qual foi dada um alias', function () {

        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload').selectFile('@sampleFile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })

    });
    it('Verifica que a polica de privacidade abre em outra aba sem necessidade de um clique', function () {

        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    });
    it('Acessa  a pagina de polica de privacidade removendo o target e então clicando no link', function () {

        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing').should('be.visible')
    });
    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Mensagem enviada com sucesso.')
            .invoke('hide')
            .should('not.be.visible')
        cy.get('.error')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')
            .and('contain', 'Valide os campos obrigatórios!')
            .invoke('hide')
            .should('not.be.visible')
    });
    it('Faz uma requisição HTTP ', function () {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function (response) {
                const { status, statusText, body } = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')


            })

    });

        it('Encontre o gato', function () {
            cy.get('#cat')
                .invoke('show')
                .should('be.visible')
        });
})