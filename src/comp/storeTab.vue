<template>
	<div class="storeTab">
		<div class="c_flexRow">
			<div class="c_flexRow">
				<div class="tabItem c_flexRow c_gray_txt flexCenter" @click="changeTab(0)" :class="{active:tab==0}">
					<img src="~img/src/icon/文件.svg" alt="" />
					<span>文件</span>
				</div>
				<div class="tabItem c_flexRow c_gray_txt flexCenter" v-show="issuesEnable" @click="changeTab(1)" :class="{active:tab==1}">
					<img src="~img/src/icon/工单管理.svg" alt="" />
					<span>工单管理</span>
					<span class="c_badge_normal c_gray_badge_bg" v-show="ticketMGNum>0">{{ticketMGNum}}</span>
				</div>
				<div class="tabItem c_flexRow c_gray_txt flexCenter" v-show="pullsEnable" @click="changeTab(2)" :class="{active:tab==2}">
					<img src="~img/src/icon/合并请求.svg" alt="" />
					<span>合并请求</span>
					<span class="c_badge_normal c_gray_badge_bg" v-show="pullRequestNum>0">{{pullRequestNum}}</span>
				</div>
				<div class="tabItem c_flexRow c_gray_txt flexCenter" v-show="wikiEnable" @click="changeTab(3)" :class="{active:tab==3}">
					<img src="~img/src/icon/文件.svg" alt="" />
					<span>Wiki</span>
				</div>
			</div>
			<div class="tabItem c_flexRow c_gray_txt" v-show="isAdminOrOwner"  @click="changeTab(4)" :class="{active:tab==4}" >
				<img src="~img/src/icon/设置.svg" class="c_wh16 c_margin-right4" alt="" />
				<span>仓库设置</span>
			</div>
		</div>
		<div class="body">
			<slot></slot>
		</div>

	</div>
</template>

<script>
	import signal from '@/signal'
	
	export default {
		props: {
			tab: { //sync
				type: Number,
				default: 0
			},
            issuesEnable: { //sync
                type: Boolean,
                default: false
            },
            pullsEnable: { //sync
                type: Boolean,
                default: false
            },
            wikiEnable: { //sync
                type: Boolean,
                default: false
            },
            isAdminOrOwner: {
			    type: Boolean,
                default: false
            }
		},
		data() {
			return {
				ticketMGNum:0,//工单管理数量
				pullRequestNum:0
			}
		},
		methods: {
			changeTab(tab) {
				this.$emit('update:tab', tab)
			}
		},
		computed: {

		},
		created() {
			signal.$on('store_tab.ticket_num',(n)=>{
				this.ticketMGNum=n
			})
			
			signal.$on('store_tab.pr_num',n=>{
				this.pullRequestNum=n
			})
		},
		mounted() {

		}

	}
</script>

<style scoped>
	.body{
		/*margin-top:0;
		padding-top:20px;*/
	}
	
	.tabItem {
		position: relative;
		cursor:pointer;
		padding: 0 26px;
		height: 46px;
	}
	
	.tabItem img {
		width: 16px;
		margin-right: 2px;
	}
	
	.tabItem.active {
		background: white;
		color: #475669;
		font-weight: bold;
	}
	
	.tabItem.active:after {
		content: '';
		/*display: table;*/
		left: 0;
		top: 0;
		right: 0;
		height: 2px;
		background: #308EFF;
		position: absolute;
		width: 100%;
	}
	
	.active .c_gray_badge_bg{
		background:#308EFF;
		color:white;
	}
</style>