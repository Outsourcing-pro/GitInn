/* 合并请求具体页面入口 */
<template>
	<div class="c_white_bg container">
		<div class="c_paddingV c_flexRow alignItemStart">
			<!-- 头部详情信息 -->
			<div class="header">
				<div class="info">
					<h1 class="index">#{{ details.index }} {{ details.title }}</h1>
					<div class="row2">
					<!-- 开启中 -->
					<button v-if="details.state === 'open'" class="open">开启中</button>
					<!-- 未合并但已关闭，按钮为关闭文案，可重新打开 -->
					<button v-if="details.state === 'closed' && !details.pull_request.has_merged" class="close">已关闭</button>
					<!-- 已合并状态 -->
					<button v-if="details.state === 'closed' && details.pull_request.has_merged" class="merged">已合并</button>
						<span class="c_blue_color cursor" @click="$router.push({path: `/${headusernme}`})">{{ headusernme}}</span> 请求将
						<span class="c_blue_color">{{ pullnum }}</span> 次代码提交从
						<span class="c_blue_color cursor" @click="$router.push({path: `/${headusernme}/${reponame}/src/${headbranch}`})">{{ headusernme }}/{{ headbranch }}</span> 合并至
						<span class="c_blue_color cursor" @click="$router.push({path: `/${baseusername}/${reponame}/src/${basebranch}`})">{{ baseusername}}/{{ basebranch }}</span>
					</div>
				</div>
				<!-- tabmenu: 对话，代码提交，文件变动 -->
				<div class="tab-bar">
					<div :class="[{'active': this.$route.name==='mergeDetail'},'item']" @click="changeMenu('')">
						<span class="name">对话</span>
						<span class="badge">{{ details.comments }}</span>
					</div>
					<div :class="[{'active': this.$route.name==='codeSubmitPage'},'item']" @click="changeMenu('codeSubmitPage')">
						<span class="name">代码提交</span>
						<span class="badge">{{ pullnum }}</span>
					</div>
					<div :class="[{'active': this.$route.name==='fileChangePage'},'item']" @click="changeMenu('fileChangePage')">
						<span class="name">文件变动</span>
						<!-- 还不确定要取哪个值 -->
						<span class="badge">{{ diffnum }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 对话，代码提交，文件变动 -->
		<router-view name="mergeDetailEntry"></router-view>
	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'

	export default {
		data() {
			return {
				atdUsers: new Map(),
				// 控制菜单：对话，代码提交，文件变动
				tbMenu: '',
				repo: {},
				username: '',
				reponame: '',
				details: {},
				headRepo: {},
				baseRepo: {},

				headusernme: '',
				baseusername: '',
				headbranch: '',
				basebranch: '',
				pullnum: 0,
				diffnum: 0
			}
		},
		methods: {
			// 切换菜单
			changeMenu(name) {
				this.$router.push({path: `/${this.username}/${this.reponame}/pulls/${this.getIssueId}/${name}`});
			},
			// 获取工单详情
            getOrderDetail() {
                axios.get(`/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}`, {
                    params: {
                        owner: this.username,
                        repo: this.reponame,
                        index: this.getIssueId
                    }
                }).then(resp => {
					this.details = resp.data;
					this.headRepo = this.details.pull_request.head_repo;
					this.baseRepo = this.details.pull_request.base_repo;

					this.headusernme = this.headRepo.owner.username;
					this.baseusername = this.baseRepo.owner.username;

					this.headbranch = this.details.pull_request.head_branch;
					this.basebranch = this.details.pull_request.base_branch;

					// this.pullnum = this.headRepo.num_pulls;
                });
            },
			initData() {
                // 仓库的拥有者
                var self = this;
                this.$getUser(this.username, function(user) {
                    self.user= user;
                });
                // 仓库信息
                this.$getRepo(this.username, this.reponame, function(repo) {
                    self.repo= repo;
                });
			},
			getDiff() {
				let url = `/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}/diff`;
				axios.get(url).then(resp => {
					// this.diff = resp.data
					this.diffnum = resp.data.files.length;
				}).catch(Err)
			},
			// 获取代码提交次数
			getCommits() {
				let url = '/repos/' + this.username + '/' + this.reponame + '/issues/' + this.getIssueId + '/commits';

				axios.get(url).then(resp => {
					// this.commits = resp.data.commits
					this.pullnum = resp.data.commits.length;
				}).catch(Err)
			}
		},
		computed: {
			// 获取工单id
			getIssueId() {
				return this.$route.params.issueId;
			},
			atdUsersCal: function() {
				let arr = []
				this.atdUsers.forEach((item, key) => {
					arr.push(item)
				})
				return arr;
			}
		},
		created() {
            this.username = this.$route.params.username
			this.reponame = this.$route.params.repoName
			console.log(this.$route)
			
			// 初始化用户信息，仓库信息
			this.initData()
			
			// 获取详情
			this.getOrderDetail();
			// 获取文件变动
			this.getDiff();
			// 获取代码提交
			this.getCommits();

			let self = this;
			// 抛出一个事件，用来在合并请求操作成功后刷新父路由的详情
			signal.$on('getOrderDetail', function() {
				self.getOrderDetail();
			});
		}
	}
</script>

<style lang="scss" scoped>
	// 鼠标指针
	@mixin cursor {
		cursor: pointer;
	}
	// 背景色
    @mixin bg-color {
        background-color: #ffffff;
    }
	// 边框颜色
    @mixin bd-color {
        border: 1px solid rgba(34,36,38,.15);
    }
	// 边框圆角
    @mixin bd-radius {
        border-radius: .25rem;
    }
	// direction:row布局
	@mixin flex($d, $fd, $jc, $ai) {
		display: $d;
		flex-direction: $fd;
		justify-content: $jc;
		align-items: $ai;
	}
	.cursor {
		cursor: pointer;
	}
	.container {
		padding: 0 20px 20px;
		.header {
			width: 100%;
			@include bg-color;
			border: none;
			border-top: 1px solid rgba(34,36,38,.15);
			border-bottom: 1px solid rgba(34,36,38,.15);
			margin-bottom: 20px;
			margin-bottom: 8px;
			.info {
				.row2 {
					color: #465364;
					button {
						border-radius: 50px;
						color: #FFF;
						font-size: 13px;
						margin-right: 10px;
						width: 85px;
						height: 32px;
						text-align: center;
						line-height: 32px;
						cursor: default;
					}
					.open {
						background-color: #21BA45;
					}
					.close {
						background-color: #d0d0d0;
					}
					.merged {
						background-color: #A333C8;
					}
				}
				h1 {
					font-weight: 300;
					font-size: 28px;
					margin-top: 20px;
					.index {
						font-weight: 300;
						color: #aaa;
						letter-spacing: -1px;
					}
				}
			}
			.tab-bar {
				@include flex(flex, row, flex-start,center);
				margin-top: 30px;
				.item {
					@include cursor();
					@include flex(flex, row, center, center);
					height: 35px;
					min-width: 140px;
					text-align: center;
					color: #919aa7;	
					font-size: 15px;
					.name {
						margin-right: 3px;
					}
				}
				.active {
					color: #19222e;
					font-weight: 700;
					border-bottom: 2px solid #308eff;
				}
				.badge {
					background-color: #eceef0;
					height: 20px;
					min-width: 20px;
					border-radius: 50px;
					font-size: 13px;
					padding: 0 5px;
				}
			}
		}

		// 右侧布局
		
			.flex-right {
				@include bd-color;
				@include bd-radius;
				padding: 14px;
				flex: 2;
				height: max-content;
				margin-right: 20px;
				.menu-list {
					@include cursor;
					min-height: 64px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					&:nth-child(2) {
						border: none;
						border-bottom: 1px solid rgba(34,36,38,.15);
						border-top: 1px solid rgba(34,36,38,.15);
					}
					&:not(:last-child) {
						strong {
							cursor: default;
							color: rgba(175,175,175,.87);
						}
					}
					strong {
						font-weight: 700;
					}
					span {
						font-size: 13px;
						line-height: 30px;
						color: rgba(0,0,0,.87);
					}
				}
			}
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
	
	.c_imBT {
		width: 90px;
		height: 36px;
		padding: 0;
		line-height: 36px;
	}
	
	.mrLeft {
		width: 840px;
	}
	
	.mrRight {
		width: 300px;
		padding: 0 9px;
	}
	
	.mrLeftItem {
		padding: 14px 8px;
		min-height: 100px;
	}
	
	.mrLeftItem .smallIconImg+.smallIconImg {
		margin-left: 24px;
	}
	
	.editHeader {
		height: 35px;
		font-weight: bold;
	}
	
	.mrDivider {
		height: 18px;
		position: relative;
	}
	
	.mrDivider:after {
		content: '';
		display: block;
		position: absolute;
		left: 33px;
		top: 0;
		bottom: 0;
		height: 100%;
		border-right: 1px solid #E7EDF4;
	}
	
	.mrRightItem {
		min-height: 100px;
		padding: 22px 14px;
	}
	
	.rItemLabel {
		margin-top: 5px;
	}
	
	.mrHDIcon {
		display: inline-block;
		margin-right: 14px;
	}
	
	.upImg {
		width: 118px;
		height: 118px;
		border-radius: 2px;
		margin-right: 8px;
		margin-bottom: 8px;
	}
	
	.upImgCnt {
		margin-top: 16px;
		/*font-size: 0;*/
		flex-wrap: wrap;
	}
	
	.panelTabItem {
		width: 56px;
		margin-left: 35px;
		margin-right: 10px;
	}
	
	.editPanel textarea {
		height: 120px;
		padding: 22px;
		font-size: initial;
	}
	
	.mrUploadImg {
		/*width:800px;*/
		width: 100%;
		height: 144px;
		margin: auto;
	}
	
	.labelBT{
		margin:5px;
	}
	
</style>