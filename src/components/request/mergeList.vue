/* 合并请求列表 */
<template>
	<div v-show="tab==0">
		<div class="c_white_bg">

			<!-- 开启-关闭 -->
			<div class="c_bottom_line cntTile c_flexRow alignItemStrecth" style="">
				<div class="cRNavItem  c_pointer c_flexRow" @click="chooseState(0)" :class="{'c_gray_txt':subTab!=0,'active':subTab==0,'c_active_bt_ind':subTab==0}">
					<img class="itemDot" src="~img/src/灰色点.svg" v-show="subTab!=0" alt="" />
					<img class="itemDot" src="~img/src/绿点.svg" v-show="subTab==0" alt="" /> 开启中 {{openTicketsNum}}
				</div>
				<div class="cRNavItem c_pointer  c_flexRow" @click="chooseState(1)" :class="{'c_gray_txt':subTab!=1,'active':subTab==1,'c_active_bt_ind':subTab==1}">
					<img class="itemDot" src="~img/src/灰色点.svg" v-show="subTab!=1" alt="" />
					<img class="itemDot" src="~img/src/绿点.svg" v-show="subTab==1" /> 已关闭 {{closeTicketsNum}}
				</div>
				<div style="flex: 1;"></div>

				<!-- 筛选菜单 -->
				<div class="c_flexRow c_gray_txt">
					<div class="filterItem c_pointer c_flexRow c_relative" @click="showSearchListFun(0)">
						标签<span class="c_arrowLb"></span>
						<menu-list :type="1" :show.sync="showSearchList[0]">
							<ul>
								<li @click="setSearchParam('labels')">全部</li>
								<li v-for="item in labels" @click="setSearchParam('labels',item.name)">{{item.name}}</li>
							</ul>
						</menu-list>
					</div>
					<div class="filterItem c_pointer c_flexRow c_relative" @click="showSearchListFun(1)">
						里程碑<span class="c_arrowLb"></span>
						<menu-list :type="1" :show.sync="showSearchList[1]">
							<ul>
								<li @click="setSearchParam('milestone_id')">全部</li>
								<li v-for="item in milestones" @click="setSearchParam('milestone_id',item.id)">{{item.title}}</li>
							</ul>
						</menu-list>

					</div>
					<div class="filterItem c_pointer c_flexRow c_relative" @click="showSearchListFun(2)">
						指派人<span class="c_arrowLb"></span>
						<menu-list :type="1" :show.sync="showSearchList[2]">
							<ul>
								<li @click="setSearchParam('milestone_id')">全部</li>

							</ul>
						</menu-list>
					</div>
					<div class="filterItem c_pointer c_flexRow c_relative" @click="showSearchListFun(3)">
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
					<div class="filterItem c_pointer c_flexRow c_relative" @click="showSearchListFun(4)">
						排序<span class="c_arrowLb"></span>
						<menu-list :type="1" :show.sync="showSearchList[4]">
							<ul>
								<li @click="setSearchParam('sort_type','priority')">最新创建</li>
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
			<!-- 列表 -->
			<div class="c_padding c_paddingV" style="padding-top: 0;">
				<div class="MRLListItem c_flexCol flexCenter c_bottom_line dashed" v-for="item in ticketFilterList">
					<div class="c_flexRow">
						<div class="c_darkGray_bg MRLListItemLabel">#{{item.pull_request.index}}</div>
						<div class="c_bold c_pointer c_margin-right10" @click="goMergeRequst(item)">{{item.title}}</div>
						<div class="c_right_margin">
							<button v-for="label in item.labels" type="button" class="ui-btn btn-blank inlineFlex c_flexRow flexStart labelBT" :style="{color:label.color,borderColor:label.color}">
								<span style="display: inline-block;margin-top:2px;" class="c_wh16 iconfont icon-Groupx c_margin-right5"></span>
								{{label.name}}
							</button>
						</div>
						<div class="c_flexOne"></div>
						<div class="c_flexRow c_darkGray_text">
							<img src="~img/src/评论.svg" style="width:14px;" alt="" /> {{item.comments}}
						</div>
					</div>
					<div class="c_flexRow flexStart c_right_margin" style="margin-top: 5px;">
						<div class="c_gray_txt">由 <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.poster.username}`})">{{item.poster.full_name}}</span>与{{$distanceInWords(item.created)}}创建</div>
						<div class="c_flexRow flexStart inlineFlex" v-if="item.milestone!=null">
							<img src="~img/src/icon/里程碑.svg" class="c_wh20 c_margin-right4" alt="" />
							<span class="c_bold">{{item.milestone?item.milestone.title:''}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

	</div>

</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0,
				showSearchList: [],
				labels: [],
				selObjs: {
					sort_type: 'priority'
				},
				milestones: [],
				repo: {},
				self: {},
				ticketList: [],
				// ticketCloseList: [],
				closeTicketsNum: 0,
				openTicketsNum: 0,
				allowPulls: false,
				headRepo: {},
				baseRepo: {},
				username: '',
				repoName: '',
			}
		},
		methods: {
			chooseState(index) {
				this.subTab = index;
				this.subTab == 1 ?this.loadTicketListClose(index): this.loadTicketList();
			},
      		goMergeRequst(item) {
				this.$router.push({
					path: `/${this.username}/${this.repoName}/pulls/${item.index}`
				})
			},
			setSearchParam(key, val) {
				this.selObjs[key] = val
				this.loadTicketList() //里面会自动过滤掉 val为null 或者空字符的
			},
			setAssignToMe(userId) {
				this.clearAssignParam()
				this.selObjs.assignee_id = userId
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
			},

			showSearchListFun(tab) {
				this.showSearchList = []
				this.showSearchList[tab] = true
			},
			loadTicketList(params = {repo_id: this.repo.id, is_pull: true}) {
				Object.keys(this.selObjs).forEach(key => {
					if(!isStrEmpty(this.selObjs[key])) params[key] = this.selObjs[key];
				})

				axios.post('/issues/search', params).then(resp => {
					//pull request 可能为空，只取有数据的
					this.ticketList = resp.data.issues.filter(function(item) {
						return item.pull_request;
					})
					this.openTicketsNum = resp.data.issues.length;
				}).catch(err => Err(err))
			},
			loadTicketListClose(index) {
				let params = {
					repo_id: this.repo.id,
					is_pull: true,
					is_closed: true
				}
				axios.post('/issues/search', params).then(resp => {
					//	关闭工单的数量
					if(index == 1) {
						this.ticketList = resp.data.issues.filter(function(item) {
							return item.pull_request;
						})
					}
					this.closeTicketsNum = resp.data.issues.length;
				}).catch(err => Err(err))
			},
			loadLabels() {
				let username = this.repo.owner.username
				let repoName = this.repo.name
				axios.get('/repos/' + username + '/' + repoName + '/labels').then(resp => {
					this.labels = resp.data.labels
				}).catch(err => Err(err))
			},
			loadMilestone() {
				let username = this.repo.owner.username
				let repoName = this.repo.name
				axios.get('/repos/' + username + '/' + repoName + '/milestones').then(resp => {
					this.milestones = resp.data.milestones
				}).catch(err => Err(err))
			}
		},
		computed: {
			ticketFilterList: function() {
				return this.ticketList.filter((item) => {
					let show = false
					if(this.subTab == 0 && !item.is_closed) {
						show = true
					}
					if(this.subTab == 1 && item.is_closed) {
						show = true
					}

					return show;
				})
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
			// 登录用户
            this.self = this.$getSelf()
            this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
            // 仓库的拥有者
            var self = this;
            this.$getUser(this.username, function(user) {
                self.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                self.repo = repo;
				self.loadTicketList();
				self.loadTicketListClose();
                self.loadLabels();
                self.loadMilestone();
            });
		},
		mounted() {

		}

	}
</script>

<style scoped>
	.cRNavItem {
		margin-left: 66px;
	}
	
	.cRNavItem img {
		width: 10px !important;
	}
	
	.filterItem {
		margin-left: 25px;
	}
	
	.MRLListItem {
		height: 95px;
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
	
	.MRLListItem {
		/*padding-top:22px;*/
	}
	
	.MRLListItemLabel {
		color: white;
		border-radius: 3px;
		padding: 4px 14px;
		margin-right: 10px;
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
	
	
</style>