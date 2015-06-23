;
(function($) {
	var rules = {};
	var list = {};
	var total = {};
	var configTipPlacement = null;
	var defaultText = {
		empty: '不能为空',
		wrong: "输入有错误",
		right: "",
		focus:""
	};
	var validator = function(config) {
		return new validator.init(config);
	};
	validator.init = function(config) {
		var _this = this;
		$.each(config.rules, function(key, item) {
			var $element = $('#' + key);
			var limit = item.limit;
			var limitType = $.type(limit);
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
			total[key] = item;
		});
		configTipPlacement = config.tipPlacement || noop;
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
	//$.extend(validator, validator.addMethod);
	validator.get = function(id) {
		return list[id] = new create(id);
	};
	var _focus = function(options) {
		var tipPlacement = options.tipPlacement || configTipPlacement;
		var focusText = options.focus;
		if (focusText) {
			_tipPlacementRender(options.element, "validator-focus", focusText, tipPlacement)
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
		var wrongText = options.wrong || defaultText.wrong;
		var emptyText = options.empty || defaultText.empty;
		var tipPlacement = options.tipPlacement || configTipPlacement;
		var rightText = options.right || defaultText.right;
		var classNames = '';
		var validText = '';
		if ($element.is(":hidden")) { //隐藏
			classNames = "validator-blur validator-right";
			validText = '';
			_tipPlacementRender($element, classNames, validText, tipPlacement)
			return true;
		};
		if (!value || value === options.defaultValue) { //为空
			if (options.required) { //必填
				classNames = "validator-blur validator-empty";
				validText = emptyText;
				_tipPlacementRender($element, classNames, validText, tipPlacement)
				return false;
			} else {
				classNames = "validator-blur validator-right";
				validText = rightText;
				_tipPlacementRender($element, classNames, validText, tipPlacement)
				return true;
			}
		} else {
			if (options.required) {
				if (!limit || $.type(limit) === 'regexp' && limit.test(value)) {
					classNames = "validator-blur validator-right";
					validText = rightText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return true;
				} else {
					classNames = "validator-blur validator-wrong";
					validText = wrongText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return false;
				}
			} else {
				if (!limit||$.type(limit) === 'regexp' && limit.test(value)) {
					classNames = "validator-blur validator-right";
					validText = rightText;
					_tipPlacementRender($element, classNames, validText, tipPlacement)
					return true;
				} else {
					classNames = "validator-blur validator-wrong";
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
		triggerValid: function(id, type, message, tipPlacement) {
			//todo
		}
	};
	if (typeof exports !== 'undefined') {
		module.exports = validator
	} else {
		window['validator'] = validator;
	};
})(jQuery);