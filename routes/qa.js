"use sytrict";
//var log = require('logule').init(module, 'QA'),
var log = require("../utils/logger"),
    request = require('request'),
    config = require('./config').qa,
    jsonPath = require("JSONPath");

var msgConstants = {
    INVALIDANSERRNAME: 'InvalidAnswerError',
    INVALIDANSERRMESSAGE: 'Not a valid answer'
}

function isJson(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

exports.askSimpleQuestion = function(questionText, timeout, callback) {

    /*
    var config = {
        url : "https://gateway.watsonplatform.net/question-and-answer-beta/api",
        username : "3e1f66b7-9fa1-4d5e-a5ee-f1d54fa27000",
        passwd : "vqdE30xPMJqq"
    }
    */

    var headers = {
        'Content-Type': 'application/json',
        'X-synctimeout': timeout
    };
    var options = {
        uri: config.url+'/v1/question/travel',
        //uri: config.url+'/v1/question/healthcare',
        headers: headers,
        auth: {
            user: config.username,
            pass: config.passwd
        },
        body: JSON.stringify({
            question: {
                questionText: questionText
            }
        })
    };
    request.post(options, function(err, res, data) {
        if (err) {
            log.error('Failed to send question to Watson!, err: '+err);
            return callback(err, null);
        }
        try {
            if (data && isJson(data)) {
                var ans = JSON.parse(data);
                if (ans.length === 0) {
                    var error = new Error('No answer found!');
                    error.name = 'EmptyAnswerError';
                    log.error(error);
                    return callback(error, null);
                }
                // Process Results
                var result = jsonPath.eval(ans, '$[0].question.evidencelist[0].text')[0];
                if (!result) {
                    var error = new Error(msgConstants.INVALIDANSERRMESSAGE+', err: '+body);
                    error.name = msgConstants.INVALIDANSERRNAME;
                    log.error(error);
                    return callback(error, null);
                }
                callback(null, result);
            } else {
                var error = new Error(msgConstants.INVALIDANSERRMESSAGE+', err: '+body);
                error.name = msgConstants.INVALIDANSERRNAME;
                log.error(error);
                callback(error, null);
            }
        } catch (error) {
            log.error('Unexpected error: '+error);
            callback(error, null);
        }
    });
};
