var rest = require('../API/RestClient');
//send image url to custom vision
exports.sendImage = function(session, msg) {
    var url = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/135e5615-498b-4a2b-a9ed-134815a07f6a/url?iterationId=b7f65256-ec2d-40d9-8687-985bf0e308c9';
    rest.postImage(url, session, msg, function(session, body) {
        if (body && body.Predictions && (body.Predictions[0].Tag==='Contoso') && (body.Predictions[0].Probability > 0.3)){ //if it's likely that image is of contoso bank
            session.send("Yes this looks like a Contoso bank");
        } else{
            session.send("This does not look like a Contoso Bank");
        }
    })

}