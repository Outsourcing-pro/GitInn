/* 合并请求具体页面 */
<template>
	<div class="c_white_bg container">
		<div class="c_paddingV c_flexRow alignItemStart">
			<!-- 左侧布局 -->
			<div class="mrLeft">

				<!-- 合并状态 -->
				<!-- <div class="mrLeftItem statusItem c_border c_border_rad3">
					<div class="c_flexRow flexStart">
						<div class="c_hd_img c_small_head_img c_pink_bg" style="margin-right:14px;padding:10px;">
							<img src="~img/src/派生.svg" alt="" />
						</div>
						<div class="c_red_txt">该合并请求存在冲突，无法进行自动合并操作。</div>
					</div>
					<div style="margin-left:60px;" class="c_gray_txt">请手动拉取代码变更以解决冲突。</div>

				</div>
				<div class="mrDivider"></div>
				<div class="mrLeftItem statusItem c_border c_border_rad3">
					<div class="c_flexRow flexStart">
						<div class="c_hd_img c_small_head_img c_lgreen_bg" style="margin-right:14px;padding:10px;">
							<img src="~img/src/派生.svg" alt="" />
						</div>
						<div class="c_green_txt">该合并请求可以进行自动合并操作。</div>
					</div>
					<div style="margin-left:60px;" class="c_gray_txt">
						<button type="button" class="ui-btn btn-green c_flexRow">
							<img src="~img/src/派生.svg" class="c_margin-right4" style="width:14px;" alt="" />合并请求
						</button>
					</div>
				</div> -->

				<!-- 评论内容 -->
				<div v-for="(item,index) in comments" :key="'comment-id-' + item.id">

					<!-- 评论 -->
					<div v-if="item.type == 0">
						<div class="mrLeftItem c_border c_border_rad3">
							<div class="c_flexRow flexStart">
								<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+item.user.avatar_url+')',marginRight:'14px'}"></div>
								<div><span class="c_blue_color c_margin-right4">{{item.user.full_name}}</span><span class="c_gray_txt ft12">{{$distanceInWords(item.created)}}</span></div>
								<div class="c_flexOne"></div>
								<!-- 编辑或删除 -->
								<div>
									<img src="~img/src/编辑.svg" class="c_wh20 smallIconImg" alt=""  @click="commentEdit(item)"/>
									<!-- <img src="~img/src/删除.svg" class="c_wh20 smallIconImg" alt="" /> -->
								</div>
							</div>
							<!-- 评论详情 -->
							<div style="margin-left:60px;">
								<div>
									{{item.body}}
								</div>
								<!-- 评论中的附件 -->
								<div class="upImgCnt c_flexRow flexStart">
									<a target="_blank" :href="imgUrl + item1.uuid" v-for="item1 in item.attachments" :key="item1.uuid">
										<img :src="imgUrl + item1.uuid" class="upImg" :alt="item1.name" />
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- 评论列表中的状态：关闭或重新开启 -->
					<div class="c_flexRow flexStar box-padding" v-if="item.type == 1 || item.type == 2">
						<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+item.user.avatar_url+')',marginRight:'14px'}"></div>
						<div>
							<span class="c_blue_color c_margin-right4">{{item.user.full_name}}</span>
							<span class="c_gray_txt ft12">{{$distanceInWords(item.created)}}</span>
							<span class="c_gray_txt ft12 state-color">{{ item.type == 2 ? '关闭请求' : '重新打开'}}</span>
						</div>
					</div>
					<div class="mrDivider" v-if="index<comments.length-1"></div>

				</div>

				 <!-- 工单操作：合并请求或删除分支 -->
				 <!-- 未合并的请求可以合并，合并成功后可以执行删除操作 -->
				<div class="mrDivider" v-if="!has_merged"></div>
				<div class="mrLeftItem statusItem c_border c_border_rad3" v-if="!has_merged">
					<div class="c_flexRow flexStart">
						<div :class="['c_hd_img', 'c_small_head_img', status == 0 ? 'c_lred_bg' : 'c_lgreen_bg']" style="margin-right:14px;padding:10px;">
							<img v-if="status==0" src="~img/src/派生1.svg" alt="" />
							<img v-else src="~img/src/派生.svg" alt="" />
						</div>
						<!-- 可以合并：工单未关闭，has_merged:false -->
						<div v-if="!details.is_closed && status != 0" class="c_green_txt">
							该合并请求可以进行自动合并操作。
						</div>
						<!-- 工单已关闭但未合并 -->
						<div v-if="details.is_closed" class="c_gray_txt">
							请重新开启合并请求来完成合并操作。
						</div>
						<!-- 冲突 -->
						<div v-if="status == 0" class="c_danger_text">
							该合并请求存在冲突，无法进行自动合并操作。
						</div>
						<!-- 这一期不做 -->
						<!-- <div class="c_green_txt">{{!has_merged ? '该合并请求可以进行自动合并操作。' : '该合并请求已经成功合并！'}}</div> -->
					</div>
					<div style="margin-left:60px;" class="c_gray_txt" v-if="!details.is_closed">
						<button v-if="status != 0" type="button" class="ui-btn btn-green c_flconditionexRow" @click="createMerge">
							<img src="~img/src/派生1-1.svg" class="c_margin-right4" style="width:14px;" alt="" />合并请求
						</button>

						<!-- 合并请求冲突时 -->
						<div class="c_gray_txt"  v-if="status == 0">请手动拉取代码变更以解决冲突。</div>
						<!-- 这一期不做 -->
						<!-- <button type="button" class="ui-btn btn-green c_flexRow" v-if="!has_merged" @click="createMerge">
							<img src="~img/src/派生.svg" class="c_margin-right4" style="width:14px;" alt="" />合并请求
						</button>
						<button v-else type="button" class="ui-btn btn-green c_flexRow" @click="delBranch">
							<img src="~img/src/派生.svg" class="c_margin-right4" style="width:14px;" alt="" />删除分支
						</button> -->
					</div>
				</div>

                <!-- 编辑与评论 -->
				<div class="mrDivider"></div>
				<div class="editPanel c_border">
					<div class="c_flexRow flexStar box-padding" style="margin:10px 0">
						<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+user.avatar_url+')',marginRight:'14px'}"></div>
						<div>
							<span class="c_blue_color c_margin-right4">{{user.full_name}}</span>
						</div>
					</div>
                    <!-- tab页签 -->
					<div class="editHeader c_bottom_line c_flexRow flexStart alignItemStrecth">
						<div :class="['c_active_bt_ind', {'c_blue_color': isActive}, 'panelTabItem', 'cursor', {'active': isActive}]" @click="isActive=true">编辑内容</div>
						<div :class="['c_active_bt_ind', {'c_blue_color': !isActive}, 'panelTabItem', 'cursor', {'active': !isActive}]" @click="isActive=false">预览效果</div>

					</div>
					<div class="edit-box">
                        <textarea id="iptTextarea" v-if="isActive" class="c_gray_txt" v-model="content" placeholder="请说说你的想法"></textarea>
                        <div class="preview-box" v-else v-html="content"></div>
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
                            <button class="ui-btn btn-green" @click="addComment(false)">评论</button>
							<!-- 已经合并成功的请求，工单会关闭，并且无法再次开启 -->
                            <button v-if="!has_merged" class="ui-btn btn-blank" @click="closeIssues()">{{ details.is_closed ? '重新开启' : '关闭'}}</button>
						</div>
					</div>

				</div>

			</div>
			<!-- 右侧布局 -->
			<div class="flex-right">
				 <!-- 选择标签 -->
                <div class="menu-list">
                    <strong>标签</strong>
                    <!-- 下拉选项 -->
                    <el-dropdown v-if="tags.length>0" trigger="click" @command="selectTag" placement="bottom-start" :hide-on-click="false">
                        <span v-if="labels.length < 1" class="el-dropdown-link">
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
                        <span v-if="!milestone" class="el-dropdown-link">
                            未选里程碑
                        </span>
                        <!-- 已选的 -->
                        <span v-else class="el-dropdown-link">
                            {{ milestone.title }}
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
                        <span v-if="!assignee" class="el-dropdown-link">
                            未指派成员
                        </span>
                        <!-- 已选的 -->
                        <span v-else class="el-dropdown-link">
                            {{ assignee.full_name }}
                        </span>
                        <!-- 选项 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in assignees" :command="item" :key="'assignees-'+item.id">
                                {{ item.full_name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
		</div>

		<!-- 对话，代码提交，文件变动 -->
		<!-- <router-view name="mergeDetailEntry"></router-view> -->
	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'

	export default {
		data() {
			return {
				comments: [],
				atdUsers: new Map(),
				user: {},
				// 控制菜单：对话，代码提交，文件变动
				tbMenu: 0,
				repo: {},
				username: '',
				reponame: '',
                index: '',
                
				// 当前的已选
				assignee: null,
				milestone: null,
				labels: [],

				tags: [],
				milestones: [],
                assignees: [],
                
                isActive: true,
                details: {},
                commentId: '',
                isEdit: false,
                body: '',
                action: 'title',
                state: '',
                placeholder: '标题',
                content: '',

				imgUrl: window.domains.apiDomain+"/attachments/",
                attachSetting:{},
                attachUrl:window.domains.apiDomain+"/releases/attachments",
                attachFiles:[],
                attachFilelist:[],
				attaShow:true,
				
				// 工单是否已合并
				has_merged: false,
				status: '',
			}
		},
		methods: {
			// 选择标签
			selectTag(params) {
				this.action = 'labels'
				// 如果已经存在就不添加了
				!this.labels.some(item => item.id == params.id) && this.labels.push(params);
				this.saveUpdate();
			},
			// 选择里程碑
			selectMilestones(params) {
				this.action = 'milestone';
				this.milestone = params;
				this.saveUpdate();
			},
			// 指派成员
			selectAssignee(params) {
				this.action = 'assignee';
				this.assignee = params;
				this.saveUpdate();
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
				let owner = this.username
				let repo = this.repoName 
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
			loadLabels() {
				axios.get('/repos/' + this.username + '/' + this.reponame + '/labels').then(resp => {
					this.tags = resp.data.labels
				}).catch(err => Err(err))
			},
			loadMilestone() {
				axios.get('/repos/' + this.username + '/' + this.reponame + '/milestones').then(resp => {
					this.milestones = resp.data.milestones
				}).catch(err => Err(err))
			},
			loadAssignees() {
				axios.get('/repos/' + this.username + '/' + this.reponame + '/assignees').then(resp => {
					this.assignees = resp.data.users
				}).catch(err => Err(err))
			},
			// 获取评论
			getComments() {

				let url = '/repos/' + this.username + '/' + this.reponame + '/issues/' + this.getIssueId + '/comments'
				axios.get(url).then(resp => {
					this.comments = resp.data.comments
					this.comments.forEach(item => {
						this.atdUsers.set(item.user.id, item)
					})
				}).catch(Err)
            },
            // 编辑评论
            commentEdit(item) {
                this.content = item.body;
                this.isEdit = true;
                this.commentId = item.id;
                this.attaShow=false;
                console.log(item);
                if(item.attachments){
                        for( var it of item.attachments){
                            this.attachFiles.push(it.uuid);
                            this.attachFilelist.push(it);
                        } 
                    }
                document.getElementById('iptTextarea').focus();
            },
            closeIssues() {
                    this.action = 'state';
                    this.state = this.details.is_closed ? 'open' : 'closed';
                    this.saveUpdate();
            },
            addComment(flag) {

                console.log(this.isEdit)

                let url = this.isEdit ? `/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}/comments/${this.commentId}`
                    : `/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}/comments`;

                let params = this.isEdit ? {
                    owner: this.username,
                    repo: this.reponame,
                    index: parseInt(this.getIssueId),
                    id: parseInt(this.commentId),
                    body: this.content,
                    file:this.attachFiles
                } : {
                    owner: this.username,
                    repo: this.reponame,
                    index: parseInt(this.getIssueId),
                    body: this.content,
                    files: this.attachFiles
                };

                axios.post(url, params).then(resp => {
                    // 重置一些状态
                    this.isEdit = false;
                    this.content = '';
                    // this._refreshOrderDetail();
                    this.getComments();
                    this.attachFiles=[];
                    this.attachFilelist=[];
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
			// 打开或关闭工单
			updateState(state='closed') {
				this.action = 'state';
				this.state = this.state === 'open' ? 'closed' : 'open';
				this.saveUpdate();
			},
			// 保存更新
			saveUpdate() {
				// 标签集合
				let _labels = [];
				this.labels.length >0 && this.labels.forEach(item => _labels.push(item.id));
				console.log(this.labels, _labels, this.milestone)
				
				axios.post(`/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}`, {
					title: this.title,
					body: this.body,
					assignee: (this.assignee && this.assignee.username) || '',
					milestone: (this.milestone && parseInt(this.milestone.id)) || -1,
					owner: this.username,
					repo: this.reponame,
					index: parseInt(this.getIssueId),
					state: this.state,
					action: this.action,
					labels: _labels,
				}).then(resp => {
					this.details = resp.data;
					this.title = this.details.title;
					this.state = this.details.state;

					// 如果是编辑状态，需要重置disable
					if(this.disabled) this.disabled = false;

					// 刷新工单详情
					this.getComments();
					// 刷新详情
					this.getOrderDetail();
				});
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
					this.status = this.details.pull_request.status;
					this.has_merged = this.details.pull_request.has_merged;
					this.labels = this.details.labels;
					this.milestone = this.details.milestone;
					this.assignee = this.details.assignee;
                });
			},
			// 合并请求
			createMerge() {
				axios.post(`/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}/merge`, {
					owner: this.username,
					repo: this.reponame,
					index: parseInt(this.getIssueId)
				}).then(resp => {
					this.getComments();

					this.getOrderDetail();
					// 合并请求成功后刷新父路由的详情信息
					signal.$emit('getOrderDetail');
				})
			},
			// 删除分支
			// delBranch() {
			// 	console.log('删除分支')
			// }
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
			console.log(this.$route.params)
			
			// 初始化用户信息，仓库信息
			this.initData()
			
            this.getComments();
            this.getOrderDetail();
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
			this.$on('onUpdateState', function(state) {
				this.updateState(state);
			})
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
	::-webkit-input-placeholder {
		font-size: 13px;
	}
    .cursor {
        @include cursor();
    }
	.box-padding {
		padding: 0 10px;
		justify-content: flex-start;
	}
	.state-color {
		color: rgba(47,47,47,.87)
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
        .edit-box {
            height: 120px;
            padding: 0 20px;
            textarea,
            .preview-box {
                width: 100%;
                height: 100%;
                padding: 20px;
                color: #919AA7;
                font-size: 16px;
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
        margin-right: 20px;
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