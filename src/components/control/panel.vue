<template>
	<div class="c_cnt_noColor panelHeader c_flexRow alignItemStart">
		<div class="panelLeft c_white_bg c_padding c_paddingV">
			<div class="c_flexRow">
				<span class="c_bold ft16">开发提交数</span>
				<div class="c_flexRow c_gray_txt">
					<div class="panelHeadItem c_pointer c_flexRow c_relative" @click="showMenuList(0)">仓库<span class="c_arrowLb"></span>
						<menu-list :type="1" :show.sync="showListObj[0]">
							<ul>
								<li @click="setParam('repo')">不限</li>
								<li v-for="item in fRepos" @click="setParam('repo',item)">{{item.repo_name}}</li>
							</ul>
						</menu-list>
					</div>
					<div class="panelHeadItem c_pointer c_flexRow c_relative" @click="showMenuList(1)">用户<span class="c_arrowLb"></span>

						<menu-list :type="1" :show.sync="showListObj[1]">
							<ul>
								<li @click="setParam('user')">不限</li>
								<li v-for="user in users" @click="setParam('user',user)">{{user.name}}</li>
							</ul>
						</menu-list>
					</div>
					<div class="panelHeadItem c_pointer c_flexRow c_relative" @click="showMenuList(2)">时间<span class="c_arrowLb"></span>

						<menu-list :type="1" :show.sync="showListObj[2]">
							<ul>
								<li @click="setRangeType(0)">不限</li>
								<li @click="setRangeType(1)">当天</li>
								<li @click="setRangeType(2)">最近7天</li>
								<li @click="setRangeType(3)">最近30天</li>
								<li @click="setRangeType(4)">30天以前</li>
							</ul>
						</menu-list>
					</div>
				</div>
			</div>
			<div>
				<div id="chart" style="width: 100%;height:400px;"></div>
			</div>
			<div class="c_bottom_line  c_bold" style="padding:10px 0;">操作记录</div>
			<div>
				<div class="historyItem c_bottom_line" v-for="item in ctrlList">
					<!--{{item}}-->
					<!-- 新建仓库 -->
                    <div v-if="item.op_type==1">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">创建了仓库</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}`})">{{item.repo_name}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            <div>{{item.content}}</div>
                        </div>
                    </div>
                    <div v-if="item.op_type==2">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">重命名仓库</span>
                            <span class="c_gray_label">{{item.content}}</span>
                            <span>为</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}`})">{{item.repo_name}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                    </div>
                    <div v-if="item.op_type==5">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">推送了</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/src/${item.ref_name}`})">{{item.ref_name}}</span>
                            <span>分支的代码到</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}`})">{{item.repo_user_name}}/{{item.repo_name}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            <div style="margin-left: 10px;">
                                <div class="c_flexRow flexStart c_right_margin" v-for="subItem in toJson(item.content).Commits">
                                    <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                                    <span class="c_blue_color c_textEllipsis c_pointer" style="max-width: 100px;" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/commit/${subItem.Sha1}`})">{{subItem.Sha1}}</span>
                                    <span class="c_gray_txt">{{subItem.Message}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="item.op_type==6">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">创建了工单</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/issues/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.issue_infos[1]}}
                        </div>
                    </div>
                    <div v-if="item.op_type==7">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">创建了合并请求</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/pulls/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.issue_infos[1]}}
                        </div>
                    </div>
                    <div v-if="item.op_type==8">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">将仓库</span>
                            <span class="c_gray_label">{{item.content}}</span>
                            <span>转移至</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}`})">{{item.repo_user_name}}/{{item.repo_name}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                    </div>
                    <div v-if="item.op_type==10">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">评论了工单</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/issues/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.content}}
                        </div>
                    </div>
                    <div v-if="item.op_type==11">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">合并了请求</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/issues/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.issue_infos[1]}}
                        </div>
                    </div>
                    <div v-if="item.op_type==12">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">关闭了工单</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/issues/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.issue_infos[1]}}
                        </div>
                    </div>
                    <div v-if="item.op_type==13">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">重新开启了工单</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/pulls/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.issue_infos[1]}}
                        </div>
                    </div>
                    <div v-if="item.op_type==14 || item.op_type==15">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">关闭了合并请求</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}/pulls/${item.issue_infos[0]}`})">{{item.repo_user_name}}/{{item.repo_name}}#{{item.issue_infos[0]}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                        <div class="historyItemCmt">
                            {{item.issue_infos[1]}}
                        </div>
                    </div>
                    <div v-if="item.op_type==19">
                        <div class="c_flexRow">
                            <img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
                            <span style="margin-left: 10px;">
                                <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
                            <span class="">派生了仓库</span>
                            <span class="c_blue_color c_pointer" @click="$router.push({path: `/${item.repo_user_name}/${item.repo_name}`})">{{item.repo_user_name}}/{{item.repo_name}}</span>
                            </span>
                            <span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
                        </div>
                    </div>

					<!--<div class="c_flexRow">
							<img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
							<span style="margin-left: 10px;">
								<span class="c_blue_color" @click="$router.push({path: `/${item.act_user_name}`})">{{item.user_full_name}}</span>
							<span class="">评论了工单</span>
							<span class="c_blue_color">proginn</span>
							</span>
							<span style="flex: 1;text-align: right;" class="c_gray_txt">{{$cmmDate(item.created,1)}}</span>
						</div>
						<div class="historyItemCmt">
							<div>{{item.content}}</div>
							<!--<div style="margin-left: 10px;">
								<div class="c_flexRow c_right_margin">
									<img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
									<span class="c_blue_color">Derek</span>
									<span class="c_gray_txt">手机号全称修改;</span>
								</div>
								<div class="c_flexRow c_right_margin">
									<img class="c_hd_img c_small_head_img" :src="item.act_avatar" alt="" />
									<span class="c_blue_color">Derek</span>
									<span class="c_gray_txt">手机号全称修改;</span>
								</div>
							</div>
						</div>-->

				</div>
				<div class="fileListItemHeader c_bottom_line c_bold c_color_initial btn-group" v-show="show_page2">
                <button @click="prev2()" type="button" style="margin-left:10px;" :class="disable_class_prev">上一页</button>
                <button @click="next2()" type="button" style="margin-left:10px;" :class="disable_class_next">下一页</button>
                </div>

			</div>
			<!--<div class="ctrlRecord c_paddingV" v-for="item in cmtList">
				<div class="c_flexRow recordImgLine flexStart">
					<div class="c_hd_img" :style="{backgroundImage:'url('+''+')'}"></div>
					<span class="c_gray_txt"><span class="c_blue_color"></span>评论了工单<span class="c_blue_color">proginn</span></span>
				</div>
				<div class="recordDesc c_darkGray_text">
					{{item.message}}
				</div>
				<!--<div class="recordList c_gray_txt">
					<div class="c_flexRow flexStart recordListItem" v-for="n in 3">
						<div class="c_hd_img" :style="{backgroundImage:'url('+require('img/headImg/nv07.jpg')+')'}"></div>
						<div>
							<span class="c_blue_color">积木李</span>
							<span>远端工作工作年限更新; 工作款项试用期修改</span>
						</div>
					</div>

				</div>
			</div>-->

			<!--<div class="ctrlRecord c_paddingV" v-for="item in ctrlList">
				<div class="c_flexRow recordImgLine flexStart">
					<div class="c_hd_img" :style="{backgroundImage:'url('+require('img/headImg/nv07.jpg')+')'}"></div>
					<span class="c_gray_txt"><span class="c_blue_color">王大锤</span>评论了工单<span class="c_blue_color">proginn</span></span>
				</div>
				<div class="recordDesc c_darkGray_text">
					Natural Home Treatment For Cellulite
				</div>
				<div class="recordList c_gray_txt">
					<div class="c_flexRow flexStart recordListItem" v-for="n in 3">
						<div class="c_hd_img" :style="{backgroundImage:'url('+require('img/headImg/nv07.jpg')+')'}"></div>
						<div>
							<span class="c_blue_color">积木李</span>
							<span>远端工作工作年限更新; 工作款项试用期修改</span>
						</div>
					</div>

				</div>
			</div>-->

		</div>
		<div class="panelRight">
			<div class="c_white_bg c_flexCol flexCenter alignItemCenter rightHeadImg c_margin_bottom">
				<div class="c_hd_img" :style="{backgroundImage:'url('+self.avatar_url+')'}"></div>
				<div class="ft16">{{self.full_name}}</div>
				<div class="c_gray_txt"></div>
				<!--<div class="c_block_margin">-->
					<!--<button type="button" class="ui-btn  btn-blank btn-green-bd">技术信用分: <span class="c_bold c_green_txt">{{}}</span></button>-->
				<!--</div>-->
			</div>

			<div class="c_margin_bottom c_white_bg">
				<div class="c_flexRow flexAround alignItemStrecth subTabPanel c_bottom_line">
					<div class="c_blue_color c_active_bt_ind rTabItem c_pointer" :class="{active:rightSubTab==0}" @click="rightSubTab=0">
						<span>仓库</span>
						<span class="c_badge_normal c_gray_badge_bg">{{selfRepo.length}}</span>
					</div>
					<!--<div class="c_active_bt_ind rTabItem c_pointer" :class="{active:rightSubTab==1}" @click="rightSubTab=1">-->
						<!--<span>组织</span>-->
						<!--&lt;!&ndash;<span class="c_badge_normal">5</span>&ndash;&gt;-->
					<!--</div>-->
					<div class="c_active_bt_ind rTabItem c_pointer" :class="{active:rightSubTab==2}" @click="rightSubTab=2">
						<span>镜像</span>
						<!--<span class="c_badge_normal">5</span>-->
					</div>
				</div>
				<div class="rightListItem c_bottom_line dashed c_flexRow flexStart" v-if="rightSubTab==0" v-for="item in selfRepo">
					<img src="~img/src/文件.svg" class="rlItemIcon" alt="" />
					<div class="c_pointer" @click="$router.push({path: `/${self.username}/${item.name}`})">
						<div class="c_blue_color">{{item.name}}</div>
						<div class="c_gray_txt">{{item.description}}</div>
					</div>
				</div>
				<div class="c_pointer" v-if="rightSubTab==0 && selfRepo.length>=moreSize" @click="$router.push({path: `/?tab=2`})">
				&nbsp;&nbsp;&nbsp;&nbsp;查看更多
				</div>
				<!--<div class="rightListItem c_bottom_line dashed c_flexRow flexStart" v-if="rightSubTab==1" v-for="item in repos">
					<img src="~img/src/文件.svg" class="rlItemIcon" alt="" />
					<div>
						<div class="c_blue_color">{{item.name}}</div>
						<div class="c_gray_txt">{{item.description}}</div>
					</div>
				</div>-->
				<div class="rightListItem c_bottom_line dashed c_flexRow flexStart" v-if="rightSubTab==2" v-for="item in mirrorRepo">
					<img src="~img/src/文件.svg" class="rlItemIcon" alt="" />
					<div @click="$router.push({path: `/${self.username}/${item.name}`})" class="c_pointer">
						<div class="c_blue_color">{{item.name}}</div>
						<div class="c_gray_txt">{{item.description}}</div>
					</div>
				</div>
                <div class="c_pointer" v-if="rightSubTab==2 && selfRepo.length>=moreSize" @click="$router.push({path: `/?tab=2`})">
				&nbsp;&nbsp;&nbsp;&nbsp;查看更多
				</div>
			</div>
			<div class="c_white_bg" v-if="rightSubTab==0">
				<div class="c_bold ft16 c_bottom_line c_flexRow flexStart" style="height: 50px;padding:0 10px;">参与协作的</div>
				<div class="rightListItem c_bottom_line dashed c_flexRow flexStart" v-for="item in collRepos">
					<img src="~img/src/文件.svg" class="rlItemIcon" alt="" />
					<div class="c_pointer" @click="$router.push({path: `/${item.owner.username}/${item.name}`})">
						<div class="c_blue_color">{{item.name}}</div>
						<div class="c_gray_txt">{{item.description}}</div>
					</div>
				</div>
				<div class="c_pointer" v-if="selfRepo.length>=moreSize" @click="$router.push({path: `/?tab=3`})">
				&nbsp;&nbsp;&nbsp;&nbsp;查看更多
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
	import MenuList from '@/comp/menuList'
	import Vue from 'vue'

	export default {
		data() {
			return {
				tab: 0,
				ctrlList: [],
				allCtrlList:[],
				rightSubTab: 0,
				showListObj: [],
				myChart: null,
				repos: [], //获取自己的repos
				self: {},
				collRepos: [], //
				moreSize:10,
				sParam: {
					rangeType: 0 //时间段
				},
				defaultPageSize: 20,
				page2: 1,
				show_page2: true,
				disable_class_prev: "ui-btn btn-grey",
				disable_class_next: "ui-btn ",
				disable_class: "ui-btn btn-grey",
                mirrorRepo: []
			}
		},
		methods: {
			setParam(key, item) {
				if(item) {
					this.sParam[key] = item
				} else {
					delete this.sParam[key]
				}
				this.drawChart(this.allCtrlList)
			},
			setRangeType(index) {
				this.sParam.rangeType = index
				this.drawChart(this.allCtrlList)
			},

			drawChart(data) {
				// console.log('draw chart:', data)
				var chartData = data || [];
				chartData = chartData.filter(item => {
					var show = true
					if(this.sParam.user) {
						if(this.sParam.user.user_id != item.act_user_id) show = false;
					}
					if(this.sParam.repo) {
						if(this.sParam.repo.repo_id != item.repo_id) show = false;
					}

					return show;
				})
	
				var rangeType = this.sParam.rangeType
				var spanType; // 1: day, 2: hour

				var users = {};
				var rangeData = [];
				// default
				if(rangeType == 0) {
					spanType = 1;
					for(var i = 30 - 1; i >= 0; i--) {
						var d = moment().subtract(i, 'days').format('YYYY-MM-DD');
						rangeData.push(d)
					}
				}
				// today
				else if(rangeType == 1) {
					spanType = 2;
					for(var i = 0; i <= moment().hours(); i++) {
						rangeData.push(moment().hours(i).format('HH:00'));
					}
				}
				// 7 days
				else if(rangeType == 2) {
					spanType = 1;
					for(var i = 6; i >= 0; i--) {
						var d = moment().subtract(i, 'days').format('YYYY-MM-DD');
						rangeData.push(d)
					}
				}
				// 30 days
				else if(rangeType == 3) {
					spanType = 1;
					for(var i = 30 - 1; i >= 0; i--) {
						var d = moment().subtract(i, 'days').format('YYYY-MM-DD');
						rangeData.push(d)
					}
				}
				// before 30 days
				else if(rangeType == 4) {
					for(var i = 90; i > 30; i--) {
						var d = moment().subtract(i, 'days').format('YYYY-MM-DD');
						rangeData.push(d)
					}
				}

				for(var i = chartData.length - 1; i >= 0; i--) {
					var commit = chartData[i];
					var userName = commit.act_user_name;
					if(!users.hasOwnProperty(userName)) {
						users[userName] = {};
					}

					var x;
					if(spanType == 1) {
						x = moment(commit.created).format('YYYY-MM-DD');
					} else {
						x = moment(commit.created).format('HH');
					}

					if(!users[userName].hasOwnProperty(x)) {
						users[userName][x] = 0;
					}
					users[userName][x]++;
				}
				 
				var option = {
					tooltip: {},
					legend: {
						data: []
					},
					xAxis: {
						type: 'time',
					},
					yAxis: {
						type: 'value',
						minInterval: 0
					},
					series: []
				};
				console.log('range data:', rangeData, users)
				for(var k in users) {
					option.legend.data.push(k);
					var serieData = {
						name: k,
						type: 'line',
						smooth: true,
						showSymbol: false,
						data: []
					}

					for(var i = 0; i < rangeData.length; i++) {
						var x = rangeData[i];
						var y = users[k][x];
						if(y === undefined) {
							y = 0;
						}
						// if(k === 'u84543') {
							serieData.data.push([x, y]);
						// } else {
							// serieData.data.push([x, y]);
						// }
					}

					option.series.push(serieData)
				}
				console.log('option:', option)
				this.myChart.setOption(option, true);
			},
			showMenuList(index) {
				this.showListObj = []
				this.showListObj[index] = true
			},
			toJson(str) {
				return toJson(str); //global function	
			},
			reloadCtrlList(cb) {
				axios.get('/user/feeds').then(resp => {
					this.ctrlList = resp.data.actions
					cb && cb(this.allCtrlList)
				}).catch(err => Err(err))
                axios.get('/user/feeds', {params: {charts: 1}}).then(resp => {
                    this.allCtrlList = resp.data.actions
                    cb && cb(this.allCtrlList)
                }).catch(err => Err(err))
			},
			loadRepo() {
				axios.get('/user/repos',{params:{page_size:10}}).then(resp => {
					this.repos = resp.data.repos
				}).catch(err => Err(err))

                axios.get('/users/'+this.self.username+'/mirror/repos',{params:{page_size:10, is_mirror: 1}}).then(resp => {
                    this.mirrorRepo = resp.data.repos
                }).catch(err => Err(err))

				axios.get('/users/'+this.self.username+'/collaborate/repos',{params:{username:this.self.username,page_size:10}}).then(resp => {
					this.collRepos = resp.data.repos
				}).catch(err => Err(err))
			},
			prev2() {
			    if (this.page2 == 1) {
			        return;
			    }
			    this.page2--;
			   // var ownerRep = '/repos/' + this.username + '/' + this.repoName;
			    axios.get('/user/feeds',{  params:{
                            offset: (this.page2-1)*20,
                            username: this.self.username
                        }}).then(resp => {
                          this.ctrlList = resp.data.actions
                        }).catch(err => Msg(err))
                if (this.page == 1) {
                    this.disable_class_prev = this.disable_class;
                    this.disable_class_next = "ui-btn"
                }
			},
			next2() {
                if (this.ctrlList.length<this.defaultPageSize) {
					this.disable_class_next = this.disable_class;
                    this.disable_class_prev = "ui-btn"
                    return;
                }
                this.page2++;
               // var ownerRep = '/repos/' + this.username + '/' + this.repoName;
                axios.get('/user/feeds',{  params:{
                            offset: (this.page2-1)*20,
                            username: this.self.username
                        }}).then(resp => {
                          this.ctrlList = resp.data.actions
                        }).catch(err => Msg(err))
               
			}
		},
		computed: {
			selfRepo: function() {
				return this.repos.filter(item => {
					return item.owner.id == this.self.id
				})
			},
			colleRepo: function() { // 协做的仓库
				return this.repos.filter(item => {
					return item.owner.id != this.self.id
				})
			},

			fRepos: function() {
				var map = {}
				this.ctrlList.forEach(item => {
					map[item.repo_id] = item
				})

				var arr = []
				for(let key in map) {
					arr.push(map[key])
				}

				return arr;
			},

			users: function() {
				var map = {}
				//				this.repos.forEach(item => {
				//					map[item.owner.id] = item.owner
				//				})

				this.ctrlList.forEach(item => {
					map[item.act_user_id] ={
						name:item.act_user_name,
						user_id:item.act_user_id
					} 
				})

				var arr = []
				for(let key in map) {
					arr.push(map[key])
				}

				return arr;

			}
		},
		components: {
			'store-tab': StoreTab,
			'menu-list': MenuList
		},
		created() {

			this.self = this.$getSelf()

			this.loadRepo()
		},
		mounted() {
			this.myChart = echarts.init(document.getElementById('chart'));
			this.reloadCtrlList(this.drawChart)
		}

	}
