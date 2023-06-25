/*
 * ポータル メイン処理
 */
var app = new Vue({
	el: '#app',
	data: {
		imgroot: '',
		fields: {
			attentions: ["date", "label", "message"],
			infos: ["date", "label", "message"],
			forms: [{ key: "spec", label: "規格" }, { key: "name", label: "様式" }],
			manuals: [{ key: "system", label: "システム" }, { key: "name", label: "マニュアル" }]
		},
		headers: { items: null },
		attentions: { items: null, per: 5, current: 1 },
		infos: { items: null, per: 5, current: 1 },
		forms: { items: null, per: 5, current: 1 },
		manuals: { items: null, per: 10, current: 1 },
		contacts: { items: null },
		banners: { items: null },
		links: { items: null }
	},
	mounted: function() {
		var self = this;

		// LocalStrageから取得
		var json = localStorage.getItem("portal_data");
		if (json) {
			var data = JSON.parse(json);
			self.headers.items = data.headers;
			self.attentions.items = data.attentions;
			self.infos.items = data.infos;
			self.forms.items = data.forms;
			self.manuals.items = data.manuals;
			self.banners.items = data.banners;
			self.links.items = data.links;
			self.contacts.items = data.contacts;
		}

		// 発注者ポータルAPIを呼び出す
		axios.get(PORTAL_API)
			.then(function(response) {
				// データを取得
				self.headers.items = response.data.headers;
				self.attentions.items = response.data.attentions;
				self.infos.items = response.data.infos;
				self.forms.items = response.data.forms;
				self.manuals.items = response.data.manuals;
				self.banners.items = response.data.banners;
				self.links.items = response.data.links;
				self.contacts.items = response.data.contacts;

				// LocalStrageに保存
				localStorage.setItem("portal_data", JSON.stringify({
					headers: response.data.headers,
					attentions: response.data.attentions,
					infos: response.data.infos,
					forms: response.data.forms,
					manuals: response.data.manuals,
					banners: response.data.banners,
					links: response.data.links,
					contacts: response.data.contacts
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
		}
	}
})
