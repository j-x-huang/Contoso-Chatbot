var rest = require('../API/RestClient');


var url = 'http://contosobankgroup.azurewebsites.net/tables/Account';
exports.displayBalance = function getBalance(session, username, accountType) {
    rest.getAccount(url, session, username, accountType, handleBalanceResponse);
};

exports.sendAccount = function postAccount(session, username, accountType) {

    rest.getAccount(url , session, username, accountType, function(message, session, username, accountType) {
        var response = JSON.parse(message);
        console.log("here");
        var count = 0;

        for (var index in response) {
            var usernameReceived = response[index].username;
            var accountTypeReceived = response[index].account_type;

            if (usernameReceived.toLowerCase() === username.toLowerCase()
            && accountTypeReceived.toLowerCase() === accountType.toLowerCase()) {
               count++;
           }
        }
        if (count > 0) {
            console.log("here2")
            session.send("You already have a " + accountType + ". You cannot create another.");
        } else {
            console.log("here3");
         rest.postAccount(url, username, generateAccountNumber(), accountType, session, function(session) {
             session.send("Account created!")
         });
        }

    })


}

exports.removeAccount = function deleteAccount(session, username, accountType) {
    rest.getAccount(url, session, username, accountType, function(message, session, username, accountType) {
        var response = JSON.parse(message);

        var count = 0;
        for (var index in response) {
            var usernameReceived = response[index].username;
            var accountTypeReceived = response[index].account_type;

            if (usernameReceived.toLowerCase() === username.toLowerCase()
             && accountTypeReceived.toLowerCase() === accountType.toLowerCase()) {
                count++;
                if (response[index].balance !== 0) {
                    session.send("There are still funds in that account. Please transfer to another account if you wish to delete.");
                } else {
                    rest.deleteAccount(url, session, username, accountType, response[index].id, handleDelete);
                }
                break;
            }
        }
        if (count === 0) {
            session.send("You have no " + accountType+ " accounts.");
        }
    });
}

exports.displayAccounts = function getAllAccounts(session, username) {
    rest.getAccount(url, session, username, null, function(message, session, username, accountType) {
        var response = JSON.parse(message);
        var allAccounts = [];
        var count = 0;
        for (var index in response) {
            var usernameReceived = response[index].username;
        
            if (usernameReceived.toLowerCase() === username.toLowerCase()) {
                count++;
                if (response.length - 1) {
                    allAccounts.push(response[index].account_type);
                } else {
                    allAccounts.push(response[index].account_type + ', ');
                }
            }
        }
        if (count === 0) {
            session.send("You have no accounts");
        } else {
            session.send("%s, you have the following bank accounts: %s", username, allAccounts);
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
        for (var index in response) {
            var usernameReceived = response[index].username;
            var accountTypeReceived = response[index].account_type;

            if (usernameReceived.toLowerCase() === username.toLowerCase()
            && accountTypeReceived.toLowerCase() === accountA.toLowerCase()) {
                accountAExists = true;
                aIndex= index;
            }
            if (usernameReceived.toLowerCase() === username.toLowerCase()
            && accountTypeReceived.toLowerCase() === accountB.toLowerCase()) {
                accountBExists = true;
                bIndex = index;
            }
        }

        if (accountAExists && accountBExists ) {
            if (response[aIndex].balance < amount) {
                session.send("Insufficient funds in your " + accountA + " account.")
            } else {
                var newABalance = response[aIndex].balance - amount;
                var newBBalance = response[bIndex].balance + amount;
                rest.modifyAccount(url, session, response[aIndex].id, newABalance, function(session) {
                    console.log("here2")
                    rest.modifyAccount(url, session, response[bIndex].id, newBBalance, function(session) {
                        console.log("here3")
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
    //console.log(message);
    var response = JSON.parse(message);
    //console.log(response);
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

