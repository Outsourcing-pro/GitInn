<template>
    <div></div>
</template>
<script>
	export default {
		data() {
			return {
			    self: {}
			}
		},
		methods: {

		},
		computed: {

		},
		created() {
		    this.self = this.$getSelf();
			localStorageEx.set('token', '');
            window.location.href = window.domains.proginnUrl;
		},
		mounted() {

		}
	}
</script>