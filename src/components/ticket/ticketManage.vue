<template>
	<div class="c_cnt c_contentBody c_flexRow cSection c_relative">
		<div class="cntLeft">
			<!--<div class="c_bottom_line cntTile c_flexRow"><img src="" /> 账户设置
			</div>-->
			<div class="c_flexRow ticketLHeader c_relative" style="position: relative;">
				<div>
					<div><img class="c_hd_img ticketLHeaderImg" :src="self.avatar_url" alt="" /></div>
					<div class="c_flexRow c_gray_txt ticketLHeaderDes" @click="showHeadMenu=true">{{self.username}} <img src="~img/src/多层级_下.svg" alt="" /></div>
					<menu-list :type="1" :show.sync="showHeadMenu" class="">
						<ul class="selfDefMenu">
							<li class="c_gray_txt noHover">切换控制面板用户</li>
							<li class="c_flexRow flexStart c_pointer" v-for="n in 5" @click="showHeadMenu=false">
								<div class="c_hd_img img" :style="{'background-image':'url('+require('img/headImg/nv05.jpg')+')'}"></div>
								<span>Lexus Kihn</span>
							</li>

							<li class="c_flexRow flexStart c_pointer" @click="showHeadMenu=false">
								<div class="c_hd_img img" :style="{'background-image':'url('+''+')'}"></div>
								<span class="c_gray_txt">创建组织</span>
							</li>

						</ul>
					</menu-list>
				</div>
			</div>
			<div class="">
				<div>
					<div class="cntLeftListItem topListItemLine c_bottom_line c_flexRow" :class="{active:activeTab==0}" @click="toggleTabs(0)">
						<img v-show="activeTab!=0" class="rotAngle" src="~img/src/多层级_下.svg" alt="" />
						<img v-show="activeTab==0" src="~img/src/多层级_下_选中.svg" alt="" />
						<span style="flex: 1;">该用户仓库工单</span>
						<span class="c_badge">{{allSelfTickesNum}}</span>
					</div>
					<div class="subItemList  ft13">
						<div @click="reloadSubData(item)" class="subItem c_flexRow c_bottom_line" v-for="item in repos">
							<span class="c_textEllipsis">{{item.full_name}}</span>
							<span>{{item.open_issues}}</span>
						</div>
						<!--<div class="subItem c_flexRow c_bottom_line subItemActive">
							<span class="c_textEllipsis">u0468/LearningGit</span>
							<span>3</span>
						</div>-->
					</div>
				</div>
				<div>
					<div class="cntLeftListItem c_bottom_line c_flexRow" :class="{active:activeTab==1}" @click="toggleTabs(1)">
						<!--<img v-show="!activeTabs[1]" class="rotAngle" src="~img/src/多层级_下.svg" alt="" />
						<img v-show="activeTabs[1]" src="~img/src/多层级_下_选中.svg" alt="" />-->
						<img src="" alt="" />
						<span style="flex: 1;">指派给你的</span>
						<span class="c_badge">{{assignToMeClose.length+assignToMeOpen.length}}</span>
					</div>
					<!--<div class="subItemList ft13">
						<div class="subItem c_flexRow c_bottom_line" v-for="item in assignToMe">
							<span class="c_textEllipsis">{{item.base_repo && item.base_repo.full_name}}</span>
							<span>3</span>
						</div>
					</div>-->
				</div>
				<div>
					<div class="cntLeftListItem  c_bottom_line c_flexRow" :class="{active:activeTab==2}" @click="toggleTabs(2)">
						<!--<img v-show="!activeTabs[2]" class="rotAngle" src="~img/src/多层级_下.svg" alt="" />
						<img v-show="activeTabs[2]" src="~img/src/多层级_下_选中.svg" alt="" />-->
						<img src="" alt="" />
						<span style="flex: 1;">由您创建的</span>
						<span class="c_badge">{{createdByMeClose.length+createdByMeOpen.length}}</span>
					</div>
					<!--<div class="subItemList ft13">
						<div class="subItem c_flexRow c_bottom_line">
							<span class="c_textEllipsis">u0468/LearningGit</span>
							<span>3</span>
						</div>
					</div>-->
				</div>

			</div>
		</div>
		<div class="cntRight">
			<div class="c_bottom_line cntTile c_flexRow" style="justify-content: space-between;align-items: stretch;">
				<div class="cRNavItem  c_pointer c_flexRow" @click="subTab=0" :class="{'c_gray_txt':subTab!=0,'active':subTab==0,'c_active_bt_ind':subTab==0}">
					<img class="itemDot" v-show="subTab==0" src="~img/src/绿点.svg" alt="" />
					<img class="itemDot" v-show="subTab!=0" src="~img/src/灰色点.svg" alt="" /> 开启中 {{sortTickets.open.length}}
				</div>
				<div class="cRNavItem c_pointer  c_flexRow" @click="subTab=1" :class="{'c_gray_txt':subTab!=1,'active':subTab==1,'c_active_bt_ind':subTab==1}">
					<img class="itemDot" v-show="subTab==1" src="~img/src/绿点.svg" alt="" />
					<img class="itemDot" v-show="subTab!=1" src="~img/src/灰色点.svg" alt="" /> 已关闭 {{sortTickets.close.length}}
				</div>
				<div style="flex: 1;"></div>
				<div class="cRNavItem c_pointer c_flexRow c_gray_txt c_relative" @click="showSortMenu">
					排序 <img class="c_arrow" style="margin-left:5px;" src="~img/src/多层级_下.svg" alt="" />
					<menu-list ref="menuList" :show.sync="showMenu">
						<ul>
							<li v-for="item in menuList" @click="sortIssues(item.value)">{{item.cnt}}</li>
						</ul>
					</menu-list>
				</div>
			</div>
			<div class="cntRightCnt">
				<div v-show="subTab==0" class="cntRightItem c_bottom_line dashed c_flexCol" v-for="item in sortTickets.open">
					<div class="c_flexRow" style="justify-content: flex-start;margin-bottom: 3px;">
						<div class="c_gray_label c_pointer" @click="$router.push({path: `/${item.repo.owner.username}/${item.repo.name}/issues/${item.index}`})">{{item.repo.full_name}}#{{item.index}}</div>
						<span style="margin-left:8px">
							{{item.title}}
						</span>
						<span style="flex: 1;"></span>

					</div>
					<div class="c_gray_txt ft12 c_flexRow" style="justify-content:flex-start;margin-top:3px;">
						<span>由<span class="c_blue_color c_pointer" style="margin:0 9px;" @click="$router.push({path: `/${item.poster.username}`})">{{item.poster.full_name}}</span>与
						<!--<span style="margin: 0 5px;">4</span>-->{{$distanceInWords(item.created)}}创建</span>
						<span style="flex: 1;"></span>
						<div class="c_flexCol" style="justify-content: flex-start;">
							<span v-if="item.comments>0" class="c_gray_txt c_flexRow"> <img src="~img/src/评论.svg" style="width:14px;margin-right: 3px;" alt="" />{{item.comments}}</span>
							<img v-if="item.comments>0" class="c_hd_img rightHdImg" :src="item.poster.avatar_url" alt="" />
						</div>

					</div>
				</div>

				<div v-show="subTab==1" class="cntRightItem c_bottom_line dashed c_flexCol" v-for="item in sortTickets.close">
					<div class="c_flexRow" style="justify-content: flex-start;margin-bottom: 3px;">
						<div class="c_gray_label c_pointer" @click="$router.push({path: `/${item.repo.owner.username}/${item.repo.name}`})">{{item.repo.full_name}}</div>
						<span style="margin-left:8px">
							{{item.repo.description}}
						</span>
						<span style="flex: 1;"></span>
						<span v-if="item.comments>0" style="" class="c_gray_txt"> <img src="~img/src/评论.svg" style="width:14px;margin-right: 3px;" alt="" />{{item.comments}}</span>
					</div>
					<div class="c_gray_txt ft12 c_flexRow" style="justify-content:flex-start;margin-top:3px;">
						<span>由<span class="c_blue_color c_pointer" style="margin:0 9px;" @click="$router.push({path: `/${item.poster.username}`})">{{item.poster.full_name}}</span>与
						<!--<span style="margin: 0 5px;">4</span>-->{{$distanceInWords(item.poster.created)}}创建</span>
						<span style="flex: 1;"></span>
						<img v-if="item.comments>0" class="c_hd_img rightHdImg" :src="item.poster.avatar_url" alt="" />
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import MenuList from '@/comp/menuList'
	import signal from '@/signal'
	import qs from 'qs'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0,
				self: {},
				activeTab: 0,
				activeTabs: {
					0: false,
					1: false,
					2: false
				},
				repos: [],
				selfTicketClose: [],
				selfTicketOpen: [],
				assignToMeClose: [],
				assignToMeOpen: [],
				createdByMeClose: [],
				createdByMeOpen: [],
				showTicketsMap: {
					open: [],
					close: []
				},
				menuList: [{
					cnt: '最早创建',
					value: 'oldest'
				}, {
					cnt: '最新更新',
					value: 'recentupdate'
				}, {
					cnt: '最小更新',
					value: 'leastupdate'
				}, {
					cnt: '最多评论',
					value: 'mostcomment'
				}, {
					cnt: '最少评论',
					value: 'leastcomment'
				}],
				showMenu: false,
				showHeadMenu: false,
				sortType: '',
				subRepo: {}
			}
		},
		methods: {
		    sortIssues(sortType) {
		        this.sortType = sortType;
		        if (sortType == 'oldest') { //最早创建
                    this.showTicketsMap.close.sort(function(a, b) {
                        return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();
                    })
                    this.showTicketsMap.open.sort(function(a, b) {
                        return (new Date(a.created)).getTime() - (new Date(b.created)).getTime();
                    })
                } else if (sortType == 'recentupdate') { //最新更新
                    this.showTicketsMap.close.sort(function(a, b) {
                        console.log(-a.updated + b.updated);
                        return (new Date(b.updated)).getTime() - (new Date(a.updated)).getTime();
                    })
                    this.showTicketsMap.open.sort(function(a, b) {
                        console.log(-a.updated + b.updated);
                        return (new Date(b.updated)).getTime() - (new Date(a.updated)).getTime();
                    })
                } else if (sortType == 'leastupdate') { //最少更新
                    this.showTicketsMap.close.sort(function(a, b) {
                        return (new Date(a.updated)).getTime() - (new Date(b.updated)).getTime();
                    })
                    this.showTicketsMap.open.sort(function(a, b) {
                        return (new Date(a.updated)).getTime() - (new Date(b.updated)).getTime();
                    })
                } else if (sortType == 'mostcomment') { //最多评论
                    this.showTicketsMap.close.sort(function(a, b) {
                        return -a.comments + b.comments;
                    })
                    this.showTicketsMap.open.sort(function(a, b) {
                        return -a.comments + b.comments;
                    })
                } else if (sortType == 'leastcomment') { //最少评论
                    this.showTicketsMap.close.sort(function(a, b) {
                        return a.comments - b.comments;
                    })
                    this.showTicketsMap.open.sort(function(a, b) {
                        return a.comments - b.comments;
                    })
                }
		    },
			toggleTabs(index) { //点击左边的列表
				if (this.activeTab == index) {
					this.activeTab = -1;
					this.showTicketsMap.open = []
					this.showTicketsMap.close = []
				} else {
					this.activeTab = index;
					this.reloadData(index);
				}
				//				this.activeTabs[index] = !this.activeTabs[index]
			},
			reloadSubData(item) { //加载自己仓库里面的子分支
			    if (!item.id) {
			        return;
			    }
			    this.subRepo = item;
				let open = []
				let close = []

				axios.post('/issues/search', {
					user_id: this.self.id,
					repo_id: item.id,
					is_closed: false,
					sort_type: this.sortType
				}).then(resp => {
					open = resp.data.issues
					return axios.post('/issues/search', {
						user_id: this.self.id,
						repo_id: item.id,
						is_closed: true,
                        sort_type: this.sortType
					})
				}).then(resp => {
					close = resp.data.issues
					this.showTicketsMap = {
						open: open,
						close: close
					}
				}).catch(err => Err(err))

			},
			reloadData(index) { //大的tab页加载显示数据
				let open = []
				let close = []
				if (index == 0) {
					open = this.selfTicketOpen
					close = this.selfTicketClose
				} else if (index == 1) {
					open = this.assignToMeOpen
					close = this.assignToMeClose
				} else if (index == 2) {
					open = this.createdByMeOpen
					close = this.createdByMeClose
				}

				this.showTicketsMap = {
					open: open,
					close: close
				}

			},
			showSortMenu(e) {
				this.$refs.menuList.$emit('data', {
					x: e.clientX,
					y: e.clientY
				})

				this.showMenu = true
			},
			loadTickets() {
				//该用户仓库列表
				axios.get('/users/' + this.self.username + '/repos').then(resp => {
					this.repos = resp.data.repos.filter(function(item) {
						return item.open_issues > 0;
					})

					axios.post('/issues/search', {
						repo_ids: this.repos.map(function(item) {
							return item.id;
						}),
						sort_type: this.sortType
					}).then(resp => {
						var data = resp.data
						this.selfTicketClose = [];
						this.selfTicketOpen = [];
						data.issues.forEach((item)=>{

							if (item.is_closed)
								this.selfTicketClose.push(item);
							else
								this.selfTicketOpen.push(item);

						})

						this.showTicketsMap.open = this.selfTicketOpen
						this.showTicketsMap.close = this.selfTicketClose
					}).catch(err => Err(err))

					//用户自己的仓库工单
					//				axios.post('/issues/search', {
					//					user_id: this.self.id,
					//					is_mention: true,
					//					is_closed: true
					//				}).then(resp => {
					//					var data = resp.data
					//					this.selfTicketClose = data.issues
					//					this.showTicketsMap.close = this.selfTicketClose
					//				}).catch(err => Msg(err))

					//				axios.post('/issues/search', {
					//					user_id: this.self.id,
					//					is_mention: true,
					//					is_closed: false
					//				}).then(resp => {
					//					var data = resp.data
					//					this.selfTicketOpen = data.issues
					//					this.showTicketsMap.open = this.selfTicketOpen
					//				}).catch(err => Msg(err))

				}).catch(err => Err(err))

				//指派给你的
				axios.post('/issues/search', {
					assignee_id: this.self.id,
					is_closed: false,
					sort_type: this.sortType
				}).then(resp => {
					var data = resp.data
					this.assignToMeOpen = data.issues
				}).catch(err => Err(err))

				axios.post('/issues/search', {
					assignee_id: this.self.id,
					is_closed: true,
					sort_type: this.sortType
				}).then(resp => {
					var data = resp.data
					this.assignToMeClose = data.issues
				}).catch(err => Err(err))

				//由您创建的
				axios.post('/issues/search', {
					poster_id: this.self.id,
					is_closed: false,
					sort_type: this.sortType
				}).then(resp => {
					var data = resp.data
					this.createdByMeOpen = data.issues
				}).catch(err => Err(err))

				axios.post('/issues/search', {
					poster_id: this.self.id,
					is_closed: true,
					sort_type: this.sortType
				}).then(resp => {
					var data = resp.data
					this.createdByMeClose = data.issues
				}).catch(err => Err(err))

			}
		},
		computed: {
			sortTickets: function() {
				//this.showTicketsMap
				return this.showTicketsMap
			},
			allSelfTickesNum: function() {
				let n = 0;
				this.repos.forEach(function(item) {
					n += item.open_issues
				})

				return n;
			}
		},
		created() {
			this.self = this.$getSelf()
			this.loadTickets()
		},
		mounted() {

		},
		components: {
			'menu-list': MenuList
		}

	}
