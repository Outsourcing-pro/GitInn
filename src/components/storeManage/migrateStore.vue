<template>
	<div class="c_contentBody ft13 c_cnt">
		<div class="CNSHeader c_flexRow flexStart c_bottom_line">
			<span class="c_bold ft16">迁移外部仓库</span>
		</div>
		<div class="inputSec" style="margin-top:20px;">
			<div class="c_bold">仓库名称</div>
			<div>
				<input type="text" class="c_input_line" placeholder="请选择..." v-model="storeUrl"/>
			</div>
			<div class="ft12 c_darkGray_text">该地址可以是 HTTP/HTTPS/GIT 类型的 URL</div>
		</div>
		<div class="c_block_margin c_flexRow flexStart c_bold">
			<img src="~img/src/多层级_下.svg" style="margin-right: 10px; width:10px;" alt="" />
			<span>需要验证授权</span>
		</div>

		<div class="inputSec">
			<div class="c_bold">用户名</div>
			<div>
				<input type="text" class="c_input_line" style="width: 50%;" v-model="loginName"/>
			</div>
		</div>
		<div class="inputSec c_bottom_line dashed" style="padding-bottom: 30px;">
			<div class="c_bold">密码</div>
			<div>
				<input type="password" class="c_input_line" style="width: 50%;" v-model="loginPwd"/>
			</div>
		</div>

		<div class="inputSec">
			<div class="c_bold">拥有者<span class="c_red_txt">*</span></div>
			<div class="c_select_style c_flexRow" style="width: 40%;">
				<img src="~img/headImg/nv06.jpg" class="c_hd_img left c_wh26" alt="" />
				<div class=""></div>
				<!--<input type="text" class="c_input" placeholder="请输入..." />-->
				<!--<img src="~img/src/多层级_下.svg" style="width:5px;" class="right" alt="" />-->
			</div>
		</div>
		<div class="inputSec" style="margin-top:20px;">
			<div class="c_bold">仓库名称<span class="c_red_txt">*</span></div>
			<div>
				<input type="text" class="c_input_line" placeholder="请输入..." v-model="name"/>
			</div>
		</div>

		<div class="c_block_margin c_flexRow flexStart">
			<label for=""><input type="checkbox" v-model="isPrivate"/> 该仓库为私有</label>
		</div>
		<div class="c_block_margin c_flexRow flexStart">
			<label for=""><input type="checkbox" v-model="mirror"/> 该仓库是一个<span class="c_blue_color">镜像</span></label>
		</div>

		<div class="c_bottom_line dashed" style="padding-bottom: 20px;">
			<div class="c_bold">仓库描述</div>
			<textarea class="c_textArea" name="" rows="" cols="" placeholder="请输入..." v-model="description"></textarea>
		</div>

		<div class="inputSec" style="margin-top: 5px;margin-bottom: 0;">
			<div class="c_bold">.gitignore</div>
			<div><input type="text" class="c_input_line" placeholder="选择..." /></div>
		</div>

		<div class="c_paddingV">
			<button class="ui-btn btn-green c_margin-right10" @click="moveStore()">迁移仓库</button>
			<button class="ui-btn btn-blank" @click="goBack()">取消</button>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				storeUrl: '',
				loginName: '',
				loginPwd: '',
				username: '',
				name: '',
				isPrivate: false,
				mirror: false,
				description: '',
				self: {}
			}
		},
		methods: {
			goBack() {
				this.$router.back();
			},
			moveStore() {
				axios.post(`repos/${this.username}/${this.name}/migrate`, {
					clone_addr: this.storeUrl,
					repo: this.name,
					private: this.isPrivate,
					mirror: this.mirror,
					description: this.description,
					owner: this.username,
					auth_username: this.loginName,
					auth_password: this.loginPwd
				}).then(resp => {
					let item = {
						username: this.self.username,
						name: this.name
					};
					// 跳转到仓库首页
					this.$router.push({path: `/${resp.data.owner.username}/${resp.data.name}`});
				}).catch(Err)
			}
		},
		
		created() {
			this.self = this.$getSelf();
			this.username = this.self.username;
			// this.name = this.self.name;
			// console.log(this.self)
		}

	}
</script>

<style scoped>
	.CNSHeader {
		height: 60px;
	}
	
	.inputSec {
		margin-bottom: 20px;
		padding-bottom: 7px;
	}
</style>