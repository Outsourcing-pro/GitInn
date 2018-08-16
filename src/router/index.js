import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/index'
let IndexCnt = () => {
	return import('@/components/user/indexCnt')
}
// 用户页面
let UserView = () => {
    return import('@/components/user/userView')
}
let UserProfile = () => {
	return import('@/components/user/others')
}
let FileDetailPage = () => {
	return import('@/components/store/fileDetail')
}
let Follower = () => {
	return import('@/components/user/follower')
}
let UserSetting = () => {
	return import('@/components/user/userSetting')
}
let Issues = () => {
	return import('@/components/ticket/ticketManage')
}
let LoginCallback = () => {
	return import('@/components/loginCallback')
}
let StoreIndex = () => {
	return import('@/components/store/index')
}
let PushHistory = () => {
	return import('@/components/store/pushHistory')
}
let Branch = () => {
	return import('@/components/store/branch')
}
let VersionPub = () => {
	return import('@/components/store/versionPub')
}
let Version = () => {
	return import('@/components/store/version')
}
let Watchers = () => {
	return import('@/components/store/followers')
}
let Stars = () => {
    return import('@/components/store/stargazers')
}
let Forks = () => {
    return import('@/components/store/forks')
}
// 工单管理
let TicketManageMain = () => {
	return import('@/components/ticket/ticketManageMain')
}
// 创建工单
let CreateOrder = () => {
	return import('@/components/ticket/createOrder')
}
// 工单列表
let IssuesList = () => {
	return import('@/components/ticket/orderList')
}
// 具体工单页面
let DetailOrder = () => {
	return import('@/components/ticket/detailOrder')
}
let Dashboard = () => {
	return import('@/components/control/panel')
}
let PullsView = () => {
    return import('@/components/request/pullsView')
}
let MergeRequest = () => {
	return import('@/components/request/mergeRequest')
}

let MergeRequestIndex = () => {
	return import('@/components/request/mergeRequestIndex')
}

// 合并请求入口模块
let MergeRequestList = () => {
	return import('@/components/request/mergeRequestList')
}
// 合并请求列表
let MergeList = () => {
	return import('@/components/request/mergeList')
}
// 合并请求详情
let MergeDtail = () => {
	return import('@/components/request/mergeDetail')
}
// 文件变动
let FileChange = () => {
	return import('@/components/request/filechangepage')
}

let CompareRequest = () => {
	return import('@/components/request/compareRequest')
}
let MergeStatusFailed = () => {
	return import('@/components/request/mergeStatusFailed')
}
let CodeSubmitPage = () => {
	return import('@/components/code/codeSubmitPage')
}

let CodeDetailPage = () => {
	return import('@/components/code/codeDetailPage')
}

let Wiki = () => {
    return import('@/components/wiki/wikiView')
}
let WikiList = () => {
	return import('@/components/wiki/wiki')
}
let WikiCreate = () => {
	return import('@/components/wiki/wikiCreate')
}
let StoreSetting = () => {
	return import('@/components/setting/storeSetting')
}

let CreateNewStore = () => {
	return import('@/components/storeManage/createNewStore')
}
let MigrateStore = () => {
	return import('@/components/storeManage/migrateStore')
}
let DeriveStore = () => {
	return import('@/components/storeManage/deriveStore')
}

// 里程碑
let MileStoneList = () => {
	return import('@/components/milestone/milestoneList')
}
// 创建里程碑
let CreateMilstones = () => {
	return import('@/components/milestone/create')
}

let LabelList = () => {
	return import('@/components/label/labelList')
}

let Pulls = () => {
	return import('@/components/request/headerMergeRequest')
}

let Logout = () => {
	return import('@/components/user/logout')
}

