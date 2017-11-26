var rest = require('../API/RestClient');

exports.displayBalance = function getBalance(session, username, accountType) {
    var url = 'http://contosobankgroup.azurewebsites.net/tables/Account';
    rest.getAccount(url, session, username, accountType, handleBalanceResponse);
};

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
