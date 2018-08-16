import signal from '@/signal'

document.addEventListener('click', function(e) {
	signal.$emit('closeAllMenuList')
}, true)

