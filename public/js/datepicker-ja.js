/* Japanese initialisation for the jQuery UI date picker plugin. */
/* Written by Kentaro SATO (kentaro@ranvis.com). */
( function( factory ) {
	"use strict";

	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
} )( function( datepicker ) {
"use strict";

datepicker.regional.ja = {
	closeText: "閉じる",
	prevText: "&#x3C;前",
	nextText: "次&#x3E;",
	currentText: "今日",
	monthNames: [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" ],
	monthNamesShort: [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" ],
	dayNames: [ "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日" ],
	dayNamesShort: [ "日", "月", "火", "水", "木", "金", "土" ],
	dayNamesMin: [ "日", "月", "火", "水", "木", "金", "土" ],
	weekHeader: "週",
	dateFormat: "yy/mm/dd",
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: true,
	yearSuffix: "年" };
datepicker.setDefaults( datepicker.regional.ja );

return datepicker.regional.ja;

} );

// Scriptパスを取得
var scripts = document.getElementsByTagName('script');
var script_file = document.currentScript ? document.currentScript.src : scripts[scripts.length - 1].src;
var script_path = script_file.split('/').reverse().slice(1).reverse().join("/");

$(function(){

	// Scriptディレクトリ内の祝日ファイルを読み込む
	$.ajax({
		beforeSend: function (xhr) {
			xhr.overrideMimeType("text/plain; charset=Shift_JIS");
		},
		url: script_path + '/syukujitsu.csv',
		type: 'get',
		dataType: 'text'

	}).done(function(csv) {

		// CSVを配列に変換
		var syukujitsu = [];
		let rows = csv.split("\r\n");
		rows.shift();	// 1行目（見出し）をスキップ
		for (let i = 0; i < rows.length; i++) {
			if (rows[i]) {
				let cols = rows[i].split(",");
				syukujitsu.push(cols);
			}
		}

		// 日付選択カレンダーを作成
		$('.datepicker').datepicker({
			changeYear: true,
			changeMonth: true,
			showOtherMonths: true,
			selectOtherMonths: true,
			//minDate: "-3y",
			//maxDate: "+3y",
			showButtonPanel: true,
			showOn: "both",
			buttonText: "<i class='fa fa-calendar-alt text-secondary'></i>",
			navigationAsDateFormat: true,
			//appendText: "　　年　月　日",
			beforeShow: function(input) {
				$(input).datepicker( "option", "dateFormat", $(input).data("dateFormat"));
			},
			beforeShowDay: function(date) {
				// 祝日
				let yy = date.getFullYear();
				let mm = date.getMonth() + 1;
				let dd = date.getDate();
				let dateStr = yy + '/' + mm + '/' + dd;
				for (let i = 0; i < syukujitsu.length; i++) {
					if (syukujitsu[i][0] === dateStr) {
						return [true, 'ui-datepicker-holiday', syukujitsu[i][1]];
					}
				}

				// 日曜
				if (date.getDay() == 0) {
					return [true, 'ui-datepicker-sunday', null];
				}

				// 土曜
				if (date.getDay() == 6) {
					return [true, 'ui-datepicker-saturday', null];
				}

				// 平日
				return [true];
			//},
			//onSelect: function(dateText) {
			//	//$(this).val(formatDate(dateText, "gee/mm/dd"));
			//	if ($(this).datepicker("option", "appendText")) {
			//		$(this).datepicker("option", "appendText", formatDate(dateText, "ggge年m月d日"))
			//	}
			}
		});
	});
});
