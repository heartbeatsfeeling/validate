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
			required:true,//根据元素判断type ，确定click blur change 
			limit:/\d/ [string/regexp]
		}
	}
});
validator.get('na').valid('a');//单独验证a
validator.get('na').valid()//.result();//验证全部
validator.get('na').trigger('a','error','出错了',tipPlacement);//触发a error
*/
;(function($){
	var validator=function(config){
		return new  validator.prototype.init(config);
	};
	validator.fn=validator.prototype={
		init:function(config){//初始化
			this[config.id]=this.api;
		},
		get:function(id){//获取验证id
			return this[id]
		},
		api:function(){//对外接口

		},
		addMethod:function(){

		},
		triggerValid:function(){

		},
		validRexp : { //验证规则
			isEmail: /^[\w.-]+?@[a-z0-9]+?\.[a-z]{2,6}$/i, //电子邮件
			isIdnumber: /^\d{6}(?:((?:19|20)\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}(?:x|X|\d)|(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}))$/, //身份证
			isPhone: /^(\+?0?86\-?)?1[345789]\d{9}$/, //手机号
			isEmpty: /[^\s]{1,}/ //非空
		}
	};
	validator.prototype.init.prototype=validator.fn;
	if (typeof exports !== 'undefined') {
		module.exports = validator
	} else {
		window['validator']=validator;
	};
})(jQuery);
