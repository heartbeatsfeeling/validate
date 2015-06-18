/*validator({
	id:"na",
	tipPlacement:function(element,text){
		defaultValue:"请输入文字",
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
	var $d=$(document);
	var rules={};
	var list = {};
	var total={};
	var configTipPlacement=null;
	var validator = function(config) {
		var rule=config.rules;
		$.each(rule,function(key,item){
			$d.on('focus','#'+key,function(){
				_focus($(this),item);
			});
			$d.on('blur','#'+key,function(){
				_blur($(this),item);
			});
			total[key]=item;
		})
		configTipPlacement=config.tipPlacement;
		rules[config.id] = config.rules;
	};
	validator.get = function(id) {
		return list[id] = new create(id);
	};
	var _focus=function($this,options){
		var tipPlacement=options.tipPlacement||configTipPlacement;
		var focusText=options.focus;
		if(focusText){
			tipPlacement($this,"<div class='validator-focus'>"+focusText+"</div>");
		};
	};
	var _blur=function($this,options){
		var tipPlacement=options.tipPlacement||configTipPlacement;
		var value=$.trim($this.val());
		var limit=options.limit;
		var wrongText=options.wrong||"错误";
		var emptyText=options.empty||"为空";
		if(options.required){//必写
			if(value){
				if( limit.test(value) ){
					tipPlacement($this,"");
					return true;
				}else{
					tipPlacement($this,"<div class='validator-blur'>"+wrongText+"</div>");
					return false;
				}
			}else{
				tipPlacement($this,"<div class='validator-blur'>"+emptyText+"</div>");
				return false;
			}
		}else{
			if(value){
				if( limit.test(value) ){
					tipPlacement($this,"");
					return true;
				}else{
					tipPlacement($this,"<div class='validator-blur'>"+wrongText+"</div>");
					return false;
				}
			}else{
				tipPlacement($this,"");
				return true;
			}
		}
	};
	var create = function(id) {
		this.element=rules[id];
	};
	create.prototype = {
		valid: function(id) {
			var _this=this;
			var result=true;
			if(id){
				result= _this.validHander(id)
			}else{
				$.each(this.element,function(id,item){
					result=_this.validHander(id)?result:false;
				});
			};
			return result;
		},
		validHander:function(id){
			var $this=$('#'+id);
			var options=total[id];
			return _blur($this,options)
		},
		triggerValid: function(id,type,message,tipPlacement) {
			//todo
		}
	};
	if (typeof exports !== 'undefined') {
		module.exports = validator
	} else {
		window['validator'] = validator;
	};
})(jQuery);