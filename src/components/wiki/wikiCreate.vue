<template>

	<div v-show="tab==0" class="c_white_bg c_padding c_paddingV c_child_margin_bottom" style="">
		<div class="c_bold ft18">{{tipsText}}</div>
		<div><input type="text" class="c_input_line" v-model="title" placeholder="请输入标题..." /></div>
		<div>
			<textarea id="wiki_editor_storeindex" data-id="wiki-{.old_title}" data-url="{AppSubUrl}/api/v1/markdown" data-context="{.RepoLink}"></textarea>
		</div>
		<div>
			<input type="text" class="c_input_line" v-model="msg" placeholder="关于修改说明 （选填）" />
		</div>
		<div style="margin-top: 20px;margin-bottom: 30px;">
			<button type="button" class="ui-btn btn-green" @click="createOneWiki">{{buttonText}}</button>
		</div>

	</div>

</template>

<script>
	import StoreTab from '@/comp/storeTab'
	//	import SimpleMDE from 'simplemde'

	export default {
		data() {
			return {
				tab: 0,
				subTab: 0,
				isEdit: false,
				content: '',
				msg: '',
				title: '',
				editor: null,
				oneWiki: {},
                buttonText: '创建',
                tipsText: '创建新的页面',
                repo: {},
                old_title: '',
                username: '',
                repoName: '',
                wikiUrl: null
			}
		},
		methods: {
			initWikiForm() {
				var dom = document.getElementById('wiki_editor_storeindex')
				if(dom) {
					this.created = true
					this.editor = new SimpleMDE({
						autoDownloadFontAwesome: false,
						element: dom,
						forceSync: true,
						previewRender: function(plainText, preview) { // Async method
							setTimeout(function() {
								// FIXME: still send render request when return back to edit mode
								$.post($editArea.data('url'), {
										"_csrf": csrf,
										"mode": "gfm",
										"context": $editArea.data('context'),
										"text": plainText
									},
									function(data) {
										preview.innerHTML = '<div class="markdown">' + data + '</div>';
										emojify.run($('.editor-preview')[0]);
									}
								);
							}, 0);

							return "Loading...";
						},
						renderingConfig: {
							singleLineBreaks: false
						},
						indentWithTabs: false,
						tabSize: 4,
						spellChecker: false,
						toolbar: ["bold", "italic", "strikethrough", "|",
							"heading-1", "heading-2", "heading-3", "heading-bigger", "heading-smaller", "|",
							"code", "quote", "|",
							"unordered-list", "ordered-list", "|",
							"link", "image", "table", "horizontal-rule", "|",
							"clean-block", "preview", "fullscreen"
						]
					})

					if(this.isEdit == true) {
						this.editor.value(this.oneWiki.content)
					}
				}
			},
			createOneWiki() {
				let owner = this.username
				let repo = this.repoName
				if (this.isEdit == true) {
                    axios.post(`/repos/${owner}/${repo}/wiki/edit`, {
                        title: this.title,
                        content: this.editor.value(),
                        msg: this.msg,
                        old_title: this.old_title
                    }).then(resp => {
                        InfoMsg.suc('操作成功')
                        this.$router.push({path: `/${owner}/${repo}/wiki/${resp.data.url}`})
                    }).catch(Err)
                } else {
                    axios.post(`/repos/${owner}/${repo}/wiki/new`, {
                        title: this.title,
                        content: this.editor.value(),
                        msg: this.msg
                    }).then(resp => {
                        InfoMsg.suc('操作成功')
                        this.$router.push({path: `/${owner}/${repo}/wiki/${resp.data.url}`})
                    }).catch(Err)
                }
			},
			initData() {
                if (this.wikiUrl != '' && typeof(this.wikiUrl) != 'undefined') {
                    this.isEdit = true;
                    this.getOneWiki();
                    this.buttonText = "编辑";
                    this.tipsText = "编辑Wiki页面";
                }
                // 仓库的拥有者
                var that = this;
                this.$getUser(this.username, function(user) {
                    that.user= user;
                });
                // 仓库信息
                this.$getRepo(this.username, this.repoName, function(repo) {
                    that.repo= repo;
                });
            },
            getOneWiki() {
                let url = this.wikiUrl
                axios.get(`/repos/${this.username}/${this.repoName}/wiki/${url}`).then(resp => {
                    this.oneWiki = resp.data;
                    this.title = this.oneWiki.title;
                    this.old_title = this.oneWiki.title;
                    this.content = this.oneWiki.content;
                    this.editor && this.editor.value(this.oneWiki.content)
                }).catch(Err)
            },
		},
		computed: {

		},
		components: {
			'store-tab': StoreTab
		},
		created() {
		    this.self = this.$getSelf();
            this.username = this.$route.params.username;
            this.repoName = this.$route.params.repoName;
            this.wikiUrl  = this.$route.params.wikiUrl;
			this.initData();
		},
		mounted() {
			this.initWikiForm()
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
</style>