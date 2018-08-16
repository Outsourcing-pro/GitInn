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
			<div v-show="tab==0">
				<div class="c_white_bg c_padding">
					<div class="c_paddingV c_bottom_line">
						<div class="c_flexRow">
							<div class="c_flexRow btn-group">
								<div class="ui-btn-simple">标签管理</div>
								<div class="ui-btn-simple">里程碑</div>
							</div>

							<button type="button" class="ui-btn btn-green">创建合并请求</button>
						</div>
					</div>
					<div class="c_paddingV">
						<div class="ft26">#6 merge update</div>
						<div class="c_flexRow flexStart" style="margin-top:10px;">
							<div class="c_flexRow c_margin-right10 c_label_normal c_purple_label"><img src="" style="width:17px;" alt="" />已合并</div>
							<div class="c_gray_txt">
								<span class="c_blue_color">u10468 </span>
								<span>于3天之前  将 5 次代码提交从 </span>
								<span class="c_blue_color">gitinn/jane</span>
								<span>合并至 </span>
								<span>gitinn/master</span>
							</div>

						</div>
					</div>
					<div class="c_bottom_line  cntTile c_flexRow alignItemStrecth" style="">
						<div style="margin-left:25px;" class="cRNavItem  c_pointer c_flexRow c_active_bt_ind" @click="subTab=0" :class="{'c_gray_txt':subTab!=0,'active':subTab==0}">
							<span>对话</span> <span class="c_badge_normal c_gray_badge">8</span>
						</div>
						<div class="cRNavItem c_pointer  c_flexRow c_active_bt_ind" @click="subTab=1" :class="{'c_gray_txt':subTab!=1,'active':subTab==1}">
							<span>代码提交</span><span class="c_badge_normal c_gray_badge">8</span>
						</div>
						<div class="cRNavItem c_pointer  c_flexRow c_active_bt_ind" @click="subTab=1" :class="{'c_gray_txt':subTab!=2,'active':subTab==2}">
							<span>文件变动</span><span class="c_badge_normal c_gray_badge">2</span>
						</div>

					</div>
					<div class="c_paddingV c_flexRow">
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
					<div>
						<div class="comparePanel c_border c_border_rad3">

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