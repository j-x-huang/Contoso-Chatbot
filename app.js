var restify = require('restify');
var builder = require('botbuilder');
var luis = require('./Controller/LuisDialog');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '37cbbce4-63f1-4703-b9f4-79998acfd52f',
    appPassword:'iyhRPZX024?*lsfiTRZ92^+'
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send(new builder.Message(session)
    .addAttachment(
        new builder.HeroCard(session)
            .title("Hi, welcome to Contoso Bank")
            .subtitle("I am Conrad, your ContosoBot")
            .text(`I can help you do these awesome things:
            
            \n • View your balance
            \n • Open a new bank account
            \n • Remove your bank account
            \n • View what types of bank accounts you have
            \n • Get exchange rates
            \n • Get stock quotes
            \n
            \n Type 'help' to see all options again.`)
    

    ));
});

// Send welcome when conversation with bot is started, by initiating the root dialog
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});



luis.startDialog(bot);
