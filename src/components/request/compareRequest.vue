<template>
	<div class="c_white_bg c_padding c_paddingV">

		<!-- 基准分支...对比分支 -->
		<div class="c_darkGray_text">
			<div class="ft26 c_bold">对比文件变化</div>
			<div class="ft12" style="margin-top:7px;">对比两个分支间的文件变化并发起一个合并请求。</div>
		</div>
		<div class="c_block_margin c_flexRow flexStart">
			<img src="~img/src/合并请求.svg" style="margin-right: 20px;width:20px;" alt="" />
			<div class="c_select_style c_margin-right10" style="padding: 0">
				<div class="menu-list">
                    <!-- 下拉选项 -->
                    <el-dropdown style="width:100%;" trigger="click" @command="selectBase" placement="bottom-start">
                        <span class="el-dropdown-link" style="display:inline-block;height:100%;width:100%;padding: 0 20px;">
                            基准分支: {{params.base_branch }} 
                        </span>
                        <!-- 选项 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in branches" :command="item" :key="'tag-'+item.id">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
			</div>
			<span class="c_margin-right10">...</span>
			<div class="c_select_style c_margin-right10" style="padding: 0">
				<!-- 下拉选项 -->
                    <el-dropdown style="width:100%" trigger="click" @command="selectHead" placement="bottom-start">
                        <span class="el-dropdown-link" style="display:inline-block;height:100%;width:100%;padding: 0 20px;">
                            对比分支: {{ params.head_branch }} 
                        </span>
                        <!-- 选项 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in headBranches" :command="item" :key="'tag-'+item.id">
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
			</div>
		</div>

		<!-- 评论 -->
		<div class="c_flexRow alignItemStart" v-if="commits.length > 0">
			<div class="mrLeft">

				<div class="mrLeftItem c_border c_border_rad3">

					<!-- 这里没有评论 -->
					<!-- <div class="c_flexRow flexStart">
						<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+require('img/headImg/nv06.jpg')+')',marginRight:'14px'}"></div>
						<div><span class="c_blue_color c_margin-right4">小猫咪</span><span class="c_gray_txt ft12">3天前</span></div>
						<div class="c_flexOne"></div>
						<div>
							<img src="~img/src/编辑.svg" class="c_wh20 smallIconImg" alt="" />
							<img src="~img/src/删除.svg" class="c_wh20 smallIconImg" alt="" />
						</div>

						</div>
						<div style="margin-left:60px;">
						<div>
							本质上，品质生活可能意味着你要多花些钱。因为中国人之前用的一些家居生活用品，确实多数偏低端。而你想要更好的，往往更贵。 除了铸铁锅，我第二个想到的厨房消费升级产品是菜板
						</div>
						<div class="upImgCnt c_flexRow flexStart">
							<img src="~img/headImg/nv07.jpg" v-for="n in 1" class="upImg" alt="" />
						</div>
					</div> -->

					<!-- 编辑框 -->
					<div class="editPanel c_border">
						<div class="c_flexRow flexStar box-padding" style="margin:15px 0;padding: 0 10px;justify-content:flex-start">
							<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+self.avatar_url+')',marginRight:'14px'}"></div>
							<div>
								<span class="c_blue_color c_margin-right4">{{self.full_name}}</span>
							</div>
						</div>
						<!-- tab页签 -->
						<div class="editHeader c_bottom_line c_flexRow flexStart alignItemStrecth">
							<div :class="['panelTabItem', 'cursor', {'active': isActive}]" @click="isActive=true">编辑内容</div>
							<div :class="['panelTabItem', 'cursor', {'active': !isActive}]" @click="isActive=false">预览效果</div>

						</div>
						<div class="edit-box">
							<!-- 标题 -->
							<div class="title-box" v-if="isActive">
								<input class="title" type="text" placeholder="标题" v-model="params.title"/>
							</div>
							<!-- 内容 -->
							<textarea id="iptTextarea" v-if="isActive" class="c_gray_txt" v-model="params.body" placeholder="请说说你的想法"></textarea>
							<div class="preview-box" v-else v-html="params.body"></div>
						</div>

						<div style="width:800px;margin: auto;">
							<el-upload v-show="attaShow"
								class="upload-demo"
								drag
								:action=attachUrl
								:limit=parseInt(attachSetting.max_files) 
								:on-exceed="AttaExceed"
								:before-upload="AttaBeforeUpload"
								:on-preview="AttaPreview"
								:on-remove="AttaRemove"
								:on-success="AttaSuccess"
								:file-list=attachFilelist

								multiple
							>
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
								<div class="el-upload__tip" slot="tip">文件最多能上传{{this.attachSetting.max_files}}件，且单个文件不超过{{this.attachSetting.max_size}}M
											,允许的文件格式:{{this.attachSetting.allow_types}}</div>
							</el-upload>
							<div class="c_paddingV">
								<button type="button" class="ui-btn btn-green" @click="createMergeRequest">创建合并请求</button>
							</div>

						</div>

					</div>
				</div>

			</div>

			<!-- 标签，里程碑，指派人员 -->
			<div class="mrRight c_border c_border_rad3 flex-right">

				<!-- 选择标签 -->
                <div class="menu-list">
                    <strong>标签</strong>
                    <!-- 下拉选项 -->
                    <el-dropdown v-if="tags.length>0" trigger="click" @command="selectTag" placement="bottom-start" :hide-on-click="false">
                        <span v-if="params.labels.length < 1" class="el-dropdown-link">
                            未选择标签
                        </span>
                        <!-- 已选的 -->
                        <span v-else class="el-dropdown-link flex-column">
                            <span class="el-dropdown-link" v-for="item in labels" :key="'labels-'+item.id">
                                <span class="tag-color" :style="{backgroundColor:item.color}"></span>
                                <span>{{ item.name }}</span>
                            </span>
                        </span>
                        <!-- 选项 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in tags" :command="item" :key="'tag-'+item.id">
                                <span class="tag-color" :style="{backgroundColor:item.color}"></span>
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
				<!-- 里程碑 -->
                <div class="menu-list">
                    <strong>里程碑</strong>
                    <!-- 下拉选项 -->
                    <el-dropdown v-if="milestones.length>0" trigger="click" @command="selectMilestones" placement="bottom-start">
                        <span v-if="params.milestone < 0" class="el-dropdown-link">
                            未选里程碑
                        </span>
                        <!-- 已选的 -->
                        <span v-else class="el-dropdown-link">
                            {{ tempMilestones.title }}
                        </span>
                        <!-- 选项 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in milestones" :command="item" :key="'milestones-'+item.id">
                                {{ item.title }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
				<!-- 指派成员 -->
                <div class="menu-list">
                    <strong>指派成员</strong>
                    <!-- 下拉选项 -->
                    <el-dropdown v-if="assignees.length>0" trigger="click" @command="selectAssignee" placement="bottom-start">
                        <span v-if="params.assignee == ''" class="el-dropdown-link">
                            未指派成员
                        </span>
                        <!-- 已选的 -->
                        <span v-else class="el-dropdown-link">
                            {{ params.assignee.full_name }}
                        </span>
                        <!-- 选项 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in assignees" :command="item" :key="'assignees-'+item.id">
                                {{ item.full_name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

				<!-- <div class="mrRightItem">
					<div class="c_bold">15名参与者</div>
					<div class="c_block_margin">
						<div class="c_hd_img c_wh36 mrHDIcon" v-for="n in 12" :style="{backgroundImage:'url('+require('img/headImg/nv03.jpg')+')'}"></div>
					</div>
				</div> -->

			</div>
		</div>
		<div style="padding: 1rem;border: 1px solid rgba(34,36,38,.15);border-radius: .25rem;" v-else>基准和对比分支代码已经同步，无需进行对比。</div>

		<!-- 代码提交记录 -->
		<div style="margin-top: 10px;" class="c_border c_border_rad3" v-if="commits.length > 0">
			<div class="c_flexRow flexStart c_gray_bg c_bottom_line  fileListItem c_right_margin">
				<span class="c_bold">次代码提交</span>
				<div class="c_gray_label c_green_label c_textEllipsis" style="width:93px;">{{ committeruid }}</div>
				<span>...</span>
				<div class="c_gray_label c_green_label c_textEllipsis" style="width:93px;" @click="routerCodeDetail(committerSha1)">{{ committerSha1}}</div>
			</div>

			<div class="c_flexRow fileListItem c_bottom_line c_color_initial">
				<span class="" style="width: 340px;">作者</span>
				<span class="" style="width: 93px;margin-right: 15px;">SH1</span>
				<span class="c_flexOne" style="color:#465364">备注</span>
				<span>提交日期</span>
			</div>
			<!--<div class="c_flexRow fileListItem c_bottom_line" v-for="n in 9">
				<div class="c_hd_img c_wh20 c_margin-right10" :style="{backgroundImage:'url('+require('img/headImg/nv07.jpg')+')'}"></div>
				<span class="c_blue_color" style="width: 300px;">src</span>
				<span class="c_gray_label c_textEllipsis" style="width: 93px;margin-right: 15px;">3sdfsd23239</span>
				<span class="c_flexOne" style="color:#465364">
							First working version
						</span>
				<span>3天前</span>
			</div>-->
			<div class="c_flexRow c_fileListItem c_bottom_line" v-for="item in commits">
				<div class="c_hd_img c_wh20 c_margin-right10" :style="{backgroundImage:'url('+item.author.avatar_url+')'}"></div>
				<span class="c_blue_color" style="width: 300px;">{{item.author.full_name}}</span>
				<span class="c_gray_label c_textEllipsis c_pointer" @click="routerCodeDetail(item)" style="width: 93px;margin-right: 15px;">{{item.id}}</span>
				<span class="c_flexOne" style="color:#465364">
							{{item.message}}
						</span>
				<span>{{$distanceInWords(item.created)}}</span>
			</div>

		</div>

		<!-- 差异对比 -->
		<div class="c_white_bg c_padding" v-if="diff.files && diff.files.length > 0">
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
						<div class="ui-btn-simple c_border_rad3" @click="viewFile(commits[0].id, file.name)">查看文件</div>
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

</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0,

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

				tags: [],
				milestones: [],
				assignees: [],

				tempMilestones: '',

				showStatic: false,
				viewShowType: 0, //0 合并显示,1 分列显示
                // baseRepo
                repo: {},
                mergeItem: {},
                // base branches
                branches: [],
                // head branches
                headBranches: [],
                headRepo: {},

				committeruid: '',
				committerSha1: '',

				diff: {},
				commits:[],//代码提交列表

				isActive: true,

				// 图片上传相关
				imgUrl: window.domains.apiDomain+"/attachments/",
                attachSetting:{},
                attachUrl:window.domains.apiDomain+"/releases/attachments",
                attachFiles:[],
                attachFilelist:[],
				attaShow:true,

			}
		},
		methods: {
			// 文件详情
			viewFile(index, name) {
				this.$router.push({path: `/${this.username}/${this.repoName}/src/${index}/${name}?is_dir=false`});
			},
			 // 选择标签
			selectTag(params) {
				// 如果已经存在就不添加了
				!this.params.labels.some(item => item.id == params.id) && this.params.labels.push(params);
				console.log(this.params.labels)
			},
			// 选择里程碑
			selectMilestones(params) {
				this.params.milestone = params.id;
				this.tempMilestones = params;
				console.log(params)
			},
			// 指派成员
			selectAssignee(params) {
				this.params.assignee = params;
			},
			loadLabels() {
				axios.get('/repos/' + this.params.owner + '/' + this.params.repo + '/labels').then(resp => {
					this.tags = resp.data.labels
				}).catch(err => Err(err))
			},
			loadMilestone() {
				axios.get('/repos/' + this.params.owner + '/' + this.params.repo + '/milestones').then(resp => {
					this.milestones = resp.data.milestones
				}).catch(err => Err(err))
			},
			loadAssignees() {
				axios.get('/repos/' + this.params.owner + '/' + this.params.repo + '/assignees').then(resp => {
					this.assignees = resp.data.users
				}).catch(err => Err(err))
			},
			// 选择对比分支
			selectHead(item) {
				this.params.head_branch = item.name;
				this.getCommitAndDiff();
			},
			// 选择基准分支
			selectBase(item) {
				this.params.base_branch = item.name;
				this.getCommitAndDiff();
			},
			// 创建合并请求
			createMergeRequest() {
				console.log('>>>>>>>>', this.params)
				axios.post(`/repos/${this.params.owner}/${this.params.repo}/pr/create`, this.params).then(resp => {
					let data = resp.data;
					this.$router.replace({
						path: `/${this.params.owner}/${this.params.repo}/pulls/${data.index}`
					})
				})
			},
			getCommitAndDiff() {
				this.getDiff();
				this.getCommits();
			},
			calLineType(line) {
				let type = -1;
				if(line.left_idx == 0 && line.right_idx == 0) type = 0; //tags
				else if(line.left_idx == 0 && line.right_idx > 0) type = 1; //add
				else if(line.left_idx > 0 && line.right_idx == 0) type = 2; //deletion
				else if(line.left_idx == line.right_idx && line.left_idx > 0) type = 3 //same

				return type;
			},
			routerCodeDetail(item) {
				this.$router.push({path: `/${this.params.owner}/${this.params.repo}/commit/${item.id}`})
			},
			getBranches() {
				axios.get(`/repos/${this.params.owner}/${this.params.repo}/branches`).then(respo => {
					this.branches = respo.data.branches;

                    respo.data.branches.forEach(item => {
                        if(item.is_default && this.params.base_branch == "") {
                            this.params.base_branch = item.name;
                        }
                    });
                });
                axios.get(`/repos/${this.params.head_owner}/${this.params.head_repo}/branches`).then(respo => {
                    this.headBranches = respo.data.branches;

                    respo.data.branches.forEach(item => {
                        if(item.is_default && this.params.head_branch == "") {
                            this.params.head_branch = item.name;
                        }
                    });
                })
            },
            getDiff() {

                let url = `/repos/${this.params.owner}/${this.params.repo}/pr/preview_diff`;
                axios.post(url, this.params).then(resp => {
                    this.diff = resp.data
                    signal.$emit('merge_request:change_file_num', this.diff.files.length)
                }).catch(Err)
            },
            getCommits() {
                let url = '/repos/' + this.params.owner + '/' + this.params.repo + '/pr/preview_commits';

				let self = this;
                axios.post(url, this.params).then(resp => {
                    this.commits = resp.data.commits

					// 提交记录头部
					// 获取最近一次提交的usernam
					this.committeruid = this.commits[0] && this.commits[0].author.full_name;
					// 获取最近一次提交的sha
					this.committerSha1 = this.commits[0] && this.commits[0].id;
                }).catch(Err)

            },
            // 文件上传
            AttaExceed(files, fileList){
                InfoMsg.warn('上传的文件不能多于'+this.attachSetting.max_files+"个")
                return
            },
            AttaBeforeUpload(file){
                if(file.size/(1024*1024)>this.attachSetting.max_size){
                    InfoMsg.warn('单个文件不要超过'+this.attachSetting.max_size+'M')
                    return false;
                }
            },
            AttaPreview(file){
                let uuid=file.uuid?file.uuid:file.response.uuid;
                window.open(window.domains.apiDomain+"/attachments/"+uuid);
            },
            AttaRemove(file,fileList){
                let owner = this.params.owner
                let repo = this.params.repo
                this.attachFiles = this.getFileArrByFiles(fileList);
                let uuid=file.response?file.response.uuid:file.uuid;
                axios.post(`/repos/${owner}/${repo}/delete/attachment/file`,{
                    owner:owner,repo:repo,file:uuid
                }).then(resp => {
                    console.log(resp)
                }).catch(Err)

            },
            getFileArrByFiles(files){
                let f=[];
                for(var item of files){
                    let uuid=item.response?item.response.uuid:item.uuid;
                    f.push(uuid);
                }
                //console.log(f);
                return f;
            },
            AttaSuccess(response, file, fileList){
                this.attachFiles = this.getFileArrByFiles(fileList);
            },
        },
        computed: {
            // 获取工单id
            // getIssueId() {
            // 	return this.$route.params.issueId;
            // },
        },
        components: {
            'store-tab': StoreTab
        },
        created() {
            // 登录用户
            this.self = this.$getSelf()
            this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
			// base owner
            this.params.owner = this.$route.params.username
			// base repo
            this.params.repo = this.$route.params.repoName
			// 获取base_branch和head info
            var compareURI = this.$route.params.compareop
			this.params.base_branch = compareURI.split("...")[0]
			var headInfo = compareURI.split("...")[1]
			this.params.head_owner = headInfo.split(":")[0]
            this.params.head_repo = headInfo.split(":")[1]
            // 获取分支
            this.getBranches();

            this.loadLabels();
            this.loadMilestone();
			this.loadAssignees();
			
			axios.get(`/repos/${this.username}/${this.reponame}/issues/attachment/setting`,
				{params:{owner:this.username,repo:this.reponame}}).then(resp=>{
                       this.attachSetting=resp.data
					   //console.log(resp.data)
				}).catch(Err)
        },
        mounted() {
            console.log(this.$router.currentRoute)
        }

    }
