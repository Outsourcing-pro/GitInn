<template>
	<div>
		<div class="selfPanel">
			<div class="c_cnt c_flexRow">
				<div class="left c_flexRow">
					<div class="c_hd_img bigHdImg" :style="{backgroundImage:'url('+user.avatar_url+')'}"></div>
					<div class="userBrief">
						<div class="name">{{user.full_name}}</div>
						<div class="des c_gray_txt">ID: {{user.id}}<span style="margin:0 13px;">|</span>2006年2月18日加入</div>
					</div>
					<div v-show="!user.is_self">
						<!--<button class="lBtn ui-btn ui-btn-rd"><span style="margin-right: 3px;font-weight: bold;">+</span>关注</button>-->
						<button class="ui-btn ui-btn-rd btn-grey" @click="following" v-show="!user.is_following">关注</button>
						<button class="ui-btn ui-btn-rd btn-blank" v-show="user.is_following">已关注</button>
					</div>

				</div>
				<div class="right">
					<ul class="c_flexRow" style="text-align: center;">
						<li class="c_pointer" @click="tab=1">
							<div class="rTitle">{{user.follower_count}}</div>
							<div class="c_gray_txt rDes">关注者</div>
						</li>
						<li class="c_pointer"  @click="tab=2">
							<div class="rTitle">{{user.following_count}}</div>
							<div class="c_gray_txt rDes">已关注</div>
						</li>
					</ul>

				</div>
			</div>

		</div>
		<div class="c_cnt c_contentBody">
			<div class="cntBodyNav c_bottom_line">
				<div class="c_flexRow cntBodyNavItem c_gray_txt" :class="{active:tab==1}" @click="tab=1">
					<span>关注者</span>
				</div>

				<div class="c_flexRow cntBodyNavItem c_gray_txt" :class="{active:tab==2}" @click="tab=2">
					<span>已关注</span>
				</div>
			</div>

			<div class="followerCnt">
				<div v-show="tab==1">
					<div class="followerItem c_flexRow c_pointer" v-for="item in fList" @click="$router.push({path:`/${item.username}`})">
						<img class="c_hd_img" :src="item.avatar_url" alt="" />
						<div class="follItemDes">
							<div class="c_blue_color">{{item.full_name}}</div>
							<div class="c_gray_txt ft12">{{item.created}}加入</div>
						</div>
					</div>
				</div>
				<div v-show="tab==2">
					<div class="followerItem c_flexRow c_pointer" v-for="item in wList" @click="$router.push({path:`/${item.username}`})">
						<img class="c_hd_img" :src="item.avatar_url" alt="" />
						<div class="follItemDes">
							<div class="c_blue_color">{{item.full_name}}</div>
							<div class="c_gray_txt ft12">{{item.created}}加入</div>
						</div>
					</div>
				</div>

			</div>

		</div>
		<div class="c_cnt"></div>
	</div>
</template>

<script>
	//	import * as COMMON from '@/common'

	export default {
		data() {
			return {
				tab: 1,
				user: {},
				self: {},
				fList: [], //关注者
				wList: [] //已关注
			}
		},
		methods: {
			following() {
				axios.put('/users/following/' + this.user.username).then(resp => {
					InfoMsg.suc('关注成功')
				}).catch(err => Err(err))
			},
			unFollowing() {
				axios.delete('/users/following/' + this.user.username).then(resp => {
					InfoMsg.suc('取消关注成功')
				}).catch(err => Err(err))
			}
		},
		computed: {

		},
		created() {

			this.self = this.$getSelf()
			let tab=this.$route.query.tab
			if(tab!=null)this.tab=tab

			axios.get('/users/' + this.self.username).then(resp => {
				console.log(resp.data)
				this.user = resp.data
			}).catch(err => Err(err))

			axios.get('/users/' + this.self.username + '/followers').then(resp => {
				console.log(resp.data)
				this.fList = resp.data.users
			}).catch(err => Err(err))

			axios.get('/users/' + this.self.username + '/following').then(resp => {
				this.wList = resp.data.users
			}).catch(err => Err(err))

		},
		mounted() {

		}

	}
</script>

<style>
	/*selfPanel*/
	
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
	/*.lBtn {*/
	/*box-shadow: 2px 5px 12px rgba(48, 142, 255, 0.25)*/
	/*}*/
	
	.right li {
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
	/*end selfPanel*/
	/*body and nav*/
	
	.cntBodyNav {}
	
	.cntBodyNavItem {
		cursor: pointer;
		height: 50px;
		display: inline-flex;
		margin-left: 55px;
		position: relative;
		width: 80px;
		/*text-align: center;*/
		justify-content: center;
	}
	
	.cntBodyNavItem:nth-child(1) {
		margin-left: 40px;
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
	/*end body and follower*/
	
	.followerCnt {
		padding: 28px 0;
	}
	
	.followerItem {
		display: inline-flex;
		margin-right: 16px;
		height: 120px;
		width: 270px;
		padding-left: 16px;
		margin-bottom: 16px;
		justify-content: flex-start;
		border: 1px solid #E7EDF5;
		box-shadow: 0 2px 10px rgba(0, 58, 132, 0.06);
		border-radius: 3px;
	}
	
	.followerItem img {
		width: 58px;
		height: 58px;
	}
	
	.follItemDes {
		margin-left: 16px;
	}
</style>