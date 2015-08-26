var http = require('http');
var fs = require('fs');
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();
var watson = require("watson-developer-cloud");
var logger = require("../utils/logger")
var credentials_alchemy = require('./config').alchemy;

var msgConstants = {
    INVALIDANSERRNAME: 'InvalidAnswerError',
    INVALIDANSERRMESSAGE: 'Not a valid answer'
};
//credentials = require("./config").speech_to_text,
//var streamifier = require("streamifier");

var options = {
    port: 80,
    path: '',
    method: '',
}

var send_req = function(content,options,callback){
    var req = http.request(options, function(res){
        var body = '';
        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function(){
            callback(res,body);
        });
    })

    req.on('error', function(err) {
        console.log("err: " + err);
        callback(null,err);
        // Handle error and recovery
    });

    if(content){
        req.write(JSON.stringify(content));
    }
    req.end();
};

function isJson(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}

exports.faceDetectionUrl = function(data_url,callback_res){

    var url = encodeURIComponent(data_url);
    var content = null;
    //var apikey = fs.readFileSync(__dirname + '/api_key.txt').toString().trim();
    // bind alchemy api on bluemix
    var apikey = credentials_alchemy.apikey;

    options.method = 'GET';
    options.host = 'access.alchemyapi.com',
    options.path = '/calls/url/URLGetRankedImageFaceTags?url='+url+"&apikey=" + apikey + "&outputMode=json";
    console.log("path: " + options.path);

    var callback = function(res,body){
        if(res!=null){
            console.log("res status code: " + res.statusCode);
        }

        console.log("body: " + body);
        callback_res(body);
    };

    send_req(content,options,callback);
};

// Face detection
exports.faceDetection = function(req,res) {

        var data = '';
        var count = 0;

        console.log(req.body)
        console.log(req.files)
        //console.log('buffer: ' + req.files.fileContent.buffer)

        // Save Buffer to File and send face detection to alchemy
        fs.writeFile(req.files.filePic.path,req.files.filePic.buffer,function(err){

            alchemyapi.face_detection('image', req.files.filePic.path, null, function(response) {

                console.log('Face detection tests complete!\n');
                console.log('response totalTransactions: ' + response['totalTransactions']);
                console.log('response age: ' + response['imageFaces'][0]['age']['ageRange']);

                var result = {
                    result : response['imageFaces'][0]['age']['ageRange']
                }

                res.status(200).json(result);
            });
        })
}

//module.exports = imageUrl;
