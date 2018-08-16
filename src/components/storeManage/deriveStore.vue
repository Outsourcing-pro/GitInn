<template>
	<div class="c_contentBody ft13 c_cnt">
		<div class="CNSHeader c_flexRow flexStart c_bottom_line">
			<span class="c_bold ft16">创建新的派生仓库</span>
		</div>
		<div class="inputSec c_block_margin">
			<div class="c_bold">拥有者<span class="c_red_txt">*</span></div>
			<div class="c_select_style c_flexRow c_relative" style="width: 40%;">
				<img :src="self.avatar_url" class="c_hd_img left c_wh26" alt="" />
				<div class="" style="text-align: center;padding-right: 30px;">{{self.full_name}}</div>
				<menu-list :type="1" :show.sync="showOwner">
					<ul @click.stop>
						<li>{{self.full_name}}</li>
						<!--<li v-for="item in branches" @click="chooseBranch(item)">{{item.name}}</li>-->
					</ul>
				</menu-list>

				<!--<input type="text" class="c_input" placeholder="请输入..." />-->
				<!--<img src="~img/src/多层级_下.svg" style="width:5px;" class="right" alt="" />-->
			</div>
		</div>
		<div class="c_block_margin">派生自: <span class="c_blue_color">{{repo.full_name}}</span></div>

		<div class="inputSec">
			<div class="c_bold">仓库名称<span class="c_red_txt">*</span></div>
			<div>
				<input type="text" class="c_input_line" v-model="name" placeholder="请选择..." />
			</div>
		</div>

		<div class="c_block_margin c_flexRow flexStart">
			<div>
				<div>
					<label for="">该仓库为<span class="c_red_txt" v-show="repo.private">私有</span><span class="c_red_txt" v-show="repo.private === false">公开</span></label>
				</div>
				<div class="c_gray_txt">派生仓库无法修改可见性</div>
			</div>

		</div>

		<div class="c_bottom_line dashed" style="padding-bottom: 20px;">
			<div class="c_bold">仓库描述</div>
			<textarea class="c_textArea" v-model="desc" placeholder="请选择..."></textarea>
		</div>

		<div class="c_paddingV">
			<button class="ui-btn btn-green c_margin-right10" @click="fork">派生仓库</button>
			<button class="ui-btn btn-blank" @click="$route.go(-1)">取消</button>
		</div>

	</div>
</template>

<script>
	import MenuList from '@/comp/menuList'

	export default {
		data() {
			return {
				showOwner: false,
				repo: {},
				self: {},
				desc: '',
				name: ''
			}
		},
		methods: {
			fork() {
				if(isStrEmpty(this.name)){
					InfoMsg.warn('仓库名称为空')
					return;
				}
				
				let owner=this.repo.owner.username
				let repo=this.repo.name
				axios.post('/repos/'+owner+'/'+repo+'/fork',{
					new_repo: this.name,
					description: this.desc
				}).then(resp=>{
					let newRepo = resp.data
					this.$router.push({path: `/${newRepo.owner.username}/${newRepo.name}`})
				}).catch(Err)
			}
		},
		computed: {

		},
		created() {
			// 登录用户
            this.self = this.$getSelf()
            this.username = this.$route.params.username
            this.repoName = this.$route.params.repoName
            // 仓库的拥有者
            var that = this;
            this.$getUser(this.username, function(user) {
                that.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                that.repo= repo;
                that.name = repo.name;
            });
		},
		mounted() {

		},
		components: {
			'menu-list': MenuList
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