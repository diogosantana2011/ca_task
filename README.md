# C&A QA Task
## Table of Contents
1. [General Info](#general-info)

   -[Cypress](#cypress)
2. [Mailsac](https://mailsac.com/)
### General Info
This is a QA task for C&A login page.
This includes docs for manual tests covered, and test themselves using [Cypress](https://www.cypress.io/) automation framework.

Please note passwords are for a test accounts created during creation of project, and normally would be used as secret key passed as environment variable via command line, to not be exposed anywhere.

I'm also leaving .env file with EMAIL_API_KEY for mailsac API which will allow to call on inboxes API and assert on email received. 

I shall reset said key a bit after you review entire project.

In root I've also added .mov file with recording and image of CLI results.
***

## Technologies
# Cypress
Cypress docs: [Cypress docs](https://docs.cypress.io/guides/getting-started/installing-cypress) 
Mailsac email api: [Mailsac](https://mailsac.com/)
***

# Setup (Project structure)
     ├── cypress                   # cypress main folder.
        ├── downloads              # Downloaded file folder
        ├── fixtures               # Fixtures folders -> images, json's etc.
        ├── e2e                    # Main folder for specs. Broken down by FE, BE, + any add.
            ├── ca.login.js         
        ├── plugins                # Where tasks are added.
        └── support                # Where commands are added.
        └── utils                  # Utilities folder

## Installation
Cypress installation documents found below.
Easiest steps are to simply navigate to Cypress root folder and run command 'npm run cy:open' and this will open the test runner from where you can run the spec for login page.

Alternatively, if you want to simply run the spec you can run 'npm run cy:run:loginTest' and test will run on terminal.

All start and run scripts available in 'package.json'

See below:
[Cypress Install](https://on.cypress.io/installing-cypress)

## Questions

Any questions, please reach out to diegsan20@gmail.com.
