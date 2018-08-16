<template>
	<div class="c_contentBody c_cnt_noColor">
		<!-- 版本列表 -->
		<div v-show="tab==0">
			<div class="c_white_bg c_padding c_paddingV">
				<div class="c_paddingV c_flexRow c_bottom_line">
					<div class="c_bold ft16">版本发布</div>
					<div class="ui-btn btn-green" @click="tab=1">发布新版</div>
				</div>
				<div class="c_flexRow flexStart alignItemStart">
					<div class="alignSelfStretch versionLeft"></div>
					<div class="pdHeight"></div>
				</div>
				<div class="c_flexRow flexStart alignItemStart" v-for="item in release">
					<div class="alignSelfStretch  versionLeft dot">
						<!-- 版本类型 -->
						<div style="margin-top:-5px;">
							<span v-if="item.is_draft" class="c_imBT c_imBT_gray c_imBT_small c_imBT_radius">草稿</span>
							<span v-if="item.is_prerelease" class="c_imBT c_imBT_gray c_imBT_small c_imBT_radius">预发行</span>
						</div>
						<div class="">
							<img src="" alt="" style="width:12px;" />
							<span class="c_gray_txt">{{item.tag_name}}</span>
						</div>
						<div class="c_blue_color sha1 cursor-pointer" @click="$router.push({path: `/${username}/${repoName}/commit/${item.sha1}`})"> {{"</> "+item.sha1.substr(0,10)}}</div>

					</div>
					<div class="c_padding">
						<div class="c_blue_color ft18 cursor-pointer">
							<span @click="goBack()">{{item.title}}</span>
							<!-- 编辑按钮 -->
							<img class="edit" @click="edit(item)" src="~img/src/编辑.svg" alt="" />
						</div>
						<!-- 头像，昵称 -->
						<div class="cBigMargin c_flexRow flexStart cursor-pointer" @click="goPerson(item.publisher.name)">
							<div class="c_hd_img" style="width:22px;height: 22px;margin-right: 8px;" :style="'background-image: url('+item.publisher.avatar_url+');'"></div>
							<span class="c_gray_txt"> <span class="c_blue_color" style="margin-right:4px;">{{item.publisher.full_name}}</span>{{$distanceInWords(item.created)}} 在该版本发布之后已有 {{item.num_commits_behind}} 次代码提交到 {{item.target}} 分支</span>
						</div>

						<div class="txtDesc">
							<div v-html="item.note"></div>
							<!--1. 程序员客栈的使命是为程序员服务，当好程序员的经纪人。<br> 2. 当前阶段我们的愿景是服务好中高端程序员; <br> 3. 对程序员的了解理解数据化，让平台+优质个人取代公司+雇员，改变程序员的工作方式。 <br>3. 未来我们服务顶尖程序员，和他们一起改进提升行业生产效率，成为新理念、新技术、新标准的发源地。-->
						</div>
						<!-- 下载附件 -->
						<!-- <div class="cBigMargin"> <img style="width:20px;vertical-align: middle;" src="~img/src/附件/附件.svg" alt="" /><span class="c_bold">下载附件</span></div> -->
						<div class="c_border c_dashed_border c_border_rad3">
							<!--<div class="attach c_bottom_line dashed c_flexRow flexStart">
								<img src="~img/src/附件/普通文件.svg" alt="" />
								<span>屏幕快照2007_2_12.png</span>
							</div>-->
							<div v-for="att in item.attachments.attachments" class="attach c_bottom_line dashed c_flexRow flexStart">
								<img src="~img/src/附件/压缩文件.svg" alt="" />
								<span class="cursor-pointer"  @click="attrUrl(att.uuid)" >{{att.name}}</span>
							</div>

						</div>

						<div class="pdHeight"></div>
					</div>
				</div>

			</div>

		</div>

		<!-- 发布页 -->
		<div v-show="tab==1">
			<div class="c_white_bg c_padding c_paddingV">
				<div class="pubTitle">
					<div class="ft20">发布新版本</div>
					<div class="c_gray_txt ft12">发布版本对产品进行迭代。</div>
				</div>
				<div class="cBigMargin">
					<div class="c_flexRow flexStart">
						<span class="pubLabel">标签:</span>
						<input class="c_input" style="width:243px;" v-model="label" type="text" placeholder="请输入标签名称..." />
						<span style="margin: 0 14px;">@</span>
						<div class="c_icon_input c_relative" style="width:190px;" @click="showBranchList=true">
							<img src="~img/src/icon/分支.svg" style="width: 20px;margin-left:5px;" class="left" />
							<input type="text" style="padding-left:30px;" readonly :value="selBranchObj.name" class="c_input" placeholder="" name="" id="" value="" />
							<img src="~img/src/多层级_下.svg" style="width: 10px;margin-right: 5px;" class="right" />
							<menu-list :show.sync="showBranchList">
								<ul>
									<li v-for="(item,index) in branches" @click="selBranch=index">
										{{item.name}}
									</li>
								</ul>
							</menu-list>
						</div>
					</div>
					<div class="pubCnt c_gray_txt ft12">
						选择或创建一个已经存在的标签
					</div>

				</div>
				<div class="cBigMargin c_flexRow flexStart">
					<span class="pubLabel">标题:</span>
					<input class="c_input pubCntWidth" v-model="title" type="text" placeholder="输入标题..." />
				</div>

				<div class="cBigMargin c_flexRow flexStart">
					<span class="pubLabel alignSelfStart" style="margin-top:7px;">内容:</span>
					<textarea class="c_input pubCntWidth pubCntHeight" v-model="content" placeholder="输入标题..."></textarea>
				</div>
				<div class="cBigMargin c_flexRow flexStart">
					<span class="pubLabel alignSelfStart" style="margin-top:7px;">文件:</span>
					<el-upload
  class="upload-demo"
  drag
  :action=attachUrl
  :limit= attachSetting.max_files 
  :on-exceed="AttaExceed"
  :before-upload="AttaBeforeUpload"
  :on-preview="AttaPreview"
  :on-remove="AttaRemove"
  :on-success="AttaSuccess"
  :file-list=attachFilelist
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">文件最多能上传{{this.attachSetting.max_files}}件，且单个文件不超过{{this.attachSetting.max_size}}M</div>
</el-upload>
				</div>
				<div class="cBigMargin pubCnt">
					<div class="c_flexRow flexStart">
						<div class="alignSelfStart c_margin-right10"><input type="checkbox" v-model="isPrePublish" /></div>
						<div>
							<div>预发行版本</div>
							<div class="ft12 c_gray_txt">我们会告知用户不建议将本次发布投入生产环境使用。</div>
						</div>

					</div>

				</div>
				<div class="c_bottom_line"></div>
				<div class="pubBottomBT c_paddingV pubCnt">
					<button type="button" class="ui-btn lBtn" @click="publish({type: type})">{{ pubTxt }}</button>
					<button type="button" v-if="type!='pub'" class="ui-btn lBtn del" @click="delVersion()">删除此次发布</button>
					<button type="button" v-if="isDraft|| type==='pub'" class="ui-btn btn-grey btn-grey-shadow" @click="publish({isDraft: true})">存草稿</button>
					<button type="button" class="ui-btn btn-blank" @click="changeTab(0)">取消</button>
				</div>

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
				tab: 0,
				branches: [],
				selBranch: 0,
				showBranchList: false,
				username: '',
				reponame: '',
				storeItem: {},

				label: '',
				title: '',
				content: '',
				isPrePublish: false,

				type: 'pub', // pub,普通发布；edit，编辑
				id: '',	// 编辑需要用到的id
				isDraft: false, // 是否为草稿
				attachSetting:[],
				attachUrl:window.domains.apiDomain+"/releases/attachments",
				attachFiles:[],
				attachFilelist:[],
				pubTxt: '发布版本',

				release: [] //版本列表
			}
		},
		methods: {

			// 回到代码仓库
			goBack() {
				this.$router.push('/' + this.username + '/' + this.repoName);
			},

			// 个人中心(首页)
			goPerson(username) {
				this.$router.push('/' + username);
			},
            attrUrl(uuid){
              window.open(window.domains.apiDomain+"/attachments/"+uuid);
			},
			// 编辑
			edit(item) {
				// 标记为编辑状态
				this.type = 'edit';

				this.id = item.id;
				this.label = item.lower_tag_name;
				this.title = item.title;
				this.content = item.note;
				// 是否是预发行
				this.isPrePublish = item.is_prerelease;
				// 是否是草稿
				this.isDraft = item.is_draft;
				this.attachFiles=[];
				this.attachFilelist=[];
				 for(var it of item.attachments.attachments){
					   this.attachFiles.push(it.uuid);
					   this.attachFilelist.push(it);
				   }
				
                //this.attachFiles = this.getFileArrByFiles();
				this.pubTxt = this.isDraft  ? '发布版本' : '编辑发布信息';
				this.changeTab(1);
			},

			// 删除此次发布
			delVersion() {
				let owner = this.username;
				let repo = this.repoName;
				axios.get(`/repos/${owner}/${repo}/releases/${this.id}`).then(resp => {
					InfoMsg.suc('delete sucess');
					this.getReleaseList();
					this.changeTab(0)
				}).catch(Err)
			},

			getReleaseList() { //获取版本列表
				let owner = this.username
				let repo = this.repoName
				axios.post(`/repos/${owner}/${repo}/releases`,{
					after:''
				}).then(resp => {
					let list = resp.data.releases.releases
					this.release = list
				}).catch(Err)
			},
//parseInt(attachSetting.max_files)
			//			saveDraft() {
			//				this.publish(true)
			//			},
			publish(obj) {
				let tag_name = this.label
				let target = this.branches[this.selBranch].name
			  
			   
				if(isStrEmpty(tag_name)) {
					InfoMsg.warn('tag name is empty')
					return;
				}

				if(isStrEmpty(this.title)) {
					InfoMsg.warn('title is empty')
					return;
				}

				if(isStrEmpty(this.content)) {
					InfoMsg.warn('content is empty')
					return;
				}
   
				let params = {
					tag_name: tag_name,
					target: target,
					title: this.title,
					content: this.content,
					draft: obj.isDraft ? true : false,
					prerelease: this.isPrePublish,
					files:this.attachFiles
				}

				// 是否为编辑
				let isEdit = obj.type && obj.type === 'edit' ? true : false;

				isEdit && Object.assign(params, {id: this.id});

				let _type = isEdit ? 'edit' : 'add';
				

				let owner = this.username
				let repo = this.repoName

				axios.post(`/repos/${owner}/${repo}/release/${_type}`,params).then(resp => {
					InfoMsg.suc('操作成功')
					this.changeTab(0);
					// 刷新列表
					this.getReleaseList();
					this.type = 'pub';
				}).catch(Err)

			},
            getAttachSetting(){
				axios.get(`/repos/${this.username}/${this.repoName}/release/attachment/setting`,
				{params:{owner:this.username,repo:this.repoName}}).then(resp=>{
                       this.attachSetting=resp.data
					   //console.log(resp.data)
				}).catch(Err)
			},
			changeTab(tab) {
				this.tab = tab
			},
			loadBranches() {
				let owner = this.username
				let repo = this.repoName
				axios.get(`/repos/${owner}/${repo}/branches`).then(resp => {
					let list = resp.data.branches
					if(list == null) {
						InfoMsg.warn('branch list is empty')
						return;
					}
					this.branches = list
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
			AttaSuccess(response, file, fileList){
				this.attachFiles = this.getFileArrByFiles(fileList);
			}

		},
		computed: {
			selBranchObj: function() {
				let branch = this.branches[this.selBranch]
				return branch || {};
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
            // 仓库的拥有者
            var that = this;
            this.$getUser(this.username, function(user) {
                that.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                that.repo= repo;
            });
			this.loadBranches() //发版时候需要
			this.getReleaseList() //获取版本
			this.getAttachSetting()

		},
		mounted() {

		}

	}
</script>

<style scoped>
	.cursor-pointer {
		cursor: pointer;
	}
	.edit {
		width:17px;
		margin-left:4px;
		vertical-align: middle;
		cursor: pointer;
	}
	.del {
		background-color: #c33835;
		box-shadow: 2px 5px 12px rgba(195, 56, 53, 0.25);
	}
	.sha1 {
		font-size: 12px;
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
	
	.versionLeft {
		border-right: 1px solid #D3D9E6;
		width: 160px;
		position: relative;
		padding-right: 17px;
		text-align: right;
	}
	
	.versionLeft.dot:after {
		content: '';
		display: table;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #308EFF;
		position: absolute;
		right: -5px;
		top: 0;
	}
	
	.attach {
		height: 40px;
	}
	
	.attach img {
		width: 20px;
	}
	
	.pdHeight {
		height: 70px;
	}
	
	.txtDesc {
		white-space: normal;
		word-wrap: break-word;
		word-break: break-all;
		margin: 0 0 20px 0;
	}
	/*version pub edit*/
	
	.pubTitle {
		margin-top: 8px;
	}
	
	.pubLabel {
		display: inline-block;
		width: 33px;
		white-space: nowrap;
		margin-right: 5px;
	}
	
	.pubCnt {
		margin-left: 40px;
	}
	
	.pubCntWidth {
		width: 666px;
	}
	
	.pubCntHeight {
		height: 146px;
	}
</style>