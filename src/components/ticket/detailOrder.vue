<template>
    <div class="container">
		<!-- 工单详情 -->
		<div class="header">
			<div>
				<h1>
					<span class="index">#{{ details.index }}</span>
					<span v-if="!disabled">{{ details.title }}</span>
					<input id='ipt-title' v-else class="active" type="text" v-model="title">
				</h1>
				<div class="row2">
					<!-- is_closed -->
					<button @click="updateState" :class="[details.state === 'open' ? 'open' : 'close']">{{ details.state === 'open' ? '开启中' : '重新开启'}}</button>
					<span>
						<!-- 由 <span class="blue-light">{{ details.poster.full_name }}</span> -->
						<span>{{ $cmmDate(details.created) }}创建</span> 
						<span class="split-chater">|</span> 
						<span class="blue-light">{{ details.comments }}</span>条评论
					</span>
				</div>
			</div>
			<div>
				<button @click="disabled=false" class="default" v-if="disabled">取消</button>
				<button @click="saveUpdate"  :class="{'default': !disabled}" v-if="disabled">保存</button>
				<button @click="editOrderDetail" class="default" v-if="!disabled">编辑</button>
			</div>
		</div>
		<div class="body">
            <!-- 左侧布局 -->
            <div class="flex-left">
				<!-- 工单评论列表 -->
				<div class="order-list">
					<div class="order-item" v-for="item in comments" :key="'comments-'+item.id">
						<div class="avatar">
							<img :src="item.user.avatar_url" alt="">
						</div>
						<div class="ipt-box clear-padding">
							<div class="tag">
								<span>
									<span class="blue-light">{{ item.user.full_name }}</span>
									<span v-if="item.type == 2 || item.type == 1">在</span>
									<span>{{ $cmmDate(item.created) }}</span>
									<span v-if="item.type == 2 || item.type == 1">{{ item.type == 2 ? '关闭' : item.type == 1 ? '重新开启' : ''}}</span>
								</span>
								<span class="comment-edit" @click="commentEdit(item)">
									<img src="~img/src/编辑.svg" class="c_wh20 smallIconImg" alt="" />
								</span>
							</div>
							
							<div v-if="item.type != 2 && item.type != 1" class="content-detail" >{{ item.body }}</div>
							<div class="c_border c_dashed_border c_border_rad3">
							<div v-for="att in item.attachments" class="attach c_bottom_line dashed c_flexRow flexStart">
								<img style="width:3%;margin-right:15px;cursor:pointer;" src="~img/src/附件/压缩文件.svg" width="10%" height="10%" alt="" />
								<span style="cursor:pointer;" class="cursor-pointer"  @click="attrUrl(att.uuid)" >{{att.name}}</span>
							</div>
						   </div>
						</div>
					</div>
				</div>

				<!-- 当前用户操作区 -->
				<div class="edit-box">
					<div class="user">
						<img class="avatar" :src="userinfo.avatar_url" alt="">
						<span class="blue-light">{{ userinfo.full_name }}</span>
					</div>
					<div class="ipt-box">
						<div class="content">
							<div class="tab-bar">
								<div class="menu">
									<div :class="[{'active' : isActive}]" @click="isActive=true">内容编辑</div>
									<div :class="[{'active' : !isActive}]" @click="isActive=false">效果预览</div>
								</div>
								<!-- 内容 -->
								<div class="edit" v-if="isActive">
									<textarea id="iptTextarea" v-model="content"></textarea>
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
									<div class="btn">
										<button @click="addComment(true)">{{ details.is_closed ? '评论并开启' : '评论并关闭'}}</button>
										<button @click="addComment(false)">评论</button>
									</div>
								</div>
								<div class="preview" v-else v-html="content"></div>
							</div>
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
    </div>    
