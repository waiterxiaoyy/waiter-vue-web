import Vue from "vue"

Vue.mixin({
	methods: {
		hasAuth(perm) {
			var authority = this.$store.state.menus.permList
			return authority.indexOf(perm) > -1
		},
		hasRole(perm) {
			var authority = this.$store.state.menus.permList;
			console.log(authority)
			return authority.indexOf(perm) > -1
		},
		showFuture() {
			this.$notify({
				showClose: true,
				message: '此功能待开发，敬请期待',
				type: 'warning'
			});
		}
	}
})