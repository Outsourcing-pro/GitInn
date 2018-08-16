'use strict'
//每条语句都不需要分号结尾，基本是是无用的

import qs from 'qs'

if(location.toJsonMap == null) {

	location.toJsonMap = function() {
		var rs = {}
		var search = location.search
		var s = search.indexOf('?')
		var e = search.indexOf('/')
		var m = search.indexOf('#')
		if(m >= 0 && m < e) e = m
		if(e < 0) e = search.length
		if(s >= 0) {
			var tempS = search.substring(s + 1, e)
			rs = qs.parse(tempS)
			//			console.log(JSON.stringify(rs))
		}

		return rs
	}

}

export function setTitle(title) {
	if(title === null) return;
	document.title = title;
	var deviceInfo = navigator.userAgent.toLowerCase();
	if(/iphone|ipad|ipod/.test(deviceInfo)) {
		var iframe = document.createElement('iframe')
		iframe.style.display = 'none'
		// 替换成站标favicon路径或者任意存在的较小的图片即可
		iframe.setAttribute('src', '/favicon.ico')
		var iframeCallback = function() {
			setTimeout(function() {
				iframe.removeEventListener('load', iframeCallback)
				document.body.removeChild(iframe)
			}, 0)
		}
		iframe.addEventListener('load', iframeCallback)
		document.body.appendChild(iframe)
	}
}