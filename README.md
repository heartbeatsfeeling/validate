<h2>基本使用方法</h2>
<h3>html</h3>
```html
<div class="form-group common">
	<label>中文验证：</label>
	<input type="text" name='a' class='form-control' >
	<div class="tip"></div>
</div>
```
<h3>js</h3>
```js
validate({
	id:"na",//验证器名称
	tipPlacement:function(element,tip){//提示信息放置位置
		element.closest('.common').find('.tip').html(tip);
	},
	rules:{
		'a':{//name为a的节点，注意！别重复。
			wrong:"请输入中文",//错误提示文字
			right:"输入正确",//正确后提示文字
			empty:'输入不能为空',//
			focus:"请您输入该字段",//
			required:true,//是否必填，为空为false或是不写，则为非必填（可以不写，写了就必需写正确）
			limit:/^[\u4e00-\u9fa5]+$/ //验证正则，这里也可以传入其它，见下文
		}
	}
});
```
<h3>调用</h3>
```js
validate.get('na').valid()//返回na这个验证器的验证结果
validate.get('na').valid('a')//返回name=a节点的验证结果
```
<p>
	对limit说明：可以传入正则，或插件自带验证函数number,string,phone,email等，也可以自定义验证规则
</p>
<h1>自定义验证规则</h1>
```js
validate.addMethod.isDate=function(options){//日期验证
	var $element=options.element;
	var value=$element.val();
	if(!value){
		options.tipPlacement($element,options.empty);
		return false;
	}else if(!isNaN(Date.parse(value)) &&Date.parse(value)>0 ){
		options.tipPlacement($element,options.right);
		return true;
	}else{
		options.tipPlacement($element,options.wrong);
		return false;
	}
};
```
<p>调用方法同上</p>
<h3>自带验证规则：</h3>
<ul>
	<li>
		<h4 class='tit'>number 验证纯数字</h4>
	</li>
	<li>
		<h4 class='tit'>email  验证电子邮箱</h4>
	</li>
	<li>
		<h4 class='tit'>string  纯字母</h4>
	</li>
	<li>
		<h4 class='tit'>phone  验证手机号码</h4>
	</li>
</ul>
<p>2015-07-09:发布第一版</p>
<p>2015-05-27:基于jquery的一个简单验证插件 version:0.1</p>