</script>

<style scoped lang="scss">
	@mixin focus {
		color: rgba(0,0,0,.95);
		border-color: #85B7D9;
		border-radius: .28571429rem;
		background: #FFF;
		box-shadow: 0 0 0 0 rgba(34,36,38,.35) inset;
	}
	// 鼠标指针
	@mixin cursor {
		cursor: pointer;
	}
	// 边框颜色
    @mixin bd-color {
        border: 1px solid rgba(34,36,38,.15);
    }
	// 边框圆角
    @mixin bd-radius {
        border-radius: .25rem;
    }

	.flex-right {
		@include bd-color;
		@include bd-radius;
		padding: 14px;
		flex: 2;
		height: max-content;
		margin: 0 20px;
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
	::-webkit-input-placeholder {
		font-size: 13px;
	}
	.title-box {
		width: 100%;
		margin: 20px 0 20px;
		.title {
			font-size: 13px;
			width: 100%;
			height: 40px;
			color: rgba(0, 0, 0, .95);
			border: 1px solid rgba(34,36,38,.15);
			padding: 0 10px;
			border-radius: .25rem;
			&:focus {
				@include focus();
			}
		}
	}
	.edit-box {
		height: 160px;
		padding: 0 10px;
		textarea,
		.preview-box {
			width: 100%;
			height: 120px;
			padding: 20px;
			color: #919AA7;
			font-size: 16px;
		}
		textarea {
			&:focus {
				@include focus();
			}
		}
	}
	.cursor {
		cursor: pointer;
	}
	.active {
		color: #19222e;
		font-weight: 700;
		border-bottom: 2px solid #308eff;
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
		/*padding: 22px;*/
		padding: 10px 0;
		font-size: initial;
	}

	.mrUploadImg {
		/*width:800px;*/
		width: 100%;
		height: 144px;
		margin: auto;
	}

	.CRListHead {
		height: 40px;
		padding: 0 25px;
	}

	.fileListItem {
		padding: 2px 12px;
		height: 36px;
	}
</style>