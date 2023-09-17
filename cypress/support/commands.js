// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// *********************************************
//  
//                  Helpers
//
// *********************************************

Cypress.on('uncaught:exception', (err, runnable) => {
    // Uncaught exception
    // returning false here prevents Cypress from
    // failing the test
    return false
});

Cypress.Commands.add('closeInitialPopUps', () => {
    // Closes popups
    cy.xpath('//button[@class="sc-fMMURN czLRbO"]').click()
    cy.xpath('//button[@id="onetrust-accept-btn-handler"]').click()
    cy.get('.sc-crvIOg > .sc-flFixB').should('not.be.hidden')
});

Cypress.Commands.add('checkErrorFields', () => {
    cy.wait(550)
    // Username error + text
    cy.xpath('//span[@class="sc-aXZVg leGHeq"]')
        .should('have.text', 'Please enter a valid e-mail address.')
        .and('have.css', 'color', 'rgb(228, 9, 36)')
    // Email field is with red error
    cy.xpath('//label[@for="myaccount_login_email"]')
        .should('have.css', 'color', 'rgb(228, 9, 36)')
        // Email field is with red error
    cy.xpath('//label[@for="myaccount_login_password"]')
        .should('have.css', 'color', 'rgb(228, 9, 36)')
}); 

// *********************************************
//  
//                  Login
//
// *********************************************

Cypress.Commands.add('checkLoginModal', () => {
    // Click login icon
    cy.get('[data-qa="HeaderAccountButton"]').should('have.attr', 'class', 'sc-flFixB byjZKr').click()
    cy.get('[data-qa="Copy"][class="sc-aXZVg khqjeG sc-ktPPKK eSpxNf"]').should('have.text', 'Go to your account')
    cy.get('button[class="sc-fMMURN czLRbO"]').should('not.eq', '0')
    // Checks login fields are empty
    cy.get('[data-testid="myaccount_login_email"]').should('have.attr', 'value', '')
    cy.get('[data-testid="myaccount_login_password"]').should('have.attr', 'value', '')
    // Checks presence of "forgot password"
    cy.xpath('//span[@class="sc-aXZVg leGHeq sc-eldPxv jgBQxt"]').should('have.text', 'Forgot password?')
    // Checks login button
    cy.get('button[data-qa="LoadingButton"]').first().should('have.text', 'Log in')
});

Cypress.Commands.add('uiSuccessLogin', (username, password) => {
    cy.checkLoginModal()
    cy.intercept('/api?o=login').as('login')
    cy.xpath('//input[@data-testid="myaccount_login_email"]').type(username)
    cy.xpath('//input[@data-testid="myaccount_login_email"]').should('have.attr', 'value', username)
    cy.xpath('//input[@data-testid="myaccount_login_password"]').type(password)
    cy.xpath('//input[@data-testid="myaccount_login_password"]').should('have.attr', 'value', password)
    cy.xpath('//button[@data-qa="LoadingButton"]').should('have.text', 'Log in')
    // Login action
    cy.get('button[data-qa="LoadingButton"]').click()
    // Assert on successful login response
    cy.wait('@login').then((response) => {
        const actual = response.response.body;
        const status = response.response.statusCode;
        const data = actual.data;

        if (data.login.loginState == 'LOGGED_IN') {
            expect(status).to.eq(200)
            expect(actual).to.contain.keys('data')
            expect(data).to.contain.keys('login')
            expect(data.login.firstName).to.eq('Diogo')
            expect(data.login.email).to.eq(Cypress.env('USERNAME'))
        } else if (data.login.loginState == 'NOT_LOGGED_IN') {
            // // Check error
            cy.get('[data-qa="InlineNotification"]')
            .children()
            .eq(1)
            .should('have.text', 'Oops! Your email address or password is not correct.');
        };

        // With switch clause
        // switch (data.login.loginState) {
        //     case 'LOGGED_IN':
        //         expect(status).to.eq(200)
        //         expect(actual).to.contain.keys('data')
        //         expect(data).to.contain.keys('login')
        //         expect(data.login.firstName).to.eq('Diogo')
        //         expect(data.login.email).to.eq(Cypress.env('USERNAME'))
        //         break;
        //     case 'NOT_LOGGED_IN':
        //         // Check error
        //         cy.get('[data-qa="InlineNotification"]')
        //         .children()
        //         .eq(1)
        //         .should('have.text', 'Oops! Your email address or password is not correct.')
        //         break;
        //     default:
        //         cy.log(`Login status is: ${data.login.loginState}.`);
        // }
    });
});

