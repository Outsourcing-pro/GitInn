<template>
	<div v-show="rootTab==0">
		<div class="c_white_bg">
			<div class="c_paddingV c_padding">
				<div class="c_flexRow">
					<div class="c_flexRow">
						<div :class="[{'c_imBT_blue': menuTab == 0}, 'c_imBT']" @click="switchMenuTab(0)">工单</div>
                        <div :class="[{'c_imBT_blue': menuTab == 1}, 'c_imBT', 'c_border_rad3']" @click="switchMenuTab(1)">里程碑</div>
                        <div :class="[{'c_imBT_blue': menuTab == 2}, 'c_imBT', 'c_border_rad3']" @click="switchMenuTab(2)">标签</div>
					</div>

					<button type="button" class="ui-btn btn-green" @click="createIssue">创建工单</button>
				</div>
			</div>
		</div>

		<!-- 自入口：用来渲染具体工单，新建工单，编辑工单等操作页面 -->
		<router-view name="orderEntry"></router-view>

	</div>

</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				// 控制文件/工单管理/合并请求/Wiki
				rootTab: 0,
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
				repo: {}
			}
		},
		methods: {
			// 创建工单
			createIssue() {
				this.$router.push({path: `/${this.username}/${this.reponame}/issues/create`});
			},
			switchMenuTab(index) {
				this.menuTab = index;
				switch (this.menuTab){
					case 0: 
						this.$router.push({path: `/${this.username}/${this.reponame}/issues`});
						break;
					case 1: 
						this.$router.push({path: `/${this.username}/${this.reponame}/milestones`});
						break;
					case 2:
						this.$router.push({path: `/${this.username}/${this.reponame}/labels`});
						break;
					default: 
						console.error('index error!');
						break;
				}
				console.log('meun tab:', this.menuTab)
			},
			showSearchListFun(tab) {
				this.showSearchList = []
				this.showSearchList[tab] = true
			},
			loadTicketList(repoid) {
				let params = {
					repo_id: repoid
				}
				Object.keys(this.selObjs).forEach(key => {
					if (!isStrEmpty(this.selObjs[key])) params[key] = this.selObjs[key];
				})

				axios.post('/issues/search', params).then(resp => {
					this.ticketList = resp.data.issues;
					console.log('issues search>>>>>>>>>', resp, this.ticketList);
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
			setSearchParam(key, val) {
				this.selObjs[key] = val
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
            this.$getRepo(this.username, this.reponame, function(repo) {
				self.repo= repo;
				self.loadTicketList(parseInt(self.repo.id))
            });

			this.loadLabels()
			this.loadMilestone()
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				console.log('next: ', vm)
			});
		}

	}
</script>

<style scoped>
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
</style>