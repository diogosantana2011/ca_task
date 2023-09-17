# C&A QA Task
## Table of Contents
1. [General Info](#general-info)

   -[Cypress](#cypress)

### General Info
This is a QA task for C&A login page.
This includes docs for manual tests covered, and test themselves using [Cypress](https://www.cypress.io/) automation framework.
Please note passwords are for a test account and normally would be used as secret key passed as environment variable via command line, to not be exposed anywhere.
***

## Technologies
# Cypress
Cypress docs: [Cypress docs](https://docs.cypress.io/guides/getting-started/installing-cypress) 
***

# Setup (Project structure)
     ├── cypress                   # cypress main folder.
        ├── downloads              # Downloaded file folder
        ├── fixtures               # Fixtures folders -> images, json's etc.
        ├── e2e                    # Main folder for specs. Broken down by FE, BE, + any add.
            ├── ca.login.page.js         
        ├── plugins                # Where tasks are added.
        └── support                # Where commands are added.
        └── utils                  # Utilities folder

## Installation
If you are on Windows Machine, I would suggest to install node.js and use its command line. 
It makes the entire process much easier. Alternatively, you can always download manually from the Cypress downloads page. 

See below:
[Cypress Install](https://on.cypress.io/installing-cypress)

If you have the node.js cmd, it is as simple as entering below command:
```
$ cd ../path/to/the/project
$ npm install cypress
```
Or

```
$ cd ../path/to/the/project
npm install cypress --save-dev
```

The operation should look somewhat similar to the below:
```
> cypress@13.1.0 postinstall C:\Users\XXXXXXXXXX\node_modules\cypress
> node index.js --exec install

Installing Cypress (version: 13.1.0)

√  Downloaded Cypress
√  Unzipped Cypress
√  Finished Installation C:\Users\XXXXXXXXXX\AppData\Local\Cypress\Cache\13.1.0

You can now open Cypress by running: node_modules\.bin\cypress open
```

Once this install happens on the project folder you selected above, nothing will show. The reason being is, you need to start cypress now.

```
$ npx cypress open
It looks like this is your first time using Cypress: 13.1.0

√  Verified Cypress! C:\Users\XXXXXXXXXXXX\AppData\Local\Cypress\Cache\13.1.0\Cypress

Opening Cypress...

√  Verified Cypress! C:\Users\XXXXXXXXXXX\AppData\Local\Cypress\Cache\13.1.0\Cypress
```
Cypress windows should open thereafter, and 'e2e' configuration is the required option.

If you are on a Mac, open Terminal or your shell of choice, and navigate to the root of your project, follow same steps!

## Questions

Any questions, please reach out to diegsan20@gmail.com.
