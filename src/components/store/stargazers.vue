<template>
	<div class="c_contentBody c_cnt_noColor">
		<div class="c_white_bg c_padding ">
			<div class="c_paddingV c_bottom_line">
				<span class="c_bold ft16">点赞者</span>
			</div>
			<div class="cBigMargin">
				<div class="followerItem c_flexRow c_pointer" v-for="item in fList" @click="$router.push({path:`/${item.username}`})">
                    <img class="c_hd_img" :src="item.avatar_url" alt="" />
                    <div class="follItemDes">
                        <div class="c_blue_color">{{item.full_name}}</div>
                        <div class="c_gray_txt ft12">{{item.created}}加入</div>
                    </div>
                </div>
			</div>
			<div class="fileListItemHeader c_bottom_line c_bold c_color_initial btn-group" v-show="show_page">
                <button @click="prev()" type="button" style="margin-left:10px;" :class="disable_class_prev">上一页</button>
                <button @click="next()" type="button" style="margin-left:10px;" :class="disable_class_next">下一页</button>
            </div>
		</div>

	</div>
</template>

<script>
	import StoreTab from '@/comp/storeTab'

	export default {
		data() {
			return {
				tab: 0,
				fList: [],
				total: 0,
				show_page: false,
                defaultPageSize: 40,
                page: 1,
                disable_class_prev: "ui-btn btn-grey",
                disable_class_next: "ui-btn ",
                disable_class: "ui-btn btn-grey",
			}
		},
		methods: {
            prev() {
                if (this.page == 1) {
                    return;
                }
                this.page--;
                var ownerRep = '/repos/' + this.username + '/' + this.repoName;
                axios.post(ownerRep + '/stars',{
					page: this.page,
                }).then(resp => {
                    this.fList = resp.data.users
                }).catch(err => Msg(err))
                if (this.page == 1) {
                    this.disable_class_prev = this.disable_class;
                    this.disable_class_next = "ui-btn"
                }
            },
            next() {
                if (this.page * this.defaultPageSize >= this.total) {
                    return;
                }
                this.page++;
                var ownerRep = '/repos/' + this.username + '/' + this.repoName;
                axios.post(ownerRep + '/stars',{
					page: this.page,
                }).then(resp => {
                    this.fList = resp.data.users
                }).catch(err => Msg(err))
                if (this.page * this.defaultPageSize >= this.total || this.fList.length < this.defaultPageSize) {
                    this.disable_class_next = this.disable_class;
                    this.disable_class_prev = "ui-btn"
                }

            },
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
            // 仓库的拥有者
            var that = this;
            this.$getUser(this.username, function(user) {
                that.user= user;
            });
            // 仓库信息
            this.$getRepo(this.username, this.repoName, function(repo) {
                that.repo = repo;
                that.total = that.repo.stars;
                if (that.total <= that.defaultPageSize) {
                    that.show_page = false;
                } else {
                    that.show_page = true;
                }
            });
            axios.post(`/repos/${this.username}/${this.repoName}/stars`, {}).then(resp => {
                let list = resp.data.users;
                that.fList = list;
                // 如果返回的列表长度比当前分页少，不显示分页
                if (that.fList.length < that.defaultPageSize) {
                    that.show_page = false;
                }
            }).catch(function (err) {
                Msg(err);
            });
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