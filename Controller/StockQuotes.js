var rest = require('../API/RestClient');
var builder = require('botbuilder');

exports.displayExchangeRate = function getRates(session, fromCurrency, toCurrency) {
    var url = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=' 
        + fromCurrency + '&to_currency=' + toCurrency +'&apikey=P20P9RQXQ5YG6ZCT';

    rest.getRates(url, session, function(message, session) { //rest call to api
        var response = JSON.parse(message);
        console.log(response);  
        for (var index in response ) {  //extract currency names and value
            var fCurrency = response[index]["2. From_Currency Name"];
            var tCurrency = response[index]["4. To_Currency Name"];
            var rate = response[index]["5. Exchange Rate"];
            session.send("1 " + fCurrency + " = " + rate + " " +tCurrency);
        }
    })
}

exports.displayStocks = function getStocks(session, symbol, company) {
    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + symbol + '&apikey=P20P9RQXQ5YG6ZCT';
    rest.getStocks(url, session, company, function(message, session, company) {
        var response = JSON.parse(message);

        var timeSeries = response["Time Series (Daily)"];
        var count = 0;
        for (var time in timeSeries) { 

        session.send(new builder.Message(session).addAttachment({ //create new adaptive card to hold information
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
                        "text" : "Open: $" + timeSeries[time]["1. open"] //extract values from api response
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
        count ++;   //stop after making a card for the first result
        if (count > 0) {
            break;
        }
        }
    })
};