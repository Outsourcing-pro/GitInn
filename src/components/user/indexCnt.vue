<template>
	<div>
		<div class="selfPanel">
			<div class="c_cnt c_flexRow">
				<div class="left c_flexRow">
					<div class="c_hd_img bigHdImg" :style="{backgroundImage:'url('+user.avatar_url+')'}"></div>
					<div class="userBrief">
						<div class="name">{{user.full_name}}</div>
						<div class="des c_gray_txt">ID: {{user.id}}<span style="margin:0 13px;">|</span>{{$cmmDate(user.created)}}加入</div>
					</div>
					<div v-if="!user.is_self">
						<button type="button" v-if="user.is_following" class="ui-btn ui-btn-rd btn-grey">已关注</button>
						<button type="button" v-if="!user.is_following" class="lBtn ui-btn ui-btn-rd" @click="following"><span style="margin-right: 3px;font-weight: bold;">+</span>关注</button>
					</div>

				</div>
				<div class="right">
					<ul class="c_flexRow">
						<li @click="$router.push({path:`${self.username}/followers`,query:{tab:1}})" class="c_pointer">
							<div class="rTitle">{{user.follower_count}}</div>
							<div class="c_gray_txt rDes">关注者</div>
						</li>
						<li @click="$router.push({path:`${self.username}/following`,query:{tab:2}})" class="c_pointer">
							<div class="rTitle">{{user.following_count}}</div>
							<div class="c_gray_txt rDes">已关注</div>
						</li>
					</ul>

				</div>
			</div>

		</div>
		<div class="c_cnt c_contentBody">
			<div class="cntBodyNav c_bottom_line">
				<div class="c_flexRow cntBodyNavItem c_gray_txt" :class="{active:tab==1}" @click="tab=1;show_page2=true;show_page=false">
					<img v-show="tab==1" src="~img/src/个人贡献选中.svg" alt="" />
					<img v-show="tab!=1" src="~img/src/个人贡献未选中.svg" alt="" />
					<span>个人贡献</span>
				</div>

				<div class="c_flexRow cntBodyNavItem c_gray_txt" :class="{active:tab==2}" @click="tab=2;show_page2=false;show_page=true">
					<img v-show="tab==2" src="~img/src/仓库列表选中.svg" alt="" />
					<img v-show="tab!=2" src="~img/src/仓库列表未选中.svg" alt="" />
					<span>仓库列表</span>
				</div>

				<div class="c_flexRow cntBodyNavItem c_gray_txt" :class="{active:tab==3}" @click="tab=3;show_page3=true;show_page2=false;show_page=false">
					<img v-show="tab==2" src="~img/src/仓库列表选中.svg" alt="" />
					<img v-show="tab!=2" src="~img/src/仓库列表未选中.svg" alt="" />
					<span>协作仓库</span>
				</div>
			</div>
			<!--个人贡献-->
			<div class="personContri" v-show="tab==1">
				<div style="display: table;">
					<div class="glanceyear-container" style="margin-bottom:20px;">
						<div class="glanceyear-content" id="js-glanceyear">
						</div>

						<div class="glanceyear-summary">
							<div class="glanceyear-legend">
								Less&nbsp;
								<span style="background-color: #eee"></span>
								<span style="background-color: #c6e48b"></span>
								<span style="background-color: #7bc96f"></span>
								<span style="background-color: #239a3b"></span>
								<span style="background-color: #196127"></span> &nbsp;More
							</div>
							共<span id="contribution-count"></span>个贡献
						</div>

					</div>
				</div>
				<div class="historyTitle c_bottom_line">操作记录</div>

				<div class="c_gray_txt">
					<div class="historyItem c_bottom_line" v-for="item in ctrlList">
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
								<span class="c_blue_color">{{item.user_full_name}}</span>
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
					<!--<div class="historyItem c_bottom_line">
						<div class="c_flexRow">
							<img class="c_hd_img c_small_head_img" src="~img/headImg/nan01.jpg" alt="" />
							<span style="margin-left: 10px;">
								<span class="c_blue_color">王大锤</span>
							<span>评论了工单</span>
							<span class="c_blue_color">proginn</span>
							</span>
							<span style="flex: 1;text-align: right;" class="c_gray_txt">2017-04-12</span>
						</div>
						<div class="historyItemCmt">Nature Home Treatment For Cellulite</div>

					</div>-->

				</div>
				<div class="fileListItemHeader c_bottom_line c_bold c_color_initial btn-group" v-show="show_page2">
                <button @click="prev2()" type="button" style="margin-left:10px;" :class="disable_class_prev">上一页</button>
                <button @click="next2()" type="button" style="margin-left:10px;" :class="disable_class_next">下一页</button>
                </div>
			</div>

			<!--仓库列表-->
			<div class="storeList" v-show="tab==2">
				<div class="storeItem c_bottom_line c_flexRow" v-for="item in storeList">
					<!--<div class="c_bg_img sItemImg"></div>-->
					<div class="sItemDes">
						<div class="c_blue_color c_pointer" @click="$router.push({path: `/${item.owner.username}/${item.name}`})" style="font-size: 18px;">{{item.name}}
						<img src="~img/src/私有仓库icon.svg" v-if="item.private" class="a_store_icon" alt="" />
						</div>
						<div>{{item.description}}</div>
						<div class="c_gray_txt" style="font-size: 12px;margin-top: 3px;">{{$distanceInWords(item.updated)}}更新</div>
					</div>
					<div class="sItemInfo c_flexRow">
						<img src="~img/src/收藏.svg" alt="" />
						<span>{{item.stars}}</span>

						<img style="margin-left:40px;" src="~img/src/派生.svg" alt="" />
						<span>{{item.forks}}</span>
					</div>

				</div>
				<div class="fileListItemHeader c_bottom_line c_bold c_color_initial btn-group" v-show="show_page">
                <button @click="prev()" type="button" style="margin-left:10px;" :class="disable_class_prev">上一页</button>
                <button @click="next()" type="button" style="margin-left:10px;" :class="disable_class_next">下一页</button>
                </div>

			</div>



          <!--协作仓库列表-->
			<div class="storeList" v-show="tab==3">
				<div class="storeItem c_bottom_line c_flexRow" v-for="item in collaList">
					<!--<div class="c_bg_img sItemImg"></div>-->
					<div class="sItemDes">
						<div class="c_blue_color c_pointer" @click="$router.push({path: `/${item.owner.username}/${item.name}`})" style="font-size: 18px;">{{item.name}}
						<img src="~img/src/私有仓库icon.svg" v-if="item.private" class="a_store_icon" alt="" />
						</div>
						<div>{{item.description}}</div>
						<div class="c_gray_txt" style="font-size: 12px;margin-top: 3px;">{{$distanceInWords(item.updated)}}更新</div>
					</div>
					<div class="sItemInfo c_flexRow">
						<img src="~img/src/收藏.svg" alt="" />
						<span>{{item.stars}}</span>

						<img style="margin-left:40px;" src="~img/src/派生.svg" alt="" />
						<span>{{item.forks}}</span>
					</div>

				</div>
				<div class="fileListItemHeader c_bottom_line c_bold c_color_initial btn-group" v-show="show_page3">
                <button @click="prev3()" type="button" style="margin-left:10px;" :class="disable_class_prev">上一页</button>
                <button @click="next3()" type="button" style="margin-left:10px;" :class="disable_class_next">下一页</button>
                </div>

			</div>


		</div>
		<div class="c_cnt"></div>
	</div>
