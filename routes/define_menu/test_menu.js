var menu = require('./menu.js');

var menu_data = {
     "button":[
     {  
          "type":"click",
          "name":"今日歌曲",
          "key":"V1001_TODAY_MUSIC"
     },
     {
           "name":"菜单",
           "sub_button":[
           {    
               "type":"view",
               "name":"搜索",
               "url":"http://www.soso.com/"
           },
           {
               "type":"view",
               "name":"视频",
               "url":"http://v.qq.com/"
           },
           {
               "type":"click",
               "name":"赞一下我们",
               "key":"V1001_GOOD"
           }]
     },
     {  
          "type":"pic_photo_or_album",
          "name":"Take a photo",
          "key":"V1001_Take_Photo"
     }]
};

function callback(body){
    var jsonBody = JSON.parse(body);
    var access_token = jsonBody["access_token"];
    console.log("access_token:" + access_token);

    function cb_menu(res_body){
        res_body  = JSON.parse(res_body);

        console.log("res error msg: " + res_body['errmsg']);
    }

    menu.define_menu(access_token, menu_data,cb_menu);
}

menu.access_token(callback);

