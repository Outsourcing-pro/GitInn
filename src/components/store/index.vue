<template>
	<div class="c_contentBody ft13 c_cnt_noColor">
		<div class="c_flexRow storeHeader">
			<div class="c_flexCol">
				<!--<div class="c_bg_img c_wh50 c_margin-right6" :style="{'background-image':'url('+''+')'}"></div>-->
				<div>
					<span class="ft20">{{username}}/<span class="c_blue_color">{{repoName}}</span></span>
					<img src="~img/src/私有仓库icon.svg" v-if="repo.private" class="a_store_icon" alt="" />
					<img src="~img/src/公开仓库icon.svg" v-if="!repo.private" class="a_store_icon" alt="" />
				</div>
				<span class="ft12" v-if="repo.fork">派生自<span class="c_blue_color c_pointer" @click="$router.push({path: `/${repo.base_repo.full_name}`})">{{repo.base_repo.full_name}}</span></span>
				<span class="ft12" v-if="repo.is_mirror">镜像地址{{repo.mirror.address}}</span>
			</div>
			<div class="c_flexOne"></div>

			<div class="c_flexRow">
				<div class="c_flexRow flexStart c_white_bg whiteBlockIcon c_margin-right6 c_gray_txt">
					<img src="~img/src/icon/关注.svg" class="c_pointer" style="width:16px;" alt="" @click="watch" />
					<span style="margin-left:8px;margin-right: 8px;" @click="watch" class="c_pointer">{{(repo && repo.is_watching)?'取消关注':'关注'}}</span>
					<span style="margin-left:15px;" class="alignSelfStretch c_border_right"></span>
					<span class="c_bold iconLabel c_pointer" style="width:25px;text-align: center;" @click="$router.push({path: `/${username}/${repoName}/watchers`})">{{repo.watchers}}</span>
				</div>
				<div class="c_flexRow c_white_bg whiteBlockIcon c_margin-right6 c_gray_txt c_pointer">
					<img src="~img/src/icon/赞.svg" style="width:16px;" alt="" class="c_pointer" @click="star" />
					<span style="margin-left:8px;margin-right: 8px;" @click="star" class="c_pointer">{{repo && repo.is_staring?'取消点赞':'点赞'}}</span>
					<span style="margin-left:15px;" class="alignSelfStretch c_border_right"></span>
					<span class="c_bold iconLabel c_pointer" style="width:25px;text-align: center;" @click="$router.push({path: `/${username}/${repoName}/stars`})">{{repo.stars}}</span>
				</div>
				<div class="c_flexRow c_white_bg whiteBlockIcon c_gray_txt c_pointer">
					<img src="~img/src/icon/派生.svg" style="width:16px;" alt="" class="c_pointer" @click="routerDerive" />
					<span @click="routerDerive" class="c_pointer">派生</span>
					<span style="margin-left:15px;" class="alignSelfStretch c_border_right"></span>
					<span class="c_bold iconLabel c_pointer" style="width:25px;text-align: center;" @click="$router.push({path: `/${username}/${repoName}/forks`})">{{repo.forks}}</span>
				</div>

			</div>
		</div>

		<store-tab :tab="tab" @update:tab="updateTab" :issuesEnable="repo.enable_issues" :pullsEnable="repo.enable_pulls && repo.is_mirror === false" :wikiEnable="repo.enable_wiki" :isAdminOrOwner="(repo.permissions && repo.permissions.admin == true) || repo.owner.username == self.username" v-show="repo.is_bare === false">
			<div v-if="tab==0">
				<div v-show="showLabel=='repoIndex' || showLabel=='repoBranch' || showLabel=='fileDetail'">
					<div class="c_white_bg c_padding c_paddingV" style="">
						<div class="c_bold ft16">{{ repo.description }}</div>
						<div class="cBigMargin c_flexRow lineItemCnt">
							<div class="c_flexRow lineItem c_pointer" @click="goSubTab(0)">
								<img src="~img/src/icon/历史版本.svg" alt="" />
								<span class="c_bold"> {{commits_count}} </span>
								<span class="c_bold">提交历史</span>
							</div>
							<div class="c_flexRow lineItem c_pointer" @click="goSubTab(1)">
								<img src="~img/src/icon/合并请求.svg" alt="" />
								<span class="c_bold"> {{repo.branches_count}} </span>
								<span class="c_bold">代码分支</span>
							</div>
							<div class="c_flexRow lineItem c_pointer" @click="goSubTab(2)">
								<img src="~img/src/icon/版本发布.svg" alt="" />
								<span class="c_bold"> {{repo.tags_count}}</span>
								<span class="c_bold">版本发布</span>
							</div>
						</div>
						<div class="cBigMargin c_flexRow c_gray_txt ft14">
							<div class="c_flexRow">
								<div class="c_green_bg c_border_rad3 lineBTH c_pointer" @click="createPull" style="width:38px;padding:12px;margin-right: 10px;">
									<img src="~img/src/分支_白色.svg" alt="" />
								</div>
								<!-- <div class="c_green_bg c_border_rad3 lineBTH c_pointer" @click="$router.push({path:`/${username}/${repoName}/pulls`})" style="width:38px;padding:12px;margin-right: 10px;">
									<img src="~img/src/分支_白色.svg" alt="" />
								</div> -->
								<div class="c_flexRow lineBTH c_border c_pointer c_relative" style="padding:0 35px;" @click="showBranchesWin">
									<img src="~img/src/icon/分支.svg" style="width:16px;" alt="" />
									<span>分支: {{branchName}} <img style="width:8px;margin-bottom:2px;" src="~img/src/多层级_下.svg" alt="" /></span>
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
								<input class="c_border lineBTH c_gray_txt ft14" readonly id="repo-clone-url" :value="subDownTab?repo.ssh_url:repo.html_url" type="text" style="width:210px;margin-right: 15px;" />
								<button class="c_border lineBTH c_flexRow c_flexRowCenter clipboard ui basic icon button poping up " data-success="复制成功" data-error="复制失败" data-original="复制链接" data-variation="inverted tiny" id="repo-copy-bt" data-clipboard-target="#repo-clone-url" type="button" style="margin-left:16px;width:40px;"><img src="~img/src/复制.svg" alt="" /></button>
								<button class="c_border lineBTH c_flexRow c_flexRowCenter" type="button" style="width: 40px;"><img src="~img/src/下载.svg" alt="" /></button>
							</div>
						</div>
						<!-- 最近一次提交 -->
						<div class="cBigMargin c_border c_gray_txt" style="margin-bottom: 10px;">
							<!-- 文件列表 -->
							<div v-if="is_dir">
								<div class="c_flexRow flexStart fileListItemHeader c_bottom_line">
									<img @click="commits.author.id > 0 && toCenter(commits.author.username)" :src="commits.author && commits.author.avatar_url" class="c_hd_img cursor" alt="" style="width: 26px;margin-right:10px;" />
									<span @click="commits.author.id > 0 && toCenter(commits.author.username)" class="c_blue_color c_bold cursor">{{commits.author.full_name}}</span>
									<span @click="routerCodeDetail(commits.id)" class="c_gray_label c_textEllipsis ft12 cursor" style="width: 93px;margin-right: 15px;margin-left: 15px;">{{commits.id}}</span>
									<span class="c_flexOne" style="color:#465364">{{commits.message}}
									</span>
									<span class="ft12">{{commits && $distanceInWords(commits.created)}}</span>
								</div>
								<!-- 文件列表 -->
								<div class="c_flexRow fileListItem c_bottom_line" v-for="(item,index) in files">
									<img src="~img/src/list/文件.svg" v-show="!item.is_dir" alt="" />
									<img src="~img/src/list/文件夹.svg" v-show="item.is_dir" alt="" />
									<span @click="routerFileDetail(item)" class="c_blue_color cursor" style="width: 300px;">{{item.name}}</span>
									<span @click="routerCodeDetail(item.commit.id)" class="c_gray_label c_textEllipsis ft12 cursor" style="width: 93px;margin-right: 15px;">{{item.commit.id}}</span>
									<span class="c_flexOne" style="color:#465364">
									{{item.commit && item.commit.message}}
									</span>
									<span class="ft12">{{item.commit && $distanceInWords(item.commit.created)}}</span>
								</div>
							</div>
							<!-- 文件详情 -->
							<div class="c_padding  c_white_bg" v-else>
								<div style="height: 60px;color: #1a1a1a" class="c_bold c_bottom_line ft16 c_flexRow right-action">
									<!-- 文件名 -->
									<div class="file-name">{{filename}}</div>
									<!-- 其他操作：永久链接，历史文件，原始文件， 修改删除 -->
									<div class="other-action">
										<div class="action-item">
											<span class="c_pointer" @click="routerForever()">永久链接</span>
											<span class="c_pointer" @click="routerPushHistory()">历史文件</span>
											<span class="c_pointer" @click="routerRaw()">原始文件</span>
										</div>
										<div class="action-item"></div>
									</div>
								</div>
								<!-- 代码高亮 -->
                                <div class="repository file list">
                                    <div id="file-content" class="tab-size-8">
                                        <div class="ui attached table segment">
                                            <div :id="{'': fileData.is_ipython_notebook === false,'ipython-notebook': fileData.is_ipython_notebook === true}" :class="{'file-view': true, 'markdown': fileData.is_markdown, 'plain-text': fileData.readme_exists, 'ipython-notebook1': fileData.is_ipython_notebook, 'code-view': fileData.is_text, 'has-emoji': true}">
                                                <div v-html="rawContent" v-show="fileData.is_markdown===true || fileData.readme_exists===true"></div>
                                                <table class="table-code-highlight" v-show="fileData.is_text === true && fileData.is_too_large === false && fileData.is_markdown===false && fileData.readme_exists===false">
                                                    <tbody>
                                                        <tr>
                                                            <td class="lines-num" v-html="fileData.line_nums">
                                                            </td>
                                                            <td class="lines-code">
                                                                <pre>
                                                                    <code id="code"  :class="fileData.highlight_class"><ol class="linenums" v-html="fileData.content"></ol></code>
                                                                </pre>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div class="view-raw ui center" v-show="fileData.is_text === false">
                                                    <img :src="rawLink" v-show="fileData.is_image">
                                                    <video controls :src="rawLink" v-show="fileData.is_video">
                                                        <strong>浏览器不支持视频</strong>
                                                    </video>
                                                    <iframe width="100%" height="600px" :src="'/plugins/pdfjs-1.4.20/web/viewer.html?file='+rawLink"></iframe>
                                                    <a :href="rawLink" rel="nofollow" class="btn btn-gray btn-radius">查看源文件</a>
                                                </div>
                                                <table v-show="fileData.is_too_large">
                                                    <tbody>
                                                    <tr>
                                                        <td><strong>文件过大，不支持在线预览</strong></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
							</div>
						</div>
					</div>
					<!-- 仓库首页md -->
					<div v-if="showLabel=='repoIndex'" class="c_padding  c_white_bg" style="margin-top:10px; padding-bottom: 22px;">
						<div style="height: 60px;" class="c_bold c_bottom_line ft16 c_flexRow">
							README.md
						</div>
						<div style="color:#475669;" v-html="readmeData.content"></div>
					</div>

				</div>
				<router-view v-show="showLabel!='repoIndex' && showLabel!='repoBranch' && showLabel!='fileDetail'"></router-view>
			</div>
			<!--设置-->
			<div v-if="tab!=0">
				<router-view></router-view>
			</div>

		</store-tab>
        <div class="c_white_bg c_padding c_paddingV" v-show="repo.is_bare === true">
            <div class="c_flexRow c_bottom_line" style="padding-bottom: 20px;">
                <div class="ft16 c_blue_color c_flexRow">
                    <img src="~img/src/icon/帮助.svg" style="width:20px;margin-right: 10px;" alt="" />
                    <span>快速帮助</span>
                </div>
                <div class="c_flexRow c_darkGray_text">
                    <img src="~img/src/icon/设置.svg" class="c_margin-right10" style="width:20px;" alt="" />
                    <span>仓库设置</span>
                </div>
            </div>
            <div class="c_flexRow">
                <div class="c_block_margin">
                    <span class="c_bold c_margin-right10">克隆当前仓库</span>
                    <span class="c_margin-right10 ft13">不知道如何操作?</span>
                    <span class="c_blue_color ft13" style="text-decoration: underline;">查看帮助</span>
                </div>
            </div>
            <div class="c_flexRow">
                <div class="c_flexRow c_bottom_line" style="padding-bottom: 40px;">
                    <div class="c_flexRow">
                        <button class="c_border lineBTH c_pointer" :class="{c_border_blue:subDownTab==0,c_blue_color:subDownTab==0,c_gray_txt:subDownTab!=0}" style="width:73px;" type="button" @click="changeDownLoadTab(0)">HTTPS</button>
                        <button class="c_border lineBTH c_pointer" :class="{c_border_blue:subDownTab==1,c_blue_color:subDownTab==1,c_gray_txt:subDownTab!=1}" style="width:63px;" @click="changeDownLoadTab(1)" type="button">SSH</button>
                    </div>
                    <div class="c_flexRow">
                        <input class="c_border lineBTH c_flexOne c_gray_txt ft14" readonly id="repo-clone-url" :value="subDownTab?repo.ssh_url:repo.html_url" type="text" />
                        <button class="c_border lineBTH c_flexRow c_flexRowCenter clipboard ui basic icon button poping up " data-success="复制成功" data-error="复制失败" data-original="复制链接" data-variation="inverted tiny" id="repo-copy-bt" data-clipboard-target="#repo-clone-url" type="button" style="width:40px;"><img src="~img/src/复制.svg" alt="" /></button>
                    </div>
                </div>
            </div>
            <div class="c_flexRow">
                <div class="c_block_margin c_bold">命令行创建一个新仓库</div>
            </div>
            <div class="c_flexRow">
                <div class="c_gray_bg c_padding c_paddingV c_darkGray_text ft13" style="margin-bottom: 40px;">
                    touch README.md<br> git init<br> git add README.md<br> git commit -m "first commit"<br> git remote add origin {{calURL}}<br> git push -u origin master<br>
                </div>
            </div>
            <div class="c_flexRow">
                <div class="c_block_margin c_bold">命令行推送已经创建的仓库</div>
            </div>
            <div class="c_flexRow">
                <div class="c_gray_bg c_padding c_paddingV c_darkGray_text ft13">
                    git remote add origin {{calURL}}<br> git push -u origin master
                </div>
            </div>
        </div>
	</div>
