<template>
	<div v-show="tab==0">
		<div class="c_white_bg">
			<div class="c_paddingV c_padding">
				<div class="c_flexRow">
					<div class="c_flexRow">
					<!-- <div class="c_imBT c_imBT_blue" @click="goMergeRequst">工单</div> -->
						<div class="c_imBT c_border_rad3" @click="goMileStone">里程碑</div>
						<div class="c_imBT c_border_rad3" @click="goLabel">标签</div>
					</div>

					<button type="button" class="ui-btn btn-green" v-show="allowPulls" @click="createPull">创建合并请求</button>
				</div>
			</div>
		</div>

		<!-- 工单详情，发布页等入口 -->
		<router-view name="mergeEntry"></router-view>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				tab: 0,
				repo: {},
				allowPulls: true,
				details: {},
				username: '',
				repoName: '',
				baseRepo: {},
				headRepo: {}
			}
		},
		methods: {
			// goMergeRequst() {
			// 	this.$router.push('');
			// },
			goMileStone() {
				this.$router.push({
					path: `/${this.username}/${this.repoName}/milestones`
				})
			},
			goLabel() {
				this.$router.push({
					path: `/${this.username}/${this.repoName}/labels`
				})
			},
            createPull() {
                this.$router.push({
                    path: `/${this.baseRepo.owner.username}/${this.baseRepo.name}/pulls/compare/${this.baseRepo.default_branch}...${this.headRepo.owner.username}:${this.headRepo.name}`
                });
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
                    this.allowPulls = true;
                } else {
                    // 判断当前用户有没有fork过当前仓库
                    axios.get('/repos/' + this.username + '/' + this.repoName + '/isfork').then(resp => {
                        var headRepo = resp.data;
                        // 有fork过，可以从fork的仓库向当前仓库提交PR
                        if (headRepo != null && headRepo != "" && headRepo.id != 0) {
                            this.headRepo = resp.data;
                            this.baseRepo = this.repo;
                            this.allowPulls = true;
                        } else if (this.isWriter() == true && this.repo.enable_pulls && this.repo.is_mirror == false) {
                            // 当前仓库的可写权限，允许从当前仓库的不同分支提交PR
                            this.headRepo = this.repo;
                            this.baseRepo = this.repo;
                            this.allowPulls = true;
                        }
                    }).catch(err => Err(err))
                }
            },
            isWriter() {
                return (this.self && this.repo.owner.id == this.self.id) || this.repo.permissions.push == true || this.repo.permissions.admin == true;
            },
		},
		created() {
            // 登录用户
            this.self = this.$getSelf()
            this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
            // 仓库的拥有者
            var that = this;
            this.$getUser(this.username, function(user) {
                that.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                that.repo = repo;;
                that.initCanPulls();
            });
			
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