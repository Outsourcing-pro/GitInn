<template>
	<div class="c_contentBody">
		<div v-show="tab==0">
			<div class="c_white_bg c_padding">
				<div class="c_paddingV c_flexRow">
					<div class="c_flexRow">
						<img src="~img/src/合并请求.svg" style="width:20px;margin-right:10px;" alt="" />
						<span>{{diff.files && diff.files.length}} 个文件被更改，包括 {{diff.total_addition}} 次插入 和 {{diff.total_deletion}} 次删除</span>
					</div>
					<div class="c_flexOne"></div>
					<div class="btn-group">
						<div class="ui-btn-simple" @click="viewShowType=!viewShowType">{{viewShowType==0?'分列视图':'合并视图'}}</div>
						<div class="ui-btn-simple" @click="showStatic=!showStatic">文件统计</div>
					</div>
				</div>
				<div class="static" v-show="showStatic">
					<div class="static_item c_flexRow" v-for="item in this.diff.files">
						<span>{{item.name}}</span>
						<div class="c_flexRow">
							<span class="c_margin-right10">+{{item.addition}}</span>
							<div class="CPProgressCnt c_gray_bg">
								<div class="c_green_bg CPProgress" :style="{width:item.addition*100/(item.addition+item.deletion)+'%'}"></div>
							</div>
							<span class="c_green_txt" style="margin:0 35px">-{{item.deletion}}</span>
						</div>
					</div>
				</div>
				<div>
					<div class="comparePanel c_border c_border_rad3" v-for="file in diff.files">

						<div class="comparePanelTitle c_flexRow">
							<span class="c_margin-right10">+{{file.addition}}</span>
							<div class="CPProgressCnt c_gray_bg">
								<div class="c_green_bg CPProgress" :style="{width:file.addition*100/(file.addition+file.deletion)+'%'}"></div>
							</div>
							<span class="c_green_txt" style="margin:0 35px">-{{file.deletion}}</span>
							<span class="c_gray_txt c_flexOne">{{file.name}}</span>
							<div class="ui-btn-simple c_border_rad3" @click="viewFile(file.name)">查看文件</div>
						</div>
						<table class="compareTable">
							<tbody v-for="section in file.sections">
								<tr v-if="viewShowType==0" v-for="line in section.lines" :class="{'tag-code':calLineType(line)==0,'add-code':calLineType(line)==1,'del-code':calLineType(line)==2,'same-code':calLineType(line)==3}">
									<td colspan="2" class="lines-num" v-if="calLineType(line)==0"></td>
									<td class="lines-num lines-num-old" v-if="calLineType(line)!=0">
										{{line.left_idx==0?'':line.left_idx}}
									</td>
									<td class="lines-num lines-num-new" v-if="calLineType(line)!=0">
										{{line.right_idx==0?'':line.right_idx}}
									</td>
									<td class="lines-code">
										<pre><code>{{line.content}}</code></pre>
									</td>
								</tr>

								<!--分列视图-->
								<tr v-if="viewShowType==1" v-for="line in section.lines" :class="{'tag-code':calLineType(line)==0,'add-code':calLineType(line)==1,'del-code':calLineType(line)==2,'same-code':calLineType(line)==3}">
									<td class="lines-num" v-if="calLineType(line)==0"></td>
									<td class="lines-code" colspan="3" v-if="calLineType(line)==0">
										<pre><code>{{line.content}}</code></pre>
									</td>
									<td class="lines-num lines-num-old" v-if="calLineType(line)!=0">
										{{line.left_idx==0?'':line.left_idx}}
									</td>
									<td class="lines-code halfwidth">
										<pre><code>{{line.left_idx!=0?line.content:''}}</code></pre>
									</td>
									<td class="lines-num lines-num-new borderLeft" v-if="calLineType(line)!=0">
										{{line.right_idx==0?'':line.right_idx}}
									</td>
									<td class="lines-code halfwidth">
										<pre><code>{{line.right_idx!=0?line.content:''}}</code></pre>
									</td>
								</tr>

							</tbody>

						</table>
						<!--<div class="comparePanelDes c_gray_bg">@@ -0,0 +1,64 @@</div>
						<div class="c_flexRow alignItemStrecth comparePanelCnt">
							<div class="comparePanelCntLeft c_darkGray_text">
								<span v-for="n in 20" class="comparePanelCntLeftItem">{{n}}</span>
							</div>
							<div class="comparePanelCntRight c_flexOne">
								<code style="white-space: pre-wrap;">
								</code>
							</div>
						</div>-->
					</div>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'

	export default {
		data() {
			return {
				tab: 0,
				showStatic: false,
				viewShowType: 0, //0 合并显示,1 分列显示
				subTab: 0,
				storeItem: {},
				mergeItem: {},
				diff: {},
				username: '',
				reponame: '',
				committerSha1: '',
				headRepo: {},
				baseRepo: {},
				details:{},
				params: {
					owner: '',
					repo: '',
					base_branch: '',
					head_owner: '',
					head_repo: '',
					head_branch: '',
					title: '',
					body: '',
					assignee: '',
					milestone: -1,
					labels: [],
					files: [],
				},
				repo: {}
			}
		},
		methods: {
			// 文件详情
			viewFile(name) {
				this.$router.push({path: `/${this.username}/${this.reponame}/src/${this.committerSha1}/${name}?is_dir=false`});
			},
			calLineType(line) {
				let type = -1;
				if(line.left_idx == 0 && line.right_idx == 0) type = 0; //tags
				else if(line.left_idx == 0 && line.right_idx > 0) type = 1; //add
				else if(line.left_idx > 0 && line.right_idx == 0) type = 2; //deletion
				else if(line.left_idx == line.right_idx && line.left_idx > 0) type = 3 //same

				return type;
			},
			getDiff() {

				let url = `/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}/diff`;
				axios.get(url).then(resp => {
					this.diff = resp.data
					signal.$emit('merge_request:change_file_num', this.diff.files.length)
				}).catch(Err)
			},
			getCommits() {
                let url = '/repos/' + this.username + '/' + this.reponame + '/pr/preview_commits';

				let self = this;
                axios.post(url, this.params).then(resp => {
                    self.commits = resp.data.commits

					// 获取最近一次提交的id
					self.committerSha1 = this.commits[0].id;
                }).catch(Err)

			},
			initCanPulls() {
                // 仓库本身是从别的仓库Fork的，当前用户有仓库写权限
                if (this.isWriter() == true
                    && this.repo.enable_pulls
                    && this.repo.is_mirror == false
                    && this.repo.fork == true
                    && this.repo.base_repo
                ) {
                    this.baseRepo = this.repo.base_repo;
                    this.headRepo = this.repo;
                } else {
                    // 判断当前用户有没有fork过当前仓库
                    axios.get('/repos/' + this.username + '/' + this.reponame + '/isfork').then(resp => {
                        var headRepo = resp.data;
                        // 有fork过，可以从fork的仓库向当前仓库提交PR
                        if (headRepo != null && headRepo != "" && headRepo.id != 0) {
                            this.headRepo = resp.data;
                            this.baseRepo = this.repo;
                        } else if (this.isWriter() == true && this.repo.enable_pulls && this.repo.is_mirror == false) {
                            // 当前仓库的可写权限，允许从当前仓库的不同分支提交PR
                            this.headRepo = this.repo;
                            this.baseRepo = this.repo;
						}

						this.params.base_branch = this.baseRepo.default_branch
						this.params.head_owner = this.headRepo.owner.username
						this.params.head_repo = this.headRepo.name
						
						this.getCommits();
                    }).catch(err => Err(err))
                }
            },
            isWriter() {
                return (this.self && this.repo.owner.id == this.self.id) || (this.repo.permissions && this.repo.permissions.push == true) || this.repo.permissions.admin == true;
			},
			getOrderDetail() {
                axios.get(`/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}`, {
                    params: {
                        owner: this.username,
                        repo: this.reponame,
                        index: this.getIssueId
                    }
                }).then(resp => {
					this.details = resp.data;

					console.log('detais: ', this.details.pull_request.head_branch)
					this.params.head_branch = this.details.pull_request.head_branch;
					this.initCanPulls();
                });
            },
		},
		computed: {
			getIssueId() {
				return this.$route.params.issueId;
			},
		},
		components: {
			'store-tab': StoreTab
		},
		created() {
			this.username = this.$route.params.username
			this.reponame = this.$route.params.repoName

			// base owner
            this.params.owner = this.$route.params.username
			// base repo
            this.params.repo = this.$route.params.repoName

			this.getDiff()

			this.getOrderDetail();

			let that = this;
			// 仓库信息
            this.$getRepo(this.username, this.reponame, function(repo) {
				that.repo = repo;
			});
			
			console.log(signal.$emit('sendDetail'), '3456789')

		},
		mounted() {

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
	
	.cRNavItem .c_badge_normal {
		margin-right: 0;
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
	
	.CDPushHeader {
		padding: 0 27px;
		height: 50px;
	}
	
	.CDPushBody {
		min-height: 80px;
	}
	/*compare css*/
	
	.compareTable {
		width: 100%;
		font-size: 12px;
		line-height: 1.4;
		border-collapse: collapse;
	}
	
	.lines-num {
		color: gray;
		padding: 0 3px;
		border-right: 1px solid #d4d4d5;
		text-align: center;
		width: 15px;
		min-width: 15px;
	}
	
	.borderLeft {
		border-left: 1px solid #d4d4d5;
	}
	
	.tag-code {
		background: #F0F0F0;
	}
	
	.same-code {
		background: white;
	}
	
	.add-code {
		background: #eaffea;
	}
	
	.del-code {
		background: #ffecec;
	}
	
	.lines-code {
		padding-left: 10px;
		text-align: left;
	}
	
	.halfwidth {
	}
	
	.lines-code pre {
		margin: 0;
		text-align: left;
	}
	
	.lines-code code {
		/*padding-top:4px;
		float: left;*/
		/*display: inline;*/
	}
	
	.static{
		margin-bottom: 10px;
		color:gray;
	}
	
	.static_item{
		padding:10px;
		border-bottom: 1px dashed darkgray;
	}
</style>