</template>
<script src="/plugins/marked-0.3.6/marked.min.js"></script>
<script src="/plugins/notebookjs-0.2.6/notebook.min.js"></script>
<script type="text/javascript">
	import StoreTab from '@/comp/storeTab'
	import MenuList from '@/comp/menuList'
    import Highlight from '@/highlights/index'
    import Vue from 'vue'

	export default {
		data() {
			return {
				tab: 0,
				self: {},
				showLabel: '',
				// showHistory: false,
				subDownTab: 0,
				repo: {
				    owner: {},
                    permissions: {}
                },
				showBranches: false,
				currentBranch: {},
				branches: [],
				files: [], //显示的文件
				commits: {
				    author: {}
                }, //最近一次提交记录
				fileIndex: 0, //显示文件在第几层，默认为第一层
				fileData: {},
				readmeData: {},
				user:'',
				path: '',
				is_dir: true,
				branchName: '',
				currentRoute: this.$router.currentRoute.fullPath,
				filename: '',
				commits_count: 0,
                rawLink: '',
				rawContent: '',
				allowPulls: true,
				baseRepo: {},
				headRepo: {}
			}
		},
		methods: {
			// 合并请求
			createPull() {
				this.$router.push({path:`/${this.baseRepo.owner.username}/${this.baseRepo.name}/pulls/compare/${this.baseRepo.default_branch}...${this.headRepo.owner.username}:${this.headRepo.name}`})
			},
			// 跳转到提交历史
			routerPushHistory() {
			    if (this.path.substring(0,1) != '/') {
                    this.path = '/' + this.path;
                }
				this.$router.push({path: `/${this.username}/${this.repoName}/commits/${this.branchName}${this.path}`})
			},
			// 跳转到永久
            routerForever() {
                if (this.path.substring(0,1) != '/') {
                    this.path = '/' + this.path;
                }
                this.$router.push({path: `/${this.username}/${this.repoName}/src/${this.commits.id}${this.path}`})
            },
            // 跳转到RAW
            routerRaw() {
                if (this.path.substring(0,1) != '/') {
                    this.path = '/' + this.path;
                }
                window.location.href = `/${this.username}/${this.repoName}/raw/${this.branchName}${this.path}`
            },
			// 跳转到首页
			toCenter(username) {
				if(username === this.$getSelf().username) {
					this.$router.push('/');
				} else {
					// 其他人的首页
					this.$router.push({path: `/${username}`});
				}
			},
			// 提交页面
			routerCodeDetail(id) {
				this.$router.push({path: `/${this.username}/${this.repoName}/commit/${id}`});
			},
			// 文件详情页面
			routerFileDetail(item) {
				// 是否为文件夹
				this.is_dir = item.is_dir;
				this.filename = item.name;
				this.path += '/' + encodeURIComponent(item.name);
				if (this.path.substring(0,1) != '/') {
				    this.path = '/' + this.path;
				}
				this.$router.push({path: '/' + this.username + '/' + this.repoName + '/src/' + this.branchName + this.path, query: {is_dir: this.is_dir}});
			},
			routerDerive() {
				let owner = this.repo.owner
				if(this.self.id == owner.id) {
					InfoMsg.warn('不能派生自己的仓库')
					return;
				}

				this.$router.push({
					path: '/repo/fork/' + owner.username + '/' + this.repo.name
				})
			},

			updateTab(tab) {
				if(tab == 0) {
					//this.showLabel='main'
					this.$router.push({
						path: `/${this.username}/${this.repoName}`
					})
				} else if(tab == 1) { //工单管理
				    if (this.repo.enable_external_tracker === true) {
				        window.location.href = this.repo.external_tracker_url
                    } else {
                        this.$router.push({
                            path: `/${this.username}/${this.repoName}/issues`
                        })
                    }
				} else if(tab == 2) { //合并请求
					this.$router.push({
						path: `/${this.username}/${this.repoName}/pulls`
					})
				} else if(tab == 3) { //wiki
				    if (this.repo.enable_external_wiki === true) {
				        window.location.href = this.repo.external_wiki_url
                    } else {
                        this.$router.push({
                            path: `/${this.username}/${this.repoName}/wiki`
                        })
                    }
				} else if(tab == 4) { //设置
					this.$router.push({
						path: `/${this.username}/${this.repoName}/setting`
					})
				}

			},
			showView(name) {
				//子view 里面还有view 需要被忽略的路由，不需要错误消息
				let ignoreMap = {
					filechangepage: 0,
					codesubmitpage: 0,
					mergerequestindex: 0,
					stars: 0,
					forks: 0,
					watchers: 0
				}
				if(isStrEmpty(name)) {
					InfoMsg.warn('view name is empty')
					return;
				}
				this.showLabel = name

				if(name == 'repoIndex') { //仓库主页
					this.tab = 0
				} else if(name == 'commits' || name == 'commitsFile') { //提交历史
					this.tab = 0
				} else if(name == 'commit') { //提交历史
                    this.tab = 0
                } else if(name == 'repoBranch') { //仓库某个分支
                    this.tab = 0
                } else if(name == 'fileDetail') { // 某个文件详情和目录列表
                    this.tab = 0
				} else if(name == 'branches') { //分支
					this.tab = 0
				} else if(name == 'releases') { //版本
					this.tab = 0
				} else if(name == 'repoIssues'  || name == 'wareMilestones') { //工单管理
					this.tab = 1
				} else if(name == 'issueDetail') { //工单详情
                    this.tab = 1
                } else if(name == 'createIssue') { //新建工单
                    this.tab = 1
                } else if(name == 'createMilestones') { //新建里程碑
                    this.tab = 1
				} else if(name == 'milestones') { //里程碑
					this.tab = 1
				} else if(name == 'repoLabels') { //标签
					this.tab = 1
                } else if(name == 'repoPulls' || name == 'createPulls' || name=="mergeList" || name=="mergeDetail" || name=="fileChangePage" || name=="codeSubmitPage") { //合并请求
					this.tab = 2
				} else if(name == 'pullsDetail') { //合并请求
					this.tab = 2
				} else if(name == 'codedetailpage') { //代码详情
					this.tab = 2
				} else if(name == 'createWiki' || name == 'repoWiki' || name == 'editWiki' || name == 'wikiDetail') { //创建wiki 文件
					this.tab = 3
				} else if(name == 'wiki') {
					this.tab = 3
                } else if(name == 'repoSetting') { //仓库设置
					this.tab = 4
				} else if(!(name in ignoreMap)) {
				    console.log(name)
					InfoMsg.warn('no router name found')
				}
			},
			goSubTab(index) {
				switch(index) {
					case 0: // 提交历史记录
						this.$router.push({
							path: `/${this.username}/${this.repoName}/commits/${this.branchName}`
						})
						break;
					case 1:
						this.$router.push({
							path: `/${this.username}/${this.repoName}/branches`
						})
						break; //代码分支
					case 2:
						this.$router.push({
							path: `/${this.username}/${this.repoName}/releases`
						})
						break; //版本发布
					default:
						break;
				}
			},
			watch() { //关注
				let action = 'watch';
				if(this.repo.is_watching) action = 'unwatch';
				axios.post(this.ownerRep + '/action', {
					action: action
				}).then(resp => {
					this.reloadStoreInfo()
				}).catch(err => Err(err))
			},
			star() { //点赞
				let action = 'star';
				if(this.repo.is_staring) action = 'unstar';
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
				this.currentBranch = item
				this.showBranches = false
				this.branchName = item.name
				this.$router.push({
				    path: `/${this.username}/${this.repoName}/src/${item.name}`
				})
			},
			reloadStoreInfo() {
				axios.get(this.ownerRep).then(resp => {
					this.repo = resp.data;
					// console.log('reloadstoreinfo>>>>',this.repo)
					// 更新全局数据
					//localStorageEx.set('storeItem', this.repo);
				}).catch(err => Err(err))
			},
			// 获取最新提交记录
			getLatestCommit() {
				if(this.branchName == null) {
					InfoMsg.warn('branch name is empty')
					return;
				}
				axios.get(`repos/${this.username}/${this.repoName}/${this.branchName}/latest/commit`).then(resp => {
					this.commits = resp.data
					this.commits_count = resp.data.commits_count;
				}).catch(err => Err(err))
			},
			getReadMeData(ownerRep) {
			    if (this.$route.name === 'repoIndex') {
                    if (this.branchName == null) throw 'branch name is empty';
                    axios.get(ownerRep + '/branches/' + this.branchName + '/get?path=/README.md').then(resp => {
                        this.readmeData = resp.data
                    }).catch(err => Err(err))
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
					that.repo = repo;
					that.initCanPulls();
                    if (that.branchName == '' || typeof(that.branchName) == 'undefined') {
                        that.branchName = repo.default_branch
                    }
                    if (repo.is_bare) {
                        that.branches = [];
                        that.branchName = '';
                        that.currentBranch = {};
                        return;
                    }
                    //get store basic info
                    var ownerRep = '/repos/' + that.username + '/' + that.repoName;
                    that.ownerRep = ownerRep

                    //get branches
                    axios.get(ownerRep + '/branches').then(resp => {
                        that.branches = resp.data.branches
                        if (that.branchName) {
                            that.branches.forEach(item => {
                                if(item.name == that.branchName) {
                                    that.currentBranch = item
                                }
                            })
                        } else {
                            that.currentBranch = that.branches[0] || {};
                            that.branchName    = that.currentBranch.name || 'master';
                            // console.log(that.branchName)
                        }
                        that.getReadMeData(ownerRep)
                        // 获取分支最新一次提交
                        that.getLatestCommit();
                        //get file list
                        // 如果在某个目录下，用户主动重载页面，这时需要重新获取目录或文件
                        let reqUrl = '';
                        if (that.is_dir === true) {
                            // 获取目录
                            reqUrl = `/repos/${that.username}/${that.repoName}/branches/${that.branchName}/list`;
                        } else {
                            // 获取文件内容
                            reqUrl = `/repos/${that.username}/${that.repoName}/branches/${that.branchName}/get`;
                        }
                        let params = {	//参数
                            owner: that.username,
                            repo: that.repoName,
                            branch: that.branchName,
                            path: `/${that.path}`
                        };
                        // console.log('>>>>>>>>>>', that.is_dir, that.path, reqUrl)
                        return axios.get(reqUrl, that.is_dir && that.path === '' ? {} : {
                            params: params
                        })
                    }).then(resp => {
                        var entries = resp.data.entries
                        // 获取目录
                        if(that.is_dir) {
                            that.files = resp.data.entries;
                        } else {
                            // 获取文件详情
                            that.fileData = resp.data;
                            if (that.path.substring(0,1) != '/') {
                                that.path = '/' + that.path;
                            }
                            that.rawLink = `/${that.username}/${that.repoName}/raw/${that.branchName}${that.path}`;
                            if (that.fileData.is_ipython_notebook) {
                                var rendered = null;
                                $.getJSON(that.rawLink, null, function(notebook_json) {
                                    var notebook = nb.parse(notebook_json);
                                    rendered = notebook.render();
                                    $("#ipython-notebook").append(rendered);
                                    $("#ipython-notebook code").each(function(i, block) {
                                        $(block).addClass("py").addClass("python");
                                        Highlight.highlightBlock(block);
                                    });

                                    $("#ipython-notebook .nb-markdown-cell").each(function(i, markdown) {
                                        $(markdown).html(marked($(markdown).html()));
                                    });
                                });
                            }
                            if (that.fileData.is_markdown===true || that.fileData.readme_exists===true) {
                                that.rawContent = that.fileData.content;
                            }
                            that.$nextTick(function() {
                                Highlight.highlightCode();
                            });
                        }
                    }).catch(err => Err(err))
                });
                this.showView(this.$route.name)
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
		computed: {
			urlStatus()  {
				return localStorageEx.get('urlstatus');
			},
			routerParams() {
				return this.$router.currentRoute.params[0];
			},
			calURL() {
                return this.subDownTab ? this.repo.ssh_url : this.repo.html_url
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
            this.branchName = this.$route.params.branchName
            this.path = this.$route.params.uri
            this.is_dir = this.$route.query.is_dir
            if (this.is_dir === 'false') {
                this.is_dir = false;
            } else if(this.is_dir === 'true') {
                this.is_dir = true;
            }
            if (typeof(this.path) == 'undefined') {
                this.path = '';
                this.is_dir = true;
            }
			this.initData();
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
		    // 登录用户
            this.self = this.$getSelf()
            this.username = to.params.username
            this.repoName = to.params.repoName
            this.branchName = to.params.branchName
            this.path = to.params.uri
            this.is_dir = to.query.is_dir
            if (this.is_dir === 'false') {
                this.is_dir = false;
            } else if(this.is_dir === 'true') {
                this.is_dir = true;
            }
            if (typeof(this.path) == 'undefined') {
                this.path = '';
                this.is_dir = true;
            }
            this.initData();
			this.showView(to.name)
			next()
		}

	}
</script>

<style lang="scss" scoped>
	@mixin flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	// 最近一次提交代码页，右侧操作区
	.right-action {
		@include flex-between();
		.other-action {
			@include flex-between();
			.action-item {
				@include flex-between();
				&:first-child {
					width: 230px;
				}
				height: 32px;
				>span {
					cursor: pointer;
					display: inline-block;
					width: 33%;
					height: 100%;
					font-size: 13px;
					line-height: 32px;
					text-align: center;
					color: #576373;
					background-color: #F4F5F9;
				}
			}
		}
	}
	// 代码行号
	.lines-num {
		vertical-align: top;
		text-align: right;
		color: #999;
		background: #f5f5f5;
		width: 1%;
		padding: 0;
		>span {
			
		}
	}
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
		padding: 0 0 0 22px;
		box-shadow: 0 2px 6px 0 rgba(71, 86, 105, 0.02);
		border-radius: 2px;
		min-width: 121px;
		font-size: 12px;
		height: 40px;
	}
	
	.iconLabel {
		color: #19222E;
		font-size: 13px;
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
		padding: 2px 6px;
		height: 36px;
	}
</style>