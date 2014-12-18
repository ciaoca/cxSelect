/*!
 * jQuery cxSelect
 * @name jquery.cxselect.js
 * @version 1.3.4
 * #date 2013-12-18
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxSelect
 * @license Released under the MIT license
 */
(function(factory){
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    };
}(function($){
	$.cxSelect = function(settings){
		var obj;
		var settings;
		var cxSelect = {
			dom: {},
			api: {}
		};

		// 检测是否为 DOM 元素
		var isElement = function(o){
			if(o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
				return true;
			} else {
				return (o && o.nodeType && o.nodeType === 1) ? true : false;
			};
		};

		// 检测是否为 jQuery 对象
		var isJquery = function(o){
			return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
		};

		// 检测是否为数组
		var isArray = function(o){
			if(!Array.isArray) {
				return Object.prototype.toString.call(o) === "[object Array]";
			} else {
				return Array.isArray(o);
			};
		};

		// 分配参数
		for (var i = 0, l = arguments.length; i < l; i++) {
			if (isJquery(arguments[i])) {
				obj = arguments[i];
			} else if (isElement(arguments[i])) {
				obj = $(arguments[i]);
			} else if (typeof arguments[i] === 'object') {
				settings = arguments[i];
			};
		};

		if (obj.length < 1) {return};

		cxSelect.init = function(){
			var _this = this;

			_this.dom.box = obj;

			_this.settings = $.extend({}, $.cxSelect.defaults, settings, {
				url: _this.dom.box.data('url'),
				nodata: _this.dom.box.data('nodata'),
				required: _this.dom.box.data('required'),
				firstTitle: _this.dom.box.data('firstTitle'),
				firstValue: _this.dom.box.data('firstValue')
			});

			// 未设置选择器组
			if (!_this.settings.selects.length) {return};

			_this.selectArray = [];
			_this.selectSum = _this.settings.selects.length;

			for (var i = 0; i < _this.selectSum; i++) {
				if (!_this.dom.box.find('select.' + _this.settings.selects[i])) {break};

				_this.selectArray.push(_this.dom.box.find('select.' + _this.settings.selects[i]));
			};

			_this.selectSum = _this.selectArray.length;

			// 设置的选择器组不存在
			if (!_this.selectSum) {return};

			// 设置 URL，通过 Ajax 获取数据
			if (typeof _this.settings.url === 'string') {
				$.getJSON(_this.settings.url, function(json){
					_this.dataJson = json;
					_this.buildContent();
				});

			// 设置自定义数据
			} else if (typeof _this.settings.url === 'object') {
				_this.dataJson = _this.settings.url;
				_this.buildContent();
			};
		};

		cxSelect.getIndex = function(n){
			return (this.settings.required) ? n : n - 1;
		};

		// 获取下拉框内容
		cxSelect.getNewOptions = function(elemJquery, data){
			if (!elemJquery) {return};
			
			var _title = this.settings.firstTitle;
			var _value = this.settings.firstValue;
			var _dataTitle = elemJquery.data('firstTitle');
			var _dataValue = elemJquery.data('firstValue');
			var _html = '';

			if (typeof _dataTitle === 'string' || typeof _dataTitle === 'number' || typeof _dataTitle === 'boolean') {
				_title = _dataTitle.toString();
			};

			if (typeof _dataValue === 'string' || typeof _dataValue === 'number' || typeof _dataValue === 'boolean') {
				_value = _dataValue.toString();
			};

			if (!this.settings.required) {
				_html='<option value="' + _value + '">' + _title + '</option>';
			};

			$.each(data, function(i, v){
				if (typeof(v.v) === 'string' || typeof(v.v) === 'number' || typeof(v.v) === 'boolean') {
					_html += '<option value="'+v.v+'">' + v.n + '</option>';
				} else {
					_html += '<option value="'+v.n+'">' + v.n + '</option>';
				};
			});

			return _html;
		};

		// 构建选框内容
		cxSelect.buildContent = function(){
			var _this = this;

			_this.dom.box.on('change', 'select', function(){
				_this.selectChange(this.className);
			});

			var _html = _this.getNewOptions(_this.selectArray[0], _this.dataJson);
			_this.selectArray[0].html(_html).prop('disabled', false).trigger('change');

			_this.setDefaultValue();
		};

		// 设置默认值
		cxSelect.setDefaultValue = function(n){
			n = n || 0;

			var _this = this;
			var _value;

			if (n >= _this.selectSum || !_this.selectArray[n]) {return};

			_value = _this.selectArray[n].data('value');

			if (typeof _value === 'string' || typeof _value === 'number' || typeof _value === 'boolean') {
				_value = _value.toString();

				setTimeout(function(){
					_this.selectArray[n].val(_value).trigger('change');
					n++;
					_this.setDefaultValue(n);
				}, 1);
			};
		};

		// 改变选择时的处理
		cxSelect.selectChange = function(name){
			name = name.replace(/ /g,',');
			name = ',' + name + ',';

			var selectValues=[];
			var selectIndex;
			var selectNext;
			var selectData;
			var _html;

			// 获取当前 select 位置、选择值，并清空后面的 select
			for (var i = 0; i < this.selectSum; i++) {
				selectValues.push(this.getIndex(this.selectArray[i].get(0).selectedIndex));

				if (typeof selectIndex === 'number' && i > selectIndex) {
					this.selectArray[i].empty().prop('disabled', true);

					if (this.settings.nodata === 'none') {
						this.selectArray[i].css('display', 'none');
					} else if(this.settings.nodata === 'hidden') {
						this.selectArray[i].css('visibility', 'hidden');
					};
				};

				if (name.indexOf(',' + this.settings.selects[i] + ',') > -1) {
					selectIndex = i;
				};
			};

			// 获取下级的列表数据
			selectNext = selectIndex + 1;
			selectData = this.dataJson;

			for (var i = 0; i < selectNext; i++){
				if (typeof selectData[selectValues[i]]  === 'undefined' || isArray(selectData[selectValues[i]].s) === false || !selectData[selectValues[i]].s.length) {
					return;
				};
				selectData = selectData[selectValues[i]].s;
			};

			// 遍历数据写入下拉选框
			if (this.selectArray[selectNext]) {
				_html = this.getNewOptions(this.selectArray[selectNext], selectData);
				this.selectArray[selectNext].html(_html).prop('disabled', false).css({'display':'', 'visibility':''}).trigger('change');
			};
		};
		
		cxSelect.init();

		return this;
	};

	// 默认值
	$.cxSelect.defaults = {
		selects: [],			// 下拉选框组
		url: null,				// 列表数据文件路径，或设为对象
		nodata: null,			// 无数据状态
		required: false,		// 是否为必选
		firstTitle: '请选择',	// 第一个选项选项的标题
		firstValue: '0'			// 第一个选项的值
	};

	$.fn.cxSelect = function(settings, callback){
		this.each(function(i){
			$.cxSelect(this, settings, callback);
		});
		return this;
	};
}));
