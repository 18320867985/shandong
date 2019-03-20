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

/***********公共js代码************ */

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

// 一键分享
$(function () {

    _positon();
    $(window).resize(function () {
        _positon();
    });

    function _positon() {

        var w = $(window).width();
        if (w > 1280) {
            $(".one-share").css("left", (w - 1280) / 2);
        } else {
            $(".one-share").css("left", 10);
        }
    }
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

(function () {

	/*创建include对象*/
	var _include = window.include;
	var include = window.include = function (selector, content) {};

	include.extend = function (obj) {
		if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object") {
			for (var i in obj) {
				this[i] = obj[i];
			}
		}

		return this;
	};

	// ajax type
	function _ajaxFun(url, type, data, _arguments) {
		var success;
		var error;
		var progress;
		if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" && _arguments.length > 2) {
			success = _arguments[2];
			if (_arguments.length >= 3) {
				error = _arguments[3];
				progress = _arguments[4] || null;
			}
		} else if (typeof data === "function") {
			success = data;
			if (_arguments.length > 2) {
				error = _arguments[2];
				progress = _arguments[3] || null;
			}
		}

		include.ajax({
			type: type,
			url: url,
			data: (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object" ? data : null,
			success: success,
			error: error,
			progress: progress
		});
	}

	// 链接ajax发送的参数数据
	function _JoinParams(data) {
		// 参数data对象字符
		var params = [];

		for (var key in data) {

			if (_typeof(data[key]) === "object") {
				var data2 = data[key];
				// object
				if (data[key].constructor !== Array) {
					for (var key2 in data2) {
						var _key = key + "[" + key2 + "]";
						var _value = data2[key2];
						params.push(encodeURIComponent(_key) + '=' + encodeURIComponent(_value));
					}
				} else {
					for (var key2 in data2) {

						var data3 = data2[key2];
						if ((typeof data3 === "undefined" ? "undefined" : _typeof(data3)) === "object" && data3.constructor !== Array) {
							for (var key3 in data3) {
								var _key = key + "[" + key2 + "]" + "[" + key3 + "]";
								var _value = data3[key3];
								params.push(encodeURIComponent(_key) + '=' + encodeURIComponent(_value));
							}
						}
					}
				}
			} else {
				params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			}
		}

		return params.join("&") || "";
	}

	include.extend({

		// create XHR Object
		createXHR: function createXHR() {

			if (window.XMLHttpRequest) {

				//IE7+、Firefox、Opera、Chrome 和Safari
				return new XMLHttpRequest();
			} else if (window.ActiveXObject) {

				//IE6 及以下
				var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
				for (var i = 0, len = versions.length; i < len; i++) {
					try {
						return new ActiveXObject(version[i]);
						break;
					} catch (e) {
						//跳过
					}
				}
			} else {
				throw new Error('浏览器不支持XHR对象！');
			}
		},

		/* 封装ajax函数
  		 @param {string}opt.type http连接的方式，包括POST和GET两种方式
  		 @param {string}opt.url 发送请求的url
  		 @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
  		 @param {object}opt.data 发送的参数，格式为对象类型
  		 @param {function}opt.contentType   内容类型
  		@param {function}opt.success ajax发送并接收成功调用的回调函数
  		 @param {function}opt.error ajax发送并接收error调用的回调函数
  		 @param {function}opt.getXHR 获取xhr对象
  		 @param {number}opt.timeout // 超时
   	*/
		ajax: function ajax(opt) {

			// 参数object对象
			opt = opt || {};
			opt.type = typeof opt.type === "string" ? opt.type.toUpperCase() : "GET";
			opt.url = typeof opt.url === "string" ? opt.url : '';
			opt.async = typeof opt.async === "boolean" ? opt.async : true;
			opt.data = _typeof(opt.data) === "object" ? opt.data : {};
			opt.success = opt.success || function () {};
			opt.error = opt.error || function () {};
			opt.contentType = opt.contentType || "application/x-www-form-urlencoded;charset=utf-8";
			opt.progress = opt.progress || {};

			var xhr = include.createXHR();
			if (typeof opt.timeout === "number") {
				xhr.timeout = opt.timeout;
			}

			xhr.xhrFields = opt.xhrFields || {};

			// 连接参数
			var postData = _JoinParams(opt.data); // params.join('&');

			if (opt.type.toUpperCase() === 'POST' || opt.type.toUpperCase() === 'PUT' || opt.type.toUpperCase() === 'DELETE') {
				opt.url = opt.url.indexOf("?") === -1 ? opt.url + "?" + "_=" + Math.random() : opt.url + "&_=" + Math.random();

				xhr.open(opt.type, opt.url, opt.async);
				xhr.setRequestHeader('Content-Type', opt.contentType);
				xhr.send(postData);
			} else if (opt.type.toUpperCase() === 'GET') {
				if (postData.length > 0) {
					postData = "&" + postData;
				}
				opt.url = opt.url.indexOf("?") === -1 ? opt.url + "?" + "_=" + Math.random() + postData : opt.url + "&_=" + Math.random() + postData;

				xhr.open(opt.type, opt.url, opt.async);
				xhr.send(null);
			}
			xhr.onreadystatechange = function () {

				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
						if (typeof opt.success === "function") {
							try {
								opt.success(JSON.parse(xhr.responseText), xhr.status, xhr.statusText);
							} catch (e) {
								//TODO handle the exception
								opt.success(xhr.responseText, xhr.status, xhr.statusText);
							}
						}
					} else {
						if (typeof opt.error === "function") {
							opt.error(xhr.status, xhr.statusText);
						}
					}
				}
			};
		},

		// get
		get: function get$$1(url, data) {
			_ajaxFun(url, "get", data, arguments);
		},

		// post
		post: function post(url, data) {
			_ajaxFun(url, "post", data, arguments);
		},

		// html字符串转dom对象
		htmlStringToDOM: function htmlStringToDOM(txt) {

			var df2 = document.createDocumentFragment();
			var df = document.createElement("div");
			var div = document.createElement("div");
			div.innerHTML = txt;
			df.appendChild(div);
			var _nodes = df.getElementsByTagName("div")[0].childNodes;
			for (var i = _nodes.length; i > 0; i--) {
				if (window.addEventListener) {
					df2.insertBefore(_nodes[i - 1], df2.childNodes[0]);
				} else {
					df2.insertBefore(_nodes[i - 1], df2.firstChild);
				}
			}
			df = null;
			return df2;
		}

	});
})();

