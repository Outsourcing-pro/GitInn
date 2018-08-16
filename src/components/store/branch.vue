<template>
	<div class="c_contentBody c_cnt_noColor">
		<div class="c_white_bg c_padding c_paddingV">
			<div class="cBigMargin c_flexRow flexStart btSummary">
				<div class="c_imBT " :class="{active:rightSubTab==0}" @click="rightSubTab=0">概况</div>
				<div class="c_imBT " :class="{active:rightSubTab==1}" @click="rightSubTab=1">所有分支</div>
			</div>
			<div v-if="rightSubTab==0">
			<div class="c_border c_block_margin c_border_rad3"  >
				<div class="bcListItem c_flexRow flexStart c_bold c_gray_bg c_padding c_bottom_line">
					默认分支
				</div>

				<div class="bcListItem c_flexRow c_padding c_bottom_line ft12 c_darkGray_text"  v-for="item in default_branches">
					<span class="c_gray_label c_label_blue bcListItemS1 c_pointer " @click="$router.push({path: `/${p_username}/${p_reponame}/src/${item.name}`})">{{item.name}}</span>
					<span class="bcListItemS2 c_flexOne"> {{item.author}}创建于{{$distanceInWords(item.created)}}&nbsp;&nbsp;&nbsp;
						  由{{item.updatedUser}}更新于{{$distanceInWords(item.updated)}}</span>
					<span class="c_imBT c_bt_blank_blue bcListItemS3 c_pointer" @click="$router.push({path: `/${p_username}/${p_reponame}/setting?subTab=3`})">更改分支</span>
				</div>
			</div>
			<div class="c_border c_block_margin c_border_rad3">
				<div class="bcListItem c_flexRow flexStart c_bold c_gray_bg c_padding c_bottom_line">
					活跃分支
				</div>
				<div class="bcListItem c_flexRow c_padding c_bottom_line ft12 c_darkGray_text"  v-for="item in active_branches">
					<span class="c_gray_label c_label_blue bcListItemS1 c_pointer " @click="$router.push({path: `/${p_username}/${p_reponame}/src/${item.name}`})">{{item.name}}</span>
					<span class="bcListItemS2 c_flexOne">{{item.author}}创建于{{$distanceInWords(item.created)}}&nbsp;&nbsp;&nbsp;
						  由{{item.updatedUser}}更新于{{$distanceInWords(item.updated)}}</span>
				</div>
			</div>
			<div class="c_border c_block_margin c_border_rad3">
				<div class="bcListItem c_flexRow flexStart c_bold c_gray_bg c_padding c_bottom_line">
					陈旧分支
				</div>

				<div class="bcListItem c_flexRow c_padding c_bottom_line ft12 c_darkGray_text"  v-for="item in old_branches">
					<span class="c_gray_label c_label_blue bcListItemS1 c_pointer " @click="$router.push({path: `/${p_username}/${p_reponame}/src/${item.name}`})">{{item.name}}</span>
					<span class="bcListItemS2 c_flexOne">{{item.author}}创建于{{$distanceInWords(item.created)}}&nbsp;&nbsp;&nbsp;
						  由{{item.updatedUser}}更新于{{$distanceInWords(item.updated)}}</span>
				</div>

			</div>
			</div>

			<div v-if="rightSubTab==1">
			<div class="c_border c_block_margin c_border_rad3"  >
				<div class="bcListItem c_flexRow flexStart c_bold c_gray_bg c_padding c_bottom_line">
					所有分支
				</div>

				<div class="bcListItem c_flexRow c_padding c_bottom_line ft12 c_darkGray_text"  v-for="item in all_branches">
					<span class="c_gray_label c_label_blue bcListItemS1 c_pointer " @click="$router.push({path: `/${p_username}/${p_reponame}/src/${item.name}`})">{{item.name}}</span>
					<span class="bcListItemS2 c_flexOne"> {{item.author}}创建于{{$distanceInWords(item.created)}}&nbsp;&nbsp;&nbsp;
						  由{{item.updatedUser}}更新于{{$distanceInWords(item.updated)}}</span>
				
				</div>
			</div>
			</div>

		</div>
	</div>
