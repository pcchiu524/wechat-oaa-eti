var express = require('express');
var router = express.Router();
var token = "token12345"
var wechat = require('node-wechat')(token);
var logger = require("../utils/logger");
var watson = require("./watson");
var openapi = require("./openapi");
var qa = require("./qa");

var wechat_api = function(req,res){

  logger.info("Start wechat api!!!!");

  wechat.checkSignature(req, res);

  wechat.handler(req, res);

  wechat.text(function (data) {

    logger.info("------");
    logger.info(data.ToUserName);
    logger.info(data.FromUserName);
    logger.info(data.CreateTime);
    logger.info(data.MsgType);
    //...

    var content = data.Content;
    var msg = {};
    try{
        if(content.toLowerCase()==="test"){
            msg = {
              FromUserName : data.ToUserName,
              ToUserName : data.FromUserName,
              MsgType : "text",
              Content : "這是測試文本回覆"
            }
            wechat.send(msg);
        }
        else if(content.substring(0,2) === "Q:"){
            var question = content.substring(2);

            function qa_cb(error,body){

                msg = {
                  FromUserName : data.ToUserName,
                  ToUserName : data.FromUserName,
                  MsgType : "text",
                  Content : body
                }

                wechat.send(msg);
            }

            qa.askSimpleQuestion(question,0,qa_cb);
        }
        else{
            //回复信息
            wechat.send(msg);
        }
    }
    catch(err){
        msg = {
          FromUserName : data.ToUserName,
          ToUserName : data.FromUserName,
          MsgType : "text",
          Content : err
        }
        wechat.send(msg);
    }

  });

  wechat.image(function (data) {

    var callback = function(body){

        var jsonBody = JSON.parse(body);
        var content = null;

        if (jsonBody['imageFaces'].length == 0){
            content = "Sorry, no face in your picture.";
        }
        else {
            var age = jsonBody['imageFaces'][0]['age']['ageRange']
            content = "Your face looks like \'" + age + "\' years old." 
        }
        
        var msg = {
            FromUserName : data.ToUserName,
            ToUserName : data.FromUserName,
            MsgType : "text",
            Content : content
        }

        wechat.send(msg);
    }

    watson.faceDetectionUrl(data.PicUrl,callback)

  });

  wechat.voice(function (data) {
  

    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : data.Recognition,
    }

    logger.info("----voice---");
    logger.info("media id: " + data.MediaId);
    logger.info("Recognition: " + data.Recognition);
    wechat.send(msg);
          
  });

  wechat.location(function (data) {
            
    function cb_weather(body){
        var jsonBody = JSON.parse(body);
        var temp = jsonBody['main']['temp'];
        var city = jsonBody['name']

        var msg = {
            FromUserName : data.ToUserName,
            ToUserName : data.FromUserName,
            //MsgType : "text",
            Content : "現在" + city + "溫度是: " + temp + "度"
         }
        wechat.send(msg);
    }

    var lat = data.Location_X;
    var lon = data.Location_Y;
    openapi.weather(lat,lon,cb_weather);

  });

}


router.post('/',wechat_api);

module.exports = router;
