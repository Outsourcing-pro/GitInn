<template>
	<div>
		<div class="c_white_bg" v-show="!edit">
			<div class="c_paddingV c_padding">
				<div class="c_flexRow">
					<div class="c_flexRow">
						<div class="c_imBT  c_border_rad3" @click="$router.push({path: `/${username}/${repoName}/issues`})">工单</div>
						<div class="c_imBT c_imBT_blue" @click="$router.push({path: `/${username}/${repoName}/milestones`})">里程碑</div>
						<div class="c_imBT c_border_rad3" @click="$router.push({path: `/${username}/${repoName}/labels`})">标签</div>
					</div>

					<!-- <button type="button" class="ui-btn btn-green" @click="addMilestone"> -->
					<button type="button" class="ui-btn btn-green" @click="edit=true">
							新建里程
					</button>
				</div>
			</div>
			<div class="c_bottom_line cntTile c_flexRow alignItemStrecth" style="">
				<div class="cRNavItem  c_pointer c_flexRow" @click="subTab=0" :class="{'c_gray_txt':subTab!=0,'active':subTab==0,'c_active_bt_ind':subTab==0}">
					<img class="itemDot" src="~img/src/灰色点.svg" v-show="subTab!=0" alt="" />
					<img class="itemDot" src="~img/src/绿点.svg" v-show="subTab==0" alt="" /> 开启中 {{openedMilestones}}
				</div>
				<div class="cRNavItem c_pointer  c_flexRow" @click="subTab=1" :class="{'c_gray_txt':subTab!=1,'active':subTab==1,'c_active_bt_ind':subTab==1}">
					<img class="itemDot" src="~img/src/灰色点.svg" v-show="subTab!=1" alt="" />
					<img class="itemDot" src="~img/src/绿点.svg" v-show="subTab==1" /> 已关闭 {{closedMilestones}}
				</div>
				<div style="flex: 1;"></div>

			</div>
			<div class="c_padding c_paddingV">
				<div class="tmListItem c_flexRow c_bottom_line dashed" v-for="item in filterMilestones">
					<div class="ItemLeft">
						<div class="c_flexRowStart">
							<img src="~img/src/icon/里程碑.svg" class="c_wh20 c_margin-right4" alt="" />
							<span class="c_bold">{{item.title}}</span>
						</div>
						<div class="ft13 c_gray_txt c_flexRow">
							<img src="~img/src/icon/时间.svg" class="c_wh20" alt="" />
							<span class="c_margin-right20">{{$cmmDate(item.deadline,1)}}</span>
							<img src="~img/src/icon/无法操作.svg" class="c_wh20" alt="" />
							<span class="c_margin-right20">{{item.open_issues}}个开启中</span>
							<img src="~img/src/icon/关闭工单.svg" class="c_wh20" alt="" />
							<span class="">{{item.close_issues}}个已关闭</span>
						</div>
						<div>{{item.description}}</div>

					</div>
					<div class="ItemRight">
						<div class="pg_cnt">
							<div class="pg_cnt_item" :style="{width:item.completeness}">{{item.completeness}}%</div>
						</div>

						<div class="c_flexRow flexEnd c_darkGray_text rgithDesc ft12">
							<img src="~img/src/编辑.svg" class="c_wh20 c_margin-right10" alt="" />
							<span class="c_margin-right30 c_pointer" @click="editMilestone(item)">编辑</span>
							<img src="~img/src/关闭.svg" class="c_wh20 c_margin-right10" alt="" v-show="!item.is_closed" />
							<img src="~img/src/icon/开启.svg" class="c_wh20 c_margin-right10" alt="" v-show="item.is_closed" />
							<span class="c_margin-right30 c_pointer" v-show="!item.is_closed" @click="updateMilestoneState(item,true)">关闭</span>
							<span class="c_margin-right30 c_pointer" v-show="item.is_closed" @click="updateMilestoneState(item,false)">开启</span>
							<img src="~img/src/icon/删除.svg" class="c_wh20 c_margin-right10" alt="" />
							<span class="c_margin-right10 c_pointer" @click="deleteMilestone(item)">删除</span>
						</div>

					</div>
				</div>
			</div>
		</div>

		<!-- 新增里程碑 -->
		<div class="c_white_bg c_padding c_paddingV" v-show="edit">
			<div class="c_bottom_line dashed" style="padding-bottom:20px;margin-bottom: 10px;">
				<div class="c_bold ft20">
					新的里程碑
				</div>
				<div class="ft12 c_gray_txt">创建里程碑来更好地组织您的工单。</div>
			</div>
			<div class="c_flexRow alignItemStart c_bottom_line dashed" style="padding-bottom: 20px;">
				<div class="c_flexOne">
					<div class="inputSec">
						<div>
							<span class="c_bold ft13">标题</span>
						</div>
						<div>
							<input type="text" class="c_input_line" v-model="ctitle" placeholder="请输入标题" />
						</div>
					</div>
					<div class="inputSec">
						<div>
							<span class="c_bold ft13">描述</span></div>
						<div>
							<textarea class="c_textArea" name="" rows="" v-model="cdesc" cols="" placeholder="请输入描述"></textarea>
						</div>
					</div>
				</div>

				<div class="datePicker">
					<div class="c_bold">截止日期 (可选)</div>
					<div>
						<el-date-picker v-model="cdate" type="date" placholder="请选择日期"></el-date-picker>
					</div>
				</div>
			</div>
			<div class="c_block_margin">
				<button class="ui-btn btn-green c_margin-right10" @click="createMilestone">确定</button>
				<button class="ui-btn btn-blank" @click="edit=false">取消</button>
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

				edit: false,
				isUpdate: false,
				updateItem: {},
				ctitle: '',
				cdesc: '',
				cdate: null,
				username: '',
				repoName: '',
				repo: ''
			}
		},
		methods: {
			editMilestone(item) {
				this.edit = true
				this.isUpdate = true
				this.updateItem = item
				this.ctitle = item.title
				this.cdesc = item.description
				this.cdate = item.deadline

			},
			updateMilestoneState(item,close) {
				let id = item.id
				if(isStrEmpty(id)) {
					InfoMsg.warn('id is empty')
					return;
				}

				axios.post('/repos/' + this.username + '/' + this.repoName + '/milestones/' + id, {
//					title: item.title,
//					description: item.description,
//					deadline: item.deadline,
					state:close?'closed':'open'
				}).then(resp => {
					if(close){
						InfoMsg.suc('关闭成功')
					}else InfoMsg.suc('开启成功')
					
					this.resetEditState()
					this.loadMilestone()
				}).catch(err => Err(err))
			},
			deleteMilestone(item) {
				axios.delete('/repos/' + this.username + '/' + this.repoName + '/milestones/' + item.id).then(resp => {
					InfoMsg.suc('删除成功')
					this.loadMilestone()
				}).catch(err => Err(err))
			},

			resetEditState() {
				this.edit = false
				this.isUpdate = false
				this.updateItem = {}
				this.ctitle = ''
				this.cdesc = ''
				this.cdate = ''
			},
			// 新增里程碑
			addMilestone() {
				this.$router.push({path: `/${this.username}/${this.repoName}/milestones/create`});
			},
			createMilestone() {
				if(isStrEmpty(this.ctitle)) {
					InfoMsg.warn('标题不能为空')
					return;
				}

				if(isStrEmpty(this.cdesc)) {
					InfoMsg.warn('描述不能为空')
					return;
				}

				if(this.isUpdate) {
					let id = this.updateItem.id
					if(isStrEmpty(id)) {
						InfoMsg.warn('id is empty')
						return;
					}

					axios.post('/repos/' + this.username + '/' + this.repoName + '/milestones/' + this.updateItem.id, {
						title: this.ctitle,
						description: this.cdesc,
						deadline: this.cdate
					}).then(resp => {
						InfoMsg.suc('更新成功')
						this.resetEditState()
						this.loadMilestone()
					}).catch(err => Err(err))

				} else {
					axios.post('/repos/' + this.username + '/' + this.repoName + '/milestones', {
						title: this.ctitle,
						description: this.cdesc,
						deadline: this.cdate
					}).then(resp => {
						InfoMsg.suc('创建成功')
						this.resetEditState()
						this.loadMilestone()
					}).catch(err => {
						Err(err)
					})
				}

			},
			loadLabels() {
				axios.get('/repos/' + this.username + '/' + this.repoName + '/labels').then(resp => {
					this.labels = resp.data.labels
				}).catch(err => Err(err))
			},
			loadMilestone() {
				axios.get('/repos/' + this.username + '/' + this.repoName + '/milestones').then(resp => {
					this.milestones = resp.data.milestones
				}).catch(err => Err(err))
			}
		},
		computed: {
			filterMilestones() {
				return this.milestones.filter((item) => {
					let show = false
					if(this.subTab == 0 && !item.is_closed) {
						show = true
					}
					if(this.subTab == 1 && item.is_closed) {
						show = true
					}

					return show;
				})
			},
			openedMilestones() {
				return this.milestones.filter(item => {
					return !item.is_closed
				}).length
			},
			closedMilestones() {
				return this.milestones.length - this.openedMilestones
			},
			cDateLabel() {
				if(this.cdate == null) return '';
				return this.$dateFmt(this.cdate, 'YYYY-MM-DD');
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
			this.loadMilestone()
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
		min-height: 100px;
	}
	
	.c_imBT {
		width: 90px;
		height: 36px;
		padding: 0;
		line-height: 36px;
	}
	
	.pg_cnt {
		width: 316px;
		border-radius: 10px;
		background: #1D2A3A1F;
		font-size: 0;
		line-height: 0;
	}
	
	.pg_cnt_item {
		display: inline-block;
		height: 20px;
		font-size: 14px;
		line-height: 1.4;
		background: #23CD7E;
		border-radius: 10px;
		text-align: center;
		color: white;
	}
	
	.ItemRight {}
	
	.rgithDesc {
		margin-top: 15px;
	}
	
	.inputSec {
		margin-bottom: 20px;
		padding-bottom: 7px;
	}
	
	.datePicker {
		margin-left: 15px;
		margin-top: 20px;
		width: 302px;
		padding: 15px;
		border: 1px solid lightgray;
	}
</style>