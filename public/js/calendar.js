/*
 * ポータル FAQ処理
 */
var app = new Vue({
	el: '#app',
	data: {
		imgroot: '',
		headers: { items: null },
		contacts: { items: null },
		banners: { items: null },
		links: { items: null },
		holidays: [],
		events: [
			{
				title: null,
				start: null,
				end: null,
				url: null,
				textColor: null,
				borderColor: null,
				backgroundColor: null,
			}
		]
	},
	mounted: function () {
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

		var json = localStorage.getItem("portal_event");
		if (json) {
			var data = JSON.parse(json);
			self.events = data.events;
		}

		// FAQを読み込む
		axios.get(EVENT_API)
			.then(function (response) {
				// データを取得
				self.events = response.data.events;

				// LocalStrageに保存
				localStorage.setItem("portal_event", JSON.stringify({
					events: response.data.events
				}));
			});

		// 祝日を取得
		axios.get(
			'./data/syukujitsu.csv'
		).then(function (response) {
			const parsed = Papa.parse(
				response.data,
				{
					header: true,
					skipEmptyLines: true,
				}
			);
			self.holidays = parsed.data;
		});

		// カレンダー表示
		const date = new UltraDate();
		// var calendarEl = document.getElementById('calendar');
		var calendarEl = this.$refs.calendar;
		var calendar = new FullCalendar.Calendar(calendarEl, {
			themeSystem: 'bootstrap',
			locale: 'ja',
			timeZone: "Asia/Tokyo",
			// height: 600,
			contentHeight: 535,
			expandRows: true,
			headerToolbar: {
				left: 'prevYear,prev,today,next,nextYear',
				center: 'title',
				right: 'dayGridMonth,dayGridWeek,listMonth'
			},
			buttonText: {
				list: 'リスト',
			},
			initialView: 'dayGridMonth',
			dayMaxEvents: true,
			validRange: {
				start: '2020-04-01',
				end: '2030-03-31'
			},
			dayCellContent: function (arg) {
				return arg.dayNumberText.replace('日', '');
			},
			dayCellDidMount: function (arg) {
				date.setFullYear(
					arg.date.getFullYear(),
					arg.date.getMonth(),
					arg.date.getDate()
				);
				const holiday = date.getHoliday();
				if (holiday !== "") {
					arg.el.insertAdjacentHTML("afterbegin", "<div class=\"fc-day-hol-name\">" + holiday + "</div>");
					arg.el.classList.add("fc-day-hol");
				}
			},
			events: self.events,
			display: 'list-item',
		});
		calendar.render();

	},
	computed: {
		rows: function () {
			return function (obj) {
				let rows = 0;
				if (obj.items) {
					rows = obj.items.length;
				}
				return rows;
			}
		}
	},
	methods: {
		exists: function (obj) {
			if (this.rows(obj) > 0) {
				return true;
			} else {
				return false;
			}
		}
	}
})
