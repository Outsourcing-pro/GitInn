<template>
	<div class="c_contentBody c_cnt_noColor">

		<div>
			<div class="c_white_bg c_padding">
				<div class="c_paddingV">
					<div class="c_flexRow">
						<div class="c_flexRow">
							<div class="c_imBT c_imBT_blue c_border_rad3">工单</div>
							<div class="c_imBT" @click="goMileStone">里程碑</div>
							<div class="c_imBT c_border_rad3" @click="goLabel">标签</div>
						</div>

						<button type="button" class="ui-btn btn-green">创建合并请求</button>
					</div>
				</div>
				<div class="c_block_margin c_bottom_line"></div>
				<!--<div class="c_darkGray_text c_paddingV" style="padding-bottom: 0;">
					<div class="ft26">#6 merge update</div>
					<div class="ft12" style="margin-top:7px;">u10468 请求将 0 次代码提交从 gitinn/jane 合并至 gitinn/master</div>
				</div>-->
				<div class="c_paddingV">
					<div class="ft26">#{{mergeItem.index}} {{mergeItem.title}}</div>
					<div class="c_flexRow flexStart" style="margin-top:10px;">
						<div class="c_flexRow c_margin-right10 c_label_normal c_purple_label"><img src="" style="width:17px;" alt="" />已合并</div>
						<div class="c_gray_txt">
							<span class="c_blue_color">{{mergeItem.poster.username}} </span>
							<span>于{{$distanceInWords(mergeItem.created)}}  将 {{commits.length}} 次代码提交从 </span>
							<span class="c_blue_color">{{mergeItem.pull_request.head_repo.full_name}}</span>
							<span>合并至 </span>
							<span>{{mergeItem.pull_request.base_repo.full_name}}</span>
						</div>

					</div>
				</div>

				<div class="c_bottom_line cntTile c_flexRow alignItemStrecth" style="">
					<div style="margin-left:20px;" class="cRNavItem  c_pointer c_flexRow c_active_bt_ind" @click="changeSubTab(0)" :class="{'c_gray_txt':subTab!=0,'active':subTab==0}">
						<span>对话 </span><span class="c_badge_normal c_gray_badge_bg">8</span>
					</div>
					<div class="cRNavItem c_pointer  c_flexRow c_active_bt_ind" @click="changeSubTab(1)" :class="{'c_gray_txt':subTab!=1,'active':subTab==1}">
						<span>代码提交</span>
					</div>
					<div class="cRNavItem  c_pointer c_flexRow c_active_bt_ind" @click="changeSubTab(2)" :class="{'c_gray_txt':subTab!=2,'active':subTab==2}">
						<span>文件变动 </span><span class="c_badge_normal c_gray_badge_bg">{{fileChangeNum}}</span>
					</div>

				</div>
				<router-view></router-view>

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
				mergeItem: {},
				commits: [],
				username:'',
				reponame:'',
				//				tab: 0,
				fileChangeNum: 0,
				subTab: 0
			}
		},
		methods: {
			getCommits(index) {
				if(isStrEmpty(index)) {
					InfoMsg.warn('index is empty')
					return;
				}
				let url = '/repos/' + this.username + '/' + this.reponame + '/issues/' + index + '/commits';

				axios.get(url).then(resp => {
					this.commits = resp.data.commits
				}).catch(Err)

			},
			goMileStone() {
				this.$router.push({
					name: 'milestonelist'
				})
			},
			goLabel() {
				this.$router.push({
					name: 'labellist'
				})
			},
			changeSubTab(index) {

				switch(index) {
					case 0:
						this.$router.push({
							name: 'mergerequestindex'
						})
						break;
					case 1:
						this.$router.push({
							name: 'codesubmitpage'
						})
						break;
					case 2:
						this.$router.push({
							name: 'filechangepage'
						})
						break;
					default:
						break;
				}
				this.subTab = index

			},

			keepRouterStatus(name) {

				switch(name) {
					case 'filechangepage':
						console.log('file change')
						this.subTab = 2;
						break;
					case 'codesubmitpage':
						this.subTab = 1;
						break;
					default:
						this.subTab = 0
						break;
				}

			}
		},
		beforeRouteUpdate(to, from, next) {
			let name = to.name
			//			this.keepRouterStatus(name)
			//			console.log('name :' + name)
			next()
		},
		computed: {

		},
		components: {
			'store-tab': StoreTab
		},
		created() {
			let name = this.$route.name
			this.keepRouterStatus(name)
			this.repo = localStorageEx.get('repo')
			this.username = this.repo.owner.username
			this.reponame = this.repo.name
			this.mergeItem = localStorageEx.get('mergeItem')

			signal.$on('merge_request:change_file_num', n => {
				this.fileChangeNum = n
			})


			
			try {
				this.getCommits(this.mergeItem.index)
			} catch(e) {
				Err(e)
			}

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
		padding: 22px;
		font-size: initial;
	}
	
	.mrUploadImg {
		/*width:800px;*/
		width: 100%;
		height: 144px;
		margin: auto;
	}
</style>