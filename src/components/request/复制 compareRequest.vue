<template>
	<div class="c_white_bg c_padding c_paddingV">

		<div class="c_darkGray_text">
			<div class="ft26 c_bold">对比文件变化</div>
			<div class="ft12" style="margin-top:7px;">对比两个分支间的文件变化并发起一个合并请求。</div>
		</div>
		<div class="c_block_margin c_flexRow flexStart">
			<img src="~img/src/合并请求.svg" style="margin-right: 20px;width:20px;" alt="" />
			<div class="c_select_style c_margin-right10">基准分支: master</div>
			<span class="c_margin-right10">...</span>
			<div class="c_select_style c_margin-right10">对比分支: dev </div>
		</div>

		<div class="c_flexRow alignItemStart">
			<div class="mrLeft">

				<div class="mrLeftItem c_border c_border_rad3">
					<div class="c_flexRow flexStart">
						<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+require('img/headImg/nv06.jpg')+')',marginRight:'14px'}"></div>
						<div><span class="c_blue_color c_margin-right4">小猫咪</span><span class="c_gray_txt ft12">3天前</span></div>
						<div class="c_flexOne"></div>
						<div>
							<img src="~img/src/编辑.svg" class="c_wh20 smallIconImg" alt="" />
							<img src="~img/src/删除.svg" class="c_wh20 smallIconImg" alt="" />
						</div>

					</div>
					<div style="margin-left:60px;">
						<div>
							本质上，品质生活可能意味着你要多花些钱。因为中国人之前用的一些家居生活用品，确实多数偏低端。而你想要更好的，往往更贵。 除了铸铁锅，我第二个想到的厨房消费升级产品是菜板
						</div>
						<div class="upImgCnt c_flexRow flexStart">
							<img src="~img/headImg/nv07.jpg" v-for="n in 10" class="upImg" alt="" />
						</div>
					</div>
					<div class="editPanel">
						<div class="editHeader c_bottom_line c_flexRow flexStart alignItemStrecth">
							<div class="c_active_bt_ind active c_blue_color panelTabItem">编辑内容</div>
							<div class="c_active_bt_ind c_gray_txt panelTabItem">预览效果</div>

						</div>

						<div style="width:800px;margin: auto;">
							<input style="margin-top: 20px;" type="text" class="c_input_line" placeholder="请输入标题..." /><br>
							<textarea class="c_gray_txt" name="" rows="" cols=""></textarea>
							<div class=" c_border dashboard c_gray_bg c_flexCol flexCenter alignItemCenter mrUploadImg">
								<div><img src="~img/src/icon/上传文件.svg" style="width:32px;" alt="" /></div>
								<div class="c_darkGray_text">将文件拖拽到此处, 或<span class="c_link_txt c_pointer">点击上传</span></div>
							</div>
							<div class="c_paddingV">
								<button type="button" class="ui-btn btn-green">创建合并请求</button>
							</div>

						</div>

					</div>
				</div>

			</div>
			<div class="mrRight c_border c_border_rad3">
				<div class="mrRightItem c_bottom_line">
					<div class="c_bold c_flexRow flexStart">标签 <img class="c_wh20" src="~img/src/设置.svg" alt="" /></div>
					<div class="rItemLabel">未选择标签 </div>
				</div>
				<div class="mrRightItem c_bottom_line">
					<div class="c_bold c_flexRow flexStart">里程碑 <img class="c_wh20" src="~img/src/设置.svg" alt="" /></div>
					<div class="rItemLabel">未选择标签 </div>
				</div>
				<div class="mrRightItem c_bottom_line">
					<div class="c_bold c_flexRow flexStart">指派成员 <img class="c_wh20" src="~img/src/设置.svg" alt="" /></div>
					<div class="rItemLabel">未选择标签 </div>
				</div>
				<div class="mrRightItem">
					<div class="c_bold">15名参与者</div>
					<div class="c_block_margin">
						<div class="c_hd_img c_wh36 mrHDIcon" v-for="n in 12" :style="{backgroundImage:'url('+require('img/headImg/nv03.jpg')+')'}"></div>
					</div>
				</div>

			</div>
		</div>
		<div style="margin-top: 10px;" class="c_border c_border_rad3">
			<div class="c_flexRow flexStart c_gray_bg c_bottom_line  fileListItem c_right_margin">
				<span class="c_bold">次代码提交</span>
				<div class="c_gray_label c_green_label">u10468</div>
				<span>...</span>
				<div class="c_gray_label c_green_label">767943964e</div>
			</div>

			<div class="c_flexRow fileListItem c_bottom_line c_color_initial">
				<span class="" style="width: 340px;">作者</span>
				<span class="" style="width: 93px;margin-right: 15px;">SH1</span>
				<span class="c_flexOne" style="color:#465364">备注</span>
				<span>提交日期</span>
			</div>
			<div class="c_flexRow fileListItem c_bottom_line" v-for="n in 9">
				<div class="c_hd_img c_wh20 c_margin-right10" :style="{backgroundImage:'url('+require('img/headImg/nv07.jpg')+')'}"></div>
				<span class="c_blue_color" style="width: 300px;">src</span>
				<span class="c_gray_label c_textEllipsis" style="width: 93px;margin-right: 15px;">3sdfsd23239</span>
				<span class="c_flexOne" style="color:#465364">
							First working version
						</span>
				<span>3天前</span>
			</div>

		</div>
		<div class="c_flexRow c_block_margin">
			<div class="c_flexRow">
				<img src="~img/src/合并请求.svg" style="width:20px;margin-right:10px;" alt="" />
				<span>1 个文件被更改，包括 12 次插入 和 47 次删除</span>
			</div>
			<div class="c_flexOne"></div>
			<div class="btn-group">
				<div class="ui-btn-simple">分列视图</div>
				<div class="ui-btn-simple">文件统计</div>
			</div>
		</div>
		<div class="comparePanel c_border c_border_rad3" v-for="n in 2">
			<div class="comparePanelHeader c_bottom_line c_flexRow">
				<img src="~img/src/附件/压缩文件.svg" style="width:20px;" class="c_margin-right10" alt="" />
				<div class="c_flexOne">项目源代码.zip</div>
				<div class="ui-btn-simple c_border_rad3">查看文件</div>
			</div>
			<div class="comparePanelTitle c_flexRow">
				<span class="c_margin-right10">+64</span>
				<div class="CPProgressCnt c_gray_bg">
					<div class="c_green_bg CPProgress" style="width:50%;"></div>
				</div>
				<span class="c_green_txt" style="margin:0 35px">-0</span>
				<span class="c_gray_txt c_flexOne">GitInn 1.0/3_4_0_合并请求.html</span>
				<div class="ui-btn-simple c_border_rad3">查看文件</div>
			</div>
			<div class="comparePanelDes c_gray_bg">@@ -0,0 +1,64 @@</div>
			<div class="c_flexRow alignItemStrecth comparePanelCnt">
				<div class="comparePanelCntLeft c_darkGray_text">
					<span v-for="n in 20" class="comparePanelCntLeftItem">{{n}}</span>
				</div>
				<div class="comparePanelCntRight c_flexOne">
					<code style="white-space: pre-wrap;">
