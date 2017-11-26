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