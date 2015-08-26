var http = require('http');
var logger = require("../utils/logger")

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

exports.weather = function(lat,lon,callback_body){

    var content = null;

    options.method = 'GET';
    options.host = 'api.openweathermap.org';
    options.path = '/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&lang=zh_tw';
    console.log("path: " + options.path);

    var callback = function(res,body){
        if(res!=null){
            console.log("res status code: " + res.statusCode);
        }

        console.log("body: " + body);
        callback_body(body);
    };

    send_req(content,options,callback);
};

//module.exports = imageUrl;
