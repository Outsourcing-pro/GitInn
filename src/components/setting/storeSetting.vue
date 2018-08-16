<template>
	<div class="c_white_bg cSection c_flexRow" style="">
		<div class="cntLeft">
			<div class="c_bottom_line cntTile c_flexRow"><img src="~img/src/设置.svg" /> 账户设置
			</div>
			<div class="cntLeftList">
				<div class="cntLeftListItem c_flexRow" :class="{active:subTab==1}" @click="subTab=1">基本设置</div>
				<div class="cntLeftListItem c_flexRow" :class="{active:subTab==2}" @click="(subTab=2)&&resetCollb()">管理协作者</div>
				<div class="cntLeftListItem c_flexRow" :class="{active:subTab==3}" @click="(subTab=3)&&resetManageBranch()">管理分支</div>
				<div class="cntLeftListItem c_flexRow" :class="{active:subTab==4}" @click="(subTab=4)&&resetEditWebhook()">管理Web钩子</div>
				<div class="cntLeftListItem c_flexRow" :class="{active:subTab==5}" @click="(subTab=5)&&resetKeyList()">管理部署密钥</div>
			</div>
		</div>
		<div class="cntRight">

			<div class="cntRightCnt">
				<div v-show="subTab==1" class="ft13">
					<div class="c_bottom_line cntTile c_flexRow">
						<span>基本设置</span>
						<!--<span v-show="subTab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button">添加秘钥</button></span>-->
					</div>
					<div>
						<div class="c_bold" style="margin-top:10px;">仓库名称<span class="c_red_txt">*</span></div>
						<div><input type="text" class="c_input_line" v-model="repo.name" placeholder="请输入..." /></div>
						<div class="c_bold" style="margin-top:10px;">仓库描述</div>
						<div><input type="text" class="c_input_line" v-model="repo.description" placeholder="请输入..." /></div>
						<div class="c_bold" style="margin-top:10px;">官方网站</div>
						<div><input type="text" class="c_input_line" v-model="repo.website" placeholder="请输入..." /></div>
						<div style="padding-bottom: 10px;" class="c_block_margin c_flexRow flexStart c_right_margin ft13 c_bottom_line dashed">
							<input type="checkbox" v-model="repo.private" :disabled="disablePrivate" /> <span>该仓库为私有</span>
						</div>
						<div class="c_margin_bottom"><button type="button" class="ui-btn btn-green" @click="updateStore">更新设置</button></div>
					</div>

					<div class="blankLine" v-if="repo.is_mirror"></div>
					<div class="c_child_margin_bottom" v-if="repo.is_mirror">
						<div class="c_bottom_line cntTile c_flexRow">
							<span>镜像设置</span>
							<!--<span v-show="subTab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button">添加秘钥</button></span>-->
						</div>
						<div class="c_flexRow flexStart c_right_margin">
							<span class="c_bold">修剪</span>
							<input type="checkbox" v-model="form1.enable_prune" />
							<span>当远程追踪的引用被删除时本地也同步删除</span>
						</div>
						<div class="c_flexRow flexStart c_right_margin">
							<span class="c_bold">镜像同步周期 (小时)</span>
							<input type="number" v-model="form1.interval" class="c_input" />
						</div>
						<div>
							<div class="c_bold" style="margin-top:10px;">镜像地址</div>
							<div><input type="text" v-model="form1.mirror_address" class="c_input_line" placeholder="请输入..." /></div>
							<div class="c_gray_txt">请在境像地址中写入必要的用户凭据信息。</div>
						</div>
						<div class="c_bottom_line" style="padding-bottom: 10px;">
							<button type="button" class="ui-btn btn-green" @click="updateMirrorSetting">更新设置</button>
						</div>

						<div class="">
							<div class="c_block_margin">
								<span class="c_bold">上次同步时间: </span>
								<span>{{form1.updated}}<!--2018-04-13 02:33:17 +0000UTC--></span>
							</div>
							<div><button type="button" class="ui-btn btn-blue" @click="syncMirrorTime">立即同步</button></div>
						</div>

					</div>

					<div class="blankLine"></div>

					<div class="c_child_margin_bottom">
						<div class="c_bottom_line cntTile c_flexRow">
							<span>高级设置</span>
						</div>
						<div class="c_flexRow flexStart c_right_margin">
							<span class="c_bold">Wiki</span>
							<input type="checkbox" v-model="advance.enable_wiki" />
							<span>启用 Wiki 系统</span>
						</div>
						<div class="c_flexRow flexStart c_right_margin">
							<input type="radio" :disabled="!advance.enable_wiki" :value="false" v-model="advance.enable_external_wiki" name="wifiType" />
							<span>使用内置 Wiki 系统</span>
						</div>

						<div class="c_flexRow flexStart c_right_margin">
							<input type="radio" :disabled="!advance.enable_wiki" :value="true" v-model="advance.enable_external_wiki" name="wifiType" />
							<span>使用外部 Wiki 系统</span>
						</div>

						<div class="inputSec c_bottom_line dashed" style="padding-bottom: 15px;">
							<div class="c_bold">
								外部Wiki链接
							</div>
							<div>
								<input type="text" v-model="advance.external_wiki_url" class="c_input_line" placeholder="请输入..." />
							</div>
							<div class="c_gray_txt">
								当访问者单击分页标签时，将会被重定向到该链接
							</div>
						</div>
						<div class="c_child_margin_bottom" style="margin-bottom: 20px;">
							<div class="c_flexRow flexStart c_right_margin">
								<span class="c_bold">工单管理</span>
								<input type="checkbox" v-model="advance.enable_issues" />
								<span>启用工单管理系统</span>
							</div>
							<div class="c_flexRow flexStart c_right_margin">
								<input type="radio" :disabled="!advance.enable_issues" :value="false" v-model="advance.enable_external_tracker" />
								<span>使用内置的轻量级工单管理系统</span>
							</div>
							<div class="c_flexRow flexStart c_right_margin">
								<input type="radio" :disabled="!advance.enable_issues" :value="true" v-model="advance.enable_external_tracker" />
								<span>使用外部的工单管理系统</span>
							</div>
						</div>
						<div class="inputSec">
							<div class="c_bold">
								外部工单管理系统 URL
							</div>
							<div>
								<input type="text" v-model="advance.external_tracker_url" class="c_input_line" placeholder="请输入..." />
							</div>
							<div class="c_gray_txt">
								当访问者单击分页标签时，将会被重定向到该链接。
							</div>
						</div>
						<div class="inputSec">
							<div class="c_bold">
								外部工单管理系统的 URL 格式
							</div>
							<div>
								<input type="text" v-model="advance.tracker_url_format" class="c_input_line" placeholder="请输入..." />
							</div>
							<div class="c_gray_txt">
								您可以使用 {user} {repo} {index} 分别作为用户名、仓库名和工单索引的占位符。
							</div>
						</div>

						<div style="padding:5px 0 20px;" class="c_flexRow flexStart c_right_margin c_bottom_line dashed">
							<span class="c_bold">外部工单管理系统命名风格：</span>
							<span class="c_flexRow" style="margin-right: 30px;">
										<input type="radio" v-model="advance.tracker_issue_style" value="1" style="margin-right: 10px;" />
										<span>纯数字形式 <span class="c_gray_txt">(#1234)</span></span>
							</span>
							<span class="c_flexRow" style="margin-right: 30px;">
										<input type="radio" v-model="advance.tracker_issue_style" value="2" style="margin-right: 10px;" />
										<span>英文字母数字组合形式 <span class="c_gray_txt">(ABC-123, DEFG-234)</span></span>
							</span>
						</div>

						<div style="padding:5px 0 20px;" class="c_flexRow flexStart c_right_margin c_bottom_line dashed">
							<span class="c_bold">合并请求</span>
							<input type="checkbox" v-model="advance.enable_pulls" />
							<span>启用合并请求以接受社区贡献</span>
						</div>
						<div class="">
							<button type="button" class="ui-btn btn-green" @click="updateAdvanceSetting">更新设置</button>
						</div>

					</div>

					<div class="blankLine"></div>
					<!-- danger area 1.0不需要危险操作区-->
					<div v-if="false">
						<div class="c_bottom_line cntTile c_flexRow">
							<span class="c_red_txt c_bold">危险操作区</span>
						</div>
						<div class="c_flexRow dangerItem c_bottom_line dashed">
							<div>
								<div>转移仓库所有权</div>
								<div class="ft12 c_gray_txt">您可以将仓库转移至您拥有管理员权限的帐户或组织。</div>
							</div>
							<button type="button" class="ui-btn c_danger_bt">移除</button>
						</div>
						<div class="c_flexRow dangerItem c_bottom_line dashed">
							<div>
								<div>清除 Wiki 数据</div>
								<div class="ft12 c_gray_txt">清除 Wiki 数据操作不可逆转，请三思而后行。</div>
							</div>
							<button type="button" class="ui-btn c_danger_bt" @click="deleteWiki">移除</button>
						</div>
						<div class="c_flexRow dangerItem c_bottom_line dashed">
							<div>
								<div>删除本仓库</div>
								<div class="ft12 c_gray_txt">删除仓库操作不可逆转，请三思而后行。</div>
							</div>
							<button type="button" class="ui-btn c_danger_bt" @click="deleteStore">移除</button>
						</div>
					</div>

				</div>

				<!-- 管理协作者页面 -->
				<div v-show="subTab==2" class="ft13">
					<div class="c_bottom_line cntTile c_flexRow">
						<span>管理协作者</span>
						<!--<span v-show="subTab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button">添加秘钥</button></span>-->
					</div>
					<div>
						<div class="MGItem c_flexRow c_bottom_line" v-for="item in collbList">
							<div class="c_flexRow c_right_margin">
								<div class="c_hd_img c_small_head_img" :style="{backgroundImage:'url('+item.user.avatar_url+')'}"></div>
								<span>{{item.user.full_name}}</span>
							</div>
							<!-- 权限控制 -->
							<el-dropdown trigger="click" @command="settingPower">
								<span class="el-dropdown-link">
								<img src="~img/src/权限管理.svg" style="width:15px;margin-right: 7px;" alt="" />
									{{ item.permissions.admin ? '管理权限' : (item.permissions.push ? '可写权限' : '可读权限') }}<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="{mode:'admin', user: item.user}">管理权限</el-dropdown-item>
									<el-dropdown-item :command="{mode:'write', user: item.user}">可写权限</el-dropdown-item>
									<el-dropdown-item :command="{mode:'read', user: item.user}">可读权限</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>

							<button type="button" class="ui-btn c_danger_bt" @click="delCollb(item)">删除</button>

						</div>
						<div class="c_block_margin c_flexRow flexStart c_right_margin c_relative">
							<input type="text" class="c_input" v-model='collbname' style="min-width: 210px; font-size: inherit;" @input="searchUser" placeholder="搜索用户" />
							<!-- 获取用户列表 -->
							<menu-list :show.sync="users.show">
								<ul>
									<li v-for="item in users.list" @click="chooseUser(item)">
										{{item.full_name}}
									</li>
								</ul>
							</menu-list>
							<button type="button" class="c_blue_bt" @click="addCollb" style="border-radius: 4px;width:72px;">添加</button>
						</div>

					</div>
				</div>
				<div v-show="subTab==3" class="ft13">
					<div v-show="!editProtectBranch">
						<div class="c_bottom_line cntTile c_flexRow">
							<span>管理分支</span>
							<!--<span v-show="subTab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button">添加秘钥</button></span>-->
						</div>
						<div>
							<div class="c_gray_txt" style="margin:30px 0">
								默认分支是被用于代码提交、合并请求和在线编辑的基准分支。
							</div>
							<div class="c_flexRow flexStart c_right_margin c_relative" style="margin-bottom: 30px;" @click="showBranchMaster=true">
								<div class="c_icon_input">
									<input type="text" class="c_input" readonly :value="branchMaster" />
									<img src="~img/src/多层级_下.svg" class="right" style="width:10px;" alt="" />
									<menu-list :show.sync="showBranchMaster">
										<ul>
											<li v-for="item in defaultList" @click="branchMaster=item.name">
												{{item.name}}
											</li>
										</ul>
									</menu-list>
								</div>

								<button type="button" class="ui-btn btn-green" style="border-radius: 4px;min-width:72px;height: 34px;" @click.stop="setDefaultBranch">更新</button>
							</div>

						</div>
						<div class="blankLine"></div>

						<!-- 管理分支（分支保护） -->
						<div>
							<div class="c_bottom_line cntTile c_flexRow">
								<span class="c_bold">保护分支</span>
							</div>
							<div class="c_darkGray_text" style="margin:30px 0;">保护分支不被强制推送、意外删除和限制代码提交白名单。</div>

							<div class="c_icon_input c_relative" style="width:300px;" @click="showProtectList=true">
								<input type="text" class="c_input" readonly :value="branchMaster" />
								<img src="~img/src/多层级_下.svg" class="right" style="width:10px;" alt="" />
								<menu-list ref="menuList" :show.sync="showProtectList">
									<ul>
										<!-- 取所有分支 -->
										<li v-for="item in defaultList" @click="setProtectBranch(item)">
											{{item.name}}
										</li>
									</ul>
								</menu-list>
							</div>
							<div class="c_flexRow fileListItem c_bottom_line" v-for="(item,index) in protectList">
                                <span @click="$router.push({path: `/$(username}/${repoName}/src/${item.name}`})" class="c_blue_color cursor" style="width: 300px;">{{item.name}}</span>
                            </div>
						</div>
					</div>

					<!-- 保护分支设置（属于组织的仓库） -->
					<div v-show="editProtectBranch">
						<div class="c_bottom_line cntTile c_flexRow">
							<span>管理分支</span>
							<!--<span v-show="subTab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button">添加秘钥</button></span>-->
						</div>
						<div class="c_bottom_line dashed c_paddingV">
							<div class="c_block_margin c_gray_txt">
								请选择应用于 {{protectBranchName}} 分支的保护选项。
							</div>
							<div>
								<div class="c_flexRow flexStart">
									<input type="checkbox" :checked="enableBranchProtect" @change="checkChange" class="alignSelfStart c_margin-right10" />
									<div>
										<div class="ft13">启动分支保护</div>
										<div class="ft12 c_gray_txt">禁止强制推送和删除分支。</div>
									</div>
								</div>
								<div class="c_flexRow flexStart c_block_margin" style="margin-left:80px;">
									<input type="checkbox" :disabled="!enableBranchProtect" v-model="enablePullMerge" class="alignSelfStart c_margin-right10" />
									<div>
										<div class="ft13">要求通过合并请求提交代码</div>
										<div class="ft12 c_gray_txt">启用该选项后代码将不能直接被推送到此分支，所有的代码提交都必须通过另一个非保护分支发起合并请求进行合并。</div>
									</div>
								</div>
							</div>
						</div>
						<div class="c_block_margin">
							<button type="button" class="ui-btn btn-green" @click="updateBranchProtectSetting">更新设置</button>
						</div>
					</div>
				</div>
				<!-- webhook列表 -->
				<div v-show="subTab==4 && !manageEdit" class="ft13">
					<div class="c_bottom_line cntTile c_flexRow" style="justify-content: space-between;">
						<span>管理Web钩子</span>
						<button class="c_blue_bt" type="button" @click="showEditWebhook">添加Web钩子</button>
					</div>
					<div class="c_darkGray_text">
						<div style="height: 68px;" class="c_flexRow c_bottom_line dashed">
							<span>Web 钩子允许您设定在 Gogs 上发生指定事件时对指定 URL 发送 POST 通知。查看 <span class="c_blue_color">Webhooks</span>文档获取更多信息。</span>
						</div>
						<div class="c_flexRow c_margin-right6" v-for="item in tab4list" style="padding-top: 5px;">
							<div class="c_flexRow">
								<img style="width:20px;" src="~img/src/感叹号_2.svg" alt="" />
								<span>{{item.payload_url}}</span>
							</div>
							<div class="c_flexRow">
								<img src="~img/src/icon/编辑.svg" @click="editWebhook(item)" style="width:20px;" class="c_margin-right15" alt="" />
								<img src="~img/src/icon/关闭.svg" @click="delWebhook(item)" style="width:20px;" class="" alt="" />
							</div>
						</div>
					</div>
				</div>
				<!-- 编辑web钩子 -->
				<div v-show="subTab==4 && manageEdit" class="ft13">
					<div class="c_bottom_line cntTile c_flexRow c_right_margin" style="justify-content: space-between;">
						<span>管理Web钩子</span>
						<button class="c_blue_bt" type="button" @click="showEditWebhook">添加Web钩子</button>
					</div>
					<div class="">
						<div style="height: 68px;" class="c_flexRow c_darkGray_text">
							<span>
										我们会通过 POST 请求将订阅事件信息发送至向指定 URL 地址。您可以设置不同的数据接收方式（JSON 或 x-www-form-urlencoded）
										请查阅 Webhooks 文档 获取更多信息。
									</span>
						</div>
						<div class="inputSec">
							<div class="c_bold">推送地址*</div>
							<div>
								<input type="text" class="c_input_line" v-model="tab4data.push_url" placeholder="请输入..." />
							</div>
						</div>
						<div class="inputSec">
							<div class="c_bold">数据格式</div>
							<div class="c_icon_input c_relative" @click="showWebhookTypes=true">
								<input type="text" class="c_input_line" :value="tab4data.data_format_name" readonly placeholder="请选择..." />
								<img src="~img/src/多层级_下.svg" class="right" style="width:10px" alt="" />
								<menu-list :type="1" :show.sync="showWebhookTypes">
									<ul>
										<li @click="chooseWebhookType('json','application/json')">application/json</li>
										<li @click="chooseWebhookType('form','application/x-www-form-urlencoded')">application/x-www-form-urlencoded</li>
									</ul>
								</menu-list>
							</div>
						</div>
						<div class="inputSec">
							<div class="c_bold">密钥文本</div>
							<div>
								<input type="password" class="c_input_line" v-model="tab4data.key" placeholder="请输入..." />
							</div>
							<div class="c_gray_txt">密钥文本将被用于计算推送内容的 SHA256 HMAC 哈希值，并设置为 X-Gogs-Signature 请求头的值。</div>
						</div>

						<div style="margin:30px 0;" class="c_bottom_line dashed">
							<div class="c_block_margin c_flexRow flexStart c_right_margin">
								<input type="radio" value="push_only" v-model="tab4data.type" />
								<span>只推送push</span>
							</div>
							<div class="c_block_margin c_flexRow flexStart c_right_margin">
								<input type="radio" value="send_everything" v-model="tab4data.type" />
								<span>推送所有</span>
							</div>
							<div class="c_block_margin c_flexRow flexStart c_right_margin">
								<input type="radio" value="choose_events" v-model="tab4data.type" />
								<span>推送所有</span>
							</div>
						</div>
						<div class="c_paddingV c_bottom_line dashed">
							<div class="c_flexRow flexStart c_right_margin">
								<input type="checkbox" v-model="tab4data.active" />
								<span>是否激活</span>
							</div>
							<div style="margin-left:25px;" class="c_gray_txt">
								当指定事件发生时我们将会触发此 Web 钩子。
							</div>
						</div>
						<div class="c_block_margin c_right_margin" v-show="newWebhook">
							<button type="button" class="ui-btn btn-green" @click="addWebhook">添加</button>
						</div>
						<div class="c_block_margin c_right_margin" v-show="!newWebhook">
							<button type="button" class="ui-btn btn-green" @click="updateWebhook">更新</button>
							<button type="button" class="ui-btn btn-blank" @click="delWebhook(item)">删除</button>

						</div>

					</div>
					<div class="blankLine"></div>
					<!-- 最近推送记录-->
					<div>
						<div class="cntTile c_flexRow c_bottom_line">最近推送记录</div>
						<div class="c_border c_border_rad3" style="margin-top:22px">
							<div class="RCListItem c_flexRow c_bottom_line" v-for="item in hookTasks">
								<div class="c_flexRow">
									<img src="~img/src/感叹号.svg" class="c_margin-right7" alt="" style="width:25px;" />
									<span class="c_label_normal c_dark_gray_label" @click="viewDetail(item)">{{item.uuid}}</span>
								</div>
								<span class="c_gray_txt">{{ item.delivered_string }}</span>
							</div>
							<!-- 请求内容/响应内容 -->
							<div class="c_flexRow flexStart alignItemStrecth c_bottom_line editSubTabHeader" style="">
								<div class="cRNavItem  c_pointer c_flexRow c_active_bt_ind" @click="editSubTab=0" :class="{'c_gray_txt':editSubTab!=0,'active':editSubTab==0}">
									请求内容
								</div>
								<div class="cRNavItem c_pointer  c_flexRow c_active_bt_ind" @click="editSubTab=1" :class="{'c_gray_txt':editSubTab!=1,'active':editSubTab==1}">
									响应内容
								</div>
							</div>
							<!-- 请求内容 -->
							<div style="padding:18px 15px;" v-show="editSubTab==0">
								<div style="margin-bottom: 5px;">
									<div class="c_bold">头信息</div>
									<pre class="c_border_rad3 c_gray_bg" style="min-height: 100px;padding: 0 12px 24px 12px;font-family:sans-serif" v-html="requestDetail">
									</pre>
								</div>
								<div>
									<div class="c_bold">推送内容</div>
									<pre class="c_border_rad3 c_gray_bg" style="min-height: 100px;padding: 12px;font-family:sans-serif" v-html="pushDetail">
									</pre>
								</div>
							</div>
							<!-- 响应内容 -->
							<div style="padding:18px 15px;" v-show="editSubTab==1">
								
								<pre class="c_border_rad3 c_gray_bg" style="min-height: 100px;padding: 12px;font-family:sans-serif" v-html="responseDetail">
								</pre>
							</div>

						</div>

					</div>
				</div>

				<!-- 管理部署秘钥 -->
				<div v-show="subTab==5" class="ft13">
					<div class="c_bottom_line cntTile c_flexRow" style="justify-content: space-between;">
						<span>管理部署密钥</span>
						<button type="button" class="c_blue_bt" @click="showKeyCreate=true">添加密钥</button>
						<!--<span v-show="subTab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button">添加秘钥</button></span>-->
					</div>
					<div class="">
						<div class="cR2Item c_gray_txt c_flexRow c_bottom_line dashed" v-for="item in keyList">
							<img src="~img/src/绿点.svg" class="cR2ItemDot" alt="" />

							<img class="c_hd_img cR2ItemIcon" src="~img/src/密钥icon.svg" alt="" />
							<div style="flex: 1;margin-top:5px;">
								<div class="c_color_initial ft18">
									{{item.title}}
								</div>
								<div class="ft12 c_textEllipsis" style="width: 400px;">
									{{item.content}}
								</div>
								<div class="ft12">
									增加于 {{$cmmDate(item.created,2)}} —— 上次使用在 {{$cmmDate(item.updated,2)}}
								</div>
							</div>

							<button type="button" class="c_danger_bt cR2DeleButton" @click="delKey(item)">删除</button>

						</div>
						<div class="c_block_margin">常识错误<span class="c_gray_txt">如果您想要添加的是个人公钥，请将它们添加到您的</span> <span class="c_blue_color">用户设置。</span></div>
					</div>

					<div class="blankLine"></div>
					<div v-show="showKeyCreate">
						<div class="cntTile c_bottom_line c_flexRow">
							添加部署密钥
						</div>
						<div class="c_block_margin c_gray_txt">部署密钥仅具有只读权限，它在功能上和个人用户的公开密钥有本质区别。</div>

						<div class="c_block_margin">
							<input type="text" class="c_input_line" v-model="keyObj.title" placeholder="请输入标题..." />
						</div>
						<div class="c_block_margin">
							<textarea class="c_textArea" v-model="keyObj.content" cols="" placeholder="请输入密钥文本"></textarea>
						</div>
						<div class="c_block_margin">
							<button class="ui-btn btn-green" type="button" @click="createKey">确定添加</button>
						</div>
					</div>
				</div>

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
				//setting
				advance: {
					enable_wiki: false,
					enable_external_wiki: '',
					external_wiki_url: '',

					enable_issue: false,
					enable_external_tracker: false,
					external_tracker_url: '',
					tracker_url_format: '',
					tracker_issue_style: '',
					enable_pulls: ''
				},
				form1:{
					enable_prune:false,
					interval:0,
					mirror_address:'',
					updated:''
				},
				//
				tab: 4,
				subTab: 1,
				manageEdit: false,

				username: '',
				repoName: '',

				editSubTab: 0,
				repo: {},

				tab4data: {
					push_url: '',
					data_format: 'json', //json/form
					data_format_name: 'application/json',
					key: '',
					type: 'push_only', //push_only send_everything choose_events
					active: false
				},
				showWebhookTypes: false,
				tab4list: [],
				newWebhook: false,
				commits: [],
				branchname: '',

				//管理部署密钥
				keyList: [],
				keyObj: {
					title: '',
					content: ''
				},
				showKeyCreate: false,

				//管理分支
				branchMaster: '',
				// 被保护的分支名
				protectBranchName: '',
				showBranchMaster: false,
				showProtectList: false,
				protectList: [],
				defaultList: [],

				protectItem: {},
				editProtectBranch: false,
				enablePullMerge: false,
				enableBranchProtect: false,

				//collaborate
				collbList: [],
				collbname: '',
				collbnameid: '',
				// 新增协作者，获取用户列表
				users: {
					show: false,
					list: []
				},
				webhookid: '',
				// webhook推送记录
				hookTasks: [],
				// 最近推送记录-请求头
				requestDetail: '',
				// 最近推送记录-推送内容
				pushDetail: '',
				// 最近推送记录-响应内容
				responseDetail: '',
				disablePrivate: false
			}
		},
		methods: {

			updateAdvanceSetting() {
				let owner = this.username
				let repo = this.repoName

				// 是否启用wiki
				// this.advance.enable_wiki = this.repo.enable_wiki
				// // 内部wiki
				// this.advance.enable_external_wiki = this.repo.enable_external_wiki
				// // 外部wiki
				// this.advance.external_wiki_url = this.repo.external_wiki_url
				// // 是否启用工单
				// this.advance.enable_issues = this.repo.enable_issues
				// // 外部跟踪
				// this.advance.enable_external_tracker = this.repo.enable_external_tracker
				// // 外部工单地址
				// this.advance.external_tracker_url = this.repo.external_tracker_url
				// // 外部工单URL格式
				// this.advance.external_tracker_format = this.repo.external_tracker_format
				// // 外部工单命名风格
				// this.advance.external_tracker_style = this.repo.external_tracker_style
				// // 启用合并提交
				// this.advance.enable_pulls

				axios.post(`/repos/${owner}/${repo}/setting`, Object.assign({}, this.advance, {
					action: 'advanced'
				})).then(resp => {
					InfoMsg.suc('更新成功');
					this.updateStoreInfo(repo);
				}).catch(Err)

			},

			syncMirrorTime() { //同步镜像时间
				let owner = this.username
				let repo = this.repoName
				axios.post(`/repos/${owner}/${repo}/setting`, {
					action: 'mirror-sync'
				}).then(resp => {
					InfoMsg.suc('同步成功')
				}).catch(Err)
			},

			updateMirrorSetting() {
				let owner = this.username
				let repo = this.repoName
				if(isNaN(this.form1.interval * 1)) {
					InfoMsg.warn('时间间隔不是数值')
					return;
				}

				if(isStrEmpty(this.form1.mirror_address)) {
					InfoMsg.warn('镜像地址为空')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/setting`, Object.assign({}, this.form1, {
					action: 'mirror'
				})).then(resp => {
					InfoMsg.suc('更新成功')
					this.updateStoreInfo(repo);
				}).catch(Err)
			},

			//collaborate

			resetCollb() {
				this.loadCollaborate()
			},

			// 搜索用户
			searchUser() {
				if(!this.users.show) this.users.show = true;
				// collbname
				axios.post('/users/search', {
					name: this.collbname,
					// limit: ''
				}).then(res => {
					this.users.list = [...res.data.users];
					console.log('user list>>>>>>>>>', this.users.list)
				});
			},

			// 选择用户
			chooseUser(item) {
				this.collbname = item.full_name;
				this.collbnameid = item.username;
			},

			// 添加协作者
			addCollb() {
				let owner = this.username
				let repo = this.repoName

				if(isStrEmpty(this.collbname)) {
					InfoMsg.warn('collbname is empty')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/collaborators/add`, {
					collaborator: this.collbnameid
				}).then(resp => {
					this.collbname = ''
					InfoMsg.suc('添加成功');
					this.loadCollaborate();
				}).catch(Err)
			},

			// 改变权限
			settingPower(params) {
				// 权限：owner, admin, read, write
				console.log('setting power>>>>>>', params)
				let owner = this.username
				let repo = this.repoName
				axios.post(`/repos/${owner}/${repo}/collaborators/access`, {
					owner: owner,
					repo: repo,
					uid: params.user.id,
					access_mode: params.mode
				}).then(resp => {
					InfoMsg.suc('设置成功')
					this.loadCollaborate()
				}).catch(Err)

			},

			// 删除协作者
			delCollb(item) {
				let id = item.user.id
				if(isStrEmpty(id)) {
					Err('id is empty')
					return;
				}

				let owner = this.username
				let repo = this.repoName

				axios.delete(`/repos/${owner}/${repo}/collaborators/${id}`).then(resp => {
					InfoMsg.suc('删除成功')
					this.loadCollaborate()
				}).catch(Err)

			},

			// 获取协作者列表
			loadCollaborate() {
				let owner = this.username
				let repo = this.repoName

				axios.get(`/repos/${owner}/${repo}/collaborators`).then(resp => {
					let list = resp.data.collaborations
					if(list == null) {
						Err('collaboration list is empty')
						return;
					}

					this.collbList = list

				}).catch(Err)

			},

			//manage branch
			checkChange(e) {
				this.enableBranchProtect = e.target.checked
				if(!this.enableBranchProtect) {
					this.enablePullMerge = false
				}

			},
			updateBranchProtectSetting() {
				let owner = this.username
				let repo = this.repoName
				let branch = this.protectBranchName
				if(isStrEmpty(branch)) {
					InfoMsg.warn('保护分支名字不能为空')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/setprotectedbranch`, {
					branch: branch,
					protected: this.enableBranchProtect,
					require_pull_request: this.enablePullMerge
				}).then(resp => {
					this.editProtectBranch = false
					InfoMsg.suc('更新成功')
				}).catch(Err)
			},
			resetManageBranch() {
				this.editProtectBranch = false
				// this.loadProtectList()
				// 默认分支和分支保护列表保持一致
				this.loadDefaultList()
			},
			setDefaultBranch() {
				let owner = this.username
				let repo = this.repoName
				if(isStrEmpty(this.branchMaster)) {
					InfoMsg.warn('默认分支不能为空')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/updatedefaultbranch`, {
					branch: this.branchMaster
				}).then(resp => {
					InfoMsg.suc(`${this.branchMaster}分支已被设置为默认分支`)
					this.updateStoreInfo(repo);
				}).catch(Err)
			},

			setProtectBranch(item) {
				this.editProtectBranch = true;
				this.protectBranchName = item.name;
			},
			loadDefaultList() {
				let owner = this.username
				let repo = this.repoName
				axios.get(`/repos/${owner}/${repo}/branches`).then(resp => {
					this.defaultList = resp.data.branches
					this.defaultList.forEach(item => {
						if(item.is_default) {
							this.branchMaster = item.name;
							this.protectBranchName = item.name
						}
					})
				}).catch(Err)
			},
			loadProtectList() {
				let owner = this.username
				let repo = this.repoName
				axios.get(`/repos/${owner}/${repo}/protectedbranchs`).then(resp => {
					this.protectList = resp.data.protect_branchs
					this.protectList.forEach(item => {
						if(item.protected) {
							this.protectBranchName = item.name
						}
					})
				}).catch(Err)

			},
			//secret key
			createKey() {
				let owner = this.username
				let repo = this.repoName
				if(isStrEmpty(this.keyObj.title)) {
					InfoMsg.warn('title is empty')
					return;
				}

				if(isStrEmpty(this.keyObj.content)) {
					InfoMsg.warn('content is empty')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/deploykeys`, Object.assign({}, this.keyObj, {
					owner: owner,
					repo: repo
				})).then(resp => {
					InfoMsg.suc('创建成功')
					this.showKeyCreate = false
					this.loadKeyList()
				}).catch(Err)
			},
			resetKeyList() {
				this.loadKeyList()
			},
			delKey(item) {
				let owner = this.username
				let repo = this.repoName
				axios.delete('/repos/' + owner + '/' + repo + '/deploykeys/' + item.id).then(resp => {
					InfoMsg.suc('删除成功')
					this.loadKeyList()
				}).catch(Err)
			},

			loadKeyList() {
				let owner = this.username
				let repo = this.repoName
				axios.get(`/repos/${owner}/${repo}/deploykeys`).then(resp => {
					this.keyList = resp.data.deploy_keys
				}).catch(Err)
			},

			//webhook数据格式
			chooseWebhookType(type, name) {
				this.tab4data.data_format = type
				this.tab4data.data_format_name = name
			},
			resetEditWebhook() {
				this.newWebhook = false
				this.manageEdit = false
			},
			// webhook发布页
			showEditWebhook() {
				this.manageEdit = true
				this.newWebhook = true
				// 编辑转为新增时清除页面数据
				this.resetWebhookData();
			},
			editWebhook(item) {
				this.manageEdit = true
				this.newWebhook = false
				this.resetWebhookData(item);
				this.getPushRecord(item.id);
			},
			resetWebhookData(item) {
				this.webhookid = item ? item.id : '';
				this.tab4data.push_url = item ? item.payload_url : '';
				this.tab4data.key = item ? item.secret : '';
				this.tab4data.data_format = item ? item.content_type : '';
				this.tab4data.active = item ? item.is_active : false;
			},
			// 删除webhook
			delWebhook(item) {
				let owner = this.username
				let repo = this.repoName
				let id = item.id

				axios.delete(`/repos/${owner}/${repo}/webhooks/${id}`).then(resp => {
					InfoMsg.suc('删除成功');
					this.loadTab4list();
				}).catch(Err)
			},
			loadTab4list() {
				let owner = this.username
				let repo = this.repoName
				axios.get(`/repos/${owner}/${repo}/webhooks/list`).then(resp => {
					this.tab4list = resp.data.webhooks
				}).catch(Err)
			},
			// 添加web钩子
			addWebhook() {
				let owner = this.username
				let repo = this.repoName
				if(isStrEmpty(this.tab4data.push_url)) {
					InfoMsg.warn('推送链接为空')
					return;
				}
				if(isStrEmpty(this.tab4data.data_format)) {
					InfoMsg.warn('数据格式为空')
					return;
				}

				if(isStrEmpty(this.tab4data.key)) {
					InfoMsg.warn('密钥为空')
					return;
				}

				if(isStrEmpty(this.tab4data.type)) {
					InfoMsg.warn('推送类型为空')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/webhooks/create`, {
					owner: owner,
					repo: repo,
					payload_url: this.tab4data.push_url,
					content_type: this.tab4data.data_format,
					secret: this.tab4data.key,
					events: this.tab4data.type,
					is_active: this.tab4data.active,
					hook_task_type: "",
					hook_event: {
						create: "",
						delete: "",
						push: "",
						fork: "",
						issues: "",
						issue_comment: "",
						pull_request: "",
						release: ""
					},
					slack_meta: {
						channel: "",
						username: "",
						icon_url: "",
						color: ""
					}
				}).then(resp => {
					InfoMsg.suc('创建成功');
					this.resetEditWebhook();
					this.loadTab4list();
				}).catch(Err)
			},
			// 编辑web钩子
			updateWebhook() {
				let owner = this.username
				let repo = this.repoName
				if(isStrEmpty(this.tab4data.push_url)) {
					InfoMsg.warn('推送链接为空')
					return;
				}
				if(isStrEmpty(this.tab4data.data_format)) {
					InfoMsg.warn('数据格式为空')
					return;
				}

				if(isStrEmpty(this.tab4data.key)) {
					InfoMsg.warn('密钥为空')
					return;
				}

				if(isStrEmpty(this.tab4data.type)) {
					InfoMsg.warn('推送类型为空')
					return;
				}

				axios.post(`/repos/${owner}/${repo}/webhooks/edit`, {
					hook_id: this.webhookid,
					owner: owner,
					repo: repo,
					payload_url: this.tab4data.push_url,
					content_type: this.tab4data.data_format,
					secret: this.tab4data.key,
					events: this.tab4data.type,
					is_active: this.tab4data.active,
					hook_task_type: "",
					hook_event: {
						create: "",
						delete: "",
						push: "",
						fork: "",
						issues: "",
						issue_comment: "",
						pull_request: "",
						release: ""
					},
					slack_meta: {
						channel: "",
						username: "",
						icon_url: "",
						color: ""
					}
				}).then(resp => {
					InfoMsg.suc('编辑成功');
					this.resetEditWebhook();
					this.loadTab4list();
				}).catch(Err)

			},
			// 获取最近推送记录
			getPushRecord(id) {
				let page = 1;
				let owner = this.username;
				let repo = this.repoName;
				axios.post(`/repos/${owner}/${repo}/hooktasks/${id}/${page}`, {
					owner: owner,
					repo: repo,
					hook_id: id,
					page: page
				}).then(resp => {
					this.hookTasks = [...resp.data.hook_tasks];
				}).catch(Err)
			},
			// 查看推送记录详情
			viewDetail(item) {
				this.pushDetail = this.formatJSON(JSON.parse(item.payload_content));
				this.requestDetail = JSON.stringify(item.request_info.headers,null, 6)
				.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match){
					let cls = '';
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = 'color:#666;font-weight:700';
						}
					}
					return '<span style="' + cls + '">' + match + '</span>';
				}).replace(/\"|{|}/g,'');
				this.responseDetail = this.formatJSON(JSON.parse(item.response_content));
			},
			updateStore() {
				// 仓库名称
				let newRepo = this.repo.name
				// 仓库描述
				let description = this.repo.description
				let website = this.repo.website
				let tprivate = this.repo.private || false
				if(isStrEmpty(newRepo)) {
					Err('请输入仓库名称！')
					return;
				}

				// 更新仓库设置
				axios.post(`/repos/${this.username}/${this.repoName}/setting`, {
					repo: this.repoName,
					new_repo: newRepo,
					description: description,
					website: website,
					private: tprivate,
					action: 'base'
				}).then(resp => {
					InfoMsg.suc('更新成功');
					// 重新获取仓库数据，并更新全局缓存的repo
					this.updateStoreInfo(newRepo);
				}).catch(Err)
			},
			// 移除wiki数据
			deleteWiki() {
				axios.post(`/repos/${this.username}/${this.repoName}/setting`, {
					new_repo: this.repo.name,
					action: 'delete-wiki'
				}).then(resp => {
					InfoMsg.suc('删除成功')
				}).catch(Err)
			},
			// 删除仓库
			deleteStore() {
				axios.delete('/repos/' + this.username + '/' + this.repoName).then(resp => {
					InfoMsg.suc('删除成功')
				}).catch(Err)
			},
			// 更细当前仓库信息
			updateStoreInfo(repo) {
				axios.get(`/repos/${this.username}/${repo}`).then(res => {
					this.repo = res.data;
					this.advance.enable_wiki = this.repo.enable_wiki
                    this.advance.enable_external_wiki = this.repo.enable_external_wiki
                    this.advance.external_wiki_url = this.repo.external_wiki_url
                    this.advance.enable_issues = this.repo.enable_issues
                    this.advance.enable_external_tracker = this.repo.enable_external_tracker
                    this.advance.external_tracker_url = this.repo.external_tracker_url
                    this.advance.external_tracker_format = this.repo.external_tracker_format
                    this.advance.external_tracker_style = this.repo.external_tracker_style
                    this.advance.enable_pulls = this.repo.enable_pulls

                    this.form1.interval=this.repo.mirror.interval
                    this.form1.enable_prune=this.repo.mirror.enable_prune
                    this.form1.updated=this.repo.mirror.updated
                    this.branchMaster = this.repo.default_branch
				});
			},
			formatJSON(json) {
				if (typeof json != 'string') {
					json = JSON.stringify(json, undefined, 6);
				}
				json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
				return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
					var cls = 'color:#008080';
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = 'color:#333';
						} else {
							cls = 'color:#d14';
						}
					} else if (/true|false/.test(match)) {
						cls = 'color:#008080';
					} else if (/null/.test(match)) {
						cls = 'color:#008080';
					}
					return '<span style="' + cls + '">' + match + '</span>';
				});
			}
		},
		computed: {

		},
		components: {
			'store-tab': StoreTab,
			'menu-list': MenuList
		},
		created() {
			let tab = this.$route.query.tab
			if(tab != null) this.subTab = tab;
			// 登录用户
            this.self = this.$getSelf()
            this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
			if (this.$route.query.subTab > 0) {
                this.subTab = this.$route.query.subTab
			}
            // 仓库的拥有者
            var that = this;
            this.$getUser(this.username, function(user) {
                that.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                that.repo= repo;
                that.advance.enable_wiki = that.repo.enable_wiki
                that.advance.enable_external_wiki = that.repo.enable_external_wiki
                that.advance.external_wiki_url = that.repo.external_wiki_url
                that.advance.enable_issues = that.repo.enable_issues
                that.advance.enable_external_tracker = that.repo.enable_external_tracker
                that.advance.external_tracker_url = that.repo.external_tracker_url
                that.advance.external_tracker_format = that.repo.external_tracker_format
                that.advance.external_tracker_style = that.repo.external_tracker_style
                that.advance.enable_pulls = that.repo.enable_pulls
                if (repo.is_mirror == true) {
                    that.form1.interval = that.repo.mirror.interval
                    that.form1.enable_prune = that.repo.mirror.enable_prune
                    that.form1.updated = that.repo.mirror.updated
                    that.disablePrivate = "true"
                }
                if (repo.fork == true) {
                    that.disablePrivate = "true"
                }

                that.branchMaster = that.repo.default_branch
            });

			this.loadTab4list();
			this.loadProtectList();
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
	
	.cntRightCnt {
		padding-top: 0 !important;
	}
	
	.cSection .cntLeftList {
		padding-top: 0;
	}
	
	.cSection .cntLeftListItem {
		margin-top: 10px;
		margin-bottom: 10px;
	}
	
	.cSection .cntRight {
		/*background-color: transparent;*/
	}
	
	.cntRight .blankLine {
		height: 10px;
		background: #f4f5f9;
	}
	
	.blankLine {
		transform: scaleX(1.05);
	}
	
	.inputSec {
		padding-bottom: 7px;
	}
	
	.dangerItem {
		height: 100px;
	}
	/*section 2*/
	
	.MGItem {
		height: 82px;
	}
	
	.RCListItem {
		height: 40px;
		padding: 0 10px;
	}
	
	.editSubTabHeader {
		height: 50px;
		padding-left: 40px;
	}
	
	.editSubTabHeader .cRNavItem {
		margin-right: 50px;
	}
	.fileListItem:hover {
        cursor: pointer;
        background: #F4F5F9;
    }

    .fileListItem {
        padding: 2px 12px;
        height: 36px;
    }

    .fileListItem.c_bottom_line:last-of-type:after {
        display: none;
    }

    .fileListItem img {
        width: 12px;
        margin-right: 19px;
    }
</style>