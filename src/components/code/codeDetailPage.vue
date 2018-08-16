<template>
	<div class="c_contentBody c_white_bg">
		<div class="c_paddingV c_padding">
			<div class="c_border c_border_rad3">
				<div class="c_flexRow CDPushHeader c_gray_bg">
					<div class="c_bold"></div>
					<div class="c_flexOne"></div>
					<button type="button" class="ui-btn " @click="viewSource">浏览代码</button>
				</div>
				<div class="c_flexRow c_right_margin c_padding CDPushBody">
					<img @click="goUser(list.data.commit.author)" :src="list.data && list.data.commit && list.data.commit.author && list.data.commit.author.avatar_url" class="c_hd_img cursor" alt="" style="width: 26px;margin-right:10px;" />
					<span class="c_blue_color c_pointer" @click="goUser(list.data.commit.author)">{{list.data.commit.author.full_name}}</span>
					<span>{{this.list.data.commit && $distanceInWords(list.data.commit.created)}}</span>
					<span class="c_flexOne"></span>
					<span>父节点</span>
					<span v-for="(item,index) in list.data.parents" @click="routerCodeDetail(item)" class="c_gray_label c_textEllipsis ft12 c_pointer" style="width: 93px;margin-right: 15px;">{{item}}</span>
					<span class="c_bold">当前提交</span>
					<span class="c_gray_label c_textEllipsis ft12" style="width: 93px;margin-right: 15px;">{{list.data.commit.id}}</span>
				</div>
			</div>
		</div>
		<div class=" c_padding">
			<div class="c_paddingV c_flexRow">
				<div class="c_flexRow">
					<img src="~img/src/合并请求.svg" style="width:20px;margin-right:10px;" alt="" />
					<span>{{diff.files && diff.files.length}} 个文件被更改，包括 {{diff.total_addition}} 次插入 和 {{diff.total_deletion}} 次删除</span>
				</div>
				<div class="c_flexOne"></div>
				<div class="btn-group">
					<div class="ui-btn-simple" @click="viewShowType=!viewShowType;highlight()">{{viewShowType==0?'分列视图':'合并视图'}}</div>
					<div class="ui-btn-simple" @click="showStatic=!showStatic">文件统计</div>
				</div>
			</div>
			<div class="static" v-show="showStatic">
				<div class="static_item c_flexRow" v-for="item in this.diff.files">
					<span>{{item.name}}</span>
					<div class="c_flexRow">
						<span class="c_margin-right10">+{{item.addition}}</span>
						<div class="CPProgressCnt c_gray_bg">
							<div class="c_green_bg CPProgress" :style="{width:item.addition*100/(item.addition+item.deletion)+'%'}"></div>
						</div>
						<span class="c_green_txt" style="margin:0 35px">-{{item.deletion}}</span>
					</div>
				</div>
			</div>
			<div class="c_paddingV">
				<div class="repository diff">
					<div class="comparePanel c_border c_border_rad3" v-for="file in diff.files">
						<div class="diff-file-box diff-box file-content tab-size-8">

							<div class="comparePanelTitle c_flexRow">
								<span class="c_margin-right10">+{{file.addition}}</span>
								<div class="CPProgressCnt c_gray_bg">
									<div class="c_green_bg CPProgress" :style="{width:file.addition*100/(file.addition+file.deletion)+'%'}"></div>
								</div>
								<span class="c_green_txt" style="margin:0 35px">-{{file.deletion}}</span>
								<span class="c_gray_txt c_flexOne">{{file.name}}</span>
								<div class="ui-btn-simple c_border_rad3 c_pointer" @click="viewFile(file.name)">查看文件</div>
							</div>
							<!-- code view -->
							<div class="file-body file-code code-view code-diff">
								<table>
									<tbody v-for="section in file.sections">
										<tr v-if="viewShowType==0" v-for="line in section.lines" :class="{'tag-code':calLineType(line)==0,'add-code':calLineType(line)==1,'del-code':calLineType(line)==2,'same-code':calLineType(line)==3}">
											<td colspan="2" class="lines-num" v-if="calLineType(line)==0"></td>
											<td class="lines-num lines-num-old" v-if="calLineType(line)!=0">
												{{line.left_idx==0?'':line.left_idx}}
											</td>
											<td class="lines-num lines-num-new" v-if="calLineType(line)!=0">
												{{line.right_idx==0?'':line.right_idx}}
											</td>
											<td class="lines-code">
												<pre><code>{{line.content}}</code></pre>
											</td>
										</tr>

										<!--分列视图-->
										<tr v-if="viewShowType==1" v-for="line in section.lines" :class="{'tag-code':calLineType(line)==0,'add-code':calLineType(line)==1,'del-code':calLineType(line)==2,'same-code':calLineType(line)==3}">
											<td class="lines-num" v-if="calLineType(line)==0"></td>
											<td class="lines-code" colspan="3" v-if="calLineType(line)==0">
												<pre><code>{{line.content}}</code></pre>
											</td>
											<td class="lines-num lines-num-old" v-if="calLineType(line)!=0">
												{{line.left_idx==0?'':line.left_idx}}
											</td>
											<td class="lines-code halfwidth">
												<pre><code class="wrap">{{line.left_idx!=0?line.content:''}}</code></pre>
											</td>
											<td class="lines-num lines-num-new borderLeft" v-if="calLineType(line)!=0">
												{{line.right_idx==0?'':line.right_idx}}
											</td>
											<td class="lines-code halfwidth">
												<pre><code class="wrap">{{line.right_idx!=0?line.content:''}}</code></pre>
											</td>
										</tr>

									</tbody>

								</table>
							</div>
							<!--<div class="comparePanelDes c_gray_bg">@@ -0,0 +1,64 @@</div>
								<div class="c_flexRow alignItemStrecth comparePanelCnt">
									<div class="comparePanelCntLeft c_darkGray_text">
										<span v-for="n in 20" class="comparePanelCntLeftItem">{{n}}</span>
									</div>
									<div class="comparePanelCntRight c_flexOne">
										<code style="white-space: pre-wrap;">
										</code>
									</div>
								</div>-->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'
    import Highlight from '@/highlights/index'
	export default {
		data() {
			return {
				showStatic: false,
				viewShowType: 0, //0 合并显示,1 分列显示
				subTab: 0,
				repo: {},
				self: {},
				username: '',
				repoName: '',
				commitID: '',
				diff: {},
				list: {
				    data: {commit:{author:{}}, parents: [], diff:{}}
				}
			}
		},
		methods: {
			calLineType(line) {
				let type = -1;
				if(line.left_idx == 0 && line.right_idx == 0) type = 0; //tags
				else if(line.left_idx == 0 && line.right_idx > 0) type = 1; //add
				else if(line.left_idx > 0 && line.right_idx == 0) type = 2; //deletion
				else if(line.left_idx == line.right_idx && line.left_idx > 0) type = 3 //same

				return type;
			},
			getCommit() {
				axios.get(`/repos/${this.username}/${this.repoName}/commit/${this.commitID}`).then(resp => {
					this.list.data = resp.data;
					this.diff = this.list.data.diff;
                    this.$nextTick(function() {
                        Highlight.highlightCode();
                    });
				})
			},
			goUser(user) {
			    if (user.id) {
			        this.$router.push({path: `/${user.username}`});
			    }
			},
			// 提交页面
            routerCodeDetail(id) {
                window.location.href = `/${this.username}/${this.repoName}/commit/${id}`;
            },
            viewSource() {
                this.$router.push({path: `/${this.username}/${this.repoName}/src/${this.commitID}`});
            },
            viewFile(path) {
                this.$router.push({path: `/${this.username}/${this.repoName}/src/${this.commitID}/${path}?is_dir=false`});
            },
			highlight() {
			    this.$nextTick(function () {
                    Highlight.highlightCode();
                });
			}
		},
		computed: {

		},
		components: {
			'store-tab': StoreTab
		},
		created() {
		    // 登录用户
            this.self = this.$getSelf()
            this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
            this.commitID = this.$route.params.commitId
			// 仓库的拥有者
            var that = this;
            this.$getUser(this.username, function(user) {
                that.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                that.repo = repo;
                if (that.branchName == '' || typeof(that.branchName) == 'undefined') {
                    that.branchName = repo.default_branch
                }
            });
			this.getCommit();
		},
		mounted() {

		}
	}
</script>

<style scoped>
	.code-view {
		overflow: auto;
	}
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
	/*compare css*/
	
	.compareTable {
		width: 100%;
		font-size: 12px;
		line-height: 1.4;
		border-collapse: collapse;
	}
	
	.lines-num {
		color: gray;
		padding: 0 3px;
		border-right: 1px solid #d4d4d5;
		text-align: center;
		width: 15px;
		min-width: 15px;
	}
	
	.borderLeft {
		border-left: 1px solid #d4d4d5;
	}
	
	.tag-code {
		background: #F0F0F0;
	}
	
	.same-code {
		background: white;
	}
	
	.add-code {
		background: #eaffea;
	}
	
	.del-code {
		background: #ffecec;
	}
	
	.lines-code {
		padding-left: 10px;
		text-align: left;
	}
	
	.halfwidth {
	}
	
	.lines-code pre {
		margin: 0;
		text-align: left;
	}
	
	.lines-code code {
		/*padding-top:4px;
		float: left;*/
		/*display: inline;*/
	}
	
	.static {
		margin-bottom: 10px;
		color: gray;
	}
	
	.static_item {
		padding: 10px;
		border-bottom: 1px dashed darkgray;
	}
</style>