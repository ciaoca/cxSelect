/*!
 * jQuery cxSelect
 * @name jquery.cxselect.js
 * @version 1.3.9
 * @date 2016-01-06
 * @author ciaoca
 * @email ciaoca@gmail.com
 * @site https://github.com/ciaoca/cxSelect
 * @license Released under the MIT license
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto || window.$);
  };
}(function($) {
  $.cxSelect = function() {
    var cxSelect = {
      dom: {},
      api: {}
    };

    cxSelect.init = function() {
      var self = this;
      var _settings;

      // 检测是否为 DOM 元素
      var _isElement = function(o) {
        if(o && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && o instanceof HTMLElement) {
          return true;
        } else {
          return (o && o.nodeType && o.nodeType === 1) ? true : false;
        };
      };

      // 检测是否为 jQuery 对象
      var _isJquery = function(o) {
        return (o && o.length && (typeof jQuery === 'function' || typeof jQuery === 'object') && o instanceof jQuery) ? true : false;
      };

      // 分配参数
      for (var i = 0, l = arguments.length; i < l; i++) {
        if (_isJquery(arguments[i])) {
          self.dom.box = arguments[i];
        } else if (_isElement(arguments[i])) {
          self.dom.box = $(arguments[i]);
        } else if (typeof arguments[i] === 'object') {
          _settings = arguments[i];
        };
      };

      if (!self.dom.box.length) {return};

      self.settings = $.extend({}, $.cxSelect.defaults, _settings, {
        url: self.dom.box.data('url'),
        nodata: self.dom.box.data('nodata'),
        required: self.dom.box.data('required'),
        firstTitle: self.dom.box.data('firstTitle'),
        firstValue: self.dom.box.data('firstValue'),
        jsonSpace: self.dom.box.data('jsonSpace'),
        jsonName: self.dom.box.data('jsonName'),
        jsonValue: self.dom.box.data('jsonValue'),
        jsonSub: self.dom.box.data('jsonSub')
      });

      var _dataSelects = self.dom.box.data('selects');

      if (typeof _dataSelects === 'string' && _dataSelects.length) {
        self.settings.selects = _dataSelects.split(',');
      };

      // 未设置选择器组
      if (!$.isArray(self.settings.selects) || !self.settings.selects.length) {return};

      self.selectArray = [];

      var _tempSelect;

      for (var i = 0, l = self.settings.selects.length; i < l; i++) {
        _tempSelect = self.dom.box.find('select.' + self.settings.selects[i]);

        if (!_tempSelect) {break};

        // 保存默认值
        if (typeof _tempSelect.val() === 'string' && _tempSelect.val().length) {
          _tempSelect.attr('data-value', _tempSelect.val());
        };

        self.selectArray.push(_tempSelect);
      };

      // 设置的选择器组不存在
      if (!self.selectArray.length) {return};

      self.dom.box.on('change', 'select', function() {
        self.selectChange(this.className);
      });

      // 无整合数据，选项接口数据独立
      if (!self.settings.url) {
        self.start();

      // 设置 URL，通过 Ajax 获取数据
      } else if (typeof self.settings.url === 'string' && self.settings.url.length) {
        $.getJSON(self.settings.url, function(json) {
          self.start(json);
        });

      // 设置自定义数据
      } else if (typeof self.settings.url === 'object') {
        self.start(self.settings.url);
      };
    };

    cxSelect.getIndex = function(n) {
      return (this.settings.required) ? n : n - 1;
    };

    cxSelect.start = function(data) {
      var self = this;
      var _jsonSpace = self.settings.jsonSpace;

      self.dataJson = undefined;

      if (data && typeof data === 'object') {
        self.dataJson = data;

        if (typeof _jsonSpace === 'string' && _jsonSpace.length) {
          var _space = _jsonSpace.split('.');

          for (var i = 0, l = _space.length; i < l; i++) {
            self.dataJson = self.dataJson[_space[i]];
          };
        };
      };

      if (self.dataJson || (typeof self.selectArray[0].data('url') === 'string' && self.selectArray[0].data('url').length)) {
        self.getOptionData(0);
      } else {
        self.selectArray[0].prop('disabled', false).css({
          'display': '',
          'visibility': ''
        });
      };
    };

    // 改变选择时的处理
    cxSelect.selectChange = function(name) {
      if (typeof name !== 'string' || !name.length) {return};

      name = name.replace(/\s+/g, ',');
      name = ',' + name + ',';

      var _index;

      // 获取当前 select 位置
      for (var i = 0, l = this.selectArray.length; i < l; i++) {
        if (name.indexOf(',' + this.settings.selects[i] + ',') > -1) {
          _index = i;
        };
      };

      if (typeof _index === 'number') {
        _index += 1;
        this.getOptionData(_index);
      };
    };

    // 获取选项数据
    cxSelect.getOptionData = function(index, opt) {
      var self = this;

      if (typeof index !== 'number' || isNaN(index) || index < 0 || index >= self.selectArray.length) {return};

      var _indexPrev = index - 1;
      var _select = self.selectArray[index];
      var _selectIndex;
      var _selectData;
      var _valueIndex;
      var _query = {};
      var _dataUrl = _select.data('url');
      var _jsonSpace = typeof _select.data('jsonSpace') === 'undefined' ? self.settings.jsonSpace : _select.data('jsonSpace');
      var _queryName;
      var _selectName;

      // 清空后面的 select
      for (var i = 0, l = self.selectArray.length; i < l; i++) {
        if (i >= index) {
          self.selectArray[i].empty().prop('disabled', true);

          if (self.settings.nodata === 'none') {
            self.selectArray[i].css('display', 'none');

          } else if(self.settings.nodata === 'hidden') {
            self.selectArray[i].css('visibility', 'hidden');
          };
        };
      };

      if (typeof _dataUrl === 'string' && _dataUrl.length) {
        if (_indexPrev >= 0) {
          if (!self.selectArray[_indexPrev].val().length) {return};

          _queryName = _select.data('queryName');
          _selectName = self.selectArray[_indexPrev].attr('name');

          if (typeof _queryName === 'string' && _queryName.length) {
            _query[_queryName] = self.selectArray[_indexPrev].val();
          } else if (typeof _selectName === 'string' && _selectName.length) {
            _query[_selectName] = self.selectArray[_indexPrev].val();
          };

        };

        $.getJSON(_dataUrl, _query, function(json) {
          _selectData = json;

          if (typeof _jsonSpace === 'string' && _jsonSpace.length) {
            var _space = _jsonSpace.split('.');

            for (var i = 0, l = _space.length; i < l; i++) {
              _selectData = _selectData[_space[i]];
            };
          };

          self.buildOption(_select, _selectData);
        });

      } else if (self.dataJson && typeof self.dataJson === 'object') {
        _selectData = self.dataJson;

        for (var i = 0, l = self.selectArray.length; i < l; i++) {
          if (i < index) {
            _valueIndex = self.getIndex(self.selectArray[i][0].selectedIndex);

            if (typeof _selectData[_valueIndex] === 'object' && $.isArray(_selectData[_valueIndex][self.settings.jsonSub]) && _selectData[_valueIndex][self.settings.jsonSub].length) {
              _selectIndex = i;
              _selectData = _selectData[_valueIndex][self.settings.jsonSub];
            }
          };
        };

        if (_indexPrev < 0 || _indexPrev === _selectIndex) {
          self.buildOption(_select, _selectData);
        };
      }
    };

    // 构建选项列表
    cxSelect.buildOption = function(select, data) {
      var self = this;
      var _firstTitle = typeof select.data('firstTitle') === 'undefined' ? self.settings.firstTitle : String(select.data('firstTitle'));
      var _firstValue = typeof select.data('firstValue') === 'undefined' ? self.settings.firstValue : String(select.data('firstValue'));
      var _jsonName = typeof select.data('jsonName') === 'undefined' ? self.settings.jsonName : String(select.data('jsonName'));
      var _jsonValue = typeof select.data('jsonValue') === 'undefined' ? self.settings.jsonValue : String(select.data('jsonValue'));

      if (!$.isArray(data)) {return};

      var _html = !self.settings.required ? '<option value="' + _firstValue + '">' + _firstTitle + '</option>' : '';

      // 区分标题或值的数据
      if (_jsonName.length) {
        // 无值字段时使用标题作为值
        if (!_jsonValue.length) {
          _jsonValue = _jsonName;
        };

        for (var i = 0, l = data.length; i < l; i++) {
          _html += '<option value="' + String(data[i][_jsonValue]) + '">' + String(data[i][_jsonName]) + '</option>';
        };

      // 数组即为值的数据
      } else {
        for (var i = 0, l = data.length; i < l; i++) {
          _html += '<option value="' + String(data[i]) + '">' + String(data[i]) + '</option>';
        };
      };

      select.html(_html).prop('disabled', false).css({
        'display': '',
        'visibility': ''
      });

      // 初次加载设置默认值
      if (typeof select.data('value') !== 'undefined') {
        select.val(String(select.data('value'))).removeAttr('data-value');
      };

      select.trigger('change');
    };
    
    cxSelect.init.apply(cxSelect, arguments);

    return this;
  };

  // 默认值
  $.cxSelect.defaults = {
    selects: [],            // 下拉选框组
    url: null,              // 列表数据文件路径（URL）或数组数据
    nodata: null,           // 无数据状态显示方式
    required: false,        // 是否为必选
    firstTitle: '请选择',    // 第一个选项选项的标题
    firstValue: '',         // 第一个选项的值
    jsonSpace: '',          // 数据命名空间
    jsonName: 'n',          // 数据标题字段名称
    jsonValue: '',          // 数据值字段名称
    jsonSub: 's'            // 子集数据字段名称
  };

  $.fn.cxSelect = function(settings, callback) {
    this.each(function(i) {
      $.cxSelect(this, settings, callback);
    });
    return this;
  };
}));
