var watson = require('./watson');
var qa = require('./qa');
var openapi = require('./openapi');

var url = 'http://www.nationofchange.org/2014/wp-content/uploads/obama102614.jpg';
//var url = 'http://clps10160611.weebly.com/uploads/1/3/4/9/13493232/5006936.jpg?433';


function face_cb(body){
    var jsonBody = JSON.parse(body);
    if(jsonBody['imageFaces'].length == 0){
        console.log("no face");
    }
    else{
        console.log(jsonBody['imageFaces'][0]['age']['ageRange'])
    }
}

watson.faceDetectionUrl(url,face_cb);

/*
function weather_cb(body){
    var jsonBody = JSON.parse(body);
    var temp = jsonBody['main']['temp'];
    var city = jsonBody['name']
    console.log("現在" + city + "溫度是: " + temp + "度")
}

// Haidian
var lat = '39.9843472';
var lon = '116.3130694';
openapi.weather(lat,lon,weather_cb);

function qa_cb(error,body){
    console.log("result: " + body)
}
*/

/*
var questionText = "Q:Is Taipei Hot??";
var q = questionText.substring(0,2);
console.log("q: " + q);
if (q==="Q:"){
    console.log("q");
    qa.askSimpleQuestion(questionText,0,qa_cb);
}
*/