Cypress.Commands.add('uiLoginFail', () => {
    cy.checkLoginModal();
    cy.xpath('//input[@data-testid="myaccount_login_email"]').should('have.attr', 'value', '')
    cy.xpath('//input[@data-testid="myaccount_login_password"]').should('have.attr', 'value', '')
    cy.xpath('//button[@data-qa="LoadingButton"]').should('have.text', 'Log in')
    // Login action
    cy.get('button[data-qa="LoadingButton"]').click()
});

Cypress.Commands.add('uiLogout', () => {
    cy.intercept('/api?o=logout').as('logout')
    cy.get('[data-qa="HeaderAccountButton"]').click()
    cy.get('[type="button"][class="sc-hIUJlX dbtaUZ sc-jXXUWG kSxOda"]').first().should('have.text', 'Logout')
    cy.get('[type="button"][class="sc-hIUJlX dbtaUZ sc-jXXUWG kSxOda"]').click()
    cy.log('Logged user out')
    cy.wait('@logout').then((response) => {
        const actual = response.response.body;
        const status = response.response.statusCode;
        const data = actual.data;

        expect(status).to.eq(200)
        expect(data).to.contain.keys('logout')
        expect(data.logout.loginState).eq('NOT_LOGGED_IN')
    });
});
// *********************************************
//  
//                  Forgot password
//
// *********************************************

Cypress.Commands.add('forgotPassword', () => {
    cy.intercept('api?o=resetPassword').as('forgotPassword')
    cy.get('button[data-qa="HeaderAccountButton"]').click()
    cy.xpath('//span[@data-qa="Copy" and text()="Forgot password?"]').click()
    cy.get('.sc-dSIIpw > [data-qa="Copy"]').should('have.text', 'Forgotten your password?')
    cy.get('.jzmUyV').should(
        'have.text',
        'No problem, happens to all of us!Please enter the email address you used to register your account. We will immediately send you a link to create your new password.'
    )
    cy.get('[data-testid="myaccount_reset_email"]').should('have.attr', 'type', 'email')
    cy.xpath('//label[@for="myaccount_reset_email"]').should('have.text', 'E-mail address').type(Cypress.env('mailsacEmail'))
    cy.get('button[data-qa="LoadingButton"]').children().eq(0).should('have.text', 'Send e-mail').click()
    cy.get('.sc-dCrlla').should('have.text', 'Check now if you have received an email from us!')
    cy.wait('@forgotPassword').then((response) => {
        const actual = response.response.body;
        const status = response.response.statusCode;
        
        expect(status).to.eql(200)
        expect(actual.data).to.contain.keys('resetPassword')
        expect(actual.data.resetPassword).to.eql(true)
    });
});

Cypress.Commands.add('checkEmailInbox' , () => {
    const email = Cypress.env('mailsacEmail');
    cy.request({
        method: 'GET',
        url: Cypress.env('mailsacApi') + `/addresses/${email}/messages`,
        headers: {
            'Mailsac-Key': Cypress.env('EMAIL_API_KEY')
        },
        failOnStatusCode: false
    }).then((response) => {
        const actual = response.body;
        const status = response.status;
        
        if (actual.length <= 0) {
            cy.log('No emails retrieved')
            return
        } else {
            expect(status).to.eq(200)
            expect(actual[0].subject).to.eql('Reset password')
            expect(actual[0].originalInbox).to.eql(Cypress.env('mailsacEmail'))
            const message_id = actual[0]._id;
            cy.request({
                method: 'GET',
                headers: { 
                    'Mailsac-Key': Cypress.env('EMAIL_API_KEY')
                },
                url: `${Cypress.env('mailsacApi')}/dirty/${email}/${message_id}`,
                failOnStatusCode: false
            }).then((email) => {
                const doNotLog = { log: false };
                expect(email.status).to.eq(200)
                cy.document(doNotLog).invoke(doNotLog, 'write', email.body)
                // Assert on email body
                cy.get('h1').should('have.text', '\nHello Diogo,\n')
                cy.get('[style="padding: 20px;"] > :nth-child(1) > tbody > tr > td > p').should(
                    'have.text', 
                    '\nForgot password? That\'s no problem at all and happens to all of us. Just click the button "Reset password" and you will be redirected to the online shop to choose a new one.\n'
                )
                cy.get('.cta').eq(0).should('have.text', '\n\nReset password\n\n')
            });
        };
    });
});

