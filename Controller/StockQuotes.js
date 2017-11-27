var rest = require('../API/RestClient');
var builder = require('botbuilder');

exports.displayStocks = function getStocks(session, symbol, company) {
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=P20P9RQXQ5YG6ZCT';
    rest.getStocks(url, session, company, function(message, session, company) {
        var response = JSON.parse(message);

        var timeSeries = response["Time Series (Daily)"];
        var count = 0;
        for (time in timeSeries) {

        session.send(new builder.Message(session).addAttachment({
            contentType: "application/vnd.microsoft.card.adaptive",
            content: {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "type": "AdaptiveCard",
                "version": "1.0",
                "body": [
                    {
                        "type": "TextBlock",
                        "text": company + " " + symbol + " (" +time + ")",
                        "size": "large"
                    },
                    {
                        "type": "TextBlock",
                        "text" : "Open: $" + timeSeries[time]["1. open"]
                    },
                    {
                        "type": "TextBlock",
                        "text" : "High: $" + timeSeries[time]["2. high"]
                    },
                    {
                        "type": "TextBlock",
                        "text" : "Low: $" + timeSeries[time]["3. low"]
                    },
                    {
                        "type": "TextBlock",
                        "text" : "Close: $" + timeSeries[time]["4. close"]
                    },
                    {
                        "type": "TextBlock",
                        "text" : "Volume: " + timeSeries[time]["5. volume"]
                    }
                ]
            }
        }));
        count ++;
        if (count > 0) {
            break;
        }
        }
    })
};