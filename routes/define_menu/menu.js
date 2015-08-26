var https = require('https');
var logger = require("../../utils/logger")
var PropertiesReader = require('properties-reader');

var properties = PropertiesReader('./config.properties');
var app_id = properties.get('app.id');
var app_secret = properties.get('app.secret');

var options = {
    host: 'api.weixin.qq.com',
    port: 443,
    path: '',
    method: '',
};

var send_req = function(content,options,callback){
    var req = https.request(options, function(res){
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

exports.define_menu = function(access_token, menu_json, callback_body){

    var content = menu_json;

    options.method = 'POST';
    options.path = '/cgi-bin/menu/create?access_token=' + access_token;
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

exports.access_token = function(callback_body){

    var content = null;

    options.method = 'GET';
    options.path = '/cgi-bin/token?grant_type=client_credential&appid=' + app_id + '&secret=' + app_secret;
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
