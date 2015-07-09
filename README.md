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
<h2></h2>
...html
<div class="form-group common">
<label>中文验证：</label>
<input type="text" name='a' class='form-control' >
<div class="tip"></div>
</div>
...
...js
validate({
			id:"na",
			tipPlacement:function(element,tip){
				element.closest('.common').find('.tip').html(tip);
			},
			rules:{
				'a':{
					wrong:"请输入中文",
					right:"输入正确",
					empty:'输入不能为空',
					focus:"请您输入该字段",
					required:true,
					limit:/^[\u4e00-\u9fa5]+$/
				}
			}
		});
...
<p>2015-07-09:发布第一版</p>
<p>2015-05-27:基于jquery的一个简单验证插件 version:0.1</p>
