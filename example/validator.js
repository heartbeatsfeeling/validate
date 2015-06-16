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
	var rules={};
	var list = {};
	var total={};
	var validator = function(config) {
		var rule=config.rules;
		$.each(rule,function(key,item){
			total[key]=item;
		});
		rules[config.id] = config.rules;
	};
	validator.get = function(id) {
		return list[id] = new create(id);
	};
	var create = function(id) {
		this.element=rules[id];
	};
	create.prototype = {
		valid: function(id) {
			var _this=this;
			if(id){
				_this.validHander(total[id])
			}else{
				$.each(this.element,function(key,item){
					_this.validHander(item);
				});
			};
		},
		validHander:function(id){
			console.log(id)
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