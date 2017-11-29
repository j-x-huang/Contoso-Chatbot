var rest = require('../API/RestClient');
//post question to rest
exports.talkToQnA = function postQnAResults(session, question){
    var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/202ea05b-d3ae-4b45-8b81-32d6313f1b87/generateAnswer';
    rest.postQnAResults(url, session, question, handleQnA)
};
//display answer
function handleQnA(body, session, question) {
    session.send(body.answers[0].answer);
};