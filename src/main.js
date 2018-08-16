// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css'
import './common/css/common.css'
import './common/css/override.css'
//import './preConf'
import localStorageEx from 'localstorageex'
import sessionStorageEx from '@/sessionStorageEx'

localStorageEx.setPrefix('gitinn_fe')

import Vue from 'vue'
import App from './App'
import './winListener'
import router from './router'
import { format } from 'date-fns'
import distanceInWords from 'date-fns/distance_in_words'
import zhLocale from 'date-fns/locale/zh_cn'
import InfoMsg from '@/InfoMsg'

//import YDUI from 'vue-ydui'
//import 'vue-ydui/dist/ydui.px.css'

//load jquery glanceyear plugin with css style

import MugenScroll from 'vue-mugen-scroll'

import ElementUI, {
	Loading,
	MessageBox,
	Message,
	Notification
} from 'element-ui'

import axios from '@/axios'
import * as COMMON from '@/common'
import * as Self from '@/self'

//Vue.use(require('vue-wechat-title'))
Vue.use(ElementUI)
Vue.component('mugen-scroll', MugenScroll)

Vue.use({
	install: function(Vue, options) {
		Vue.prototype.$dateFmt = format
		Vue.prototype.$distanceInWords = function(date) {
			return distanceInWords(new Date(), date, {
				locale: zhLocale,
				addSuffix: true
			})
		}

		//  window.distanceInWords=Vue.prototype.$distanceInWords

		Vue.prototype.$cmmDate = function(date, type = 0) {
			var fmt = '';
			if(type == 0) {
				fmt = format(date, 'YYYY年M月DD日')
			} else if(type == 1) {
				fmt = format(date, 'YYYY-MM-DD')
			} else if(type == 2) {
				fmt = format(date, 'MMM DD, YYYY')
			}
			return fmt;
		}

		//  Vue.prototype.$toJson=window.toJson
        // 获取当前登录用户的信息
		Vue.prototype.$getSelf = Self.getSelf

		// 获取仓库详情
        Vue.prototype.$getRepo = function (username, repoName, cb) {
            cb || (cb = function() {});
            if(isStrEmpty(username)) {
                InfoMsg.err('user name is empty')
                return;
            }

            if(isStrEmpty(repoName)) {
                InfoMsg.err('repo_name is empty')
                return;
            }
            axios.get('/repos/' + username + '/' + repoName).then(resp => {
                let storeItem = resp.data
                cb(storeItem)
            }).catch(Err)
        }
        // 获取用户资料
        Vue.prototype.$getUser = function (username, cb) {
            cb || (cb = function() {});
            if(isStrEmpty(username)) {
                InfoMsg.err('user name is empty')
                return;
            }

            axios.get('/users/' + username).then(resp => {
                let user = resp.data
                cb(user)
            }).catch(Err)
        }
        // 跳到某个用户的页面
        Vue.prototype.$goUserProfile = function (username) {
            if (this.self.username != username)  {
                this.$router.push({
                    path: '/' + username
                })
            } else {
                this.$router.push('/dashboard')
            }
        }
	}
})

//Vue.use(YDUI)

Vue.config.productionTip = false

window.localStorageEx = localStorageEx
window.axios = axios
window.Msg = function(msg) {
	if(typeof msg == 'object') msg = JSON.stringify(msg)
	else if(typeof msg != 'string') {
		msg += ''
	}

	InfoMsg.msg(msg)
}

window.Err = function(msg) {
    // 控制台输入具体错误，方便定位
    console.error(msg)
	// if (typeof msg != 'string') {
	//     msg = JSON.stringify(msg)
    // }

	// InfoMsg.err(msg)
}

window.MessageBox = MessageBox
window.Loading = Loading
window.Notification = Notification
window.COMMON = COMMON
window.sessionStorageEx = sessionStorageEx

/* eslint-disable no-new */
//
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: {
		App
	}
})