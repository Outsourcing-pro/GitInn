<template>
	<div class="c_contentBody c_cnt_noColor">

		<div>
			<div class="c_white_bg c_padding">
				<!--<div class="c_paddingV c_bottom_line">
					<div class="c_flexRow">
						<div class="c_flexRow btn-group">
							<div class="ui-btn-simple">标签管理</div>
							<div class="ui-btn-simple">里程碑</div>
						</div>

						<button type="button" class="ui-btn btn-green">创建工单</button>
					</div>
				</div>-->

				<div class="c_paddingV">
					<div class="c_border c_border_rad3">
						<div class="c_flexRow flexStart c_gray_bg c_bottom_line  c_fileListItem c_right_margin">
							<span class="c_bold">{{commits.length}}次代码提交</span>
						</div>
						<div class="c_flexRow c_fileListItem c_bottom_line c_color_initial">
							<span class="" style="width: 340px;">作者</span>
							<span class="" style="width: 93px;margin-right: 15px;">SH1</span>
							<span class="c_flexOne" style="color:#465364">备注</span>
							<span>提交日期</span>
						</div>
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
				</div>
			</div>

		</div>

	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0,
				storeItem: {},
				mergeItem: {},
				username: '',
				reponame: '',

				commits: []
			}
		},
		methods: {
			routerCodeDetail(item) {
				this.$router.push({path: `/${this.username}/${this.reponame}/commit/${item.id}`})
			},

			getCommits(index) {
				if(isStrEmpty(index)) {
					InfoMsg.warn('index is empty')
					return;
				}
				let url = '/repos/' + this.username + '/' + this.reponame + '/issues/' + this.getIssueId + '/commits';

				axios.get(url).then(resp => {
					this.commits = resp.data.commits
				}).catch(Err)
			}
		},
		computed: {
			// 获取工单id
			getIssueId() {
				return this.$route.params.issueId;
			},
		},
		components: {
			'store-tab': StoreTab
		},
		created() {
			this.username = this.$route.params.username
			this.reponame = this.$route.params.repoName
			
			this.getCommits(this.getIssueId);
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
		width: inherit;
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
	
	.cRNavItem .c_badge_normal {
		margin-right: 0;
	}
	
	.cRNavItem img {
		width: 10px !important;
	}
	
	.filterItem {
		margin-left: 25px;
	}
	
	.MRLListItem {
		height: 95px;
	}
	
	.c_imBT {
		width: 90px;
		height: 36px;
		padding: 0;
		line-height: 36px;
	}
	
	.chatAlert {
		text-align: right;
		height: 20px;
		margin-bottom: 7px;
	}
	
	.chatAlert img {
		width: 14px;
		margin-right: 5px;
	}
	
	.MRLListItem {
		/*padding-top:22px;*/
	}
	
	.MRLListItemLabel {
		color: white;
		border-radius: 3px;
		padding: 4px 14px;
		margin-right: 10px;
	}
</style>