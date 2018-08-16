<template>
    <div class="container">
            <!-- 左侧布局 -->
            <div class="flex-left">
                <div class="avatar">
                    <img :src="userinfo.avatar_url" alt="">
                </div>
                <div class="ipt-box">
                    <input class="title" type="text" v-model="title" :placeholder="placeholder">
                    <div class="content">
                        <div class="tab-bar">
                            <div class="menu">
                                <div :class="[{'active' : isActive}]" @click="isActive=true">内容编辑</div>
                                <div :class="[{'active' : !isActive}]" @click="isActive=false">效果预览</div>
                            </div>
                            <!-- 内容 -->
                            <div class="edit" v-if="isActive">
                                <textarea v-model="body"></textarea>
                               <!--  <div class="file-upload">拖拽到此处或单击上传</div> -->

                               <el-upload
                                    class="upload-demo"
                                    drag
                                    :action=attachUrl
                                    :limit=parseInt(attachSetting.max_files) 
                                    :on-exceed="AttaExceed"
                                    :before-upload="AttaBeforeUpload"
                                    :on-preview="AttaPreview"
                                    :on-remove="AttaRemove"
                                    :list-type=attachSetting.allow_types
                                    :on-success="AttaSuccess"
                                    :file-list=attachFilelist
                                    multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    <div class="el-upload__tip" slot="tip">文件最多能上传{{this.attachSetting.max_files}}件，
                                        且单个文件不超过{{this.attachSetting.max_size}}M,允许的文件格式:{{this.attachSetting.allow_types}}</div>
                                </el-upload>

                                <div class="btn">
                                    <button @click="submit">创建工单</button>
                                </div>
                            </div>
                            <div class="preview" v-else v-html="body"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 右侧布局 -->

            <div class="flex-right">
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
                            <el-dropdown-item v-for="item in tags" :command="item" :key="'tags-'+item.id">
                                <span class="tag-color" :style="{backgroundColor:item.color}"></span>
                                {{ item.name }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
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
</template>
<script>
export default {
    data() {
        return {
            userinfo: {},
            storeItem: {},
            placeholder: '标题',
            title: '',
            body: '',
            milestone: null,
            labels: [],
            assignee: null,
            files: [],
            username: '',
            reponame: '',
            repo: {},

            tags: [],
            milestones: [],
            assignees: [],

            attachSetting:{},
			attachUrl:window.domains.apiDomain+"/issues/attachments",
			attachFiles:[],
			attachFilelist:[],

            isActive: true
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
            // 如果已经存在就不添加了
            !this.labels.some(item => item.id == params.id) && this.labels.push(params);
            console.log(this.labels)
        },
        // 选择里程碑
        selectMilestones(params) {
            this.milestone = params;
        },
        // 指派成员
        selectAssignee(params) {
            this.assignee = params;
        },
        submit() {
            // 标签集合
            let _labels = [];
            this.labels.forEach(item => _labels.push(item.id));

            axios.post(`/repos/${this.username}/${this.reponame}/issues`,{
                owner: this.username,
                repo: this.reponame,
                title: this.title,
                body: this.body,
                assignee: (this.assignee && this.assignee.username) || '',
                milestone: (this.milestone && parseInt(this.milestone.id)) || -1,
                labels: _labels,
                files: this.attachFiles
            }).then(resp => {
                if(resp.status == 200) {
                    InfoMsg.suc('提交成功');
                    this.$router.push({name: 'repoIssues'})
                }
                console.log(resp)
            }).catch(err => Err(err))
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
				
				axios.post(`/repos/${owner}/${this.reponame}/delete/attachment/file`,{
					owner:owner,repo:repo,file:uuid 
				}).then(resp => { 
					console.log(resp) 
				}).catch(Err)

			},
			AttaSuccess(response, file, fileList){
				this.attachFiles = this.getFileArrByFiles(fileList);
			}

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
        @include bg-color;
        @include flex-row;
        padding-bottom: 20px;
        .flex-left {
            padding: 0 20px;
            flex: 8;
            @include flex-row;
            .avatar {
                width: 42px;
                height: 42px;
                img {
                    width: 100%;
                    height: 100%;
                    @include bd-radius;
                }
            }
            .ipt-box {
                position: relative;
                @include bd-radius;
                // 左箭头
                &::before,
                &::after {
                    width: 0;
                    height: 0;
                    position: absolute;
                    right: 100%;
                    top: 20px;
                    content: " ";
                    pointer-events: none;
                }
                &::before {
                    border-width: 9px;
                    margin-top: -9px;
                    border: 10px solid transparent;
                    border-right-color: #D4D4D5;
                    
                }
                &::after {
                    border: 10px solid transparent;
                    border-width: 9px;
                    margin-top: -8px;
                    border-right-color: #fff;
                }
                @include bd-color;
                flex-grow: 1;
                padding: 14px;
                margin-left: 30px;
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
                        color: rgba(0,0,0,.95);
                        border-color: #85B7D9;
                        border-radius: .28571429rem;
                        background: #FFF;
                        box-shadow: 0 0 0 0 rgba(34,36,38,.35) inset;
                    }
                }
                .content {
                    .tab-bar {
                        width: 100%;
                        // height: 43px;
                        margin-top: 20px;
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
                                border: 1px solid #D4D4D5;
                                border-bottom-color: #fff;
                                // border-top-width: 1px;
                                // border-color: #D4D4D5;
                                font-weight: 700;
                                margin-bottom: -1px;
                                box-shadow: none;
                                border-radius: .28571429rem .28571429rem 0 0;
                                position: relative;
                                &::after {
                                    position: absolute;
                                    left: 0;
                                    bottom: 0;
                                    content: '';
                                    width: 100%;
                                    border: none;
                                    border-bottom: 1px solid #ffffff;
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
                                justify-content: flex-end;
                                button {
                                    width: 98px;
                                    height: 36px;
                                    line-height: 36px;
                                    text-align: center;
                                    font-size: 13px;
                                    background-color: #21BA45;
                                    color: #FFF;
                                    box-shadow: 0 0 0 0 rgba(34,36,38,.15) inset;
                                    @include bd-radius;
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
</style>

