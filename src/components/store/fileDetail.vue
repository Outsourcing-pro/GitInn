<template>
	<div class="c_contentBody c_cnt_noColor">
		<!-- tab：文件，工单管理，合并请求，Wiki -->
		<store-tab v-if="false" :tab="tab" @update:tab="updateTab">
			<div v-if="tab==0">
				<div v-show="showLabel=='storeindex'">
					<div class="c_white_bg c_padding c_paddingV" style="">
						<div class="c_bold ft16">{{ storeInfo.description }}</div>
						<div class="cBigMargin c_flexRow lineItemCnt">
							<div class="c_flexRow lineItem c_pointer" @click="goSubTab(0)">
								<img src="~img/src/icon/历史版本.svg" alt="" />
								<span class="c_bold">{{ storeInfo.commits_count }}</span>
								<span class="c_bold">提交历史</span>
							</div>
							<div class="c_flexRow lineItem c_pointer" @click="goSubTab(1)">
								<img src="~img/src/icon/合并请求.svg" alt="" />
								<span class="c_bold">{{ storeInfo.branches_count }}</span>
								<span class="c_bold">代码分支</span>
							</div>
							<div class="c_flexRow lineItem c_pointer" @click="goSubTab(2)">
								<img src="~img/src/icon/版本发布.svg" alt="" />
								<span class="c_bold">{{ storeInfo.tags_count }}</span>
								<span class="c_bold">版本发布</span>
							</div>
						</div>
						<div class="cBigMargin c_flexRow c_gray_txt ft14">
							<div class="c_flexRow">
								<div class="c_green_bg c_border_rad3 lineBTH c_pointer" @click="$router.push({name:'comparerequest'})" style="width:38px;padding:12px;margin-right: 10px;">
									<img src="~img/src/分支_白色.svg" alt="" />
								</div>
								<div class="c_flexRow lineBTH c_border c_pointer c_relative" style="padding:0 35px;" @click="showBranchesWin">
									<img src="~img/src/icon/分支.svg" style="width:16px;" alt="" />
									<span>分支: {{showedBranch.name}} <img style="width:8px;margin-bottom:2px;" src="~img/src/多层级_下.svg" alt="" /></span>
									<menu-list :type="1" :show.sync="showBranches">
										<ul @click.stop>
											<li v-for="item in branches" @click="chooseBranch(item)">{{item.name}}</li>
										</ul>
									</menu-list>
								</div>

							</div>
							<!-- 复制，下载 -->
							<div class="c_flexRow">
								<button class="c_border lineBTH c_pointer" :class="{c_border_blue:subDownTab==0,c_blue_color:subDownTab==0,c_gray_txt:subDownTab!=0}" style="width:73px;" type="button" @click="changeDownLoadTab(0)">HTTPS</button>
								<button class="c_border lineBTH c_pointer" :class="{c_border_blue:subDownTab==1,c_blue_color:subDownTab==1,c_gray_txt:subDownTab!=1}" style="width:63px;" @click="changeDownLoadTab(1)" type="button">SSH</button>
								<input class="c_border lineBTH c_gray_txt ft14" readonly id="repo-clone-url" :value="subDownTab?storeInfo.ssh_url:storeInfo.html_url" type="text" style="width:210px;margin-right: 15px;" />
								<button class="c_border lineBTH c_flexRow c_flexRowCenter clipboard ui basic icon button poping up " data-success="复制成功" data-error="复制失败" data-original="复制链接" data-variation="inverted tiny" id="repo-copy-bt" data-clipboard-target="#repo-clone-url" type="button" style="margin-left:16px;width:40px;"><img src="~img/src/复制.svg" alt="" /></button>
								<button class="c_border lineBTH c_flexRow c_flexRowCenter" type="button" style="width: 40px;"><img src="~img/src/下载.svg" alt="" /></button>
							</div>
						</div>
						<!-- 最近一次提交 -->
						<div class="cBigMargin c_border c_gray_txt" style="margin-bottom: 10px;">
							<div class="c_flexRow flexStart fileListItemHeader c_bottom_line">
								<img @click="toCenter(storeInfo.owner.username)" :src="storeInfo.owner && storeInfo.owner.avatar_url" class="c_hd_img cursor" alt="" style="width: 26px;margin-right:10px;" />
								<span @click="toCenter(storeInfo.owner.username)" class="c_blue_color c_bold cursor">{{storeInfo.owner && storeInfo.owner.full_name}}</span>
								<span class="c_gray_label c_textEllipsis ft12" style="width: 93px;margin-right: 15px;margin-left: 15px;">{{commits.id}}</span>
								<span class="c_flexOne" style="color:#465364">{{commits.message}}
								</span>
							</div>
							<!-- 文件列表 -->
							<div class="c_flexRow fileListItem c_bottom_line" v-for="(item,index) in files">
								<img src="~img/src/list/文件.svg" v-show="!item.is_dir" alt="" />
								<img src="~img/src/list/文件夹.svg" v-show="item.is_dir" alt="" />
								<span @click="routerFileDetail(item.commit.url)" class="c_blue_color" style="width: 300px;">{{item.name}}</span>
								<span @click="routerCodeDetail(item.commit.id)" class="c_gray_label c_textEllipsis ft12" style="width: 93px;margin-right: 15px;">{{item.commit.id}}</span>
								<span class="c_flexOne" style="color:#465364">
								{{item.commit && item.commit.message}}
								</span>
								<span class="ft12">{{item.commit && $distanceInWords(item.commit.created)}}</span>
							</div>
						</div>
					</div>
					<!-- md -->
					<div class="c_padding  c_white_bg" style="margin-top:10px; padding-bottom: 22px;">
						<div style="height: 60px;" class="c_bold c_bottom_line ft16 c_flexRow">
							README.md
						</div>
						<div style="color:#475669;" v-html="readMeData.content"></div>
					</div>
				</div>
				<router-view v-show="showLabel!='storeindex'"></router-view>
			</div>
			<!--设置-->
			<div v-if="tab!=0">
				<router-view></router-view>
			</div>

		</store-tab>

	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				tab: 0,
				self: {},
				showLabel: '',
				//				showHistory: false,
				subDownTab: 0,
				queryData: {},
				storeInfo: {},
				showBranches: false,
				showedBranch: {},
				branches: [],
				files: [], //显示的文件
				commits: {}, //最近一次提交记录
				fileIndex: 0, //显示文件在第几层，默认为第一层
				readMeData: {},
				owner:'',
				repo: '',
				pageindex: 0,
				pageurla: '/a',
				pageurlb: '/b',
				pageurlc: '/c/name.js'
			}
		},
		methods: {
			// 跳转到首页
			toCenter(username) {
				if(username === this.$getSelf().username) {
					this.$router.push('/');
				} else {
					// 其他人的首页
					this.$router.push({path: `/others/${username}`});
				}
			},
			// 提交页面
			routerCodeDetail(id) {
				console.log(id);
				this.$router.push({path: `/codedetailpage/${id}`});
			},
			// 文件详情页面
			routerFileDetail(filename) {
				this.pageindex++;
				let url = '';
				if(this.pageindex == 1) {
					url = this.pageurla
				} else if(this.pageindex == 2) {
					url = this.pageurla + this.pageurlb
				} else if(this.pageindex == 3) {
					url = this.pageurla + this.pageurlb + this.pageurlc
				} else {
					url = this.pageindex
				}
				this.$router.push({path: `/file/${url}`});
			},
			routerDerive() {
				let owner = this.storeInfo.owner
				if(this.self.id == owner.id) {
					InfoMsg.warn('不能派生自己的仓库')
					return;
				}

				this.$router.push({
					name: 'derivestore'
				})
			},

			updateTab(tab) {
				if(tab == 0) {
					//this.showLabel='main'
					this.$router.push({
						name: 'filedetailpage'
					})
				} else if(tab == 1) { //工单管理
					this.$router.push({
						name: 'ticketmanagemain'
					})
				} else if(tab == 2) { //合并请求
					this.$router.push({
						name: 'mergerequestlist'
					})
				} else if(tab == 3) { //wiki
					this.$router.push({
						name: 'wiki'
					})
				} else if(tab == 4) { //设置
					this.$router.push({
						name: 'storesetting',
						query: {
							branchname: this.showedBranch.name
						}
					})
				}

			},
			showView(name) {

				//子view 里面还有view 需要被忽略的路由，不需要错误消息
				let ignoreMap = {
					filechangepage: 0,
					codesubmitpage: 0,
					mergerequestindex: 0
				}
				if(isStrEmpty(name)) {
					InfoMsg.warn('view name is empty')
					return;
				}
				this.showLabel = name

				if(name == 'filedetailpage') { //仓库主页
					this.tab = 0
				} else if(name == 'pushhistory') { //提交历史
					this.tab = 0
				} else if(name == 'storesetting') { //仓库设置
					this.tab = 4
				} else if(name == 'branch') { //分支
					this.tab = 0
				} else if(name == 'version') { //版本
					this.tab = 0
				} else if(name == 'wiki') {
					this.tab = 3
				} else if(name == 'ticketmanagemain') { //工单管理
					this.tab = 1
				} else if(name == 'mergerequestlist') { //合并请求
					this.tab = 2
				} else if(name == 'milestonelist') { //里程碑
					this.tab = 1
				} else if(name == 'labellist') { //标签
					this.tab = 1
				} else if(name == 'mergerequestindex') { //合并请求
					this.tab = 2
				} else if(name == 'wikicreate') { //创建wiki 文件
					this.tab = 3
				} else if(name == 'codedetailpage') { //代码详情
					this.tab = 2
				} else if(!(name in ignoreMap)) {
					InfoMsg.warn('no router name found')
				}
			},
			follow(followUser) {
				try {
					var username = this.storeInfo.owner.username
					if(username == null) throw 'user name is empty'
				} catch(e) {
					InfoMsg.error(e.message)
					return;
				}

				if(followUser) {
					axios.delete('/user/following/' + username).then(resp => {
						this.reloadStoreInfo()
					}).catch(err => Err(err))
				} else {
					axios.put('/user/following/' + username).then(resp => {
						this.reloadStoreInfo()
					}).catch(err => Err(err))
				}
			},
			goSubTab(index) {
				switch(index) {
					case 0: // 提交历史记录
						this.$router.push({
							name: 'pushhistory'
						})
						//						this.showHistory = true
						break;
					case 1:
						this.$router.push({
							name: 'branch'
						})
						break; //代码分支
					case 2:
						this.$router.push({
							name: 'version'
						})
						break; //版本发布
					default:
						break;
				}
			},
			watch() { //关注
				let action = 'watch';
				if(this.storeInfo.is_watching) action = 'unwatch';
				axios.post(this.ownerRep + '/action', {
					action: action
				}).then(resp => {
					this.reloadStoreInfo()
				}).catch(err => Err(err))
			},
			star() { //点赞
				let action = 'star';
				if(this.storeInfo.is_staring) action = 'unstar';
				axios.post(this.ownerRep + '/action', {
					action: action
				}).then(resp => {
					this.reloadStoreInfo()
				}).catch(err => Err(err))
			},
			changeDownLoadTab(tab) {
				this.subDownTab = tab
			},
			showBranchesWin() {
				this.showBranches = true
			},
			chooseBranch(item) {
				this.showedBranch = item
				this.showBranches = false
			},
			reloadStoreInfo() {
				axios.get(this.ownerRep).then(resp => {
					this.storeInfo = resp.data;
					console.log('reloadstoreinfo>>>>',this.storeInfo)
					// 更新全局数据
					localStorageEx.set('storeItem', this.storeInfo);
				}).catch(err => Err(err))
			},
			// 获取最新提交记录
			getLatestCommit() {
				if(this.showedBranch.name == null) {
					InfoMsg.warn('branch name is empty')
					return;
				}
				//get readme data
				axios.get(`repos/${this.owner}/${this.repo}/${this.showedBranch.name}/latest/commit`).then(resp => {
					this.$set(this.commits, 'id', resp.data.id);
					this.$set(this.commits, 'message', resp.data.message);
				}).catch(err => Err(err))
			},
			getReadMeData(ownerRep) {
				if(this.showedBranch.name == null) throw 'branch name is empty';
				axios.get(ownerRep + '/branches/' + this.showedBranch.name + '/get?path=/README.md').then(resp => {
					this.readMeData = resp.data
				}).catch(err => Err(err))
			}

		},
		components: {
			'store-tab': StoreTab,
			'menu-list': MenuList
		},
		created() {
			console.log(this.$route.name)
			this.showView(this.$route.name)
			this.queryData = localStorageEx.get('queryData')
			// 用户名
			this.owner = this.queryData.repo_user_name;
			// 仓库名
			this.repo = this.queryData.repo_name;
			if(this.queryData == null) {
				InfoMsg.warn('queryData is empty')
				return;
			}
			if(isStrEmpty(this.queryData.repo_user_name)) {
				InfoMsg.warn('repo_user_name is empty')
				return;
			}
			if(isStrEmpty(this.queryData.repo_name)) {
				InfoMsg.warn('repo_name is empty')
				return;
			}

			//get store basic info
			var ownerRep = '/repos/' + this.queryData.repo_user_name + '/' + this.queryData.repo_name;
			this.ownerRep = ownerRep
			this.reloadStoreInfo()

			//get branches
			axios.get(ownerRep + '/branches').then(resp => {
				this.branches = resp.data.branches
				this.showedBranch = this.branches[0] || {};
				if(this.showedBranch.name == null) throw 'branch name is empty';
					this.getReadMeData(ownerRep)
					// 获取分支最新一次提交
					this.getLatestCommit();
				//get file list
				return axios.get(ownerRep + '/branches/' + this.showedBranch.name + '/list');
			}).then(resp => {
				var entries = resp.data.entries
				this.files = entries
			}).catch(err => Err(err))

			this.self = this.$getSelf()

		},
		mounted() {
			var clipboard = new Clipboard('.clipboard');
			clipboard.on('success', function(e) {
				e.clearSelection();

				$('#' + e.trigger.getAttribute('id')).popup('destroy');
				e.trigger.setAttribute('data-content', e.trigger.getAttribute('data-success'))
				$('#' + e.trigger.getAttribute('id')).popup('show');
				e.trigger.setAttribute('data-content', e.trigger.getAttribute('data-original'))
			});

			clipboard.on('error', function(e) {
				$('#' + e.trigger.getAttribute('id')).popup('destroy');
				e.trigger.setAttribute('data-content', e.trigger.getAttribute('data-error'))
				$('#' + e.trigger.getAttribute('id')).popup('show');
				e.trigger.setAttribute('data-content', e.trigger.getAttribute('data-original'))
			});
		},
		beforeRouteUpdate(to, from, next) {
			this.showView(to.name)
			next()
		}

	}
</script>

<style scoped>
	.menuList.menuListAbsPos {
		top: 15px;
	}
	
	.fileListItem:hover {
		cursor: pointer;
		background: #F4F5F9;
	}
	
	.fileListItem {
		padding: 2px 12px;
		height: 36px;
	}
	
	.fileListItem.c_bottom_line:last-of-type:after {
		display: none;
	}
	
	.fileListItem img {
		width: 12px;
		margin-right: 19px;
	}
	
	.c_contentBody {
		margin-top: 0;
	}
</style>

<style scoped>