</template>

<script>
//	import StoreTab from '@/comp/storeTab'

	export default {
		data() {
			return {
				rightSubTab:0,
				tab: 0,
				p_username: this.$router.currentRoute.params.username,
				p_reponame: this.$router.currentRoute.params.repoName,
				repo_all:[],
				default_branches:[],
				active_branches:[],
				old_branches:[],
				all_branches:[]
			}
		},
		methods: {

		},
		computed: {

		},
		components: {
//			'store-tab': StoreTab
		},
		created() {
			 this.self = this.$getSelf()
			 
			 axios.get(`/repos/${this.p_username}/${this.p_reponame}/branches`,{  params:{
                            owner: this.p_username,
                            repo: this.p_reponame
                        }}).then(resp => {
                    //console.log(resp) ;
					this.repo_all=resp.data.branches;

                      for(var item of this.repo_all){
						   
						 var row =  {name:item.name,
						 author:item.commit.author.full_name,
						  created:item.commit.created,
						  updatedUser:item.commit.author.full_name,
						  updated:item.commit.updated};
						 //console.log(row); 
						 this.all_branches.push(row);
						if(item.is_default === true){
                              this.default_branches.push(row);
						}
						if(item.is_active === true){
							this.active_branches.push(row);
						}
						if(item.is_active===false && item.is_default !==true){
							this.old_branches.push(row);
						}
					}
					
                    //this.default_branches.sort(sortfunc(a,b));
					this.active_branches.sort(function(a,b){
						return (new Date(b.updated)).valueOf()-(new Date(a.updated)).valueOf();
					}); 
					this.old_branches.sort(function(a,b){
						return (new Date(b.updated)).valueOf()-(new Date(a.updated)).valueOf();
					});
					this.all_branches.sort(function(a,b){
						return (new Date(b.updated)).valueOf()-(new Date(a.updated)).valueOf();
					});
					console.log(this.old_branches);  

				}).catch(err => Err(err))

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
		/*margin-top:0;*/
	}
	
	.whiteBlockIcon {
		padding: 0 10px 0 22px;
		box-shadow: 0 2px 6px 0 rgba(71, 86, 105, 0.02);
		border-radius: 2px;
		width: 121px;
		height: 40px;
	}
	
	.lineItemCnt {
		border: 1px solid #E9ECF0;
		border-radius: 2px;
		height: 46px;
		justify-content: space-around;
	}
	
	.lineItem img {
		width: 14px;
		margin-right: 3px;
	}
	
	.lineItem:nth-child(2) {
		margin-right: 3px;
	}
	
	.lineBTH {
		height: 38px;
	}
	
	button.lineBTH {
		background: transparent;
		/*color:inherit;*/
	}
	
	input.lineBTH {
		padding-left: 15px;
	}
	
	.fileListItemHeader {
		padding: 2px 12px;
		height: 60px;
	}
	
	.fileListItem {
		padding: 2px 12px;
		height: 36px;
	}
	
	.fileListItem img {
		width: 12px;
		margin-right: 19px;
	}
	
	.btSummary {}
	
	.btSummary .c_imBT {
		width: 90px;
	}
	
	.btSummary .c_imBT:nth-child(1) {
		border-radius: 3px 0 0 3px;
	}
	
	.btSummary .c_imBT:nth-child(2) {
		border-radius: 0 3px 3px 0;
	}
	
	.c_imBT.active {
		color: white;
		background: #7287A5;
	}
	
	.bcListItem {
		height: 40px;
	}
	
	.bcListItemS1 {
		margin-right: 10px;
	}
	
	.bcListItemS3 {
		margin-right: 120px;
	}
	
	.bcListItem .c_imBT {
		padding-top: 0;
		padding-bottom: 0;
		height: 26px;
		line-height: 26px;
		border-radius: 3px;
	}
</style>