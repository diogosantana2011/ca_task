import { users, url } from '../utils/data';

describe('Registration, Login & Forgot password', () => {
    // Commands in: ../cypress/support/commands.js
    before(() => {
        const email = Cypress.env('mailsacEmail1');
        // Clear  mailsac api inbox for test
        cy.log('Mailbox cleared')
        cy.request({
            method: 'GET',
            url: `${Cypress.env('mailsacApi')}/addresses/${email}/messages`,
            headers: { 
                'Mailsac-Key': Cypress.env('EMAIL_API_KEY') 
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            if (response.body.lenth !== 0) {
                /**
                 * delete each message prior to test running
                 */
                response.body.forEach(msg => {
                    cy.request({
                        method: 'DELETE',
                        headers: { 
                            'Mailsac-Key': Cypress.env('EMAIL_API_KEY') 
                        },
                        url: `https://mailsac.com/api/addresses/${email}/messages/${msg._id}`,
                    }).then((res) => {
                        expect(res.status).to.eq(200);
                    });
                });
            };
        });
    });

    beforeEach(() => {
        // Navigate to homepage
        cy.visit('/');
        // Closes pop-ups
        cy.closeInitialPopUps();
    });

    // Account registration
    context('Account registration', () => {
        it('GIVEN user has valid email \n \
            WHEN user types `email` into email field \n \
            AND clicks `Continue` \n \
            AND fills in form details \n \
            AND clicks on `Create an account now` \n \
            THEN account is created ', () => {
                /**
                 * Note: Here you can configure 
                 * which ever email string & pwrd.
                 * Default is in .env file
                 * or by passing it as a parameter 
                 * for the function
                 */
                const email = Cypress.env().NEW_EMAIL;
                const password = Cypress.env().NEW_PASSWORD;

                cy.registerUser(url.registration, email, password)
            }
        );
    });
   
    // Login
    // Happy
    context('Successfull login', () => {
        it('WHEN clicking enter on login \n \
            THEN User is logged in successful \n \
            AND no error is shown', () => {
                const username = Cypress.env('USERNAME');
                const password = Cypress.env('PASSWORD');            
                cy.uiSuccessLogin(username, password);
                cy.uiLogout();
            }
        );
    });

    // Unhappy 1
    context('Login failure - empty fields', () => {
        it('WHEN clicking enter on login \n \
            THEN error is given for missing credentials \n \
            AND respective fields highlighted as areas of error', () => {
                cy.uiLoginFail();
                cy.checkErrorFields();
            }
        ); 
    });
    
    // Unhappy 2
    context('Login failure - Incorrect credentials', () => {
        it(`WHEN user introduces incorrect login credentials \n \
            THEN error presented \n \
            'Oops! Your email address or password is not correct.'`, () => { 
                // Successful login command with incorrect parameters.
                cy.uiSuccessLogin(users.random_username, users.random_password);   
            }
        );
    });
    // Forgot password
    context('Forgot password', () => {
        it('GIVEN user has valid account credentials \n \
            WHEN user types `diegsan20@gmail.com` into email field \n \
            AND clicks `Forgot password?` \n \
            THEN email reset password email sent to user', () => {
                cy.forgotPassword();
                /**
                 * Email inbox will either return email 
                 * and assert, or it will log no emails available
                 * I might have spammed forgot password too much 
                 * and no emails came through for sometime
                 */
                cy.checkEmailInbox();
            }
        );
    });
});