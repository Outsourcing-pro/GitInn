<template>
	<div class="c_darkBlue header">
		<div class="c_cnt c_flexRow c_darkBlue">
			<ul class="c_flexRow headerNav">
				<li class="headerLogo c_flexRow" @click="goPageHome"><img src="~img/src/logo/logo002@2x.png" alt="" /></li>
				<li class="c_active_bt_ind c_flexRow" :class="{active:activeIndex==0}" @click="changeIndex(0)">控制</li>
				<li class="c_active_bt_ind c_flexRow" :class="{active:activeIndex==1}" @click="changeIndex(1)">工单</li>
				<li class="c_active_bt_ind c_flexRow" :class="{active:activeIndex==2}" @click="changeIndex(2)">合并请求</li>
				<!--<li class="c_active_bt_ind c_flexRow" :class="{active:activeIndex==3}" @click="changeIndex(3)">探索</li>-->
			</ul>

			<div class="c_flexRow">
				<div class="c_flexRow addRep c_pointer c_relative" @click="showAddNav">
					<img class="c_hd_img addRepImg" src="~img/src/导航_添加.svg" alt="" />
					<img src="~img/src/三角形.svg" class="triangle" alt="" />
					<menu-list class="menuAddList" :type="1" :show.sync="showAddMenu">
						<ul class="c_selfDefMenu">
							<li class="c_flexRow flexStart c_pointer" @click.stop="goAddSubNav(0)">
								<img src="~img/src/导航/添加.svg" class="itemImg" alt="" />
								<span>创建新仓库</span>
							</li>
							<li class="c_flexRow flexStart c_pointer" @click.stop="goAddSubNav(1)">
								<img src="~img/src/导航/迁移.svg" class="itemImg" alt="" />
								<span>迁移外部仓库</span>
							</li>
							<li class="c_flexRow flexStart c_pointer" @click.stop="goAddSubNav(2)">
								<img src="~img/src/导航/创建组织.svg" class="itemImg" alt="" />
								<span>创建新组织</span>
							</li>
						</ul>
					</menu-list>
				</div>
				<div class="c_flexRow c_pointer c_relative" @click="showSelfNav" v-show="logined">
					<div class="c_hd_img selfHeadImg" :style="{backgroundImage:'url('+(self ? self.avatar_url:'')+')'}"></div>
					<img src="~img/src/三角形.svg" class="triangle" alt="" />
					<menu-list :show.sync="showMenu">
						<ul>
							<li v-for="item in personList" @click="routePersonPage(item)" v-show="item.show">{{item.cnt}}</li>
						</ul>
					</menu-list>
				</div>
				<div class="c_flexRow c_pointer c_relative ft13" @click="goLogin" v-show="notLogined">
					<span style="color: white">登录</span>
				</div>
			</div>

		</div>
		<!--<menu-list ref="menuList" :show.sync="showMenu" :list="menuList"></menu-list>-->
	</div>
</template>

<script>
	import MenuList from '@/comp/menuList'
	import signal from '@/signal'
	export default {
		props: { //.sync
			tab: Number,
			default: -1
		},
		data() {
			return {
				showAddMenu: false,
				activeIndex: this.tab,
				menuList: [],
				personList: [],
				showMenu: false,
				showIndex: -1,
				self: {},
				logined: false,
				notLogined: true,
			}
		},
		methods: {
			goPageHome() {
				this.changeIndex(-1)
				this.$router.push('/')
			},
			changeIndex(tab) {
				this.$emit('updateHeaderTab', tab)
				this.activeIndex = tab
			},
			goAddSubNav(index) {
				console.log(index)
				switch(index) {
					case 0: //创建新仓库
						this.$router.push('/repo/create')
						break;
					case 1: //迁移外部仓库
						this.$router.push('/repo/migrate')
						break;
					case 2: //创建新组织
						break;
					default:
						break;
				}
				this.showAddMenu = false
			},
			showAddNav(e) {
				if(this.showAddMenu) {
					this.showAddMenu = false
					return;
				}
				this.showMenu = false
				this.showAddMenu = true
			},
			showSelfNav(e) {
				if(this.showMenu) {
					this.showMenu = false
					return;
				}

				this.showIndex = 1
				this.showMenu = true
				this.showAddMenu = false
			},
			routePersonPage(item) {
			    if (item.redirect == true) {
			        window.location.href = item.path
			        return;
			    }
				this.$router.push({
					path: item.path,
					query: {
						tab: 1 //tab 从1开始
					}
				})
			},
			goLogin() {
			    window.location.href = window.domains.redirectUrl;
			},
			initActiveIndex() {
				let name = this.$route.name

				switch(name) {
					case 'dashboard':
						this.activeIndex = 0
						break;
					case 'issues':
						this.activeIndex = 1
						break;
					case 'pulls':
						this.activeIndex = 2
						break;
					default:
						break;
				}

			}
		},
		computed: {

		},
		created() {
			this.self = this.$getSelf()
			var isLogin = false;
			if (this.self != null && this.self.id > 0) {
			    isLogin = true;
			}
			this.logined = isLogin;
			this.notLogined = isLogin == false;
			this.personList = [{
                path:'/',
                cnt: '个人信息',
                show: isLogin,
                redirect: false,
            }, {
                path:'/user/setting',
                cnt: '用户设置',
                show: isLogin,
                redirect: false,
            }, {
                path:'/logout',
                cnt: '退出登录',
                show: isLogin,
                redirect: false,
            }]

			this.initActiveIndex()

		},
		mounted() {

		},
		components: {
			'menu-list': MenuList
		}

	}
</script>

<style scoped>
	.header {}
	
	.headerLogo {
		width: 100px;
		height: 60px;
	}
	
	.headerNav .active {
		color: white;
	}
	
	.headerNav {
		padding: 0;
		align-items: stretch;
	}
	
	.header .c_cnt {
		background-color: inherit;
	}
	
	.headerNav {
		width: 35%;
		color: darkgray;
	}
	
	.headerNav li {
		cursor: pointer;
		position: relative;
	}
	
	.addRep {
		margin-right: 55px;
		position: relative;
	}
	
	.menuAddList {
	}
	
	.addRepImg {
		width: 30px;
	}
	
	.triangle {
		margin-left: 5px;
		width: 10px;
	}
	
	.selfHeadImg {
		width: 32px;
		height: 32px;
		background-image: url(../img/headImg/nan04.jpg);
	}
</style>