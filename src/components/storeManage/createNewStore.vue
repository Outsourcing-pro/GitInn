<template>
	<div class="c_contentBody ft13 c_cnt">
		<div class="CNSHeader c_flexRow flexStart c_bottom_line">
			<span class="c_bold ft16">创建新仓库</span>
		</div>
		<div class="inputSec" style="margin-top:20px;">
			<div class="c_bold">拥有者<span class="c_red_txt">*</span></div>
			<div class="c_select_style c_flexRow" style="width:376px;">
				<img :src="self.avatar_url" class="c_hd_img left c_wh26" alt="" />
				<div class=""></div>
				<!--<input type="text" class="c_input" placeholder="请输入..." />-->
				<!--<img src="~img/src/多层级_下.svg" style="width:5px;" class="right" alt="" />-->
			</div>
		</div>
		<div class="inputSec">
			<div class="c_bold">仓库名称<span class="c_red_txt">*</span></div>
			<div>
				<input type="text" v-model="name" class="c_input_line" placeholder="请选择..." />
			</div>
			<div class="ft12">伟大的仓库名称一般都较短、令人深刻并且独一无二</div>
		</div>
		<div class="c_block_margin c_flexRow flexStart">
			<label><input type="checkbox" v-model="private" /> 该仓库为私有</label>
		</div>
		<div class="c_bottom_line" style="padding-bottom: 20px;">
			<div class="c_bold">仓库描述</div>
			<textarea class="c_textArea" v-model="description" name="" rows="" cols=""></textarea>
		</div>

		<!-- gitignore -->
		<div class="inputSec c_relative" style="margin-top: 5px;">
			<div class="c_bold">.gitignore</div>
			<div @click="showGitignoreList()" class="c_relative">
				<input type="text" class="c_input_line" readonly v-model="gitignores.current" placeholder="选择 .gitignore 模板" />
				<menu-list :type="1" :show.sync="gitignores.open">
					<ul @click.stop>
						<li v-for="item in gitignores.list" @click="chooseGitignore(item)">{{item}}</li>
					</ul>
				</menu-list>
			</div>
		</div>

		<!-- licenses -->
		<div class="inputSec c_relative">
			<div class="c_bold">授权许可</div>
			<div @click="showLiceseList()" class="c_relative">
				<input type="text" class="c_input_line" readonly v-model="licenses.current" placeholder="请选择授权自序文件" />
				<menu-list :type="1" :show.sync="licenses.open">
					<ul @click.stop>
						<li v-for="item in licenses.list" @click="chooseLicense(item)">{{item}}</li>
					</ul>
				</menu-list>
			</div>
		</div>
		<div class="inputSec c_relative">
			<div class="c_bold">自诉文档</div>
			<div @click="showReadMeList()" class="c_relative">
				<input type="text" class="c_input_line" readonly v-model="reademes.current" placeholder="请选择自述文档" />
				<menu-list :type="1" :show.sync="reademes.open">
					<ul @click.stop>
						<li v-for="item in reademes.list" @click="chooseReadMe(item)">{{item}}</li>
					</ul>
				</menu-list>
			</div>
		</div>
		<div style="padding-bottom: 20px;" class="c_flexRow flexStart c_bottom_line">
			<input type="checkbox" class="c_margin-right10" v-model="auto_init" />
			<span>使用选定的文件和模板初始化仓库</span>
		</div>

		<div class="c_paddingV">
			<button class="ui-btn btn-green c_margin-right10" @click="submit">创建仓库</button>
			<button class="ui-btn btn-blank" @click="$router.go(-1)">取消</button>
		</div>

	</div>
</template>

<script>
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				selfHeadImg: '',
				name: '',
				description: '',
				private: true,
				auto_init: true,
				gitignores: {
					open: false,
					current: '',
					list: []
				},
				licenses: {
					open: false,
					current: '',
					list: []
				},
				reademes: {
					open: false,
					current: '',
					list: []
				},

				self: {},

				showGitignore: false,		
				test:0	
			}
		},
		methods: {
			// gitignore模板
			showGitignoreList() {
				// 获取模板
				axios.get(`repos/ignores`).then(repos => {
					this.gitignores.open = true;
					this.gitignores.list = [...repos.data.ignores];
				}).catch(Err)
			},
			chooseGitignore(item) {
				this.gitignores.current = item;
			},
			// license模板
			showLiceseList() {
				// 获取模板
				axios.get(`repos/licenses`).then(repos => {
					this.licenses.open = true;
					this.licenses.list = [...repos.data.licenses];
				}).catch(Err)
			},
			chooseLicense(item) {
				this.licenses.current = item;
			},
			// reademes
			showReadMeList() {
				// 获取模板
				axios.get(`repos/readmes`).then(repos => {
					this.reademes.open = true;
					this.reademes.list = [...repos.data.reademes];
				}).catch(Err)
			},
			chooseReadMe(item) {
				this.reademes.current = item;
			},
			submit() {
				// localStorageEx.set('storeItem', {name: 'quick help3', username: 'u10468'}) 
				// this.$router.push('initstoreone')
				// return;
				if(isStrEmpty(this.name)) {
					InfoMsg.warn('名称不能为空')
					return;
				}

				// if(isStrEmpty(this.gitignores)) {
				// 	InfoMsg.warn('gitignores 模版不能为空')
				// 	return;
				// }

				axios.post('/user/repos', {
					name: this.name,
					description: this.description,
					private: this.private,
					auto_init: this.auto_init,
					gitignores: this.gitignores.current,
					licenses: this.licenses.current,
					reademes: this.reademes,
					owner: this.self.username
				}).then(resp => {
					// auto_init为true时跳转到当前仓库首页，否则跳转到快速帮助
					let item = resp.data
					//if(this.auto_init) {
						this.$router.push({path: `/${item.owner.username}/${item.name}`});
					//} else {
					//	localStorageEx.set('storeItem', item);
					//	this.$router.push('initstoreone');
					//}
				}).catch(Err)
			}
		},
		components: {
			'menu-list': MenuList
		},
		created() {
			this.self = this.$getSelf()
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