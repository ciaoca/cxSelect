#jQuery cxSelect

cxSelect 是基于 jQuery 的多级联动菜单插件，适用于省市、商品分类等联动菜单。

版本：

* jQuery v1.4.4+
* jQuery cxSelect v1.2

列表数据通过 ajax 获取（所以需要在服务器环境运行），使用 json 格式

提供国内省市县数据（采集于2011年8月）

文档：http://code.ciaoca.com/jquery/cxselect/

示例：http://code.ciaoca.com/jquery/cxselect/demo/

##【options 参数说明】
<table>
    <thead>
        <tr>
            <th width="80">名称</th>
            <th width="80">默认值</th>
            <th>说明</th>
        </tr>
    </thead>
    <tr>
        <td>url</td>
        <td>"js/city.js"</td>
        <td>列表数据文件路径（josn格式）</td>
    </tr>
    <tr>
        <td>select</td>
        <td>[]</td>
        <td>下拉菜单组。输入 select 的 className</td>
    </tr>
    <tr>
        <td>nodata</td>
        <td>null</td>
        <td>子级无数据时 select 的状态。可设置为："none"(display隐藏) | "hidden"(visibility隐藏)</td>
    </tr>
    <tr>
        <td>required</td>
        <td>false</td>
        <td>是否为必选。设为 flase 时，会在列表头部添加 &lt;option value="0"&gt;请选择&lt;/option&gt; 选项，其中“请选择”可以通过 data-title 来改变。</td>
    </tr>
</table>

##【data 属性参数】
<table class="manual_table table_form">
    <thead>
        <tr>
        <th width="120">名称</th>
        <th>说明</th>
        </tr>
    </thead>
    <tr>
        <td>data-val</td>
        <td>默认值</td>
    </tr>
    <tr>
        <td>data-title</td>
        <td>第一个 option 的内容（参数 required 为 false 时才有效）</td>
    </tr>
</table>

##使用方法

载入 JavaScript 文件
```html
<script src="js/jquery.js"></script> 
<script src="js/jquery.cxselect.js"></script>
```

DOM 结构
```html
<!--
select 必须放在 id="element_id" 内部，不限层级 
select 的 class 任意取值，也可以附加多个 class，如 class="province other"，在调用时 selectes 只需要输入其中一个即可，但是不能重复
如需设置 select 默认值，加上 data-val 属性，例：<select class="province" data-val="浙江"></select>
-->
<div id="element_id">
    <select class="province"></select>
    <select class="city" disabled="disabled"></select>
    <select class="area" disabled="disabled"></select>
</div>
```

调用 cxSelect
``` javascript
// selectes 为数组形式，请注意顺序 
$("#element_id").cxSelect({
    selects:["province","city","area"],
    nodata:"none"
}); 
```

// 设置全局默认值，需在引入 **\<script src="js/jquery.cxselect.js"\>\</script\>** 之后，调用之前设置
``` javascript
$.cxSelect.defaults.url="/js/city.min.js";
$.cxSelect.defaults.nodata="none";
```