+﻿ &lt;!DOCTYPE html&gt;
+ &lt;html&gt;
+  &lt;head&gt;
+    &lt;title&gt;3.4.0 合并请求&lt;/title&gt;
+    &lt;meta http-equiv=&quot;X-UA-Compatible&quot; content=&quot;IE=edge&quot;/&gt;
+    &lt;meta http-equiv=&quot;content-type&quot; content=&quot;text/html; charset=utf-8&quot;/&gt;
+    &lt;meta name=&quot;apple-mobile-web-app-capable&quot; content=&quot;yes&quot;/&gt;
+    &lt;link href=&quot;resources/css/jquery-ui-themes.css&quot; type=&quot;text/css&quot; rel=&quot;stylesheet&quot;/&gt;
+    &lt;link href=&quot;resources/css/axure_rp_page.css&quot; type=&quot;text/css&quot; rel=&quot;stylesheet&quot;/&gt;
+    &lt;link href=&quot;data/styles.css&quot; type=&quot;text/css&quot; rel=&quot;stylesheet&quot;/&gt;
+    &lt;link href=&quot;files/3_4_0_合并请求/styles.css&quot; type=&quot;text/css&quot; rel=&quot;stylesheet&quot;/&gt;
+    &lt;script src=&quot;resources/scripts/jquery-1.7.1.min.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/jquery-ui-1.8.10.custom.min.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/axure/axQuery.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/axure/globals.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/axutils.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/axure/annotation.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/axure/axQuery.std.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;resources/scripts/axure/doc.js&quot;&gt;&lt;/script&gt;
+    &lt;script src=&quot;data/document.js&quot;&gt;&lt;/script&gt;
						</code>
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
		/*padding: 22px;*/
		padding: 10px 0;
		font-size: initial;
	}
	
	.mrUploadImg {
		/*width:800px;*/
		width: 100%;
		height: 144px;
		margin: auto;
	}
	
	.CRListHead {
		height: 40px;
		padding: 0 25px;
	}
	
	.fileListItem {
		padding: 2px 12px;
		height: 36px;
	}
</style>