var builder = require('botbuilder');
var account = require('./AccountControl');
var stocks = require('./StockQuotes');
var qna = require('./QnA');

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
                session.send("Getting balance for " + session.conversationData.name);
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
                session.send("Opening a new " + accountType + " account for " + session.conversationData.name);
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
        session.send("Hi! " + session.conversationData.name);
        
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

            session.send("Getting accounts for " + session.conversationData.name);
            account.displayAccounts(session, session.conversationData["username"]);         

        }
    
    ]).triggerAction({
        matches:'GetAccounts'
    });

    bot.dialog('ConvertCurrency', function(session, args) {
        var cEntities = args.intent.entities;               
        
        if (cEntities) {
            session.send("Getting exchange rates")
            stocks.displayExchangeRate(session, cEntities[0].entity.toUpperCase(), cEntities[1].entity.toUpperCase());
        } else {
            session.send("No valid currencies selected");
        }
        
    }).triggerAction({
        matches:'ConvertCurrency'
    })

    bot.dialog('Help', function(session, args) {
        session.send(new builder.Message(session)
        .addAttachment(
            new builder.HeroCard(session)
                .title("Hi again")
                .text(`I can help you do these awesome things:
                
                \n • View your balance
                \n • Open a new bank account
                \n • Remove your bank account
                \n • View what types of bank accounts you have
                \n • Get exchange rates
                \n • Get stock quotes`)        
    
        ));
    }).triggerAction({
        matches:'Help'
    })

    bot.dialog('TransferMoney', [function(session, args, next) {
        if (!session.conversationData["username"]) {
            builder.Prompts.text(session, "Sure, please enter your username");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function(session, results) {
        if (results.response) {
            session.conversationData["username"] = results.response;
        }
        builder.Prompts.text(session, "What account do you want to transfer from?");        
    },
    function(session, results) {
        session.dialogData.fromAccount = results.response;        
        builder.Prompts.text(session, "What account do you want to transfer to?");        
    },
    function(session,results) {
        session.dialogData.toAccount = results.response;
        builder.Prompts.number(session, "How much money do you want to transfer? Please do not type a currency symbol");
    },
    function(session, results) {
        session.dialogData.amount = results.response;
        session.send("Transferring money");
        account.transferMoney(session, session.conversationData["username"], session.dialogData.fromAccount,
            session.dialogData.toAccount, session.dialogData.amount);
    }

    ]).triggerAction({
        matches:'TransferMoney'
    })

    bot.dialog('QnA', [function(session, args, next) {
        session.dialogData.args = args || {};
        builder.Prompts.text(session, "Sure " +session.conversationData.name + " what would you like to know?");
    },
    function(session,results, next) {
        qna.talkToQnA(session, results.response);
    }
    ]).triggerAction({
        matches: 'QnA'
    })

    bot.dialog('SwitchUser', [function(session, args, next) {
        session.dialogData.args = args || {};
        builder.Prompts.text(session, "Sure " +session.conversationData.name + " what username do you want to change to");
    },
        function(session, results, next) {
            session.conversationData["username"] = results.response;
            session.send("Username changed to " + session.conversationData["username"]);
        }
    ]).triggerAction({
        matches:'SwitchUser'
    })
    bot.dialog('None', function (session, args) {
        session.send("help func");
        
    }).triggerAction({
        matches: 'None'
    });
}