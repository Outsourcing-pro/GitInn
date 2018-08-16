<template>
	<div class="c_white_bg c_padding c_paddingV" style="">
		<div class="cBigMargin c_flexRow c_gray_txt ft14">
			<div class="c_flexRow">
				<div class="c_green_bg c_border_rad3 lineBTH" style="width:38px;padding:12px;margin-right: 10px;">
					<img src="~img/src/分支_白色.svg" alt="" />
				</div>
				<div class="c_flexRow lineBTH c_border c_relative" style="padding:0 35px;" @click="showBranchesWin">
					<img src="~img/src/icon/分支.svg" style="width:16px;" alt="" />
					<span>分支: {{branchName}} <img style="width:8px;margin-bottom:2px;" src="~img/src/多层级_下.svg" alt="" /></span>
					<menu-list :type="1" :show.sync="showBranches">
						<ul @click.stop>
							<li v-for="item in branches" @click="chooseBranch(item)">{{item.name}}</li>
						</ul>
					</menu-list>
				</div>

			</div>
		</div>
		<div class="cBigMargin c_border c_gray_txt" style="margin-bottom: 10px;">
			<div class="c_flexRow fileListItemHeader c_bottom_line">
				<span class="c_flexOne ft16 c_bold c_color_initial">提交历史</span>
				<div class="c_flexRow">
					<el-input placeholder="搜索历史提交" v-model="keyword"></el-input>
					<button @click="searchHistory()" type="button" style="margin-left:10px;" class="ui-btn">查找</button>
				</div>
			</div>
			<!--<div class="c_flexRow flexStart fileListItemHeader c_bottom_line">
							<img src="~img/headImg/nv06.jpg" class="c_hd_img" alt="" style="width: 26px;margin-right:10px;" />
							<span class="c_blue_color c_bold">程序员客栈</span>
						</div>-->
			<div class="c_flexRow fileListItem c_bottom_line c_bold c_color_initial">
				<span class="" style="width: 340px;">作者</span>
				<span class="" style="width: 93px;margin-right: 15px;">SH1</span>
				<span class="c_flexOne" style="color:#465364">备注</span>
				<span>提交日期</span>
			</div>
			<div class="c_flexRow fileListItem c_bottom_line" v-for="item in commitList">
				<img :src="item.author && item.author.avatar_url" class="c_hd_img c_small_head_icon c_pointer" alt="" @click="toOtherCenter(item.author.username)" />
				<span @click="toOtherCenter(item.author.username)" class="c_blue_color cursor" style="width: 300px;">{{item.author.full_name}}</span>
				<span @click="routerCodeDetail(item.id)" class="c_gray_label c_textEllipsis cursor" style="width: 93px;margin-right: 15px;">{{item.id}}</span>
				<span class="c_flexOne" style="color:#465364">
							{{item.message}}
				</span>
				<span>{{$distanceInWords(item.created)}}</span>
			</div>
			<div class="fileListItemHeader c_bottom_line c_bold c_color_initial btn-group" v-show="show_page">
                <button @click="prev()" type="button" style="margin-left:10px;" :class="disable_class_prev">上一页</button>
                <button @click="next()" type="button" style="margin-left:10px;" :class="disable_class_next">下一页</button>
            </div>
		</div>
	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				//				tab: 0,
				showBranches: false,
				showedBranch: {},
				branches: [],
				commitList: [],
				// 搜索字段
				searchStr: '',
				commits_count: 0,
				keyword: '',
				show_page: false,
				defaultPageSize: 10,
				page: 1,
				disable_class_prev: "ui-btn btn-grey",
				disable_class_next: "ui-btn ",
				disable_class: "ui-btn btn-grey",
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
			}
		},
		methods: {
			// 查找历史提交
			searchHistory() {
			    this.show_page = false;
			    //get store basic info
            	var ownerRep = '/repos/' + this.username + '/' + this.repoName;
				axios.get(ownerRep + '/branches/' + this.branchName + '/commits',{
                    params:{
                        keyword: this.keyword,
                    }
                }).then(resp => {
                    this.commitList = resp.data.commits
                }).catch(err => Err(err))
			},
			// 提交页面
			routerCodeDetail(id) {
				this.$router.push({path: `/${this.username}/${this.repoName}/commit/${id}`});
			},
			showBranchesWin() {
				this.showBranches = true
			},
			chooseBranch(item) {
			    this.currentBranch = item
                this.showBranches = false
                this.branchName = item.name
                this.$router.push({
                    path: `/${this.username}/${this.repoName}/commits/${item.name}`
                })
            },
            // 获取最新提交记录
            getLatestCommit() {
                if(this.branchName == null) {
                    InfoMsg.warn('branch name is empty')
                    return;
                }

                //get readme data
                axios.get(`repos/${this.username}/${this.repoName}/${this.branchName}/latest/commit`).then(resp => {
                    this.commits_count = resp.data.commits_count
                    if (this.commits_count <= this.defaultPageSize) {
                        this.show_page = false;
                    } else {
                        this.show_page = true;
                    }
                }).catch(err => Err(err))
            },
			toOtherCenter(username) {
				this.$router.push({path: `/${username}`});
			},
			prev() {
			    if (this.page == 1) {
			        return;
			    }
			    this.page--;
			    var ownerRep = '/repos/' + this.username + '/' + this.repoName;
			    axios.get(ownerRep + '/branches/' + this.branchName + '/commits',{
                    params:{
                        page: this.page,
                        page_size: this.defaultPageSize
                    }
                }).then(resp => {
                    this.commitList = resp.data.commits
                }).catch(err => Msg(err))
                if (this.page == 1) {
                    this.disable_class_prev = this.disable_class;
                    this.disable_class_next = "ui-btn"
                }
			},
			next() {
                if (this.page * this.defaultPageSize >= this.commits_count) {
                    return;
                }
                this.page++;
                var ownerRep = '/repos/' + this.username + '/' + this.repoName;
                axios.get(ownerRep + '/branches/' + this.branchName + '/commits',{
                    params:{
                        page: this.page,
                        page_size: this.defaultPageSize
                    }
                }).then(resp => {
                    this.commitList = resp.data.commits
                }).catch(err => Msg(err))
                if (this.page * this.defaultPageSize >= this.commits_count || this.commitList.length < this.defaultPageSize) {
                    this.disable_class_next = this.disable_class;
                    this.disable_class_prev = "ui-btn"
                }

            },
			initData() {
			    // 仓库的拥有者
                var that = this;
                this.$getUser(this.username, function(user) {
                    that.user= user;
                });
                // 仓库信息
                this.$getRepo(this.username, this.repoName, function(repo) {
                    that.repo= repo;
                });

                //get store basic info
                var ownerRep = '/repos/' + this.username + '/' + this.repoName;

                axios.get(ownerRep + '/branches').then(resp => {
                    this.branches = resp.data.branches
                    if (this.branchName) {
                        this.branches.forEach(item => {
                            if(item.name == this.branchName) {
                                this.currentBranch = item
                            }
                        })
                    } else {
                        this.currentBranch = this.branches[0] || {};
                        this.branchName    = this.currentBranch.name || 'master';
                        // console.log(this.branchName)
                    }
                    // 获取分支最新一次提交
                    this.getLatestCommit();
                    //获取历史记录
                    return axios.get(ownerRep + '/branches/' + this.branchName + '/commits',{
                        params:{
                            page: this.page,
                            page_size: this.defaultPageSize,
                            file_name: this.fileName
                        }
                    })
                }).then(resp => {
                    this.commitList = resp.data.commits
                    // 如果返回的列表长度比当前分页少，不显示分页
                    if (this.commitList.length < this.defaultPageSize) {
                        this.show_page = false;
                    }
                }).catch(err => Msg(err))
			}
		},
		computed: {

		},
		components: {
			'store-tab': StoreTab,
			'menu-list': MenuList
		},
		created() {
			//和
			this.self = this.$getSelf();
			this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
            this.branchName = this.$route.params.branch
            this.fileName = this.$route.params.fileName
            this.initData()
		},
		mounted() {

		},
        beforeRouteUpdate(to, from, next) {
            // 登录用户
            this.self = this.$getSelf()
            this.username = to.params.username
            this.repoName = to.params.repoName
            this.branchName = to.params.branchName
            this.initData();
            next()
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
	
	.lineItemCnt {
		border: 1px solid #E9ECF0;
		border-radius: 2px;
		height: 46px;
		justify-content: space-around;
	}
	
	.lineItem img {
		width: 14px;
		margin-right: 3px;
	}
	
	.lineItem:nth-child(2) {
		margin-right: 3px;
	}
	
	.lineBTH {
		height: 38px;
	}
	
	button.lineBTH {
		background: transparent;
		/*color:inherit;*/
	}
	
	input.lineBTH {
		padding-left: 15px;
	}
	
	.fileListItemHeader {
		padding: 2px 12px;
		height: 60px;
	}
	
	.fileListItem {
		padding: 2px 12px;
		height: 36px;
	}
	
	.fileListItem img {
		width: 20px;
		height: 20px;
		margin-right: 19px;
	}
</style>