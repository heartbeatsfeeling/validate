/*validator({
	id:"na",
	tipPlacement:function(element,text){

	},
	rules:{
		'a':{
			tipPlacement:function(element,text){

			},
			defaultValue:"请输入文字",
			wrong:"输入的错误",
			right:"正确",
			empty:'为空',
			focus:"请您输入",
			required:true,
			limit:/\d/
		}
	}
});
validator.get('na').valid('a');//单独验证a
validator.get('na').valid()//.result();//验证全部
validator.get('na').triggerValid('a','error','出错了',tipPlacement);//触发a error
*/
;
(function($) {
	var validator = function(config) {
		validator.rules[config.id] = config.rules;
	};
	validator.rules={};
	validator.list = {};
	validator.get = function(id) {
		return validator.list[id] = new create(id);
	};
	var create = function(id) {
		this.element=validator.rules[id];
	};
	create.prototype = {
		valid: function(id) {

		},
		triggerValid: function(id,type,message,tipPlacement) {

		}
	};
	if (typeof exports !== 'undefined') {
		module.exports = validator
	} else {
		window['validator'] = validator;
	};
})(jQuery);