'use strict'

import axios from 'axios'

axios.defaults.baseURL = window.domains.apiDomain
axios.defaults.timeout = 6000

axios.interceptors.request.use(function(config) {
	var token = getCookie('x_access_token')
	//
	if(token != null) {
        config.headers.Token = token
    }
	config.withCredentials = true
	return config;
}, function(error) {
	return Promise.reject(error);
})

axios.interceptors.response.use(function(response) {
	return response
}, function(error) {

	if(error.response) {

	}

	var temp = error
	if(error.response) {
	    // 401 没授权，登录过期
		if (error.response.status == 401) {
			setCookie('x_access_token', '', -1)
            location.href = window.domains.redirectUrl
		}
		if(error.response.data) {//有data的时候
			if(typeof error.response.data == 'object') { //data是对象的时候
				temp = error.response.data.error || error.response.data.code
			} else temp = error.response.data
		} else {
			temp = error.response.statusText || error.response.status || error.response
		}
	}

	return Promise.reject(temp)
})

export default axios