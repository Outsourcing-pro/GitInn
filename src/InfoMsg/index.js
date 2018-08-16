//		<div class="info_msg c_flexRow info_msg_show">
//			<div class="c_flexRow c_flexRowStart">
//				<div class="info_msg_icon info_msg_blue_icon c_flexRow c_flexRowCenter">
//					<img src="~img/src/弹框/叉.svg" alt="" />
//				</div>
//				<span class="info_msg_cnt">这是一条普通消息</span>
//			</div>
//			<div class="info_msg_close"><img src="~img/src/关闭.svg" class="c_wh12" alt="" /></div>
//			
//		</div>

import leftCloseIcon from 'img/src/弹框/叉.svg'
import leftCorrectIcon from 'img/src/弹框/勾.svg'
import leftWarnIcon from 'img/src/弹框/警号.svg'

import closeIcon from 'img/src/关闭.svg'

let prevDom = null

function showDom(msg, type) {
	if(prevDom) {
		removeDir(prevDom)	
		prevDom=null
	}
	function removeDir(prevDom){
		prevDom.classList.remove('info_msg_show');

		// 上一个作者留下，具体原因不明。但这里会导致一个报错，所以先注释了。
		// setTimeout(function(){
		// 	document.body.removeChild(prevDom);
		// },500);
	}
	
	if(typeof msg != 'string') msg = Object.stringify(msg);

	var dom = document.createElement('div')
	dom.className = 'info_msg c_flexRow'
	var leftDom = document.createElement('div')
	leftDom.className = 'c_flexRow c_flexRowStart info_msg_left'

	var rightDom = document.createElement('div')
	rightDom.className = 'info_msg_close'
	var rightDomImg = document.createElement('img')
	rightDomImg.setAttribute('src', closeIcon)
	rightDomImg.className = 'c_wh12'

	rightDom.appendChild(rightDomImg)

	var leftDomIcon = document.createElement('div')
	leftDomIcon.className = 'info_msg_icon  c_flexRow c_flexRowCenter'
	var leftDomMsg = document.createElement('span')
	leftDomMsg.className = 'info_msg_cnt'
	leftDomMsg.innerHTML = msg

	var leftDomIconImg = document.createElement('img')

	leftDomIcon.appendChild(leftDomIconImg)
	leftDom.appendChild(leftDomIcon)
	leftDom.appendChild(leftDomMsg)

	dom.appendChild(leftDom)
	dom.appendChild(rightDom)
	document.body.appendChild(dom)

	switch(type) {
		case 0:
			leftDomIconImg.setAttribute('src', leftWarnIcon);
			leftDomIcon.classList.add('info_msg_blue_icon');
			break;
		case 1:
			leftDomIconImg.setAttribute('src', leftCorrectIcon);
			leftDomIcon.classList.add('info_msg_green_icon');
			break;
		case 2:
			leftDomIconImg.setAttribute('src', leftWarnIcon);
			leftDomIcon.classList.add('info_msg_orange_icon');
			break;
		case 3:
			leftDomIconImg.setAttribute('src', leftCloseIcon);
			leftDomIcon.classList.add('info_msg_red_icon');
			break;
		default:
			break;
	}
	prevDom = dom
	setTimeout(function() {
		dom.classList.add('info_msg_show')

	}, 0)

	function remove(time) {
		setTimeout(function() {
			dom.classList.remove('info_msg_show')
			setTimeout(function() {
				dom && document.body.removeChild(dom)
			}, 500)

		}, time || 3000)
	}

	rightDomImg.addEventListener('click', function(e) {
		//		console.log('click')
		removeDir(dom)
	})
	remove()

}

function msg(msg) { //普通消息
	showDom(msg, 0)
}

function suc(msg) { //成功消息
	showDom(msg, 1)
}

function warn(msg) { //警告
	showDom(msg, 2)
}

function err(msg) { //错误消息
	showDom(msg, 3)
}

export default {
	msg,
	suc,
	warn,
	err
}