</template>
<script>
export default {
    data() {
        return {
            userinfo: {},
			title: '',
			body: '',
			assignee: null,
			milestone: null,
			labels: [],
			action: 'title',
			state: '',
            placeholder: '标题',
            content: '',
			isActive: true,
			details: {},
			comments: [],
			disabled: false,
			commentId: '',
			isEdit: false,
			username: '',
			reponame: '',
			repo: {},

            attachSetting:{},
			attachUrl:window.domains.apiDomain+"/releases/attachments",
			attachFiles:[],
			attachFilelist:[],
			attaShow:true,

			tags: [],
            milestones: [],
            assignees: [],
        }
	},
	computed: {
		getIssueId() {
			return this.$router.currentRoute.params.issueId
		}
	},
    created() {
		this.userinfo = this.$getSelf();
		this.username = this.$route.params.username
        this.reponame = this.$route.params.repoName
        
        var self = this;
        this.$getRepo(this.username, this.reponame, function(repo) {
            self.repo = repo;
		});
		
		this.getOrderDetail();
		this.getOrderComments();

		this.loadLabels();
		this.loadMilestone();
		this.loadAssignees();
		 axios.get(`/repos/${this.username}/${this.reponame}/issues/attachment/setting`,
				{params:{owner:this.username,repo:this.reponame}}).then(resp=>{
                       this.attachSetting=resp.data
					   //console.log(resp.data)
				}).catch(Err)
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
				this.title = this.details.title;
				this.state = this.details.state;
				this.labels = this.details.labels;
				this.milestone = this.details.milestone;
				this.assignee = this.details.assignee;
				

			});
		},
		// 获取工单评论
		getOrderComments() {
			axios.get(`/repos/${this.username}/${this.reponame}/issues/${this.getIssueId}/comments`, {
				params: {
					owner: this.username,
					repo: this.reponame,
					index: parseInt(this.getIssueId)
				}
			}).then(resp => {
				this.comments = resp.data.comments;
			});
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
		// 提交评论
		addComment(flag) {
			// flag,是否关闭工单，true关闭，否则不关闭
			if(flag) {
				this.action = 'state';
				this.state = this.details.is_closed ? 'open' : 'closed';
				this.saveUpdate();
			}

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
				this._refreshOrderDetail();
				this._refreshOrderComments();
				this.attachFiles=[];
				this.attachFilelist=[];
			});
		},
		// 编辑工单-标题
		editOrderDetail() {
			this.disabled = true;
			this.action = 'title';
			setTimeout(function() {
				document.getElementById('ipt-title').focus();
			}, 0);
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
				files: this.attachFiles
			}).then(resp => {
				this.details = resp.data;
				this.title = this.details.title;
				this.state = this.details.state;

				// 如果是编辑状态，需要重置disable
				if(this.disabled) this.disabled = false;

				// 刷新工单详情
				this._refreshOrderDetail();
				this._refreshOrderComments();
			});
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
		// 刷新
		_refreshOrderDetail() {
			this.getOrderDetail();
		},
		_refreshOrderComments() {
			this.getOrderComments();
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
			AttaExceed(files, fileList){
				InfoMsg.warn('上传的文件不能多于'+this.attachSetting.max_files+"个")
				return 
				//console.log(files)
				//console.log(fileList)
			},
			AttaBeforeUpload(file){
				if(file.size/(1024*1024)>this.attachSetting.max_size){
				   InfoMsg.warn('单个文件不要超过'+this.attachSetting.max_size+'M')
				   return false;
				} 
				if(this.attachSetting.allow_types.toLowerCase().indexOf(file.type.toLowerCase())==-1){
                    InfoMsg.warn('文件格式不正确')
                    return false;
                }
				
			},
			AttaPreview(file){
				let uuid=file.uuid?file.uuid:file.response.uuid;
				window.open(window.domains.apiDomain+"/attachments/"+uuid);
			},
			AttaRemove(file,fileList){
				let uuid=file.response?file.response.uuid:file.uuid;
				  if(!uuid){return false; }
				let owner = this.username
				let repo = this.repoName 
				this.attachFiles = this.getFileArrByFiles(fileList);
				axios.post(`/repos/${owner}/${repo}/delete/attachment/file`,{
					owner:owner,repo:repo,file:uuid 
				}).then(resp => { 
					console.log(resp) 
				}).catch(Err)

			},
			AttaSuccess(response, file, fileList){
				this.attachFiles = this.getFileArrByFiles(fileList);
			},
			attrUrl(uuid){
              window.open(window.domains.apiDomain+"/attachments/"+uuid);
			},
	}
}
</script>
<style lang="scss" scoped>
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
    // 弹性布局-左右
    @mixin flex-row {
        display: flex;
        flex-direction: row;
    }
    // 鼠标指针样式
    @mixin cursor {
        cursor: pointer;
    }
	// 蓝色高亮
	@mixin blue-light {
		color: #008eff;
	}
	// 焦点
	@mixin focus {
		color: rgba(0,0,0,.95);
		border-color: #85B7D9;
		border-radius: .28571429rem;
		background: #FFF;
		box-shadow: 0 0 0 0 rgba(34,36,38,.35) inset;
	}
	.tag-color {
        width: 15px;
        height: 15px;
        display: inline-block;
    }
    .flex-column {
        display: flex;
        flex-direction: column;
        >span {
            display: flex;
            align-items: center;
            >span {
                margin-right: 5px;
            }
        }
    }
    .container {
        padding: 0 20px 20px;
		@include bg-color;
		.blue-light {
			@include blue-light;
		}
		.clear-padding {
			padding: 0;
		}
		.header {
			width: 100%;
			height: 122px;
			@include bg-color;
			border: none;
			border-top: 1px solid rgba(34,36,38,.15);
			border-bottom: 1px solid rgba(34,36,38,.15);
			margin-bottom: 20px;
			@include flex-row;
			>div {
				&:first-child {
					flex: 8;
				}
				&:last-child {
					flex: 2;
					text-align: right;
					line-height: 122px;
					button {
						width: 98px;
						height: 36px;
						line-height: 36px;
						text-align: center;
						font-size: 13px;
						box-shadow: 0 0 0 0 rgba(34,36,38,.15) inset;
						border-radius: 50px;
						&:last-child {
							background-color: #21BA45;
							color: #FFF;
							margin-left: 15px;
						}
						&.default {
							background-color: transparent;
							color: #465364;
							border: 1px solid #d7dfe8;
						}
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
					.active {
						outline: none;
						@include bd-color;
						@include bd-radius;
						width: 70%;
						line-height: 37px;
						padding: 0 10px;
						&:focus {
							@include focus;
						}
					}
				}
				.row2 {
					button {
						border-radius: 50px;
						color: #FFF;
						font-size: 13px;
						margin-right: 10px;
						width: 85px;
						height: 32px;
						text-align: center;
						line-height: 32px;
					}
					.open {
						background-color: #21BA45;
					}
					.close {
						background-color: #d0d0d0;
					}
					>span {
						font-size: 13px;
						color: #465364;
						.split-chater {
							color: #cfcfcf;
						}
					}
				}
			}
		}
		.body {
			@include bg-color;
			@include flex-row;
			.flex-left {
				flex: 8;
				.order-list {
					>div {
						&:not(:first-child) {
							margin-top: 20px;
							position: relative;
							&::after {
								position: absolute;
								top: -20px;
								left: 40px;
								content: '';
								height: 20px;
								border-left:1px solid rgba(34,36,38,.15);
							}
						}
						padding: 0 20px;
						@include flex-row;
						@include bd-radius;
						@include bd-color;
						margin-right: 20px;
						min-width: 100px;
					}
				}
				.edit-box {
					margin: 20px 20px 0 0;
					@include bd-color;
					@include bd-radius;
					.avatar {
						margin: 0;
					}
					.user {
						@include flex-row;
						align-items: center;
						padding: 0 20px;
						height: 75px;
						>span {
							margin-left: 15px;
						}
					}
				}
				.avatar {
					width: 42px;
					height: 42px;
					margin-top: 14px;
					border-radius: 100%;
					img {
						width: 100%;
						height: 100%;
						border-radius: 100%;
					}
				}
				.ipt-box {
					position: relative;
					flex-grow: 1;
					margin: 26px 14px;
					.tag {
						display: flex;
						justify-content: space-between;
						>span {
							&:last-child {
								color: #8f9aa8;
							}
						}
						.comment-edit {
							@include cursor;
						}
					}
					.content-detail {
						font-size: 14px;
						margin-top: 16px;
						.user {
							width: 100%;
							height: 150px;
							@include flex-row;
							align-items: center;
							border-bottom: 1px solid rgba(34,36,38,.15);
						}
					}
					.title {
						outline: none;
						@include bd-color;
						@include bd-radius;
						width: 100%;
						height: 37px;
						line-height: 37px;
						font-size: 13px;
						padding: 0 10px;
						&:focus {
							@include focus;
						}
					}
					.content {
						.tab-bar {
							width: 100%;
							// 编辑和预览
							.menu {
								@include flex-row;
								position: relative;
								&::after {
									position: absolute;
									bottom: 0;
									content: '';
									width: 100%;
									border: none;
									border-bottom: 1px solid rgba(34,36,38,.15);
								}
								>div {
									width: 98px;
									height: 43px;
									line-height: 43px;
									text-align: center;
									@include cursor;
								}
								.active {
									background: #FFF;
									color: rgba(0,0,0,.95);
									font-weight: 700;
									margin-bottom: -1px;
									box-shadow: none;
									position: relative;
									&::after {
										position: absolute;
										left: 0;
										bottom: 0;
										content: '';
										width: 100%;
										border: none;
										border-bottom: 2px solid #008eff;
									}
								}
							}
							// textare
							.edit {
								margin-top: 20px;
								textarea {
									@include bd-color;
									@include bd-radius;
									padding: 14px;
									width: 100%;
									height: 200px;
									&:focus {
										@include focus;
									}
								}
								.file-upload {
									width: 100%;
									height: 96px;
									line-height: 96px;
									text-align: center;
									margin-bottom: 10px;
									border: 2px dashed #0087F7;
									@include bd-radius;
									margin-top: 15px;
									@include cursor;
								}
								.btn {
									display: flex;
									// justify-content: flex-end;
									button {
										width: 98px;
										height: 36px;
										line-height: 36px;
										text-align: center;
										font-size: 13px;
										box-shadow: 0 0 0 0 rgba(34,36,38,.15) inset;
										border-radius: 50px;
										&:first-child {
											background-color: transparent;
											color: #465364;
											border: 1px solid #d7dfe8;
										}
										&:last-child {
											background-color: #21BA45;
											color: #FFF;
											margin-left: 15px;
										}
									}
								}
							}
							.preview {
								height: 200px;
								margin-top: 20px;
							}
						}
					}
				}
			}
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
    }
</style>

