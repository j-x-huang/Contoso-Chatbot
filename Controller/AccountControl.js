var rest = require('../API/RestClient');


var url = 'http://contosobankgroup.azurewebsites.net/tables/Account';
exports.displayBalance = function getBalance(session, username, accountType) {
    rest.getAccount(url, session, username, accountType, handleBalanceResponse); //rest call to get all bank accounts
};

exports.sendAccount = function postAccount(session, username, accountType) {
    //rest call for all accounts
    rest.getAccount(url , session, username, accountType, function(message, session, username, accountType) {
        var response = JSON.parse(message);
        console.log("here");
        var count = 0;
        //go through all accounts and checks if the account exists for the user
        for (var index in response) {
            var usernameReceived = response[index].username;
            var accountTypeReceived = response[index].account_type;

            if (usernameReceived.toLowerCase() === username.toLowerCase()
            && accountTypeReceived.toLowerCase() === accountType.toLowerCase()) { //check if accounts and username match
               count++;
           }
        }
        if (count > 0) { //if account exists
            session.send("You already have a " + accountType + ". You cannot create another.");
        } else {
         rest.postAccount(url, username, generateAccountNumber(), accountType, session, function(session) {
             session.send("Account created!") //create new account
         });
        }

    })


}

exports.removeAccount = function deleteAccount(session, username, accountType) {
    rest.getAccount(url, session, username, accountType, function(message, session, username, accountType) { //get accounts
        var response = JSON.parse(message);

        var count = 0;
        for (var index in response) { //looks through all account to see if that account exists
            var usernameReceived = response[index].username;
            var accountTypeReceived = response[index].account_type;

            if (usernameReceived.toLowerCase() === username.toLowerCase()
             && accountTypeReceived.toLowerCase() === accountType.toLowerCase()) { //account exists
                count++;
                if (response[index].balance !== 0) { //still have money
                    session.send("There are still funds in that account. Please transfer to another account if you wish to delete.");
                } else {
                    rest.deleteAccount(url, session, username, accountType, response[index].id, handleDelete); //no money, can delete
                }
                break;
            }
        }
        if (count === 0) { //can't find account
            session.send("You have no " + accountType+ " accounts.");
        }
    });
}

exports.displayAccounts = function getAllAccounts(session, username) {
    rest.getAccount(url, session, username, null, function(message, session, username, accountType) {
        var response = JSON.parse(message);
        var allAccounts = [];
        var count = 0;
        for (var index in response) { //find all accounts associated with user
            var usernameReceived = response[index].username;
        
            if (usernameReceived.toLowerCase() === username.toLowerCase()) { //account belongs to user
                count++;
                if (response.length - 1) {
                    allAccounts.push(response[index].account_type);
                } else {
                    allAccounts.push(response[index].account_type + `,`);
                }
            }
        }
        if (count === 0) {
            session.send("You have no accounts");
        } else {
            session.send("You have the following bank accounts: %s", allAccounts);
        }

    })
}

exports.transferMoney = function putAccount(session, username, accountA, accountB, amount) {
    rest.getAccount(url, session, username, accountA, function(message, session, username, accountA) {
        var response = JSON.parse(message);

        var accountAExists = false;
        var accountBExists = false;
        var aIndex="";
        var bIndex="";
        for (var index in response) { //look for account a and account b in all accounts
            var usernameReceived = response[index].username;
            var accountTypeReceived = response[index].account_type;

            if (usernameReceived.toLowerCase() === username.toLowerCase() //from-account exists
            && accountTypeReceived.toLowerCase() === accountA.toLowerCase()) {
                accountAExists = true;
                aIndex= index;
            }
            if (usernameReceived.toLowerCase() === username.toLowerCase() //to-account exists
            && accountTypeReceived.toLowerCase() === accountB.toLowerCase()) {
                accountBExists = true;
                bIndex = index;
            }
        }

        if (accountAExists && accountBExists ) { //if both exists
            if (response[aIndex].balance < amount) { //check if from-account has sufficient funds
                session.send("Insufficient funds in your " + accountA + " account.") //not enough money
            } else {
                var newABalance = response[aIndex].balance - amount;
                var newBBalance = response[bIndex].balance + amount;
                rest.modifyAccount(url, session, response[aIndex].id, newABalance, function(session) { //update from-account
                    rest.modifyAccount(url, session, response[bIndex].id, newBBalance, function(session) { //update to-account afterwards
                        session.send("Transfer complete!");
                    })
                })

            }
        } else {
            session.send("One of your accounts does not exist");
        }
        
    })
}

function handleDelete(body,session,username, accountType) {
    session.send("Deleted " + accountType + " account.")
}
//generate random 18 digit number for account number
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
//to get the balance from accounts
function handleBalanceResponse(message, session, username, accountType) {
    //console.log(message);
    var response = JSON.parse(message);
    //console.log(response);
    var count = 0;
    for (var index in response) { //loop through all the accounts
        var usernameReceived = response[index].username;
        var accountTypeReceived = response[index].account_type;
        var balance = response[index].balance;
        if (usernameReceived.toLowerCase() === username.toLowerCase() //If username and account type match
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