// *********************************************
//  
//                  Registration
//
// *********************************************

Cypress.Commands.add('registerUser', (regUrl, email, password) => {
    // Add intercept on register REST
    cy.intercept('/api?o=registerAccount').as('registerAccount')
    // Click user icon
    cy.get('[data-qa="HeaderAccountButton"]').click()
    // Click register now
    cy.get('.sc-bwrFUB > [data-qa="TextLink"] > [data-qa="Copy"]').should('have.text', 'Register now').click()
    // Check URL change
    cy.url().should('eq', regUrl)
    // Pre-register check intercept
    cy.intercept('api?o=PreRegisterCheck').as('preRegisterCheck')
    // Check email address
    cy.xpath(`//label[@for="emailAddress" and text() = 'Email address ']`).type(email)
    // Continue button
    cy.xpath('//button[@data-qa="LoadingButton"]').eq(0).should('have.text', 'Continue').click()
    cy.wait('@preRegisterCheck').then((response) => {
        const actual = response.response.body;
        const status = response.response.statusCode;
        const preRegisterCheck = actual.data.preRegisterCheck.emailIsAlreadyRegistered;

        if (preRegisterCheck) {
            cy.log('User already registered')
            expect(preRegisterCheck).to.eql(true)
            expect(status).to.eq(200)
            cy.get('[data-qa="Headline"]').should('have.text', 'Hey, you already have a member account – just log in here!')
            cy.get('.sc-kZkypy > .jzmUyV').should('have.text', 'Log in with your password here')
            cy.get('[data-testid="password"]').should('have.attr', 'type', 'password')
            cy.get('.sc-iZzKWI').should('have.text', 'Password ')
            cy.get('[data-qa="LoadingButton"]').children().should('have.text', 'Log in')
        } else {
            cy.log('Move to login page')
            expect(status).to.eq(200)
            expect(actual).to.contain.keys('data')
            expect(preRegisterCheck).to.eql(false)
            expect(actual.data.preRegisterCheck.newsletterSubscriptionStatus).to.eql('NOT_REGISTERED')
            // Checkboxes
            cy.get('[data-qa="RadioButtonMR"]').click()
            cy.get('[data-testid="firstName"]').type('Diogo')
            cy.get('[data-testid="lastName"]').type('Santana')
            cy.get('[data-testid="password"]').type(password)
            // Select country
            cy.get('select').select('Portugal', {force: true })
            // Create an account now btn
            cy.get('[data-qa="LoadingButton"]').eq(0).should('have.text', 'Create an account now').click()
            cy.wait('@registerAccount').then((response) => {
                const actual = response.response.body;
                const status = response.response.statusCode;
                const responseData = actual.data;

                expect(status).to.eq(200)
                expect(responseData).to.contain.keys('registerAccount')
                expect(responseData.registerAccount).to.contain.keys(
                    'account',
                    'errors',
                    'userContext'
                )
                expect(responseData.registerAccount.errors).to.be.empty
                expect(responseData.registerAccount.userContext.loginState).to.eq('LOGGED_IN')
                // Check welcome modal
                cy.get('.sc-EgOXT > [data-qa="Copy"]').should('have.text', 'Welcome to your C&A account!')
                // Close welcome modal
                cy.get('button[title="OK, all done"]')
            });
        };
    });
});