</script>

<style scoped>
	/*.c_contentBody {
		justify-content: flex-start;
	}*/
	
	.cntLeft {
		width: 240px;
	}
	
	.cntRight {
		width: 948px;
	}
	
	.ticketLHeader {
		height: 172px;
		justify-content: center;
		text-align: center;
	}
	
	.ticketLHeaderImg {
		width: 70px;
		height: 70px;
	}
	
	.ticketLHeaderDes img {
		width: 10px;
		margin-left: 5px;
	}
	
	.cntLeftListItem {
		position: relative;
		height: 50px;
		padding: 0 10px 0 12px;
		margin: 0;
	}
	
	.topListItemLine:before {
		content: '';
		display: block;
		position: absolute;
		width: 100%;
		margin: auto;
		top: 0;
		left: 0;
		border-top: 1px solid #E7EDF4;
	}
	
	.cntLeftListItem img {
		width: 10px;
		margin-right: 10px;
	}
	
	.cntLeftListItem.active {
		/*background: #308EFF;*/
		background: #586B84;
		color: white;
	}
	
	.cntLeftListItem.active .c_badge {
		color: #1D2A3A;
		background: white;
	}
	
	.cntLeftListItem .rotAngle {
		transform: rotateZ(-90deg);
	}
	
	.subItemList {
		/*padding: 0 20px;*/
		display: none;
	}
	
	.subItemList .subItem {
		padding: 0 20px 0 30px;
		height: 50px;
		cursor: pointer;
	}
	
	.cntLeftListItem.active+.subItemList {
		display: initial;
	}
	
	.subItem:hover {
		color: #308EFF;
		background: #E7F2FF;
	}
	/*.subItemActive {
		color: #308EFF;
		background: #E7F2FF;
	}*/
	
	.cRNavItem {
		margin-left: 66px;
	}
	
	.cRNavItem img {
		width: 10px !important;
	}
	
	.cntRightCnt {
		padding-top: 0 !important;
	}
	
	.cntRightItem {
		min-height: 102px;
		justify-content: center;
	}
	
	.cntRightItem .rightHdImg {
		width: 26px;
	}
	
	.headMenuList {
		position: absolute;
		transform: none;
		display: table;
		left: 0;
		right: 0;
		top: 80%;
		margin: auto;
		width: 220px;
	}
	
	.selfDefMenu .img {
		margin-right: 18px;
		margin-left: 18px;
		width: 30px;
		height: 30px;
	}
	
	.selfDefMenu li.noHover:hover {
		color: inherit;
		background: inherit;
	}
</style>