</script>

<style scoped>
	.cBigMargin {
		margin: 20px 0;
	}
	
	.panelHeader {
		margin-top: 10px;
		margin-bottom: 10px;
	}
	
	.panelLeft {
		width: 874px;
	}
	
	.panelRight {
		width: 316px;
	}
	
	.panelHeadItem {
		margin-left: 30px;
	}
	
	.ctrlRecord {
		min-height: 86px;
		/*padding:8px 0;*/
	}
	
	.historyItem {
		/*min-height: 90px;*/
		padding: 8px 0;
	}
	
	.historyItemCmt {
		margin-left: 56px;
		position: relative;
		top: -5px;
	}
	
	.ctrlRecord .recordImgLine {}
	
	.recordImgLine .c_hd_img {
		width: 46px;
		height: 46px;
		margin-right: 10px;
	}
	
	.ctrlRecord .recordDesc {
		margin-left: 56px;
	}
	
	.ctrlRecord .recordList {
		margin-left: 66px;
	}
	
	.recordList .c_hd_img {
		width: 22px;
		height: 22px;
		margin-right: 12px;
	}
	
	.subTabPanel {
		height: 50px;
		padding-top: 14px;
		text-align: center;
	}
	
	.rightHeadImg {
		height: 249px;
	}
	
	.rightHeadImg .c_hd_img {
		width: 80px;
		height: 80px;
	}
	
	.rightListItem {
		min-height: 60px;
		padding: 0 10px;
	}
	
	.recordListItem {
		margin-top: 4px;
		margin-bottom: 4px;
	}
	
	.rTabItem {
		min-width: 65px;
	}
	
	.rlItemIcon {
		width: 12px;
		margin-bottom: 20px;
		margin-right: 10px;
	}
</style>