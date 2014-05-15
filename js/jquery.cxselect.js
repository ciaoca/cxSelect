/*!
 * cxSelect 1.3.2
 * http://code.ciaoca.com/
 * https://github.com/ciaoca/cxSelect
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2013-05-15
 */
(function($){
	$.fn.cxSelect = function(settings){
		
		var cxSelect = {
			settings : $.extend({}, $.cxSelect.defaults, settings),
			dom : {
				box : this
			}
		};
		
		cxSelect.init = function(){
			var _this = this;

			// 父容器不存在、未设置选择器组
			if (!_this.dom.box.length) {return};
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

		// 兼容旧浏览器的方法 
		cxSelect.isArray = function(value){
			if (typeof Array.isArray === "function") {
				return Array.isArray(value);
			} else {
				return Object.prototype.toString.call(value) === "[object Array]";
			}
		}

		cxSelect.getIndex = function(n){
			return (this.settings.required) ? n : n - 1;
		};

		// 获取下拉框内容
		cxSelect.getNewOptions = function(elemJquery, json){
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

			$.each(json, function(i, v){
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
				if (typeof selectData[selectValues[i]]  === 'undefined' || this.isArray(selectData[selectValues[i]].s) === false || !selectData[selectValues[i]].s.length) {
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
	};

	// 默认值
	$.cxSelect = {
		defaults : {
			selects : [],			// 下拉选框组
			url : null,				// 列表数据文件路径（josn 格式）
			nodata : null,			// 无数据状态
			required : false,		// 是否为必选
			firstTitle : '请选择',	// 下拉选框的标题
			firstValue : '0'		// 下拉选框的值
		}
	};
})(jQuery);