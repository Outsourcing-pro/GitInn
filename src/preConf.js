//加载样式和插件

import InfoMsg from '@/InfoMsg'

if (window.isStrEmpty == null) {
    window.isStrEmpty = function(str) {
        return str == null || (str + '').trim() === '';
    }
}

if (window.toJson == null) {
    window.toJson = function(str) {
        if (typeof str == 'object') throw 'str is a object in toJson';
        if (str == null) return null;

        var r = {}
        try {
            r = JSON.parse(str)
        } catch (e) {
            console.error(e.message)
        }
        return r;
    }
}

//设置cookie
window.setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + (exdays == null ? "" : "; " + expires);
},
//获取cookie
window.getCookie = function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
},

window.InfoMsg=InfoMsg

import '@/public/plugins/glanceyear/glanceyear.css'
import '@/public/plugins/glanceyear/jquery.glanceyear.js'
import '@/public/plugins/simplemde-1.10.1/simplemde.min.css'
import '@/public/assets/font-awesome-4.6.3/css/font-awesome.min.css'
import '@/public/plugins/simplemde-1.10.1/simplemde.min.js'
import Clipboard from '@/public/js/libs/clipboard-1.5.9.min.js'
import '@/public/css/semantic-2.2.7.min.css'
import '@/public/css/gogs.css'
import '@/public/js/semantic-2.2.7.min.js'

window.Clipboard=Clipboard
