/*
validator({
	id:"na",
	tipPlacement:function(element,tip){
			element.closest('.common').find('.tip').html(tip);
	},
	rules:{
		'a':{
			defaultValue:"请输入a",
			wrong:"输入的错误",
			right:"正确",
			empty:'为空',
			focus:"请您输入",
			required:true,
			limit:/^\d+$/
		},
		'b':{
			defaultValue:"请输入b",
			wrong:"输入的错误",
			right:"正确",
			empty:'为空',
			focus:"请您输入",
			required:true,
			limit:/^\d+$/
		}
	}
});
validator.get('na').valid('a');//单独验证a
validator.get('na').valid()//.result();//验证全部
validator.get('na').triggerValid('a','error','出错了',tipPlacement);//触发a error
为空的处理 有点不对。。
*/
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
		focus: ""
	};
	var validator = function(config) {
		var rule = config.rules;
		$.each(rule, function(key, item) {
			var $element = $('#' + key);
			item.element = $element;
			$element.on('focus', function() {
				_focus(item);
			});
			$element.on('blur', function() {
				_blur(item);
			});
			total[key] = item;
		})
		configTipPlacement = config.tipPlacement||noop;
		rules[config.id] = config.rules;
	};
	validator.get = function(id) {
		return list[id] = new create(id);
	};
	var _focus = function(options) {
		var tipPlacementFn = options.tipPlacement || configTipPlacement;
		var focusText = options.focus || defaultText.focus;
		if (focusText) {//留着以后用
			_tipPlacementRender(options.element,"validator-focus",focusText,tipPlacementFn)
		};
	};
	var _blur = function(options) {
		return _validCore(options);
	};
	var _tipPlacementRender=function($element,className,text,tipPlacement){
		var html="<span class='{{classname}}'>{{text}}</span>".replace("{{classname}}",className).replace("{{text}}",text )
		tipPlacement($element,html);
	};
	var _validCore = function(options) { //核心验证方法
		var $element = options.element;
		var value = $.trim($element.val());
		var limit = options.limit;
		var wrongText = options.wrong || defaultText.wrong;
		var emptyText = options.empty || defaultText.empty;
		var tipPlacement = options.tipPlacement || configTipPlacement;
		var rightText=options.right||defaultText.right;
		var html="<span class='{{classname}}'>{{text}}</span>";
		var classNames='';
		var validText='';
		if($element.is(":hidden")){//隐藏
			classNames="validator-blur validator-right";
			validText='';
			tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
			return true;
		};
		if (!value || value === options.defaultValue) { //为空
			if (options.required) { //必填
				classNames="validator-blur validator-empty";
				validText=emptyText;
				tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
				return false;
			} else {
				classNames="validator-blur validator-right";
				validText=rightText;
				tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
				return true;
			}
		} else {
			if (options.required) {
				if (limit.test(value)) {
					classNames="validator-blur validator-right";
					validText=rightText;
					tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
					return true;
				} else {
					classNames="validator-blur validator-wrong";
					validText=wrongText;
					tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
					return false;
				}
			} else {
				if (limit.test(value)) {
					classNames="validator-blur validator-right";
					validText=rightText;
					tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
					return true;
				} else {
					classNames="validator-blur validator-wrong";
					validText=wrongText;
					tipPlacement($element, html.replace("{{classname}}",classNames).replace("{{text}}",validText ));
					return false;
				}
			}
		};
	};
	var noop=function(){ };
	var create = function(id) {
		this.element = rules[id];
	};
	create.prototype = {
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
			return _blur(options)
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