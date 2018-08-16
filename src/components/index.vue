<template>
	<div>
		<c-header :tab.sync="tab" @updateHeaderTab="updateHeaderTab"></c-header>
		<router-view></router-view>
		<c-footer></c-footer>
		<!--<div class="info_msg  info_msg_show">
			<div class="c_flexRow c_flexRowStart info_msg_left">
				<div class="info_msg_icon info_msg_blue_icon c_flexRow c_flexRowCenter">
					<img src="~img/src/弹框/叉.svg" alt="" />
				</div>
				<span class="info_msg_cnt">对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫对史蒂夫史蒂夫对史蒂夫</span>
			</div>
			<div class="info_msg_close"><img src="~img/src/关闭.svg" class="c_wh12" alt="" /></div>

		</div>-->
	</div>
</template>

<script>
	import cHeader from '@/comp/cHeader'
	import cFooter from '@/comp/cFooter'

	export default {
		data() {
			return {
				tab: -1
			}
		},

		methods: {
            updateHeaderTab(n) {
                switch(n) {
                    case 0: //控制
                        this.$router.push('/dashboard')
                        break;
                    case 1: //工单
                        this.$router.push('/issues')
                        break;
                    case 2: //合并请求，原来是仓库名字
                        this.$router.push('/pulls')
                        break;
                    case 3: //探索
                        this.$router.push('/')
                        break;

                    default:
                        break;
                }
			}
		},
		created() {},
		components: {
			'c-header': cHeader,
			'c-footer': cFooter
		}

	}
</script>

<style scoped>

</style>