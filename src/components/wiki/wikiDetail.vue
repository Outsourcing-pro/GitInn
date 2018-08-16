<template>
	<div class="c_contentBody c_cnt_noColor">
		<div class="c_flexRow storeHeader">
			<div class="c_flexRow">
				<div class="c_bg_img c_wh50 c_margin-right6" :style="{'background-image':'url('+require('img/headImg/nv05.jpg')+')'}"></div>
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
			<div v-show="tab==0" class=" c_white_bg c_padding c_paddingV" style="margin-top: 0;">
				<div class="c_flexRow c_bottom_line dashed WKDHeader">
					<div>
						<div class="ft20 c_bold">程序员客栈简介</div>
						<div class="c_gray_txt ft12">猫行天下 于 3 周之前 修改了此页面</div>
					</div>
					<div class="c_flexOne"></div>
					<div class="c_right_margin">
						<button type="button" class="ui-btn btn-blank adjBt">修改</button>
						<button type="button" class="ui-btn btn-green adjBt">新页面</button>
						<button type="button" class="ui-btn btn-danger adjBt" style="margin-right: 0;">删除</button>
					</div>
				</div>
				<div style="margin-top: 44px;" class="c_flexRow">
					<div class="WKDLeft c_darkGray_text alignSelfStart">
						程序员客栈-程序员的经纪人，中国最大的中高端程序员线上工作平台。我们签约经验丰富的程序员，采用线上组队开发和云端工作等方式，帮助企业解决软件开发和技术用人难题，为中高端程序员提供稳定的线上工作机会：自由工作、远程工作、兼职工作。 使命与愿景 1. 程序员客栈的使命是为程序员服务，当好程序员的经纪人。 2. 当前阶段我们的愿景是服务好中高端程序员，对程序员的了解理解数据化，让平台+优质个人取代公司+雇员，改变程序员的工作方式。 3. 未来我们服务顶尖程序员，和他们一起改进提升行业生产效率，成为新理念、新技术、新标准的发源地。 里程碑 ·程序员客栈成立时间等重要事件 ·2014年10月 程序员客栈项目筹备启动 ·2015年3月 程序员展示 V1.0 - 程序员客栈汇聚了全球优秀华人程序员。我们通过履历、作品、专业社区影响力、技能帮助程序员立体地展现成就，不被简历束缚，让收入、机遇和伙伴主动来找您。 ·2015年9月 平台派单 V2.0 - 程序员客栈是自由远程工作开创者，云端组队，企业的远程技术中心：雇佣BAT级别开发者； 24个小时内启动项目；成功率翻倍，开发成本减半。 ·2016年3月 短期雇佣 V3.0 - 通过程序员客栈短期雇佣程序员远程、驻场工作，补齐紧缺人力，顺利高质且低成本完成工作目标。 ·2017年5月 完成300万天使轮融资，资方为知名早期机构紫辉创投。在国内程序员共享工作领域，程序员客栈排名第一。平台用户数10万，月流水100万，程序员每次工作平均收入7000元。
					</div>
					<div class="WKDRight alignSelfStart c_darkGray_text">
						<div class="c_small_panel">
							<div class="spHeader c_flexRow flexStart">页面列表</div>
							<div class="spItem c_flexRow flexStart" v-for="n in 4">
								程序员客栈简介
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
		</store-tab>

	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0
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
	
	.WKDHeader {
		height: 84px;
	}
	
	.WKDLeft {
		width: 830px;
		padding-right: 22px;
		border-right: 1px solid #E7EDF4;
		white-space: normal;
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