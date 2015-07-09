<h2></h2>
```html
<div class="form-group common">
	<label>中文验证：</label>
	<input type="text" name='a' class='form-control' >
	<div class="tip"></div>
</div>
```
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
