var request = require("request");

exports.getAccount = function getData(url, session, username, accountType, callback) {
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetResponse( err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username, accountType);
        }
    });
};

exports.deleteAccount = function deleteData(url,session, username ,accountType, id, callback) {
    var options = {
        url: url + "\\" + id,
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        }
    };

    request(options,function (err, res, body){
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username, accountType);
        }else {
            console.log(err);
            console.log(res);
        }
    });
};

exports.postAccount = function postData(url, username, accountNumber, accountType) {
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "username" : username,
            "account_number" : accountNumber,
            "account_type" : accountType,
            "balance" : 0
        }
      };

      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
}

exports.getStocks = function getData(url, session, company, callback) {
    var options = {
        url: url,
        method: 'GET'
    }

    request(options,function (err, res, body){
        if( err){
            console.log(err);
        }else {
            callback(body,session, company);
            
        }
    });
}