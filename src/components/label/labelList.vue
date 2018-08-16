<template>
	<div v-show="tab==0">
		<div class="c_white_bg">
			<div class="c_paddingV c_padding">
				<div class="c_flexRow">
					<div class="c_flexRow">
						<div v-if="repo.enable_issues" class="c_imBT  c_border_rad3" @click="$router.push({path: `/${username}/${reponame}/issues`})">工单</div>
						<div class="c_imBT" @click="$router.push({path: `/${username}/${reponame}/milestones`})">里程碑</div>
						<div class="c_imBT c_imBT_blue c_border_rad3" @click="$router.push({path: `/${username}/${reponame}/labels`})">标签</div>
					</div>

					<button type="button" class="ui-btn btn-green" v-show="!edit" @click="edit=true">
						创建标签
					</button>
				</div>
			</div>
			<div class="c_padding c_paddingV c_flexRow c_top_line" v-show="edit">
				<div class="c_flexRow">
					<input type="text" class="c_input c_margin-right15" style="width:300px" placeholder="请输入标签名字...." v-model="labelName" />
					<div class="c_flexRow c_border colorCnt">
						<span class="color_ind c_margin-right10" :style="{backgroundColor: labelColor}">
						</span>
						<span class="c_margin-right20">{{labelColor}}</span>
						<span class="c_margin-right20 c_gray_txt">|</span>
						<el-color-picker class="colorPicker c_flexRowCenter" v-model="labelColor"></el-color-picker>

					</div>
				</div>
				<button type="button" class="ui-btn btn-blue" @click="createLabel">
					{{isUpdate?'更新标签':'立即创建'}}
				</button>
			</div>
			<div class="c_padding c_paddingV">
				<div class="tmListItem c_bottom_line dashed">
					<span class="c_bold c_darkGray_text">{{labels.length}}个标签</span>
				</div>

				<div class="tmListItem c_flexRow c_bottom_line dashed" v-for="label in labels">
					<div>
						<button type="button" class="ui-btn btn-blank c_flexRow flexStart labelBT" :style="{color:label.color,borderColor:label.color}">
						<span style="display: inline-block;margin-top:2px;" class="c_wh16 iconfont icon-Groupx c_margin-right5"></span>
						{{label.name}}
					</button>
					</div>

					<div class="c_flexRow c_gray_txt">
						<img src="~img/src/icon/无法操作.svg" class="c_wh20" alt="" />
						<span class="" style="margin-right: 40px;">{{label.num_issues}} 个开启的工单</span>
						<img src="~img/src/编辑.svg" alt="" class="c_wh20" />
						<span class="c_margin-right20 c_pointer" @click="updateLabel(label)">编辑</span>

						<img src="~img/src/icon/删除.svg" class="c_wh20" alt="" />
						<span class="c_margin-right20 c_pointer" @click="deleteLabel(label)">删除</span>
					</div>
				</div>

			</div>
		</div>

	</div>

</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import signal from '@/signal'
	import qs from 'qs'
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0,
				showSearchList: [],
				labels: [],
				selObjs: {
					sort_type: 'priority'
				},
				milestones: [],
				storeItem: {},
				self: {},
				ticketList: [],

				labelName: '',
				labelColor: '#000000',
				edit: false,
				isUpdate: false,
				updateItem:{},
				username: '',
				reponame: '',
				repo: ''
			}
		},
		methods: {
			resetEditState() {
				this.labelName = ''
				this.labelColor = '#000000'
				this.edit = false
				this.isUpdate = false
				this.updateItem={}
			},
			updateLabel(item){
				this.labelName =item.name
				this.labelColor = item.color
				this.edit = true
				this.isUpdate = true
				this.updateItem=item
			},
			createLabel() {
				if(isStrEmpty(this.labelName)) {
					InfoMsg.warn('标签不能为空')
					return;
				}

				if(isStrEmpty(this.labelColor)) {
					InfoMsg.warn('请选择颜色')
					return;
				}

				if(this.isUpdate) {
					let id = this.updateItem.id
					if(isStrEmpty(id)) {
						InfoMsg.warn('id is empty')
						return;
					}
					axios.post(`/repos/${this.username}/${this.reponame}/labels/${id}`, {
						name: this.labelName,
						color: this.labelColor
					}).then(resp => {
						InfoMsg.suc('更新标签成功')
						this.loadLabels()
						this.resetEditState()
					}).catch(err => Err(err))
				} else {
					axios.post(`/repos/${this.username}/${this.reponame}/labels`, {
						name: this.labelName,
						color: this.labelColor
					}).then(resp => {
						InfoMsg.suc('创建标签成功')
						this.loadLabels()
						this.resetEditState()
					}).catch(err => Err(err))
				}

			},
			deleteLabel(label) {
				axios.delete('/repos/' + this.username + '/' + this.reponame + '/labels/' + label.id).then(resp => {
					this.loadLabels()
				}).catch(err => Err(err))
			},
			loadLabels() {
				axios.get('/repos/' + this.username + '/' + this.reponame + '/labels').then(resp => {
					this.labels = resp.data.labels
				}).catch(err => Err(err))
			},
		},
		computed: {
		},
		components: {
			'store-tab': StoreTab,
			'menu-list': MenuList
		},
		created() {
		    // 登录用户
			this.self = this.$getSelf()
			this.username = this.$route.params.username
			this.reponame = this.$route.params.repoName
			// 仓库的拥有者
			var self = this;
            this.$getUser(this.username, function(user) {
                self.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.reponame, function(repo) {
                self.repo= repo;
            });
			this.loadLabels()
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
	
	.cRNavItem img {
		width: 10px !important;
	}
	
	.filterItem {
		margin-left: 25px;
	}
	
	.tmListItem {
		min-height: 60px;
	}
	
	.c_imBT {
		width: 90px;
		height: 36px;
		padding: 0;
		line-height: 36px;
	}
	
	.colorPicker {}
	
	.colorCnt {
		/*background-color: #F9F9F9;*/
	}
	
	.color_ind {
		width: 10px;
		height: 10px;
		margin-left: 30px;
		flex-shrink: 0;
		/*border: 2px solid white;*/
		border-radius: 50%;
	}
	
	.labelBT {
		min-width: 120px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>