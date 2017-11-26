var rest = require('../API/RestClient');

var url = 'http://contosobankgroup.azurewebsites.net/tables/Account';
exports.displayBalance = function getBalance(session, username, accountType) {
    rest.getAccount(url, session, username, accountType, handleBalanceResponse);
};

exports.sendAccount = function postAccount(session, username, accountType) {
    rest.postAccount(url, username, generateAccountNumber(), accountType);
}

function generateAccountNumber() {
    var number = "";
    for (var i = 0; i < 18; i++) {
        if (i === 2 || i === 7 || i === 15) {
            number += "-";
        } else {
            number += Math.floor((Math.random() * 10));            
        }
    }
    return number;
}

function handleBalanceResponse(message, session, username, accountType) {
    var response = JSON.parse(message);
    console.log(response);
    var count = 0;
    for (var index in response) {
        var usernameReceived = response[index].username;
        var accountTypeReceived = response[index].account_type;
        var balance = response[index].balance;
        if (usernameReceived.toLowerCase() === username.toLowerCase()
         && accountTypeReceived.toLowerCase() === accountType.toLowerCase()) {
            count++;
            session.send("The balance for your " + accountTypeReceived + " account is : $" + balance );
            break;
        }
    }
    if (count === 0) {
        session.send("You have no " + accountType+ " accounts");
    }
};
