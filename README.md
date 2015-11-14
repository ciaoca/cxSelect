#jQuery cxSelect

cxSelect 是基于 jQuery 的多级联动菜单插件，适用于省市、商品分类等联动菜单。

列表数据通过 AJAX 获取，也可以自定义，数据内容使用 JSON 格式。

同时兼容 Zepto，方便在移动端使用。

国内省市县数据来源：[basecss/cityData](https://github.com/basecss/cityData) Date: 2014.03.31

全球主要城市数据来源：整理国内常用网站和软件 Date: 2014.07.29

**版本：**

* jQuery v1.7+
* jQuery cxSelect v1.3.7

文档：http://code.ciaoca.com/jquery/cxselect/

示例：http://code.ciaoca.com/jquery/cxselect/demo/

##使用方法
###载入 JavaScript 文件
```html
<script src="jquery.js"></script>
<script src="jquery.cxselect.js"></script>
```

###DOM 结构
```html
<!--
select 必须放在元素 id="element_id" 的内部，不限层级
select 的 class 任意取值，也可以附加多个 class，如 class="province otherclass"，在调用时只需要输入其中一个即可，但是不能重复
如需设置 select 默认值，加上 data-value 属性，例：<select class="province" data-value="浙江省"></select>
-->
<div id="element_id">
  <select class="province"></select>
  <select class="city"></select>
  <select class="area"></select>
</div>
```

###调用 cxSelect
``` javascript
$('#element_id').cxSelect({
  url: 'cityData.min.json'                // 提示：如果服务器不支持 .json 类型文件，请将文件改为 .js 文件
  selects: ['province', 'city', 'area'],  // selects 为数组形式，请注意顺序
  nodata: 'none'
});
```
###可设置全局默认值
``` javascript
// 需在引入 <script src="jquery.cxselect.js"></script> 之后，调用之前设置
$.cxSelect.defaults.url = 'cityData.min.json';
$.cxSelect.defaults.nodata = 'none';
```

##参数说明
<table>
  <thead>
    <tr>
      <th width="120">名称</th>
      <th width="120">默认值</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>selects</td>
    <td>[]</td>
    <td>下拉选框组。输入 select 的 className</td>
  </tr>
  <tr>
    <td>url</td>
    <td>null</td>
    <td>
      整合列表数据接口地址（URL） | 数组 <a href="http://code.ciaoca.com/jquery/cxselect/demo/custom.html">[DEMO]</a>。数据使用 JSON 格式。
      每个选框的内容使用各自的接口地址，详见 <a href="http://code.ciaoca.com/jquery/cxselect/demo/oneself.html">[DEMO]</a>
    </td>
  </tr>
  <tr>
    <td>nodata</td>
    <td>null</td>
    <td>子集无数据时 select 的状态。可设置为："none"(display:none), "hidden"(visibility:hidden)</td>
  </tr>
  <tr>
    <td>required</td>
    <td>false</td>
    <td>是否为必选。设为 flase 时，会在列表头部添加 `&lt;option value="firstValue"&gt;firstTitle&lt;/option&gt;` 选项。</td>
  </tr>
  <tr>
    <td>firstTitle</td>
    <td>'请选择'</td>
    <td>选框第一个项目的标题（仅在 required 为 false 时有效）</td>
  </tr>
  <tr>
    <td>firstValue</td>
    <td>''</td>
    <td>选框第一个项目的值（仅在 required 为 false 时有效）</td>
  </tr>
  <tr>
    <td>jsonSpace</td>
    <td>''</td>
    <td>数据命名空间</td>
  </tr>
  <tr>
    <td>jsonName</td>
    <td>'n'</td>
    <td>数据标题字段名称（用于 option 的标题）</td>
  </tr>
  <tr>
    <td>jsonValue</td>
    <td>''</td>
    <td>数据值字段名称（用于 option 的 value，没有值字段时使用标题作为 value）</td>
  </tr>
  <tr>
    <td>jsonSub</td>
    <td>'s'</td>
    <td>子集数据字段名称</td>
  </tr>
</table>

##data 属性参数
###在父元素上的 data- 属性
```html
<div id="element_id" data-url="cityData.min.json" data-required="true"></select>
```
<table>
  <thead>
    <tr>
      <th width="160">名称</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>data-selects</td>
    <td>下拉选框组。输入 select 的 className，使用英文逗号分隔的字符串</td>
  </tr>
  <tr>
    <td>data-url</td>
    <td>列表数据接口地址（此处只能设置 URL，自定义需要在参数中设置）</td>
  </tr>
  <tr>
    <td>data-nodata</td>
    <td>子集无数据时 select 的状态</td>
  </tr>
  <tr>
    <td>data-required</td>
    <td>是否为必选</td>
  </tr>
  <tr>
    <td>data-first-title</td>
    <td>选框第一个项目的标题</td>
  </tr>
  <tr>
    <td>data-first-value</td>
    <td>选框第一个项目的值</td>
  </tr>
  <tr>
    <td>data-json-space</td>
    <td>数据命名空间</td>
  </tr>
  <tr>
    <td>data-json-name</td>
    <td>数据标题字段名称</td>
  </tr>
  <tr>
    <td>data-json-value</td>
    <td>数据值字段名称</td>
  </tr>
  <tr>
    <td>data-json-sub</td>
    <td>子集数据字段名称</td>
  </tr>
</table>

###在 &lt;select&gt; 上的 data- 属性
<table>
  <thead>
    <tr>
      <th width="160">名称</th>
      <th>说明</th>
    </tr>
  </thead>
  <tr>
    <td>data-value</td>
    <td>默认选中值</td>
  </tr>
  <tr>
    <td>data-url</td>
    <td>列表数据接口地址</td>
  </tr>
  <tr>
    <td>data-query-name</td>
    <td>传递上一个选框值得名称（默认使用上一个选框的 name 属性值）</td>
  </tr>
  <tr>
    <td>data-first-title</td>
    <td>选框第一个项目的标题</td>
  </tr>
  <tr>
    <td>data-first-value</td>
    <td>选框第一个项目的值</td>
  </tr>
  <tr>
    <td>data-json-space</td>
    <td>数据命名空间</td>
  </tr>
  <tr>
    <td>data-json-name</td>
    <td>数据标题字段名称</td>
  </tr>
  <tr>
    <td>data-json-value</td>
    <td>数据值字段名称</td>
  </tr>
</table>

##示例
自定义数据及使用纯数组数据 [DEMO](http://code.ciaoca.com/jquery/cxselect/demo/custom.html)

各选项数据接口独立 [DEMO](http://code.ciaoca.com/jquery/cxselect/demo/oneself.html)
