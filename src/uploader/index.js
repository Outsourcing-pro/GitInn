var fileInput = null;
export var h5TakePic = function(callback, isSingle) {
	//	function checkSize(files, allowMaxSize) {
	//		for(var i = 0; i < files.length; i++) {
	//			var temp = files[i]
	//			if(temp.size > allowMaxSize) {
	//				jAlert('图片太大了，已超过' + ((allowMaxSize / (1024 * 1024)).toFixed(2)) + 'M')
	//				return false;
	//			}
	//		}
	//
	//		return true;
	//	}

	var self = this

	if(!fileInput) {
		fileInput = document.createElement('input')
		fileInput.setAttribute('type', 'file')
		fileInput.setAttribute('accept', 'image/jpg,image/jpeg,image/png')
		fileInput.setAttribute('style', 'display:none;')

		document.body.appendChild(fileInput)

	}

	// 可能会被设置多次与移除多次，不影响逻辑
	if(!isSingle) fileInput.setAttribute('multiple', 'multiple') //允许上传多张图片
	else fileInput.removeAttribute('multiple')

	fileInput.onchange = function(e) {
		if(this.files.length > 0) {
			//if(checkSize(this.files, 1024 * 1024 * 3)) //如果图片不超过3M
			callback && typeof callback == 'function' && callback(this.files)
			this.value = '' //确保下次选择同一个图片时候还能上传
		}

	}
	fileInput.click()

}