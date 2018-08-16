//'use strict'
//local storage, enhance the function of plus.storage,
//it can store json,array,number,boolean,string and convert them automatically

var prefixKey = '_prefix_'

var commFunc = {
	remove: function(key) {
		if(key == null) throw "please input a key"
		if(typeof key != 'string') throw "key must be a string"
		this.store().removeItem(prefixKey + key)
	},
	set: function(key, val) { // if val is null, the object will be removed
		if(key == null) throw "please input a key"
		if(typeof key != 'string') {
			console.error('key is %o', key)
			throw "key must be a string"
		}
		if(val == null) {
			throw "must input a value for key " + key
		}

		if(typeof val == 'function') throw "can't store a function"

		switch(typeof val) {
			case 'object': //json, array
				this.store().setItem(prefixKey + key, JSON.stringify(val))
				break;
			default: //number ,string, boolean
				this.store().setItem(prefixKey + key, val)
				break;
		}

	},
	get: function(key) {
		if(key == null) throw "please input a key"
		if(typeof key != 'string') throw "key must be a string"

		var strVal = this.store().getItem(prefixKey + key)
		if(strVal == null) return strVal

		var obj = null
		try {
			obj = JSON.parse(strVal) //json , array
		} catch(e) {
			var temp = strVal * 1
			if(isNaN(temp)) { //boolean, string
				if(strVal == 'true') obj = true
				else if(strVal == 'false') obj = false
				else obj = strVal // remaining is string

			} else { // else is number
				obj = temp
			}

		}

		return obj

	},
	setPrefix: function(prefix) {
		if(typeof prefix != 'string' || prefix.trim() == '') throw "prefix must be a string";
		prefixKey = '_' + prefix + '_'
	}

}

var globalVar = window || global

var sessionStorageEx = Object.assign({}, commFunc, {
	store: function() {
		if(!globalVar.sessionStorage) {
			console.error("can't find localStorage object")
			return null;
		}

		return window.sessionStorage;
	}
})

module.exports = sessionStorageEx
//window.localStorageEx = localStorageEx

//export {
//	localStorageEx
//}