(function () {

	if (window.addEventListener) {
		//	window.addEventListener("load", function() {
		includeHtml();
		//});
	} else {
		window.onload = function () {
			includeHtml();
		};
	}

	function includeHtml() {
		var _htmls = document.getElementsByTagName("include");

		for (var i = 0; i < _htmls.length; i++) {

			(function (obj) {

				var src = obj.getAttribute("src");
				var prop = obj.getAttribute("obj") || "";

				if (prop) {
					prop = JSON.parse(prop);
				} else {
					prop = {};
				}
				include.get(src, prop, function (data) {
					var parent = obj.parentNode;
					var newElement = include.htmlStringToDOM(data);
					if (obj.addEventListener) {
						parent.replaceChild(newElement, obj);
						//obj.innerHTML = data;
					} else if (obj.outerHTML) {
						//obj.outerHTML = data;
						parent.replaceChild(newElement, obj);
					}

					var index = obj.getAttribute("index") || "";
					var isHead = obj.hasAttribute("header");
					if (isHead) {
						if (!isNaN(index)) {
							index = window.parseInt(index);
							//console.log(index);
							$("header .nav li").removeClass("active");
							$("header .nav li").eq(index).addClass("active");
						}
					}
				});
			})(_htmls[i]);
		}
	}
})();

