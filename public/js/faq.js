/*
 * ポータル FAQ処理
 */
var app = new Vue({
	el: '#app',
	data: {
		imgroot: '',
		pageOptions: [10, 20, 30, 40, 50, 100, 500, 1000],
		fields: {
			faqs: [{ key: "question", label: "質問" }]
		},
		headers: { items: null },
		contacts: { items: null },
		banners: { items: null },
		links: { items: null },
		faqs: {
			items: null,
			filter: null,
			per: 10,
			current: 1,
			total: 1
		}
	},
	mounted: function() {
		var self = this;

		// LocalStrageから取得
		var json = localStorage.getItem("portal_data");
		if (json) {
			var data = JSON.parse(json);
			self.headers.items = data.headers;
			self.banners.items = data.banners;
			self.links.items = data.links;
			self.contacts.items = data.contacts;
		}

		var json = localStorage.getItem("portal_faq");
		if (json) {
			var data = JSON.parse(json);
			self.faqs.items = data.faqs;
		}

		// FAQを読み込む
		axios.get(FAQ_API)
			.then(function (response) {
				// データを取得
				self.faqs.items = response.data.faqs;
				let rows = 0;
				if (self.faqs.items) {
					rows = self.faqs.items.length;
				}
				self.faqs.total = rows;

				// LocalStrageに保存
				localStorage.setItem("portal_faq", JSON.stringify({
					faqs: response.data.faqs
				}));
			});
	},
	computed: {
		rows: function() {
			return function(obj) {
				let rows = 0;
				if (obj.items) {
					rows = obj.items.length;
				}
				return rows;
			}
		}
	},
	methods: {
		exists: function(obj) {
			if (this.rows(obj) > 0) {
				return true;
			} else {
				return false;
			}
		},
		onFiltered(filteredItems) {
			this.faqs.total = filteredItems.length;
			this.faqs.current = 1;
		},
		compiledMarkdown: function (text) {
			return marked.parse(text, { sanitize: false });
		},
		rowClicked: function (row) {
			var _this = this;
			this.$set(row, '_showDetails', !row['_showDetails']);
			if (row._showDetails) {
				const answer = row.answer;
				// HTML,MDファイルを読み込む
				if (answer.match(/\.html|\.md|\.txt/g)) {
					axios.get(answer, { responseType: "blob" })
						.then(function (response) {
							response.data.text()
								.then(function (text) {
									_this.$set(row, 'answer', _this.compiledMarkdown(text));
								});
						});
				}
			}
		}
	}
})
