<template>
    <div class="c_white_bg">
        <!-- 状态与筛选 -->
        <div class="c_bottom_line cntTile c_flexRow alignItemStrecth" style="">
            <!-- 开启关闭页签 -->
            <div class="cRNavItem  c_pointer c_flexRow" @click="statusTab=0" :class="{'c_gray_txt':statusTab!=0,'active':statusTab==0,'c_active_bt_ind':statusTab==0}">
                <img class="itemDot" src="~img/src/灰色点.svg" v-show="statusTab!=0" alt="" />
                <img class="itemDot" src="~img/src/绿点.svg" v-show="statusTab==0" alt="" /> 开启中 {{openTicketsNum}}
            </div>
            <div class="cRNavItem c_pointer  c_flexRow" @click="statusTab=1" :class="{'c_gray_txt':statusTab!=1,'active':statusTab==1,'c_active_bt_ind':statusTab==1}">
                <img class="itemDot" src="~img/src/灰色点.svg" v-show="statusTab!=1" alt="" />
                <img class="itemDot" src="~img/src/绿点.svg" v-show="statusTab==1" /> 已关闭 {{closeTicketsNum}}
            </div>
            <div style="flex: 1;"></div>

            <!-- 筛选下拉框 -->
            <div class="c_flexRow c_gray_txt">
                <div class="filterItem c_pointer c_flexRow c_relative issues-filter" @click="showSearchListFun(0)">
                    标签<span class="c_arrowLb"></span>
                    <menu-list :type="1" :show.sync="showSearchList[0]">
                        <ul>
                            <li @click="setSearchParam('labels')">全部</li>
                            <li v-for="item in labels" @click="setSearchParam('labels',item.id)">{{item.name}}</li>
                        </ul>
                    </menu-list>
                </div>
                <div class="filterItem c_pointer c_flexRow c_relative issues-filter2" @click="showSearchListFun(1)">
                    里程碑<span class="c_arrowLb"></span>
                    <menu-list :type="1" :show.sync="showSearchList[1]">
                        <ul>
                            <li @click="setSearchParam('milestone_id')">全部</li>
                            <li v-for="item in milestones" @click="setSearchParam('milestone_id',item.id)">{{item.title}}</li>
                        </ul>
                    </menu-list>

                </div>
                <div class="filterItem c_pointer c_flexRow c_relative issues-filter2" @click="showSearchListFun(2)">
                    指派人<span class="c_arrowLb"></span>
                    <menu-list :type="1" :show.sync="showSearchList[2]">
                        <ul>
                            <li @click="setSearchParam('assignee_id')">全部</li>
							<li @click="setSearchParam('assignee_id', item.id)" v-for="item in assignees" :key="'assignee-'+ item.id">{{item.full_name}}</li>
                        </ul>
                    </menu-list>
                </div>
                <div class="filterItem c_pointer c_flexRow c_relative issues-filter" @click="showSearchListFun(3)">
                    类型<span class="c_arrowLb"></span>
                    <menu-list :type="1" :show.sync="showSearchList[3]">
                        <ul>
                            <li @click="resetAssign">全部</li>
                            <li @click="setAssignToMe(self.id)">指派给您的</li>
                            <li @click="setCreatedByMe(self.id)">由您创建</li>
                            <li @click="setMentionMe(self.id)">提及您的</li>
                        </ul>
                    </menu-list>
                </div>
                <div class="filterItem c_pointer c_flexRow c_relative issues-filter" @click="showSearchListFun(4)">
                    排序<span class="c_arrowLb"></span>
                    <menu-list :type="1" :show.sync="showSearchList[4]">
                        <ul>
                            <li @click="setSearchParam('sort_type','')">最新创建</li>
                            <li @click="setSearchParam('sort_type','oldest')">最早创建</li>
                            <li @click="setSearchParam('sort_type','recentupdate')">最近更新</li>
                            <li @click="setSearchParam('sort_type','leastupdate')">最少更新</li>
                            <li @click="setSearchParam('sort_type','mostcomment')">最多评论</li>
                            <li @click="setSearchParam('sort_type','leastcomment')">最少评论</li>
                        </ul>
                    </menu-list>
                </div>

            </div>

        </div>
        <!-- 列表数据 -->
        <div class="c_padding c_paddingV">
            <div class="tmListItem c_flexRow c_bottom_line dashed" v-for="item in ticketList">
                <div>
                    <div class="cursor" @click="toDetail(item.index)">
                        <span class="c_gray_label">{{item.repo.full_name}}#{{item.index}}</span>
                        <span class="c_bold">{{item.title}}</span>
                    </div>
                    <div class="ft13 c_gray_txt">由 <span class="c_blue_color">{{item.poster.full_name}}</span>与{{$distanceInWords(item.created)}}创建</div>
                </div>
                <div style="text-align: right;">
                    <div class="chatAlert">
                        <div class="c_flexRow c_darkGray_text">
                            <img src="~img/src/评论.svg" alt="" />
                            <span>{{item.comments}}</span>
                        </div>
                    </div>
                    <div class="c_hd_img c_small_head_icon" :style="{backgroundImage:'url('+item.poster.avatar_url+')'}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'
	import qs from 'qs'
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				// 控制工单/里程碑/标签
				menuTab: 0,
				// 控制开启中/已关闭
				statusTab: 0,
				showSearchList: [],
				labels: [],
				selObjs: {
					sort_type: 'priority'
				},
				milestones: [],
				storeItem: {},
				self: {},
				ticketList: [], 
				username: '',
				reponame: '',
				repo: {},
				assignees: []
			}
		},
		methods: {
			// 创建工单
			createIssue() {
				this.$router.push({path: `/${this.username}/${this.reponame}/issues/create`});
            },
            // 具体工单页
            toDetail(index) {
                this.$router.push({path: `/${this.username}/${this.reponame}/issues/${index}`})
            },
			showSearchListFun(tab) {
				this.showSearchList = []
				this.showSearchList[tab] = true
			},
			loadTicketList(repoid) {
				let params = {
					repo_id: parseInt(this.repo.id),
				}
				Object.keys(this.selObjs).forEach(key => {
					if (!isStrEmpty(this.selObjs[key])) params[key] = this.selObjs[key];
				})

				axios.post('/issues/search', params).then(resp => {
					this.ticketList = resp.data.issues;
					signal.$emit('store_tab.ticket_num', this.ticketList.length)
				}).catch(err => Err(err))
			},
			loadLabels() {
				// {
				// 	"id": "string",
				// 	"name": "string",
				// 	"color": "string"
				// }
				axios.get('/repos/' + this.username + '/' + this.reponame + '/labels').then(resp => {
					this.labels = resp.data.labels
				}).catch(err => Err(err))
			},
			loadMilestone() {
				// {
				// 	"id": "string",
				// 	"state": "string",
				// 	"title": "string",
				// 	"description": "string",
				// 	"open_issues": 0,
				// 	"closed_issues": 0,
				// 	"closed": "2018-02-13T12:56:11.342Z",
				// 	"deadline": "2018-02-13T12:56:11.342Z"
				// }
				axios.get('/repos/' + this.username + '/' + this.reponame + '/milestones').then(resp => {
					this.milestones = resp.data.milestones
				}).catch(err => Err(err))
			},
			loadAssignees() {
				axios.get('/repos/' + this.username + '/' + this.reponame + '/assignees').then(resp => {
					this.assignees = resp.data.users
				}).catch(err => Err(err))
			},
			setSearchParam(key, val) {
				this.selObjs[key] = val || ''
				this.loadTicketList() //里面会自动过滤掉 val为null 或者空字符的
			},
			setAssignToMe(userId) {
				this.clearAssignParam()
				this.selObjs.assignee_id=userId
				this.loadTicketList()
			},
			setCreatedByMe(userId) {
				this.clearAssignParam()
				this.selObjs.user_id = userId
				this.loadTicketList()
			},
			setMentionMe(userId) {
				this.clearAssignParam()
				this.selObjs.user_id = userId
				this.selObjs.is_mention = true
				this.loadTicketList()
			},
			clearAssignParam() {
				delete this.selObjs.assignee_id
				delete this.selObjs.user_id
				delete this.selObjs.is_mention
			},
			resetAssign() {
				this.clearAssignParam()
				this.loadTicketList()
			}

		},
		computed: {
			ticketFilterList: function() {
				return this.ticketList.filter((item) => {
					let show = false
					if (this.statusTab == 0 && !item.is_closed) {
						show = true
					}
					if (this.statusTab == 1 && item.is_closed) {
						show = true
					}

					return show;
				})
			},
			openTicketsNum: function() {
				return this.ticketFilterList.filter(function(item) {
					return !item.is_closed;
				}).length
			},
			closeTicketsNum: function() {
				return this.ticketFilterList.filter(function(item) {
					return item.is_closed;
				}).length
			},
			totalTicketsNum: function() {
				return this.ticketList.length
			}
		},
		components: {
			'store-tab': StoreTab,
			'menu-list': MenuList
		},
		created() {
			this.self = this.$getSelf()
			this.username = this.$route.params.username
			this.reponame = this.$route.params.repoName
            // 仓库的拥有者
            var self = this;
            this.$getUser(this.username, function(user) {
                self.user= user;
            });
			// 仓库信息
			// console.log(this.username, this.reponame)
            this.$getRepo(this.username, this.reponame, function(repo) {
				self.repo = repo;
				// 通过id获取指定工单列表
				self.loadTicketList()
            });

			this.loadLabels()
			this.loadMilestone()
			this.loadAssignees();
		},
		beforeRouteEnter: (to, from, next) => {
			next();
		}

	}
</script>

<style scoped>
    .cursor {
        cursor: pointer;
    }
	.cBigMargin {
		margin: 20px 0;
	}
	
	.storeHeader {
		margin-top: 10px;
		margin-bottom: 10px;
	}
	
	.c_contentBody {
		padding: 0;
	}
	
	.whiteBlockIcon {
		padding: 0 10px 0 22px;
		box-shadow: 0 2px 6px 0 rgba(71, 86, 105, 0.02);
		border-radius: 2px;
		width: 121px;
		height: 40px;
	}
	
	.cRNavItem {
		margin-left: 66px;
	}
	
	.cRNavItem img {
		width: 10px !important;
	}
	
	.filterItem {
		margin-left: 25px;
	}
	
	.tmListItem {
		height: 100px;
	}
	
	.c_imBT {
		width: 90px;
		height: 36px;
		padding: 0;
		line-height: 36px;
	}
	
	.chatAlert {
		text-align: right;
		height: 20px;
		margin-bottom: 7px;
	}
	
	.chatAlert img {
		width: 14px;
		margin-right: 5px;
	}
    .issues-filter .menuListCnt {
        left: -67px !important;
    }
    .issues-filter2 .menuListCnt {
        left: -60px !important;
    }
</style>