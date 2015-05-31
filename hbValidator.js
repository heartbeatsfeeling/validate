/*基于JQ的验证插件*/ 
;(function($) {//
	/*validTip 为验证提示方法包含 三个对像 你也可以自己定义 一个validTip对像
		right 正确后的提示
		wrong错误提示
		normal 输入框  focus时的提示
		可以默认，可以自己定义。
		@obj 为input对像
		@text为提示文字 
	*/
	//验证提示对像
	var validTip = {};
	//默认配置
	validTip.defaults = {
		//obj变成jq对象,防止传入的是JS对象
		right: function(obj, text) { //正确提示
			text = text || '';
			$(obj).closest('li').find('.comment').addClass('right').removeClass('wrong').html(text).css('display', '');
		},
		wrong: function(obj, text) { //错误提示
			text = text || '错误';
			$(obj).closest('li').find('.comment').addClass('wrong').removeClass('right').html(text).css('display', '');
		},
		normal: function(obj, text) { //正常提示
			text = text || '';
			$(obj).closest('li').find('.comment').removeClass('right').removeClass('wrong').html(text).css('display', '');
		}
	};
	//合并默认配置
	$(document).ready(function() {
		for (var i in validTip.defaults) {
			if (window.validTip[i] === undefined) {
				window.validTip[i] = validTip.defaults[i];
			};
		}
	});
	window['validTip'] = validTip;
})(jQuery);
//验证插件主体
;(function($) {
	var validRule = { //验证规则
		email: /^[\w.-]+?@[a-z0-9]+?\.[a-z]{2,6}$/i, //电子邮件
		idnumber: /^\d{6}(?:((?:19|20)\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}(?:x|X|\d)|(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}))$/, //身份证
		phone: /^\d{11}$/, //手机号
		empty: /[^\s]{1,}/ //非空
	};
	var valid = function() {
		var valid = function(name) {
			return new valid.fn.init(name);
		};
		valid.fn = valid.prototype = {
			constructor: valid,
			init: function(name) { //建立name 合成 validname函数，做最后验证结果
				this.name = name;
				return this;
			},
			core: function(config) { //核心验证方法
				var node = $(config.node),
					value = node.val(),
					limit = config.limit,
					status = config.status,
					ajax = config.ajax;
				if (node.is(":hidden")) { //节点隐藏，返回真
					return true;
				};
				if (value === '') { //为空
					if (status) { //必填项
						validTip.wrong(node, config.empty);
						return false;
					} else { //非必填项
						validTip.normal(node, '');
						return true;
					}
				} else { //不为空
					if ($.type(limit) === 'regexp') { //传入的limit是正则
						if (limit.test(value)) {
							if ($.type(ajax) === 'function') { //进行ajax验证
								return ajax()
							} else { //非ajax
								validTip.right(node, config.right);
								return true;
							}
						} else {
							validTip.wrong(node, config.wrong);
							return false;
						}
					} else { //limit是字符串，同时可能代有正则 同时直接做了验证处理  进力进力不要用
						if (eval(limit)) {
							if ($.type(ajax) === 'function') { //开启ajax验证
								return ajax()
							} else {
								validTip.right(node, config.right);
								return true;
							}
						} else {
							validTip.wrong(node, config.wrong);
							return false;
						}
					}
				}
			},
			//验证电子邮箱
			email: function(config) {
				config.limit = config.limit || validRule['email'];
				return valid.fn.core(config);
			},
			//验证手机号码
			phone: function(config) {
				config.limit = config.limit || validRule['phone'];
				return valid.fn.core(config);
			},
			//验证身份证号
			idnumber: function(config) {
				config.limit = config.limit || validRule['idnumber'];
				return valid.fn.core(config);
			},
			//验证非空项
			empty: function(config) {
				config.limit = config.limit || validRule['empty'];
				return valid.fn.core(config);
			},
			//验证初始化
			validator: function(config) {
				var i,
					items,
					item,
					length,
					that = this,
					cache = {},
					fun = [],
					param = [],
					randomFun;
				for (items in config) {
					if ($.type(config[items]) === 'object') { //如果传入的是对像
						item = config[items];
						cache = { //保存数据
							node: $(items),
							limit: item.limit,
							ajax: item.ajax,
							empty: item.empty,
							wrong: item.wrong,
							right: item.right
						};
						//绑定事件
						for (var j in item.bind) {
							(function(cache, j) {
								var type = item.bind[j];
								var handler = config[items].handler;
								if ($.type(type) === 'boolean') { //传入的是boolean 
									type ? (cache.status = true) : (cache.status = false); //改变状态码
									$(items).bind(j, function() {
										valid.fn[handler](cache);
									});
								} else {
									$(items).bind(j, function(e) {
										validTip.normal(this, type);
									});
								}
							})(cache, j)
						};
						fun.push(config[items].handler);
						param.push(cache);
					} else { //传入函数
						cache = null;
						randomFun = ('valid' + items).replace(/#|\./, ''); //生成随机函数名
						valid.fn[randomFun] = config[items]; //函数装载到valid.fn中
						fun.push(randomFun);
						param.push(cache);
					}
				};
				//建立一个全局函数，以供最后调用 validform()//return true/false
				window['valid' + (this.name).replace(/#|\./ig, '')] = function() {
					var l = fun.length;
					var status = 0;
					for (var i = 0; i < l; i++) {
						if (valid.fn[fun[i]](param[i])) { //运行生成的函数 例如 valid.fn.email
							status++
						};
					};
					return status === l;
				}
			}
		};
		valid.fn.init.prototype = valid.fn;
		return valid;
	}();
	window['hbValidator'] = valid;
})(jQuery);