<template>
	<div>
		<!-- 新增里程碑 -->
		<div class="c_white_bg c_padding c_paddingV">
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
					<!--<div class="c_block_margin"><input type="text" readonly :value="cDateLabel" class="c_input_line" /></div>-->
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

				isUpdate: false,
				updateItem: {},
				ctitle: '',
				cdesc: '',
				cdate: null,
			}
		},
		methods: {
			createMilestone() {
				if(isStrEmpty(this.ctitle)) {
					InfoMsg.warn('标题不能为空')
					return;
				}

				if(isStrEmpty(this.cdesc)) {
					InfoMsg.warn('描述不能为空')
					return;
				}

				let username = this.username
				let reponame = this.repoName

				if(this.isUpdate) {
					let id = this.updateItem.id
					if(isStrEmpty(id)) {
						InfoMsg.warn('id is empty')
						return;
					}

					axios.post('/repos/' + username + '/' + reponame + '/milestones/' + this.updateItem.id, {
						title: this.ctitle,
						description: this.cdesc,
						deadline: this.cdate
					}).then(resp => {
						InfoMsg.suc('更新成功')
						this.resetEditState()
						this.loadMilestone()
					}).catch(err => Err(err))

				} else {
					axios.post('/repos/' + username + '/' + reponame + '/milestones', {
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
            console.log('milestone create')
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