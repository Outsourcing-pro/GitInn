<template>
	<div class="c_cnt c_contentBody c_flexRow cSection">
		<div class="cntLeft">
			<div class="c_bottom_line cntTile c_flexRow"><img src="~img/src/设置.svg" /> 账户设置
			</div>
			<div class="cntLeftList">
				<div class="cntLeftListItem c_flexRow" :class="{active:tab==1}" @click="tab=1">个人信息</div>
				<div class="cntLeftListItem c_flexRow" :class="{active:tab==2}" @click="tab=2">管理SSH秘钥</div>
				<div class="cntLeftListItem c_flexRow" :class="{active:tab==3}" @click="tab=3">管理授权页面</div>
				<!-- 2.1才做 -->
				<!-- <div class="cntLeftListItem c_flexRow" :class="{active:tab==4}" @click="tab=4">管理组织</div> -->
			</div>
		</div>
		<div class="cntRight">
			<div class="c_bottom_line cntTile c_flexRow">
				<span v-show="tab==1">个人信息</span>
				<span v-show="tab!=1" class="c_flexRow cntTile2Item"><span>管理</span><button class="c_blue_bt" type="button" @click="addNewKey">添加秘钥</button></span>
			</div>
			<div class="cntRightCnt">
				<div v-show="tab==1">
					<div v-show="!editSelf">
						<div class="rcItem">
							<span>用户名: </span>{{user.username}}
						</div>
						<div class="rcItem">
							<span>昵称: </span>{{user.full_name}}
						</div>
						<div class="rcItem">
							<span>邮箱: </span>{{user.email}}
						</div>
						<div><button type="button" class="cSButton c_blue_bt" @click="editSelfInfo">编辑信息</button></div>
					</div>
					<div v-show="editSelf">
						<div class="editSelfinputSec">
							<div class="c_bold ft13">用户名</div>
							<div><input type="text" class="c_input_line" v-model="tempSelf.username" /></div>
						</div>
						<div class="editSelfinputSec">
							<div class="c_bold ft13">昵称</div>
							<div><input type="text" class="c_input_line" v-model="tempSelf.full_name" /></div>
						</div>
						<div class="editSelfinputSec">
							<div class="c_bold ft13">邮箱</div>
							<div><input type="text" class="c_input_line" v-model="tempSelf.email" /></div>
						</div>

						<div class="c_block_margin">
							<button type="button" class="ui-btn btn-green c_margin-right10" @click="saveSelfInfo">保存</button>
							<button type="button" class="ui-btn btn-blank" @click="editSelf=false">取消</button>
						</div>

					</div>

				</div>
				<div v-show="tab==2" class="c_gray_txt">
					<div class="c_flexRow c_bottom_line cR2ItemTitle">以下是您账户所关联的SSH密钥</div>
					<div class="cR2Item c_flexRow c_bottom_line dashed" v-for="item in keys">
						<img src="~img/src/绿点.svg" class="cR2ItemDot" alt="" />

						<img class="c_hd_img cR2ItemIcon" src="~img/src/密钥icon.svg" alt="" />
						<div style="flex: 1;margin-top:5px;">
							<div class="c_color_initial ft18">
								{{item.title}}
							</div>
							<div class="ft12 c_textEllipsis" style="width: 400px;">
								{{item.key}}
							</div>
							<div class="ft12">
								增加于 {{$cmmDate(item.created_at,2)}} —— 上次使用在 {{$cmmDate(item.updated_at,2)}}
							</div>
						</div>

						<button type="button" class="c_danger_bt cR2DeleButton" @click="deleteKey(item)">删除</button>

					</div>

					<div class="c_flexRow flexStart cR2Help">
						<img src="~img/src/帮助.svg" style="width:10px" alt="" /> 需要帮助? 请查看有关如何<span class="c_blue_color">生成SSH密钥</span> 或 <span class="c_blue_color">常见SSH问题</span>寻找答案
					</div>

					<div v-show="showAddKey">
						<div class="cntTile c_bottom_line c_flexRow">
							添加部署密钥
						</div>
						<div class="c_block_margin c_gray_txt">部署密钥仅具有只读权限，它在功能上和个人用户的公开密钥有本质区别。</div>

						<div class="c_block_margin">
							<input type="text" class="c_input_line" v-model="tempKey.title" placeholder="请输入标题..." />
						</div>
						<div class="c_block_margin">
							<textarea class="c_textArea" cols="" v-model="tempKey.key" placeholder="请输入密钥文本"></textarea>
						</div>
						<div class="c_block_margin">
							<button class="ui-btn btn-green" type="button" @click="addKey">确定添加</button>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import qs from 'qs'

	export default {
		data() {
			return {
				tab: 1,
				self: {},
				tempSelf: {},
				tempKey: {
//					title: '',
//					key: ''
				},
				user: {},
				keys: [],

				editSelf: false,
				showAddKey: false
			}
		},
		methods: {
			editSelfInfo() {
				window.location.href = window.domains.proginnProfileUrl;
			},
			saveSelfInfo() {
				// axios.
			},
			deleteKey(item) {
				axios.delete('/user/keys/' + item.id).then(resp => {
					location.reload()
				}).catch(err => Err(err))
			},
			reloadKeys(cb) {
				axios.get('/users/' + this.self.username + '/keys').then(resp => {
					this.keys = resp.data.keys
					cb && cb()
				}).catch(err => {
					Err(err)
					cb && cb()
				})
			},
			addNewKey() {
				this.showAddKey = true
			},
			addKey() {
				var title = this.tempKey.title
				var key = this.tempKey.key
				if (title == null || (title + '').trim() === '') {
					InfoMsg.warn('title is empty')
					return;
				}
				if (key == null || (key + '').trim() === '') {
					InfoMsg.warn('key is empty')
					return;
				}

				axios.post('/user/keys', this.tempKey).then(resp => {

					this.reloadKeys(() => {
						this.showAddKey = false
					})

					//					location.reload()
				}).catch(err => {
					Err(err)
				})

			}
		},
		computed: {

		},
		created() {

			var tab = this.$route.query.tab
			if (tab != null) {
				this.tab = tab
			}

			this.self = this.$getSelf()
			axios.get('/users/' + this.self.username).then(resp => {
				console.log(resp.data)
				this.user = resp.data
			}).catch(err => Err(err))

			this.reloadKeys()

		},
		mounted() {

		}

	}
</script>

<style scoped>
	/*.c_contentBody {
		justify-content: flex-start;
	}*/
	
	.rcItem {
		margin-bottom: 20px;
	}
	
	.cSButton {
		margin-top: 15px;
		width: 140px;
		height: 40px;
	}
	
	.cntTile2Item {
		width: 100%;
	}
	
	.editSelfinputSec {
		padding-bottom: 30px;
	}
</style>