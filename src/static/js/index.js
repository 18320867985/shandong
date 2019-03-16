(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.umd = {})));
}(this, (function (exports) {

/*自动执行 rollup打包umd格式js模块
	 
	 * <script   data-parent="umd" data-umd="test" src="./js/all.js" type="text/javascript" charset="utf-8"></script>
	 * */

(function () {
	window.onload = function () {
		var el_umds = document.querySelectorAll("script[data-umd]");
		for (var i = 0; i < el_umds.length; i++) {

			var parent = "umd";
			var el_umd = el_umds[i];
			if (el_umd) {

				parent = el_umd.getAttribute("data-parent") || parent;
				var umd_str = el_umd.getAttribute("data-umd") || "";
				var umd_strs = umd_str.split(/,|;|&/);
				for (var i = 0; i < umd_strs.length; i++) {
					var item = umd_strs[i] || "";
					if (item.trim() !== "") {
						setUmd(parent, item.trim());
					}
				}
			}
		}
	};

	function setUmd(parent, umd_str) {

		var arrs = umd_str.split(".");
		var prop1 = "";
		var prop2 = "";
		if (arrs.length >= 0) {
			prop1 = arrs[0] || "";
			prop1 = prop1.trim();
		}

		if (arrs.length === 1) {
			prop2 = "init";
		} else if (arrs.length === 2) {
			prop2 = arrs[1].trim();
		}

		var obj = window[parent];
		if (!obj) {
			return;
		}
		if (!obj[prop1]) {
			return;
		}
		var fn = obj[prop1][prop2];

		if (typeof fn === "function") {
			fn();
		}
	}
})();

// 置顶
$(window).scroll(function () {

    if ($(window).scrollTop() > 500) {
        $(".scroll-top").show();
    } else {
        $(".scroll-top").hide();
    }
});

//
$(".scroll-top").click(function () {
    $("body,html").animate({
        scrollTop: 0
    }, 500);
});

var index = {
	init: function init() {

		lbt();
		function lbt() {

			// 轮播图		
			setCarouselLfBtn();

			$(window).resize(function () {
				setCarouselLfBtn();
			});

			function setCarouselLfBtn() {
				if ($(window).width() > 767) {
					$(' .carousel.slide ').mouseenter(function () {

						$(this).find('.left.carousel-control,.right.carousel-control').stop().show();
					});

					$(' .carousel.slide').mouseleave(function () {

						$(this).find('.left.carousel-control,.right.carousel-control').stop().hide();
					});
				} else {

					$('.carousel.slide').find('.left.carousel-control,.right.carousel-control').hide();
				}
			}
		}
	}
};

var news = {
	init: function init() {

		$(function () {

			// tab toggle
			$(".news-banner-toggle ._item").click(function (e) {
				var p = $(this).parents(".news-banner-toggle");
				$("._item", p).removeClass("active");
				$(this).addClass("active");
				var id = $(this).attr("data-target");
				console.log(this);
				$(".news-list-item").removeClass("active");
				$(id).addClass("active");
			});
		});
	}
};

exports.index = index;
exports.news = news;

Object.defineProperty(exports, '__esModule', { value: true });

})));