Vue.use(Router)
var checkLogin = function (to, from, next) {
    var token = getCookie('x_access_token');
    localStorageEx.set('last_view_page', to.path);
    if (token == null || token == '') {
        window.location.href = window.domains.redirectUrl;
        return;
    }
    // 获取当前登录用户的信息 客户端不缓存，由服务器端决定
    axios.get('/user').then(resp => {
        let selfTmp = resp.data
        if (selfTmp == null || selfTmp.id == 0) {
            // 降级，看local storage中是否有用户信息
            selfTmp = localStorageEx.get('self');
            if(selfTmp == null) {
                Msg('获取用户信息失败，请重试！')
                return;
            }
        }
        localStorageEx.set('self', selfTmp)
        next();
    }).catch(function (err) {
        Msg(err);
        next();
    });
};
var loginCallbackProcess = function (to, from, next) {
    var token = to.query.token;
    setCookie('x_access_token', token, 7); //目前7天有效期
    // 获取当前登录用户的信息 客户端不缓存，由服务器端决定
    axios.get('/user').then(resp => {
        let selfTmp = resp.data
        if(selfTmp == null) {
            Msg('登录失败，获取用户信息失败！');
            return;
        }
        localStorageEx.set('self', selfTmp);
        var lastViewPage = localStorageEx.get('last_view_page');
        if (lastViewPage && lastViewPage.length > 0) {
            window.location.href = lastViewPage;
        } else {
            window.location.href = `/${selfTmp.username}`;
        }
    }).catch(function (err) {
        Msg(err)
        next()
    })
};
var logoutProcess = function (to, from, next) {
    console.log("logout")
    setCookie('x_access_token', '', -1); //目前7天有效期
    localStorageEx.remove('self');
    window.location.href = window.domains.proginnUrl;
};
var routes = [{
	path: '/',
	component: Index,
	children: [{
        path: '',
        name: 'indexCnt',
        component: IndexCnt,
        beforeEnter: checkLogin,
    },{
		path: 'dashboard',
		name: 'dashboard',
		component: Dashboard,
        beforeEnter: checkLogin,
	},
	{
		path: 'issues',
		name: 'issues',
		component: Issues,
        beforeEnter: checkLogin,
	},
	{
		path: 'pulls',
		name: 'pulls',
		component: Pulls,
        beforeEnter: checkLogin,
	},
	{
		path: 'user/setting',
		name: 'userSetting',
		component: UserSetting,
        beforeEnter: checkLogin,
	},
	{
		path: 'repo/create',
		name: 'createRepo',
		component: CreateNewStore,
        beforeEnter: checkLogin,
	},
	{
		path: 'repo/migrate',
		name: 'migrateRepo',
		component: MigrateStore,
        beforeEnter: checkLogin,
	},
	{
		path: 'repo/fork/:username/:repoName',
		name: 'forkRepo',
		component: DeriveStore,
        beforeEnter: checkLogin,
	},
	{
		path: 'login_callback',
		name: 'loginCallback',
        beforeEnter: loginCallbackProcess,
		component: LoginCallback
	},
    {
        path: 'logout',
        name: 'logout',
        beforeEnter: logoutProcess,
        component: Logout
    },
	// 用户首页
	{
		path: ':username',
		component: UserView,
		children: [{
			path: '',
			name: 'userProfile',
			component: UserProfile
		},
		{
			path: 'followers',
			name: 'followers',
			component: Follower
		},{
			path: 'following',
			name: 'following',
			component: Follower
		},{
			path: ':repoName',
			name: 'repoIndex',
			component: StoreIndex,
			children: [{
				path: 'src/:branchName',
				name: 'repoBranch',
				component: StoreIndex,
				children: [{
					path: ':uri(.*)',
					name: 'fileDetail',
					component: StoreIndex
				}]
			},{
				path: 'wiki',
				component: Wiki,
				children: [{
				    path: '',
                    name: 'repoWiki',
                    component: WikiList
                },{
					path: 'create',
					name: 'createWiki',
					component: WikiCreate,
                    beforeEnter: checkLogin,
				}, {
					path: ':wikiUrl',
					name: 'wikiDetail',
					component: WikiList
				}, {
                    path: 'edit/:wikiUrl',
                    name: 'editWiki',
                    component: WikiCreate,
                    beforeEnter: checkLogin,
                }]
			},{
				path: 'branches',
				name: 'branches',
				component: Branch
			},{
				path: 'releases',
				name: 'releases',
				component: Version,
				children: [{
					path: 'create',
					name: 'createReleases',
					component: VersionPub,
                    beforeEnter: checkLogin,
				}]
			},
			{
				path: 'issues',
				component: TicketManageMain,
				children: [{
                    path: '/',
                    name: 'repoIssues',
                    components: {
                        orderEntry: IssuesList
                    }
				},{
					path: 'create',
					name: 'createIssue',
					components: {
						orderEntry: CreateOrder
					},
                    beforeEnter: checkLogin,
				},{
					path: ':issueId',
					name: 'issueDetail',
					components: {
						orderEntry: DetailOrder
					}
				}]
			},{
				path: 'pulls',
				component: MergeRequestList,
				children: [{
                    path: '',
					name: 'mergeList',
					components: {
						mergeEntry: MergeList // 工单列表页面
					}
                },{
					path: ':issueId',
					name: 'pullsDetail',
					components: {
						mergeEntry: MergeRequestIndex // 具体工单详情页面
					},
					children: [{
						path: '',
						name: 'mergeDetail',
						components: {
							mergeDetailEntry: MergeDtail
						}
					},{
						path: 'filechangepage',
						name: 'fileChangePage',
						components: {
							mergeDetailEntry: FileChange
						}
					},{
						path: 'codeSubmitPage',
						name: 'codeSubmitPage',
						components: {
							mergeDetailEntry: CodeSubmitPage
						}
					}],
				},{
					path: 'compare/:compareop',
					name: 'createPulls',
					components: {
						mergeEntry: CompareRequest, // 创建合并请求
					},
                    beforeEnter: checkLogin,
				}],
			},{
				path: 'setting',
				name: 'repoSetting',
				component: StoreSetting,
                beforeEnter: checkLogin,
			},{
				path: 'commits/:branch',
				name: 'commits',
				component: PushHistory
			},{
                path: 'commits/:branch/:fileName(.*)',
                name: 'commitsFile',
                component: PushHistory
            },{
				path: 'commit/:commitId',
				name: 'commit',
				component: CodeDetailPage
			},{
				path: 'watchers',
				name: 'watchers',
				component: Watchers // 仓库关注者列表
			},{
				path: 'stars',
				name: 'stars',
				component: Stars
			},{
				path: 'forks',
				name: 'forks',
				component: Forks
			},{
				path: 'labels',
				name: 'repoLabels',
				component: LabelList,
				children: [{
					path: 'create',
					name: 'createLabel',
					component: LabelList, //新建标签
                    beforeEnter: checkLogin,
				}]
			},{
				path: 'milestones',
				name: 'milestones',
				component: MileStoneList,
				children: [{
					path: 'create',
					name: 'createMilestones',
					components: {
						orderEntry: IssuesList // 创建里程碑
					},
                    beforeEnter: checkLogin,
				}]
			}]
		}]
	},
	]
}];

var route = new Router({
	mode: 'history',
	routes: routes
});

route.beforeEach(function(to, from, next) {
    if (to.path != "/login_callback" && to.path != "/logout") {
        localStorageEx.set('last_view_page', to.path);
    }
    next();
});

export default route;