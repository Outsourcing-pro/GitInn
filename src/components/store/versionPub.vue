<template>
	<div class="c_contentBody c_cnt_noColor">
		<div class="c_flexRow storeHeader">
			<div class="c_flexRow">
				<div class="c_bg_img c_wh50 c_margin-right6" :style="{'background-image':'url('+''+')'}"></div>
				<span>Anton/<span class="c_blue_color">random</span></span>

			</div>
			<div class="c_flexOne"></div>

			<div class="c_flexRow">
				<div class="c_flexRow c_white_bg whiteBlockIcon c_margin-right6 c_gray_txt">
					<img src="~img/src/icon/关注.svg" style="width:16px;" alt="" />
					<span>关注</span>
					<span style="margin-left:15px;" class="alignSelfStretch c_border_right"></span>
					<span class="c_bold">23</span>
				</div>
				<div class="c_flexRow c_white_bg whiteBlockIcon c_margin-right6 c_gray_txt">
					<img src="~img/src/icon/赞.svg" style="width:16px;" alt="" />
					<span>点赞</span>
					<span style="margin-left:15px;" class="alignSelfStretch c_border_right"></span>
					<span class="c_bold">23</span>
				</div>
				<div class="c_flexRow c_white_bg whiteBlockIcon c_gray_txt">
					<img src="~img/src/icon/派生.svg" style="width:16px;" alt="" />
					<span>派生</span>
					<span style="margin-left:15px;" class="alignSelfStretch c_border_right"></span>
					<span class="c_bold">23</span>
				</div>

			</div>
		</div>

		<store-tab :tab.sync="tab">
			<div v-show="tab==0">
				<div class="c_white_bg c_padding c_paddingV">
					<div class="pubTitle">
						<div class="ft20">发布新版本</div>
						<div class="c_gray_txt ft12">发布版本对产品进行迭代。</div>
					</div>
					<div class="cBigMargin">
						<div class="c_flexRow flexStart">
							<span class="pubLabel">标签:</span>
							<input class="c_input" style="width:243px;" type="text" placeholder="请输入标签名称..." />
							<span style="margin: 0 14px;">@</span>
							<div class="c_icon_input" style="width:190px;">
								<img src="~img/src/icon/分支.svg" style="width: 14px;" class="left" />
								<input type="text" class="c_input" placeholder="" name="" id="" value="" />
								<img src="~img/src/多层级_下.svg" style="width: 5px;" class="right" />
							</div>
						</div>
						<div class="pubCnt c_gray_txt ft12">
							选择或创建一个已经存在的标签
						</div>

					</div>
					<div class="cBigMargin c_flexRow flexStart">
						<span class="pubLabel">标题:</span>
						<input class="c_input pubCntWidth" type="text" placeholder="输入标题..." />
					</div>

					<div class="cBigMargin c_flexRow flexStart">
						<span class="pubLabel alignSelfStart" style="margin-top:7px;">内容:</span>
						<textarea class="c_input pubCntWidth pubCntHeight" placeholder="输入标题..."></textarea>
					</div>
					<div class="cBigMargin c_flexRow flexStart">
						<span class="pubLabel alignSelfStart" style="margin-top:7px;">文件:</span>
						<div class="pubCntWidth pubCntHeight c_border dashboard c_gray_bg c_flexCol flexCenter alignItemCenter">
							<div><img src="~img/src/icon/上传文件.svg" style="width:32px;" alt="" /></div>
							<div class="c_darkGray_text">将文件拖拽到此处, 或<span class="c_link_txt c_pointer">点击上传</span></div>
						</div>
					</div>
					<div class="cBigMargin pubCnt">
						<div class="c_flexRow flexStart">
							<div class="alignSelfStart"><input type="checkbox" /></div>
							<div>
								<div>预发行版本</div>
								<div class="ft12 c_gray_txt">我们会告知用户不建议将本次发布投入生产环境使用。</div>
							</div>

						</div>

					</div>
					<div class="c_bottom_line"></div>
					<div class="pubBottomBT c_paddingV pubCnt">
						<button type="button" class="ui-btn lBtn">发布</button>
						<button type="button" class="ui-btn btn-grey btn-grey-shadow">存草稿</button>
						<button type="button" class="ui-btn btn-blank">取消</button>
					</div>

				</div>

			</div>
		</store-tab>

	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'

	export default {
		data() {
			return {
				tab: 0,
				
			}
		},
		methods: {

		},
		computed: {

		},
		components: {
			'store-tab': StoreTab
		},
		created() {
this.storeItem = localStorageEx.get('storeItem')
			this.username = this.storeItem.owner.username
			this.reponame = this.storeItem.name
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