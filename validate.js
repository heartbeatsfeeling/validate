//https://github.com/heartbeatsfeeling/validate
;
(function($) {
	var rules = {};
	var list = {};
	var total = {};
	var defaultOptions = {
		empty: '输入项不能为空',
		wrong: "输入有错误",
		right: "",
		focus: ""
	};
	var validate = function(config) {
		var _this = this;
		$.each(config.rules, function(key, item) {
			var $element = $("[name='" + key + "']"),
				limit = item.limit,
				limitType = $.type(limit),
			 	eventType = _getElementType($element);
			item.tipPlacement = item.tipPlacement || config.tipPlacement || noop;
			item.element = $element;
			//整理数据
			item = $.extend({}, defaultOptions, item);
			total[key] = item;
			if(eventType!=='click'&&item.focus){
				$element.on('focus', function() {
					_focus(item);
				});
			};
			switch (limitType) {
				case 'regexp':
				case 'undefined':
					$element.on(eventType, function() {
						_events[eventType](item);
					});
					break;
				case 'string':
					$element.on(eventType, function() {
						var fn = validate.addMethod[limit];
						if ($.type(fn) === 'function') {
							fn(item);
						} else if ($.type(_events[eventType]) == 'function') {
							_events[eventType](item);
						} else {
							throw limit + ' is not function'
						};
					});
					break;
			};
		});
		rules[config.id] = config.rules;
	};
	validate.version='1.1';
	validate.addMethod = {
		'zh-cn':function(options){//中文验证
			var reg = /^[\u4e00-\u9fa5]+$/
			options.limit = reg;
			var eventType = _getElementType(options.element);
			return _events[eventType](options);
		},
		phone:function(options){//手机号码
			var reg = /^\d{11}$/;
			options.limit = reg;
			var eventType = _getElementType(options.element);
			return _events[eventType](options);
		},
		string:function(options){//字符串
			var reg = /^[A-Za-z]+$/;
			options.limit = reg;
			var eventType = _getElementType(options.element);
			return _events[eventType](options);
		},
		number: function(options) {//纯数字
			var reg = /^\d+$/;
			options.limit = reg;
			var eventType = _getElementType(options.element);
			return _events[eventType](options);
		},
		email: function(options) {//电子邮件
			var reg = /^[\w.-]+?@[a-z0-9]+?\.[a-z]{2,6}$/i;
			options.limit = reg;
			var eventType = _getElementType(options.element);
			return _events[eventType](options);
		}
	};
	validate.get = function(id) {
		return list[id] = new create(id);
	};
	var _classNames = {
		focus: ['validate-focus'],
		right: ['validate-right'],
		empty: ['validate-empty'],
		wrong: ['validate-wrong'],
		input: {
			total: 'validate-input-empty validate-input-right validate-input-wrong validate-input-focus',
			empty: "validate-input-empty",
			right: 'validate-input-right',
			wrong: 'validate-input-wrong',
			focus: 'validate-input-focus'
		}
	};
	var _getElementType = function(element) { //得到事件类型
		var $element = element,
			nodeName = $element.prop('nodeName').toLowerCase(),
			elementType = $element.prop('type'),
			eventType = 'blur';
		if (nodeName == 'select') {
			eventType = 'blur';
		} else {
			if (elementType == 'checkbox' || elementType == 'radio') {
				eventType = 'click';
			} else {
				eventType = 'blur';
			};
		};
		return eventType
	};
	var _setInputClass = function(element, removeClass, addClass) {
		element.removeClass(removeClass).addClass(addClass)
	};
	var _focus = function(options) {
		var tipPlacement = options.tipPlacement,
			focusText = options.focus,
			$element = options.element;
		if (focusText) {
			_setInputClass($element, _classNames.input.total, _classNames.input.focus);
			_tipPlacementRender($element, _classNames.focus.join(''), focusText, tipPlacement)
		};
	};
	var _tipPlacementRender = function($element, className, text, tipPlacement) {
		var html = "<span class='{{classname}}'>{{text}}</span>".replace("{{classname}}", className).replace("{{text}}", text)
		tipPlacement($element, html);
	};
	var _events = {
		blur: function(options) { //核心验证方法
			var $element = options.element,
				value = $.trim($element.val()),
				limit = options.limit,
				wrongText = options.wrong,
				emptyText = options.empty,
				rightText = options.right,
				tipPlacement = options.tipPlacement,
				classNames = '',
				validText = '',
				length=options.length?options.length.toString().split('~'):'',
				minLength=0,
				maxLength=Infinity,
				result=true,
				currentClass='';
			if(length){
				minLength=length[0];
				maxLength=length[1]?length[1]:minLength;
			};
			if ($element.is(":hidden")) { //隐藏
				classNames = _classNames.right.join('');
				validText = '';
				currentClass=_classNames.input.right;
				result=true;
			};
			if (!value || value === options.defaultValue) { //为空
				if (options.required) { //必填
					classNames = _classNames.empty.join('');
					validText = emptyText;
					currentClass=_classNames.input.empty;
					result=false;
				} else {
					classNames = _classNames.right.join('');
					validText = rightText;
					currentClass=_classNames.input.right;
					result=true;
				}
			} else {
				if (options.required) {
					if (!limit || $.type(limit) === 'regexp' && limit.test(value)&&(value.length>=minLength&&value.length<=maxLength) ) {
						classNames = _classNames.right.join('');
						validText = rightText;
						currentClass=_classNames.input.right;
						result=true;
					} else {
						classNames = _classNames.wrong.join('');
						validText = wrongText;
						currentClass=_classNames.input.wrong;
						result=false;
					}
				} else {
					if (!limit || $.type(limit) === 'regexp' && limit.test(value) &&(value.length>=minLength&&value.length<=maxLength) ) {
						classNames = _classNames.right.join('');
						validText = rightText;
						currentClass=_classNames.input.right;
						result=true;
					} else {
						classNames = _classNames.wrong.join('');
						validText = wrongText;
						currentClass=_classNames.input.wrong;
						result=false;
					}
				}
			};
			_setInputClass($element, _classNames.input.total, currentClass);
			_tipPlacementRender($element, classNames, validText, tipPlacement)
			return result;
		},
		change: function(options) {
			return _events.blur(options);
		},
		click: function(options) {
			var $element = options.element,
				limit = options.limit,
				wrongText = options.wrong,
				emptyText = options.empty,
				rightText = options.right,
				tipPlacement = options.tipPlacement,
				classNames = '',
				validText = '',
				result=true,
				currentClass='';
			if ($element.filter(":checked").length >= limit) {
				classNames = _classNames.right.join('');
				validText = rightText;
				currentClass=_classNames.input.right;
				result=true;
			} else {
				classNames = _classNames.wrong.join('');
				validText = wrongText;
				currentClass=_classNames.input.wrong;
				result=false;
			};
			_setInputClass($element, _classNames.input.total, currentClass);
			_tipPlacementRender($element, classNames, validText, tipPlacement)
			return result;
		}
	}
	var noop = function() {};
	var create = function(id) {
		this.element = rules[id];
	};
	create.prototype = { 
		valid: function(id) {
			var _this = this,
				result = true;
			if (id) {
				result = _this.validHander(id)
			} else {
				$.each(this.element, function(id, item) {
					result = _this.validHander(id) ? result : false;
				});
			};
			return result;
		},
		validHander: function(id) {
			var options = total[id],
				limit = options.limit,
				limitType = $.type(limit),
				fn = noop,
				eventType = _getElementType(options.element);
			switch (limitType) {
				case 'regexp':
				case 'undefined':
					return _events[eventType](options)
					break;
				case 'string':
					fn = validate.addMethod[limit];
					if ($.type(fn) === 'function') {
						return fn(options)
					} else if($.type(_events[eventType]) == 'function'){
						return _events[eventType](options)
					}else {
						return false;
					}
					break;
				default:
			}
		},
		triggerValid: function(id, type) {
			var options = total[id],
				$element = options.element,
				tipPlacement = options.tipPlacement;
			_tipPlacementRender($element, _classNames[type], options[type], tipPlacement);
		}
	};
	if (typeof exports !== 'undefined') {
		module.exports = validate
	} else {
		window['validate'] = validate;
	};
})(jQuery);