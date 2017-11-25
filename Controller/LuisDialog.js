var builder = require('botbuilder');

exports.startDialog = function (bot) {
    
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/{YOUR_APP_ID_HERE}?subscription-key={YOUR_KEY_HERE}&timezoneOffset=0&q=');

    bot.recognizer(recognizer);

    bot.dialog('GetCalories', function (session, args) {

        // Pulls out the food entity from the session if it exists
        var foodEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'food');

        // Checks if the for entity was found
        if (foodEntity) {
            session.send('Calculating calories in %s...', foodEntity.entity);
            // Here you would call a function to get the foods nutrition information

        } else {
            session.send("No food identified! Please try again");
        }
        
    }).triggerAction({
        matches: 'GetCalories'
    });
}