</template>

<script>
	//	import * as COMMON from '@/common'
	import MenuList from '@/comp/menuList'

	function loadData(year, username) {

		// contributions
		axios.get('/users/' + username + '/calendar/' + year).then(function(resp) {
			var data = resp.data.contributes
			var massive = [];
			var serieData = [];
			var totalCount = 0;
			for(var k in data) {
				var d = k.replace(/\-0/g, '-');
				massive.push({
					date: d,
					value: data[k]
				});
				totalCount += data[k];
			}

			$('#contribution-count').html(totalCount);

			// $是通过appendChild的方式添加，所以需要清空
			$('#js-glanceyear').html('');
			$('#js-glanceyear').glanceyear(massive, {
				months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				weeks: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
				cellSize: 13.7,
				eventClick: function(e) {}
			});
		}).catch(function(err) {
			Err(err)
		})

		// activities
		//		$.get('')
	}

	export default {
		data() {
			return {
				opTypeMap: {
					1: '创建了仓库',
					2: '重命名仓库',
					//					5:'推送了', //this is a special case
					6: '创建了工单',
					7: '创建了合并请求',
					//					8:'',
					10: '评论了工单',
					11: '合并了合并请求',
					12: '关闭了工单',
					13: '重新开启了工单',
					14: '关闭了合并请求',
					15: '关闭了合并请求',
					19: '派生了仓库'
				},
				tab: this.$route.query.tab?this.$route.query.tab:1,
				storeList: [], //仓库列表
				ctrlList: [], //操作记录
				self: {}, //自己的信息
				user: {}, //可能是其它人，不一定是自己
				username: '',
				repos_count: 0,
				show_page: this.$route.query.tab==2?true:false,
				defaultPageSize: 20,
				page: 1,
				page2: 1,
				page3: 1,
				show_page2: this.$route.query.tab==1?true:false,
				show_page3: this.$route.query.tab==3?true:false,
				collaList:[],
				disable_class_prev: "ui-btn btn-grey",
				disable_class_next: "ui-btn ",
				disable_class: "ui-btn btn-grey",
			}
		},
		methods: {
			loadStoreItem(username, repo_name, cb) {
				cb || (cb = function() {});
				if(isStrEmpty(username)) {
					InfoMsg.err('user name is empty')
					return;
				}

				if(isStrEmpty(repo_name)) {
					InfoMsg.err('repo_name is empty')
					return;
				}

				axios.get('/repos/' + username + '/' + repo_name).then(resp => {
					let storeItem = resp.data
					cb(storeItem)

				}).catch(Err)
			},
			toJson(str) {
				return toJson(str); //global function	
			},
			following() {
				axios.put('/user/following/' + this.user.username).then(resp => {
					InfoMsg.suc('关注成功')
					this.loadUser()
				}).catch(err => Err(err))
			},
			unFollowing() {
				axios.delete('/user/following/' + this.user.username).then(resp => {
					InfoMsg.suc('取消关注成功')
					this.loadUser()
				}).catch(err => Err(err))
			},
			// 加载用户信息
			loadUser() {
				//axios.get('/users/' + this.self.username).then(resp => {
					//					console.log(resp.data)
					this.user = this.self
				//}).catch(err => Err(err))
			},
			loadStoreList() {
				axios.get('/user/repos',{  params:{
                            page: this.page,
                            page_size: this.defaultPageSize
                        }}).then(resp => {
					var list = resp.data.repos;
					this.storeList = list;
					 
				}).catch(err => Err(err))
			},
			loadCtrlList() {
				axios.post('/user/feeds', {
					offset: 0,
					username: this.self.username
				}).then(resp => {
					this.ctrlList = resp.data.actions

				}).catch(err => Err(err))
			},
			loadCollaList() {
				axios.get('/users/'+this.user.username+'/collaborate/repos',{  params:{
                            page: this.page,
                            page_size: this.defaultPageSize
                        }}).then(resp => {
					var list = resp.data.repos;
					this.collaList = list;
					 
				}).catch(err => Err(err))
			},
			prev() {
			    if (this.page == 1) {
			        return;
			    }
			    this.page--;
			   // var ownerRep = '/repos/' + this.username + '/' + this.repoName;
			    axios.get('/user/repos',{  params:{
                            page: this.page,
                            page_size: this.defaultPageSize
                        }}).then(resp => {
                    this.storeList = resp.data.repos
                }).catch(err => Msg(err))
                if (this.page == 1) {
                    this.disable_class_prev = this.disable_class;
                    this.disable_class_next = "ui-btn"
                }
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
			prev3() {
			    if (this.page3 == 1) {
			        return;
			    }
			    this.page3--;
			   // var ownerRep = '/repos/' + this.username + '/' + this.repoName;
			    axios.get('/users/'+this.user.username+'/collaborate/repos',{  params:{
                            page: this.page3,
                            page_size: this.defaultPageSize
                        }}).then(resp => {
                    this.collaList = resp.data.repos
                }).catch(err => Msg(err))
                if (this.page3 == 1) {
                    this.disable_class_prev = this.disable_class;
                    this.disable_class_next = "ui-btn"
                }
			},
			next() {
                if (this.page * this.defaultPageSize >= this.repos_count) {
                    return;
                }
                this.page++;
               // var ownerRep = '/repos/' + this.username + '/' + this.repoName;
                axios.get('/user/repos',{  params:{
                            page: this.page,
                            page_size: this.defaultPageSize
                        }}).then(resp => {
                    this.storeList = resp.data.repos;
                }).catch(err => Msg(err))
                if (this.page * this.defaultPageSize >= this.repos_count) {
                    this.disable_class_next = this.disable_class;
                    this.disable_class_prev = "ui-btn"
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
               
			},
			next3() {
                if (this.collaList.length<this.defaultPageSize) {
					this.disable_class_next = this.disable_class;
                    this.disable_class_prev = "ui-btn"
                    return;
                }
                this.page3++;
                axios.get('/users/'+this.user.username+'/collaborate/repos',{  params:{
                            page: this.page3,
                            page_size: this.defaultPageSize
                        }}).then(resp => {
                    this.collaList = resp.data.repos;
                }).catch(err => Msg(err))
			},
			 // 获取记录数字
            getCount() {
                //get readme data
                axios.get(`users/${this.user.username}/count/repos`,{params:{username:this.user.username}}).then(resp => {
                    this.repos_count = resp.data.num_repos
                    if (this.repos_count <= this.defaultPageSize) {
                        this.show_page && (this.show_page = false);
                    } else {
                       this.show_page &&  (this.show_page = true);
                    }
                }).catch(err => Err(err))
            },
			initData() {
				loadData(new Date().getFullYear(), this.self.username);
				this.loadUser()
				this.loadStoreList()
				this.loadCtrlList()
				this.getCount();
				this.loadCollaList();
			}
		},
		computed: {
			
			},
		created() {
			this.self = this.$getSelf()
			this.initData();
		},
		// beforeRouteUpdate(to, from, next) {
		// 	let is_self = to.params.username != this.self.username;
		// 	this.self.username = is_self ? to.params.username : this.$getSelf().username;
		// 	console.log('beforeRouteUpdate:', this.self.username, to);
		// 	this.initData(is_self);
		// 	next();
		// },
		mounted() {
			
			},
		components: {
			'menu-list': MenuList
		}

	}
</script>

<style scoped>
	.cursor {
		cursor: pointer;
	}
	.selfPanel {
		background: white;
	}
	
	.selfPanel .bigHdImg {
		width: 80px;
		height: 80px;
		background-image: url(~img/headImg/nan02.jpg);
	}
	
	.selfPanel>.c_cnt {
		height: 120px;
	}
	
	.userBrief .name {
		font-weight: bold;
		font-size: 20px;
	}
	
	.userBrief .des {
		font-size: 12px;
	}
	
	.left>div:nth-of-type(2) {
		margin-left: 18px;
	}
	
	.left>div:nth-of-type(3) {
		margin-left: 33px;
	}
	
	.right li {
		text-align: center;
		height: 45px;
		padding: 0 40px;
		border-right: 1px solid gainsboro;
	}
	
	.right li:nth-child(1) {
		border-left: 1px solid gainsboro;
	}
	
	.right .rTitle {
		font-weight: bold;
		font-size: 18px;
	}
	
	.right .rDes {
		font-size: 12px;
	}
	
	.cntBodyNav {}
	
	.cntBodyNavItem {
		cursor: pointer;
		height: 50px;
		display: inline-flex;
		margin-left: 55px;
		position: relative;
	}
	
	.cntBodyNavItem img {
		width: 16px;
		margin-right: 3px;
	}
	
	.cntBodyNav .active {
		color: #308EFF;
	}
	
	.cntBodyNav .active:after {
		content: '';
		display: block;
		position: absolute;
		bottom: -1px;
		margin: auto;
		width: 100%;
		border-bottom: 3px solid #308EFF;
		z-index: 10;
		/*height: 3px;
		background: #308EFF;*/
	}
	
	.historyTitle {
		font-size: 18px;
		font-weight: bold;
		padding: 14px 0;
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
	
	.storeItem {
		padding: 24px 0 30px 0;
	}
	
	.sItemImg {
		width: 70px;
		height: 70px;
		border-radius: 3px;
		/*overflow: hidden;*/
		background-image: url(~img/headImg/nv02.jpg);
	}
	
	.storeItem:after {
		border-bottom-style: dashed;
	}
	
	.sItemDes {
		flex: 1;
		margin-left: 14px;
		align-self: flex-end;
	}
	
	.sItemInfo {
		align-self: flex-start;
		margin-top: 18px;
		color: #475669;
	}
	
	.sItemInfo img {
		width: 12px;
		margin-right: 3px;
	}
</style>