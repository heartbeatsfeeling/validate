//total 需要更好的默认配置
;
(function($) {
	var rules = {};
	var list = {};
	var total = {};
	var configTipPlacement = null;
	var defaultOptions={
		empty: '不能为空',
		wrong: "输入有错误",
		right: "",
		focus:""
	};
	var validator = function(config) {
		var _this = this;
		configTipPlacement = config.tipPlacement || noop;
		$.each(config.rules, function(key, item) {
			var $element = $('#' + key);
			var limit = item.limit;
			var limitType = $.type(limit);
			defaultOptions.tipPlacement=item.tipPlacement||configTipPlacement;
			item.element = $element;
			$element.on('focus', function() {
				_focus(item);
			});
			switch (limitType) { //regexp undefined string
				case 'regexp':
				case 'undefined':
					$element.on('blur', function() {
						_validCore(item);
					});
					break;
				case 'string':
					$element.on('blur', function() {
						var fn=validator.addMethod[limit];
						if($.type(fn)==='function'){
							fn(item);
						}else{
							throw limit+' is not function'
						};
					});
					break;
			};
			//整理数据
			$.extend(item,defaultOptions);
			total[key] = item;
		});
		rules[config.id] = config.rules;
	};
	validator.addMethod = {
		number: function(options) {
			var reg = /^\d+$/;
			options.limit = reg;
			return _validCore(options);
		},
		email: function(options) {
			var reg = /^[\w.-]+?@[a-z0-9]+?\.[a-z]{2,6}$/i;
			options.limit = reg;
			return _validCore(options);
		}
	};
	validator.get = function(id) {
		return list[id] = new create(id);
	};
	var _classNames={
		focus:['validator-focus'],
		right:['validator-right'],
		empty:['validator-empty'],
		wrong:['validator-wrong']
	};
	var _focus = function(options) {
		var tipPlacement = options.tipPlacement;
		var focusText = options.focus;
		if (focusText) {
			_tipPlacementRender(options.element, _classNames.focus.join(''), focusText, tipPlacement)
		};
	};
	var _blur = function(options) {
		return _validCore(options);
	};
	var _tipPlacementRender = function($element, className, text, tipPlacement) {
		var html = "<span class='{{classname}}'>{{text}}</span>".replace("{{classname}}", className).replace("{{text}}", text)
		tipPlacement($element, html);
	};
	var _validCore = function(options) { //核心验证方法
		var $element = options.element;
		var value = $.trim($element.val());
		var limit = options.limit;
		var wrongText = options.wrong
		var emptyText = options.empty
		var tipPlacement = options.tipPlacement
		var rightText = options.right
		var classNames = '';
		var validText = '';
		if ($element.is(":hidden")) { //隐藏
			classNames =_classNames.right.join('');
			validText = '';
			_tipPlacementRender($element, classNames, validText, tipPlacement)
			return true;
		};
		if (!value || value === options.defaultValue) { //为空
			if (options.required) { //必填
				classNames =_classNames.empty.join('');
				validText = emptyText;
				_tipPlacementRender($element, classNames, validText, tipPlacement)
				return false;
			} else {
				classNames =_classNames.right.join('');
				validText = rightText;
				_tipPlacementRender($element, classNames, validText, tipPlacement)
				return true;
			}
		} else {
			if (options.required) {
				if (!limit || $.type(limit) === 'regexp' && limit.test(value)) {
					classNames =_classNames.right.join('');
					validText = rightText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return true;
				} else {
					classNames =_classNames.wrong.join('');
					validText = wrongText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return false;
				}
			} else {
				if (!limit||$.type(limit) === 'regexp' && limit.test(value)) {
					classNames =_classNames.right.join('');
					validText = rightText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return true;
				} else {
					classNames = _classNames.wrong.join('');
					validText = wrongText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return false;
				}
			}
		};
	};
	var noop = function() {};
	var create = function(id) {
		this.element = rules[id];
	};
	create.prototype = {//最后验证有错误，先放着
		valid: function(id) {
			var _this = this;
			var result = true;
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
			var options = total[id];
			var limit=options.limit;
			var limitType=$.type(limit);
			var fn=noop;
			switch(limitType){
				case 'regexp':
				case 'undefined':
					return _validCore(options)
					break;
				case 'string':
					fn=validator.addMethod[limit];
					if($.type(fn)==='function'){
						return fn(options)
					}else{
						return false;
					}
					break;
				default:
			}
		},
		triggerValid: function(id, type) {
			var options=total[id];
			var $element=options.element;
			var tipPlacement=options.tipPlacement
			_tipPlacementRender($element,_classNames[type],options[type],tipPlacement);
		}
	};
	if (typeof exports !== 'undefined') {
		module.exports = validator
	} else {
		window['validator'] = validator;
	};
})(jQuery);