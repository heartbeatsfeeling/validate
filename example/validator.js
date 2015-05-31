/*validator({
	id:"na",
	tipPlacement:function(element,text){

	},
	rules:{
		'a':{
			tipPlacement:function(element,text){

			},
			wrong:"输入的错误",
			right:"正确",
			empty:'为空',
			focus:"请您输入",
			required:true,//根据元素判断type ，确定click blur change 
			//handler:'core',
			limit:/\d/
		}
	}
});
validator.get('na').result();//验证结果*/
;(function($){
	var validator=function(config){
		return new  validator.prototype.init(config);
	};
	validator.fn=validator.prototype={
		init:function(config){
			console.log(config)
		},
		var validRule = { //验证规则
			email: /^[\w.-]+?@[a-z0-9]+?\.[a-z]{2,6}$/i, //电子邮件
			idnumber: /^\d{6}(?:((?:19|20)\d{2})(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}(?:x|X|\d)|(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1-2]\d|3[0-1])\d{3}))$/, //身份证
			phone: /^\d{11}$/, //手机号
			empty: /[^\s]{1,}/ //非空
		}
	};
	validator.prototype.init.prototype=validator.fn;
	window['validator']=validator;
})(jQuery);
