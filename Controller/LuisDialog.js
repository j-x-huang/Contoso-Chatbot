var builder = require('botbuilder');
var account = require('./AccountControl');
var stocks = require('./StockQuotes');

var companyMap = { microsoft: 'MSFT', apple:'AAPL', google:'GOOGL'}

exports.startDialog = function (bot) {
    
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4b0adc07-4a1a-49ea-90b3-c8cdcc4d1763?subscription-key=3d4376d05ce2404e8c718aed0392e82b&verbose=true&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('CheckBalance', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function(session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            var accountEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Account');
            var accountType = accountEntity.entity;
            console.log(accountType);
            if (accountType) {
                session.send("Getting balance for " + session.conversationData["username"]);
                account.displayBalance(session, session.conversationData["username"], accountType);
            } else {
                session.send('No account type identified. Please try again');
            }

        }
    
    ]).triggerAction({
        matches: 'CheckBalance'
    });

    bot.dialog('DeleteAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function(session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            var accountEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Account');
            var accountType = accountEntity.entity;
            if (accountType) {
                session.send("Deleting your " + accountType + " account.");
                account.removeAccount(session, session.conversationData["username"], accountType);
            } else {
                session.send('No account type identified. Please try again');
            }

        }
    
    ]).triggerAction({
        matches: 'DeleteAccount'
    });

    bot.dialog('OpenAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function(session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            var accountEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Account');
            var accountType = accountEntity.entity;
            if (accountType) {
                session.send("Opening a new " + accountType + " account for " + session.conversationData["username"]);
                account.sendAccount(session, session.conversationData["username"], accountType);
            } else {
                session.send('No account type identified. Please try again');
            }

        }
    
    ]).triggerAction({
        matches: 'OpenAccount'
    });

    bot.dialog('CheckStocks', function (session, args) {
        session.dialogData.args = args || {};  
        var companyEntity = builder.EntityRecognizer.findEntity(session.dialogData.args.intent.entities, 'Company');        
        var company = companyEntity.entity;
        var symbol = companyMap[company.toLowerCase()];
        if (symbol) {
            session.send("Finding stock quotes for " + company);
            stocks.displayStocks(session, symbol, company);
        } else {
            session.send("I cannot find stocks for the company you are looking for");
        }
        
    }).triggerAction({
        matches: 'CheckStocks'
    });

    bot.dialog('Greeting', function (session, args) {
        session.send("Hi!");
        
    }).triggerAction({
        matches: 'Greeting'
    });

    bot.dialog('GetAccounts', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function(session, results,next) {
            if (results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("Getting accounts for " + session.conversationData["username"]);
            account.displayAccounts(session, session.conversationData["username"]);         

        }
    
    ]).triggerAction({
        matches:'GetAccounts'
    });

    bot.dialog('ConvertCurrency', function(session, args) {
        var cEntities = args.intent.entities;               
        
        if (cEntities) {
            stocks.displayExchangeRate(session, cEntities[0].entity.toUpperCase(), cEntities[1].entity.toUpperCase());
        } else {
            session.send("No valid currencies selected");
        }
        
    }).triggerAction({
        matches:'ConvertCurrency'
    })

    bot.dialog('None', function (session, args) {
        session.send("help func");
        
    }).triggerAction({
        matches: 'None'
    });
}