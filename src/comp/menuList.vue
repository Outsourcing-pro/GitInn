<template>
	<!--@click.stop 阻止冒泡阶段，避免出现又再次触发监听打开逻辑，此处不能组织页面body 捕捉阶段关闭的信号-->
	<div class="menuListCnt" v-show="show">
		<div  id="menuList" @click.stop class="menuList" :class="{staticPos:static}">
			<!--<ul v-if="type==0">
				<li class="c_pointer" v-for="(item,index) in list" @click="choose(index,item)">
					{{item.cnt}}
				</li>
			</ul>-->

			<slot></slot>

		</div>
	</div>
</template>

<script>
	import signal from '@/signal'

	export default {
		props: {
			show: { //.sync
				type: Boolean,
				default: false
			},
//			list: {
//				type: Array,
//				default: () => []
//			},
			type: { // 0 为需要通过list传递内容，1为自定义slot
				default: 0
			},
			static: { //布局为static
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			}
		},
		methods: {
//			choose(index, item) {
//				signal.$emit('menuItemSel', {
//					index,
//					item
//				})
//
//				this.$emit('update:show', false)
//			}
		},
		computed: {

		},
		created() {
//
//			function adjPos(data) {
//				var x = data.x
//				var y = data.y
//				if (x < 80) x = 82;
//				if (document.body.offsetWidth - x < 80) x = document.body.offsetWidth - 82;
//				data.x = x
//				data.y = y
//
//			}
//
//			this.$on('data', (data) => {
//				adjPos(data)
//				this.$el.style.top = data.y + 'px'
//				this.$el.style.left = data.x + 'px'
//			})

			signal.$on('closeAllMenuList', e => {
				this.$emit('update:show', false)
			})

		},
		mounted() {
			//			let timeId;
			//
			//			this.$el.addEventListener('mousemove', function(e) {
			//				clearTimeout(timeId)
			//				timeId = setTimeout(function() {
			//					signal.$emit('closeAllMenuList')
			//				}, 4000)
			//			})
		}

	}
</script>

<style>

</style>

<style scoped>
	.menuList {
		position: relative;
		background:white;
		z-index: 100;
		left: 0;
		top: 0;
		border: 1px solid #E0E5ED;
		box-shadow: 0 2px 20px 0 rgba(0, 38, 86, 0.15);
		min-width: 160px;
		color: #465364;
		max-height: 340px;
		overflow: scroll;
	}
	.menuListCnt{
		position: absolute;
		top: 40px;
		left: 0;
		z-index: 99;
	}
	
	.staticPos {
		position: static !important;
	}
	
	.menuListAbsPos {
		position: absolute;
		left: 50%;
	}
	
	.menuList li {
		padding: 10px 0;
		text-align: center;
		cursor: pointer;
	}
	
	.menuList li:hover {
		background: #EDF5FF;
		color: #008EFF;
	}
	
	.hightlightItem {
		background: #EDF5FF;
		color: #008EFF;
	}
</style>