/* 	
   作者：724485868@qq.com
   时间：2017-10-08
   描述：表单验证    
 version:1.0.0
*/
window._vd = window.vd;
window.vd = function () {

	var Obj = function Obj(formName) {

		this.formName = typeof formName === "undefined" ? ".form" : formName;

		this.init = function () {

			this.addErrorStyle(false, true);
			this.checkObj(this.formName);
			this.addVidation();
		};

		this.disabled = function (obj) {

			$(obj).attr("disabled", "disabled");
		};

		this.enabled = function (obj) {

			$(obj).removeAttr("disabled");
		};

		this.arrs = [];

		this.vdbtnText = "";

		this.compareEmit = function (pName, compareName, value) {
			var el = $("" + pName + " [name=" + compareName + "]");
			if ($.trim(el.val()) === "") {
				return;
			}
			for (var i = 0; i < this.arrs.length; i++) {
				if ($.trim(this.arrs[i].elName) === $.trim(compareName)) {
					$(el).trigger("keyup");
					break;
				}
			}
		};

		this.checkObj = function (formName) {
			if (typeof formName === "undefined") {
				formName = ".form";
			}

			this.arrs = [];
			var $this = this;

			$("" + formName + " .vd-item").each(function () {
				var name = $(this).attr("name");
				var v = $(this).val();
				var req_msg = $(this).attr("vd-req-msg");
				var pattern = $(this).attr("vd-pattern");
				var pattern_msg = $(this).attr("vd-pattern-msg");

				// type=checkbox 复选框
				var _ck = $(this).attr("vd-ck");
				var _ck_req = $(this).attr("vd-req");
				var _ck_checked = $(this).attr("vd-ck-true") || $(this).val();

				var errorMsg = "";
				if (typeof req_msg !== "undefined" && v === "") {
					errorMsg = req_msg;
				} else if (typeof pattern_msg !== "undefined") {
					var reg = new RegExp(pattern, "i");
					if (!reg.test(v)) {
						errorMsg = pattern_msg;
					}
				} else {
					errorMsg = "";
				}

				if (name !== "" && name !== "vd-btn") {
					var obj = {};
					obj.pName = formName; //表单name
					obj.elName = name; // 元素name
					obj.errorMsg = errorMsg; // 验证错误提示信息
					obj.val = v;
					obj.el = this; // document.forms[formName][name];
					obj.bl = false;
					if (typeof _ck_req === "undefined") {
						obj.bl = true;
					}

					if (typeof _ck !== "undefined") {

						if (this.checked) {
							obj.bl = true;
							obj.val = _ck_checked;
						} else {

							if (typeof _ck_req !== "undefined") {
								obj.bl = false;
							} else {
								obj.bl = true;
							}

							obj.val = $(this).attr("vd-ck-false") || false;
						}
					}

					$this.arrs.push(obj);
				}

				// 复选组框
				var _ck_gp_attr = $(this).attr("vd-ck-gp");
				var _vd_gp_req = $(this).attr("vd-req"); //  必填项
				var _ck_gp_msg = $(this).attr("vd-req-msg");
				if (typeof _ck_gp_attr !== "undefined") {

					var _ck_gp_length = $(this).find("[type=checkbox]:checked").length;

					var p = $(this).parents(".vd-box");
					// 没有选择
					if (_ck_gp_length <= 0 && typeof _vd_gp_req !== "undefined") {

						//p.removeClass("vd-ok");
						//p.addClass("vd-error");

						obj.bl = false;
						obj.val = [];
						obj.errorMsg = _ck_gp_msg;
						//$(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_ck_gp_msg);
					} else {

						obj.val = [];

						$(this).find("[type=checkbox]:checked").each(function () {
							var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
							var v = _ck_gp_true || this.value || "";
							obj.val.push(v);
						});
						obj.bl = true;
						obj.errorMsg = "";
						//p.removeClass("vd-error");
						//p.addClass("vd-ok");

						//$(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok");
					}
				}

				// 单选组框
				var _rd_gp_attr = $(this).attr("vd-rd-gp");
				var _rd_gp_req = $(this).attr("vd-req"); //  必填项
				var _rd_gp_msg = $(this).attr("vd-req-msg");

				if (typeof _rd_gp_attr !== "undefined") {

					var _rd_gp_length = $(this).find("[type=radio]:checked").length;
					var p = $(this).parents(".vd-box");
					// 没有选择
					if (_rd_gp_length <= 0 && typeof _rd_gp_req !== "undefined") {

						obj.bl = false;
						obj.val = "";
						obj.errorMsg = _rd_gp_msg;
					} else {

						obj.val = "";
						$(this).find("[type=radio]:checked").each(function () {
							var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
							var v = _ck_gp_true || this.value || "";
							obj.val = v;
						});
						obj.bl = true;
						obj.errorMsg = "";
					}
				}
			});
		};

		this.addVidation = function () {

			for (var i = 0; i < this.arrs.length; i++) {
				var _obj = this.arrs[i];
				var el = _obj.el; // document.forms[_obj.pName][_obj.elName];
				var $this = this;
				$(el).on("keyup", _obj, function (event) {
					$this.checkElement(event.data, event.target, true, true);
					$this.addVdBtnStyle();
				});

				var remote = el.getAttribute("vd-remote");
				if (remote === null) {
					$(el).on("change", _obj, function (event) {
						$this.checkElement(event.data, event.target, true, true);
						$this.addVdBtnStyle();
					});
				}

				var vdBtn = $(".vd-btn", this.formName);
				if (vdBtn.length > 0 && vdBtn[0].hasAttribute("value")) {
					this.vdbtnText = vdBtn.val();
				} else {
					this.vdbtnText = vdBtn.text();
				}
			}
		};

		this.checkElement = function (_obj2, el, isRemote, isRadio) {

			// req
			var _req = el.getAttribute("vd-req");
			var _req_msg = el.getAttribute("vd-req-msg");

			// pattern
			var _pattern = el.getAttribute("vd-pattern");
			var _pattern_msg = el.getAttribute("vd-pattern-msg");

			// remote
			var _remote = el.getAttribute("vd-remote");
			var _remote_msg = el.getAttribute("vd-remote-msg");
			var _remote_length = el.getAttribute("vd-remote-length");

			// compare 
			var _compare = el.getAttribute("vd-compare");
			var _compare_msg = el.getAttribute("vd-compare-msg");
			var _compare_emit = el.getAttribute("vd-compare-emit"); // 触发目标对象

			// 复选框
			var _ck = el.getAttribute("vd-ck");
			var _ck_value = el.getAttribute("value") || ""; // 选中的值
			var _ck_true = el.getAttribute("vd-ck-true"); // 选中的值
			var _ck_false = el.getAttribute("vd-ck-false"); // 没选中的值
			var _ck_msg = el.getAttribute("vd-req-msg");
			var _vd_req = el.getAttribute("vd-req"); //  必填项

			// 复选组框
			var _ck_parent = $(el).closest(".vd-item");
			var _ck_gp_attr = _ck_parent.attr("vd-ck-gp");

			// 单选组框
			var _rd_parent = $(el).closest(".vd-item");
			var _rd_gp_attr = _rd_parent.attr("vd-rd-gp");

			// 当前的值
			var v = $.trim(el.value);

			// 非空验证
			if (_req !== null) {
				if (!(typeof _ck_gp_attr !== "undefined" || typeof _rd_gp_attr !== "undefined")) {

					if (v === "") {
						_obj2.bl = false;
						_obj2.val = v;
						_obj2.errorMsg = _req_msg;
						var p = $(el).parents(".vd-box");
						$(p).removeClass("vd-pattern vd-remote vd-compare").addClass("vd-error  ");

						$(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
						$(p).find(".vd-req").addClass("vd-error").text(_req_msg);
						$(el).addClass("vd-error");
						$(p).removeClass("vd-ok ");

						$(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮

						return;
					} else {
						var p = $(el).parents(".vd-box");
						$(p).removeClass("vd-error ");

						$(p).find(".vd-req").removeClass("vd-error").text("");
						$(el).removeClass("vd-error");
						$(p).addClass("vd-ok");
						$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮

						if (isRemote && !_remote) {
							//远程不去比较
							_obj2.errorMsg = "";
							_obj2.val = v;
							_obj2.bl = true;
						}
					}
				}
			}

			// 触发比较对象
			if (_compare_emit !== null) {
				this.compareEmit(_obj2.pName, _compare_emit, v);
			}

			// 正则验证
			if (_pattern !== null && v != "") {

				var reg = new RegExp(_pattern, "i");
				if (!reg.test(v)) {
					_obj2.errorMsg = _pattern_msg;
					_obj2.bl = false;
					_obj2.val = v;
					var p = $(el).parents(".vd-box");
					$(p).addClass("vd-error");

					$(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");

					$(p).find(".vd-pattern").addClass("vd-error").text(_pattern_msg);
					$(el).addClass("vd-error");
					$(p).removeClass("vd-ok");
					$(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮

					return;
				} else {
					_obj2.errorMsg = "";
					_obj2.val = v;
					_obj2.bl = true;
					var p = $(el).parents(".vd-box");
					$(p).removeClass("vd-error ");

					$(p).find(".vd-pattern").removeClass("vd-error").text("");
					$(el).removeClass("vd-error");
					$(p).addClass("vd-ok");
					$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
				}
			} else {

				if (!_remote) {
					//远程不去比较

					_obj2.errorMsg = "";
					_obj2.val = v;
					_obj2.bl = true;
					var p = $(el).parents(".vd-box");
					$(p).removeClass("vd-error ");

					$(p).find(".vd-pattern").removeClass("vd-error").text("");
					$(el).removeClass("vd-error");
					$(p).addClass("vd-ok");
					$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
				}
			}

			// 比较验证
			if (_compare !== null) {

				var _compare_obj = $("" + _obj2.pName + "  [name=" + _compare + "]");

				//var _compare_obj = document.forms[_obj2.pName][_compare];
				if (v !== $(_compare_obj).val()) {
					_obj2.bl = false;
					_obj2.val = v;
					_obj2.errorMsg = _compare_msg;
					var p = $(el).parents(".vd-box");
					$(p).addClass("vd-error");

					$(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
					$(p).find(".vd-compare").addClass("vd-error").text(_compare_msg);
					$(p).removeClass("vd-ok");
					$(el).addClass("vd-error");
					$(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮

					return;
				} else {

					_obj2.errorMsg = "";
					_obj2.val = v;
					_obj2.bl = true;
					var p = $(el).parents(".vd-box");
					$(p).removeClass("vd-error vd-compare ");

					$(p).find(".vd-compare").removeClass("vd-error").text("");
					$(el).removeClass("vd-error");
					$(p).addClass("vd-ok");
					$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
				}
			}

			if (_remote != null) {

				var _index = _remote_length != null ? _remote_length : 0;
				if (v.length < _index) {
					_obj2.errorMsg = _remote_msg;
					_obj2.bl = false;
					_obj2.val = v;
					_obj2.remote_bl = _obj2.bl;

					var p = $(el).parents(".vd-box");
					$(p).addClass("vd-error ");

					$(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
					$(p).find(".vd-remote").addClass("vd-error").text(_remote_msg);
					$(el).addClass("vd-error");
					$(p).removeClass("vd-ok");
					$(".vd-dep-btn", p).removeClass("vd-ok").addClass("vd-error"); //依赖按钮

					return;
				}

				var $remote = this;

				if (isRemote) {

					$.ajax({
						url: _remote + "?rand=" + Math.random() + "&" + el.name + "=" + v,
						type: "get",
						timeout: 10000,
						success: function success(data) {
							data = data || false;

							if (typeof data !== "number") {
								var _num = Number(data);
								data = isNaN(_num) ? false : _num;
							}

							if (!data) {

								$remote.remoteFunError(_obj2, el, _remote_msg);
								$remote.addVdBtnStyle(el);
								return;
							} else {

								$remote.remoteFunOk(_obj2, el);
								$remote.addVdBtnStyle(el);
							}
						},
						error: function error(data) {
							$remote.remoteFunError(_obj2, el, _remote_msg);

							return;
						}

					});
				} else {

					if (_obj2.bl) {
						$remote.remoteFunOk(_obj2, el);
						$remote.addVdBtnStyle(el);
					} else {
						$remote.remoteFunError(_obj2, el, _remote_msg);
						$remote.addVdBtnStyle(el);
					}
				}
			}

			// 复选框
			if (_ck !== null) {

				if (el.checked) {
					_obj2.errorMsg = "";
					_obj2.val = _ck_true !== null ? _ck_true : _ck_value;
					var p = $(el).parents(".vd-box");
					$(p).removeClass("vd-error  ");
					$(el).removeClass("vd-error");
					$(p).addClass("vd-ok");
					$(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok").text("");
					//$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
					_obj2.bl = true;
				} else {

					_obj2.val = _ck_false !== null ? _ck_false : 0;
					_obj2.errorMsg = _ck_msg;
					if (_vd_req !== null) {
						var p = $(el).parents(".vd-box");
						$(p).addClass("vd-error vd-ck ");
						$(p).removeClass("vd-ok");
						$(el).addClass("vd-error");

						_obj2.bl = false;
						$(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_ck_msg);
						//	$(".vd-dep-btn", p).addClass("vd-error").removeClass("vd-ok"); //依赖按钮	
					} else {
						_obj2.bl = true;
						$(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok").text("");
						//$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
					}

					return;
				}
			}

			// 复选组框
			if (typeof _ck_gp_attr !== "undefined") {

				var _ck_gp = _ck_parent.attr("vd-ck-gp");
				var _ck_gp_msg = _ck_parent.attr("vd-req-msg");
				var _vd_gp_req = _ck_parent.attr("vd-req"); //  必填项

				if (typeof _ck_gp !== "undefined") {

					var _ck_gp_length = _ck_parent.find("[type=checkbox]:checked").length;

					var p = _ck_parent.parents(".vd-box");
					// 没有选择
					if (_ck_gp_length <= 0 && typeof _vd_gp_req !== "undefined") {

						p.removeClass("vd-ok");
						p.addClass("vd-error");

						_obj2.bl = false;
						_obj2.val = [];
						v = "";
						_obj2.errorMsg = _ck_gp_msg;

						$(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_ck_gp_msg);
					} else {

						_obj2.val = [];
						v = [];
						_ck_parent.find("[type=checkbox]:checked").each(function () {
							var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
							var v = _ck_gp_true || this.value || "";
							_obj2.val.push(v);
						});
						_obj2.bl = true;
						_obj2.errorMsg = "";
						p.removeClass("vd-error");
						p.addClass("vd-ok");

						$(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok");
					}
				}
			}

			// 单选组框
			var _rd_gp = _rd_parent.attr("vd-rd-gp");
			var _rd_gp_true = _rd_parent.attr("vd-ck-true");
			var _rd_gp_req = _rd_parent.attr("vd-req");
			var _rd_gp_msg = _rd_parent.attr("vd-req-msg");
			if (typeof _rd_gp !== "undefined") {

				var _rd_name = _rd_parent.attr("name");
				var _rd_gp_length = _rd_parent.find("[type=radio]:checked").length;
				var p = $(el).parents(".vd-box");

				// 没有选择
				if (_rd_gp_length <= 0 && typeof _rd_gp_req !== null) {

					p.removeClass("vd-ok");
					p.addClass("vd-error");

					_obj2.bl = false;
					_obj2.val = "";

					_obj2.errorMsg = _rd_gp_msg;

					$(p).find(".vd-req").removeClass("vd-ok").addClass("vd-error").text(_rd_gp_msg);
				} else {

					_obj2.val = "";
					_rd_parent.find("[type=radio]:checked").each(function () {
						var _ck_gp_true = this.getAttribute("vd-ck-true") || "";
						var v = _ck_gp_true || this.value || "";
						_obj2.val = v;
					});
					_obj2.bl = true;
					_obj2.errorMsg = "";
					p.removeClass("vd-error");
					p.addClass("vd-ok");

					$(p).find(".vd-req").removeClass("vd-error").addClass("vd-ok");
				}
			}
		};

		this.isSubmit = true;
		this.isSuccess = function (successFun, errorFun) {

			// 添加错误样式
			this.addErrorStyle(false, false);

			// 是否全部验证成功
			var baseBl = true;
			for (var i = 0; i < this.arrs.length; i++) {
				var _obj = this.arrs[i];

				if (_obj.bl === false) {

					if (typeof errorFun === "function") {
						this.isSubmit = true;
						errorFun(_obj);
					}
					return baseBl = false;
				}
			}
			if (baseBl) {
				var newObj = this.getNewObjs();
				if (typeof successFun === "function") {
					if (this.isSubmit) {
						this.isSubmit = false;
						this.disabled($(this.formName).find("input")); //禁用
						this.disabled($(this.formName).find("select")); //禁用
						this.disabled($(this.formName).find("textarea")); //禁用

						var vdBtn = $(".vd-btn", this.formName);
						if (vdBtn.length > 0 && vdBtn[0].hasAttribute("value")) {
							vdBtn.val("正在提交中...");
						} else {
							vdBtn.text("正在提交中...");
						}
						successFun(newObj);
					}
				}
			}

			return true;
		};

		this.getNewObjs = function () {

			// 是否全部验证成功
			var newObj = {};
			for (var i = 0; i < this.arrs.length; i++) {
				var obj = this.arrs[i];
				if (obj.bl) {
					newObj[obj.elName] = obj.val;
				}
			}

			return newObj;
		};

		this.getObj = function (name) {

			// 是否全部验证成功
			var obj = {};
			for (var i = 0; i < this.arrs.length; i++) {

				if ($.trim(name) === $.trim(this.arrs[i].elName)) {

					obj = this.arrs[i];
					break;
				}
			}

			return obj;
		};

		this.addErrorStyle = function (isRemote, isRadio) {

			for (var i = 0; i < this.arrs.length; i++) {
				var obj = this.arrs[i];
				var el = obj.el;
				this.checkElement(obj, el, isRemote, isRadio); // false 不去remote验证    isRadio不做比
				this.addVdBtnStyle(); // 添加vd-btn提交按钮样式
			}
		};

		this.remoteFunOk = function (_obj2, el) {
			_obj2.errorMsg = "";
			_obj2.bl = true;
			_obj2.val = $(el).val();
			_obj2.remote_bl = _obj2.bl;

			var p = $(el).parents(".vd-box");
			$(p).removeClass("vd-error ");

			$(p).find(".vd-remote").removeClass("vd-error").text("");
			$(el).removeClass("vd-error");
			$(p).addClass("vd-ok");
			$(".vd-dep-btn", p).removeClass("vd-error").addClass("vd-ok"); //依赖按钮
		};

		this.remoteFunError = function (_obj2, el, _remote_msg) {
			_obj2.errorMsg = _remote_msg;
			_obj2.bl = false;
			_obj2.val = $(el).val();
			_obj2.remote_bl = _obj2.bl;

			var p = $(el).parents(".vd-box");
			$(p).addClass("vd-error ");

			$(p).find(".vd-req,.vd-pattern,.vd-remote,.vd-compare").removeClass("vd-error");
			$(p).find(".vd-remote").addClass("vd-error").text(_remote_msg);
			$(el).addClass("vd-error");
			$(p).removeClass("vd-ok");
			$(".vd-dep-btn", p).removeClass("vd-ok").addClass("vd-error"); //依赖按钮
		};

		this.vdIsOk = function () {

			// 是否全部验证成功
			var baseBl = true;
			for (var i = 0; i < this.arrs.length; i++) {
				var _obj = this.arrs[i];

				if (_obj.bl === false) {
					return baseBl = false;
				}
			}

			return baseBl;
		};

		this.addVdBtnStyle = function () {

			// 提交按钮
			var p = $(this.formName);
			var $vd_btn = $(".vd-btn", p);

			if (this.vdIsOk()) {
				$vd_btn.removeClass("vd-error").addClass("vd-ok");
			} else {
				$vd_btn.removeClass("vd-ok").addClass("vd-error");
			}
		};

		this.check = function () {
			if (arguments.length >= 1) {
				var el = arguments[0] || "";
				var p = $(el).closest(".vd-box");
				var crt_el = p.find(".vd-item");
				var name = crt_el.attr("name") || "";

				for (var i = 0; i < this.arrs.length; i++) {
					var obj = this.arrs[i];
					if (obj.elName == name) {
						var el = obj.el;
						this.checkElement(obj, el, false, false); // false 不去remote验证    isRadio不做比
						break;
					}
				}

				var valObj = this.getObj(name);
				if (valObj && valObj.bl) {
					p.removeClass("vd-error");
					$(".vd-req", p).removeClass("vd-error");
					$(".vd-pattern", p).removeClass("vd-error");
					$(".vd-remote", p).removeClass("vd-error");
					$(".vd-compare", p).removeClass("vd-error");
					$(".vd-dep-btn ", p).removeClass("vd-error");
				} else {
					p.addClass("vd-ok");
				}

				if (this.vdIsOk()) {
					$(this.formName).find(".vd-btn").removeClass("vd-error");
				} else {
					//$(this.formName).find(".vd-btn").addClass("vd-error");
				}
				return;
			}

			this.addErrorStyle(false, false);
			var p = $(this.formName);
			this._valStyle(p);
		};

		this.validate = function () {
			this.isSuccess();
		};

		this.reset = function () {

			this.isSubmit = true;
			var p = $(this.formName);
			$(".vd-item", p).val("");
			$("[type=checkbox]", p).each(function () {
				$(this)[0].checked = false;
			});
			$("[type=radio]", p).each(function () {
				$(this)[0].checked = false;
			});

			this.check();
			this._valStyle(p);
			var vdBtn = $(".vd-btn", this.formName);
			if (vdBtn.length > 0 && vdBtn[0].hasAttribute("value")) {
				vdBtn.val(this.vdbtnText);
			} else {
				vdBtn.text(this.vdbtnText);
			}
		};

		this._valStyle = function (p) {

			$(".vd-box", p).removeClass("vd-error ");
			$(".vd-btn", p).removeClass("vd-error ");
			$(".vd-box", p).removeClass("vd-ok");
			$(".vd-btn", p).removeClass("vd-ok");

			//error
			$(".vd-req", p).removeClass("vd-error");
			$(".vd-pattern", p).removeClass("vd-error");
			$(".vd-remote", p).removeClass("vd-error");
			$(".vd-compare", p).removeClass("vd-error");
			$(".vd-dep-btn ", p).removeClass("vd-error");
			this.enabled($(this.formName).find("input")); //激活
			this.enabled($(this.formName).find("select")); //激活
			this.enabled($(this.formName).find("textarea")); //激活
		};
	};

	return {
		create: function create(formName) {
			return new Obj(formName);
		}
	};
}();

/*
 * 分页组件
 * */

window.paging = function ($) {

	var page = {
		data: {}, // 页面数据传值
		index: 0, //	当前页
		pageItem: 0, //  每页条数
		allItem: 0, //  总条数
		allPage: 0, //  总页数
		showCount: 0, //  显示的页码数目
		groupPage: 0, // 	页码的分组数目
		selector: "", //	分页元素的选择器
		isAnimation: false, //	是否显示动画
		isShowSkip: false, // 是否显示跳转页
		isShowCount: false, // 是否显示总页数
		isShowAllItems: false, // 是否显示总条目

		prevText: "上一页",
		nextText: "下一页",

		firstText: "第一页",
		lastText: "后一页",

		prevGroupText: "...",
		nextGroupText: "...",

		// 页码是否显示
		isShowNumber: true, //是否显示数字
		isShowPrevNext: true, // 是否显示上下页
		isShowFirstLast: true, // 是否显示第一页和后一页
		isShowPrevNextGroup: true // 是否显示上下页组,
		//		init:function(){},			// 加载页面
		//		render:function(){},		//render页面
		//		callback:function(){},		// 回调函数

	};

	function checkParameter(obj) {

		// 页码
		page.data = obj.data || {};
		page.index = typeof obj.index === "number" ? obj.index : 0;
		page.pageItem = typeof obj.pageItem === "number" ? obj.pageItem : 0;
		page.allItem = typeof obj.allItem === "number" ? obj.allItem : 0;
		page.showCount = typeof obj.showCount === "number" ? obj.showCount : 0;
		page.selector = typeof obj.selector === "string" ? obj.selector : ".paning";
		page.isAnimation = typeof obj.isAnimation === "boolean" ? obj.isAnimation : false;
		page.isShowSkip = typeof obj.isShowSkip === "boolean" ? obj.isShowSkip : false;
		page.isShowCount = typeof obj.isShowCount === "boolean" ? obj.isShowCount : false;
		page.isShowAllItems = typeof obj.isShowAllItems === "boolean" ? obj.isShowAllItems : false;

		// 显示的文本
		page.prevText = typeof obj.prevText === "string" ? obj.prevText : page.prevText;
		page.nextText = typeof obj.nextText === "string" ? obj.nextText : page.nextText;
		page.firstText = typeof obj.firstText === "string" ? obj.firstText : page.firstText;
		page.lastText = typeof obj.lastText === "string" ? obj.lastText : page.lastText;
		page.prevGroupText = typeof obj.prevGroupText === "string" ? obj.prevGroupText : page.prevGroupText;
		page.nextGroupText = typeof obj.nextGroupText === "string" ? obj.nextGroupText : page.nextGroupText;

		// 是否显示项
		page.isShowNumber = typeof obj.isShowNumber === "boolean" ? obj.isShowNumber : page.isShowNumber;
		page.isShowPrevNext = typeof obj.isShowPrevNext === "boolean" ? obj.isShowPrevNext : page.isShowPrevNext;
		page.isShowFirstLast = typeof obj.isShowFirstLast === "boolean" ? obj.isShowFirstLast : page.isShowFirstLast;
		page.isShowPrevNextGroup = typeof obj.isShowPrevNextGroup === "boolean" ? obj.isShowPrevNextGroup : page.isShowPrevNextGroup;

		page.init = obj.init || function () {}; // 加载页面
		page.render = obj.render || function () {}; //render页面
		page.callback = obj.callback || function () {}; //回调函数
	}

	// 初始化
	function _init(obj) {

		// 检测参数是否为对象
		if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== "object") {
			return "参数有误";
		}

		// 检查参数
		checkParameter(obj);

		page.init = function () {
			$(page.selector).html("");
			// 设置总页数
			getAllPage();
			page.callback(page);
			$(document).on("pagingCallback", function () {
				page.callback(page);
			});
		};

		page.render = function () {

			// 设置总页数
			getAllPage();
			// 页码的分组数目
			getGroupPage();

			// 添加页码到页面元素里
			$(page.selector).html(_create(page.index));
		};

		page.init();

		// 点击触发事件
		$(page.selector).on("click", "a.item", function (e) {
			e.stopPropagation();
			e.preventDefault();

			var id = $(this).attr("data-id");
			$(page.selector).find(".skip-txt").val(id);

			//点击触发自定义事件
			$(this).trigger("paging_click", [id]);

			page.index = id;
			page.callback(page);

			// 显示动画
			if (page.isAnimation) {
				$('html,body').animate({
					scrollTop: '0px'
				}, 400);
			}
		});

		// 点击跳转页 触发事件
		$(page.selector).on("click", ".skip-btn", function (e) {
			e.stopPropagation();
			e.preventDefault();
			var id = 1;
			var v = $(page.selector).find(".skip-txt").val();
			v = v == "" ? 1 : v;
			if (!isNaN(Number(v))) {
				id = v;
			} else {
				id = 1;
			}
			id = id <= 0 ? 1 : id;
			// 检查最大值
			id = id > page.allPage ? page.allPage : id;

			$(page.selector).find(".skip-txt").val(id);
			//点击触发自定义事件
			$(this).trigger("paging_click", [id]);

			page.index = id;
			page.callback(page);
			// 显示动画
			if (page.isAnimation) {
				$('html,body').animate({
					scrollTop: '0px'
				}, 400);
			}
		});

		return page;
	}

	// 设置总页数
	function getAllPage() {
		if (page.pageItem > page.allItem) {

			page.allPage = 1;
		} else {
			if (page.allItem % page.pageItem === 0) {

				page.allPage = Math.floor(page.allItem / page.pageItem);
			} else {
				page.allPage = Math.floor(page.allItem / page.pageItem) + 1;
			}
		}
	}

	// 页码的分组数目
	function getGroupPage() {
		if (page.allPage > page.showCount) {
			if (page.allPage % page.showCount === 0) {
				page.groupPage = Math.floor(page.allPage / page.showCount);
			} else {
				page.groupPage = Math.floor(page.allPage / page.showCount) + 1;
			}
		} else {
			page.groupPage = 1;
		}
	}

	function _create(currentPage) {
		var num = "";
		var prev = "";
		var next = "";
		var first = "";
		var last = "";
		var prevGroup = "";
		var nextGroup = "";
		var skipBtn = "";
		var CountNum = "";
		var countItmes = "";
		currentPage = parseInt(currentPage);
		// 没有数据
		if (currentPage <= 0) {
			return "<span class='no-data'>没有相关数据</span>";
		}
		currentPage = currentPage > page.allPage ? page.allPage : currentPage;

		var setPageCount = 0; // 设置页码所在的数目
		if (currentPage > page.showCount) {
			setPageCount = Math.floor(currentPage / page.showCount);
			setPageCount = currentPage % page.showCount === 0 ? setPageCount - 1 : setPageCount;
		}

		page.tempId = 1;
		for (var i = setPageCount * page.showCount + 1; i <= page.allPage; i++) {
			if (i > page.allPage) {
				break;
			}
			if (page.tempId > page.showCount) {
				break;
			}

			// 当前页
			if (currentPage === i) {

				// 当前页样式
				var span = "<span class='item disabled num '>" + i + "</span>";
				num += span;
			} else {
				var a = "<a class='item active' data-id='" + i + "'>" + i + "</a>";
				num += a;
			}

			page.tempId++;
		}

		// 上一页
		if (currentPage === 1) {

			prev = "<span class='item disabled'>" + page.prevText + "</span>";
		} else {
			prev = "<a class='item active' data-id='" + (currentPage - 1) + "'>" + page.prevText + "</a>";
		}

		// 下一页
		if (currentPage === page.allPage) {

			next = "<span class='item disabled'>" + page.nextText + "</span>";
		} else {
			next = "<a class='item active' data-id='" + (currentPage + 1) + "'>" + page.nextText + "</a>";
		}

		// 第一页 
		if (currentPage === 1) {

			first = "<span class='item disabled'>" + page.firstText + "</span>";
		} else {
			first = "<a class='item active' data-id='" + 1 + "'>" + page.firstText + "</a>";
		}

		//  最后一页
		if (currentPage === page.allPage) {

			last = "<span class='item disabled'>" + page.lastText + "</span>";
		} else {
			last = "<a class='item active' data-id='" + page.allPage + "'>" + page.lastText + "</a>";
		}

		// 前一组
		if (setPageCount > 0) {
			var temp_prev_num = (setPageCount - 1) * page.showCount + 1;
			prevGroup = "<a class='item active' data-id='" + temp_prev_num + "'>" + page.prevGroupText + "</a>";
		} else {
			prevGroup = "";
		}

		// 下一组
		if (setPageCount + 1 < page.groupPage) {
			var temp_next_num = (setPageCount + 1) * page.showCount + 1;
			nextGroup = "<a class='item active ' data-id='" + temp_next_num + "'>" + page.nextGroupText + "</a>";
		} else {
			nextGroup = "";
		}

		// 跳转页
		if (page.isShowSkip) {
			skipBtn = "<input type='text' class='skip-txt' value='" + currentPage + "' /> <input type='button' class='skip-btn' value='跳转' />";
		}

		// 总条目数
		if (page.isShowAllItems) {
			countItmes = "<span class='count-items'>总共<strong>" + page.allItem + "</strong>条记录,每页<strong>" + page.pageItem + "</strong>条</span>";
		}

		// 总页数
		if (page.isShowCount) {
			CountNum = "<span class='count-num'>总共<strong>" + page.allPage + "</strong>页</span>";
		}

		return GetAllText(first, prev, prevGroup, num, nextGroup, next, last, skipBtn, countItmes, CountNum);
	}

	// 连接文本
	function GetAllText(first, prev, prevGroup, num, nextGroup, next, last, skipBtn, countItmes, CountNum) {
		var allText = "";
		// 1
		if (page.isShowFirstLast) {
			allText += first;
		}

		// 2
		if (page.isShowPrevNext) {
			allText += prev;
		}

		// 3
		if (page.isShowPrevNextGroup) {
			allText += prevGroup;
		}

		// 4
		if (page.isShowNumber) {
			allText += num;
		}

		// 3
		if (page.isShowPrevNextGroup) {
			allText += nextGroup;
		}
		// 2
		if (page.isShowPrevNext) {
			allText += next;
		}
		// 1
		if (page.isShowFirstLast) {
			allText += last;
		}

		// 跳转页
		if (page.isShowSkip) {
			allText += skipBtn;
		}

		// 总共页
		if (page.isShowAllItems) {
			allText += countItmes;
		}

		// 总共页
		if (page.isShowCount) {
			allText += CountNum;
		}

		return allText;
	}

	// 返回结果
	return {

		init: _init,
		getObj: page
	};
}(window.jQuery || window.Zepto);

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
