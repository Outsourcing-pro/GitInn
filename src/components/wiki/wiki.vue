<template>
	<div>
		<div v-show="!hasWiki" class="c_flexCol flexCenter c_contentBody c_white_bg" style="text-align: center;margin-top: 0;">

			<div>
				<img src="~img/src/wiki.svg" style="width: 108px;" alt="" />
			</div>
			<div class="c_bold ft24" style="margin-top:30px;">欢迎使用Wiki</div>
			<div class="c_gray_txt" style="margin-top:7px;">Wiki 是用于共同协作文档的地方，清晰的文档可以帮助其他人深入了解您的项目。</div>
			<div style="margin-top: 60px;">
				<button type="button" class="ui-btn" @click="routerWikiCreate()">开始编辑</button>
			</div>

		</div>
		<div v-show="hasWiki" class=" c_white_bg c_padding c_paddingV" style="margin-top: 0;">
			<div class="c_flexRow c_bottom_line dashed WKDHeader">
				<div>
					<div class="ft20 c_bold">{{oneWiki.title}}</div>
					<div class="c_gray_txt ft12">{{oneWiki.committer}} 于 {{$distanceInWords(oneWiki.updated)}} 修改了此页面</div>
				</div>
				<div class="c_flexOne"></div>
				<div class="c_right_margin">
					<button type="button" class="ui-btn btn-blank adjBt" @click="edit()">修改</button>
					<button type="button" class="ui-btn btn-green adjBt" @click="routerWikiCreate()">新页面</button>
					<button type="button" class="ui-btn btn-danger adjBt" style="margin-right: 0;" @click="deleteItem">删除</button>
				</div>
			</div>
			<div style="margin-top: 44px;" class="c_flexRow">
				<div class="WKDLeft alignSelfStart">
                    <div class="ui segment markdown" v-html="oneWiki.markdown_content"></div>
				</div>
				<div class="WKDRight alignSelfStart c_darkGray_text">
					<div class="c_small_panel">
						<div class="spHeader c_flexRow flexStart">页面列表</div>
						<div class="spItem c_flexRow flexStart" v-for="wiki in wikiList" @click="getOneWiki(wiki)">
							{{wiki.title}}
						</div>
					</div>
					<div class="c_small_panel">
						<div class="spHeader c_flexRow flexStart">克隆到本地</div>
						<div>
							<div class="WKDDownLoad">
								<div class="c_flexRow c_inline_border" style="height: 37px;">
									<input type="text" value="https://git.proginn.com/u168" class="inline_border_item WKDDownLoadInput" />
									<div style="padding:10px;" class="inline_border_item c_pointer">
										<img src="~img/src/下载.svg" alt="" />
									</div>
								</div>
							</div>

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
				hasWiki: false,
				oneWiki: {},
				wikiList: [],
                username: '',
                repo: {},
                repoName: '',
                wikiUrl: null,
			}
		},
		methods: {
			deleteItem() {
				if(this.oneWiki.content == null) return;
				let owner = this.username
				let repo = this.repoName
				let url = this.oneWiki.url
				axios.post(`/repos/${owner}/${repo}/wiki/delete`, {
					url: url
				}).then(resp => {
					InfoMsg.suc('删除成功')
					this.oneWiki = {}
					this.loadWiki()
				}).catch(Err)

			},

			getOneWiki(url) {
				axios.get(`/repos/${this.username}/${this.repoName}/wiki/${url}`).then(resp => {
					this.oneWiki = resp.data
				}).catch(Err)
			},
			routerWikiCreate() {
				this.$router.push({
					path: `/${this.username}/${this.repoName}/wiki/create`
				})
			},

			edit() {
				this.$router.push({
                    path: `/${this.username}/${this.repoName}/wiki/edit/${this.oneWiki.url}`
                })
			},
			loadWiki() {
				axios.get(`/repos/${this.username}/${this.repoName}/wiki`).then(resp => {
					this.wikiList = resp.data.wikis
					if(this.wikiList.length > 0) {
						this.hasWiki = true;
						this.getOneWiki(this.wikiUrl || this.wikiList[0].url)
					}
				}).catch(Err)
			},
			initData() {
			    this.self = this.$getSelf();
                this.username = this.$route.params.username
                this.repoName = this.$route.params.repoName
                this.wikiUrl  = this.$route.params.wikiUrl
                // 仓库的拥有者
                var that = this;
                this.$getUser(this.username, function(user) {
                    that.user= user;
                });
                // 仓库信息
                this.$getRepo(this.username, this.repoName, function(repo) {
                    that.repo= repo;
                });
            }
		},
		computed: {

		},
		components: {
			'store-tab': StoreTab
		},
		created() {
			this.initData()
			this.loadWiki()
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
	
	.CDPushHeader {
		padding: 0 27px;
		height: 50px;
	}
	
	.CDPushBody {
		min-height: 80px;
	}
	/*wiki style*/
	
	.WKDHeader {
		height: 84px;
	}
	
	.WKDLeft {
		width: 830px;
		padding-right: 22px;
		border-right: 1px solid #E7EDF4;
		white-space: pre;
		word-wrap: break-word;
		word-break: break-all;
	}
	
	.WKDRight {
		width: 302px;
	}
	
	.WKDDownLoad {
		padding: 24px;
		/*height: 35px;*/
	}
	
	.WKDDownLoadInput {
		padding: 10px;
		width: 100%;
	}
	
	.adjBt {
		min-width: 80px;
		width: 80px;
		padding: 0;
		line-height: 36px;
	}
</style>