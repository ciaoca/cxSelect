/*!
 * cxSelect 1.2
 * http://code.ciaoca.com/
 * https://github.com/ciaoca/cxSelect
 * E-mail: ciaoca@gmail.com
 * Released under the MIT license
 * Date: 2013-07-10
 */
(function($){
	$.fn.cxSelect=function(settings){
		if(this.length<1){return;};
		settings=$.extend({},$.cxSelect.defaults,settings);
		if(!settings.selects.length){return;};

		var box_obj=this;
		var select_arr=[];
		var select_sum=settings.selects.length;
		var data_json;
		var temp_html;

		var getIndex=function(n){
			return (settings.required) ? n : n-1;
		};

		// 获取下拉框内容
		var getNewOption=function(json,title){
			var _title=title||"请选择";
			var _html;

			if(!settings.required){
				_html="<option value='0'>"+_title+"</option>";
			};

			$.each(json,function(i,v){
				if(typeof(v.v)=="undefined"||!v.v){
					_html+="<option value='"+v.n+"'>"+v.n+"</option>";
				}else{
					_html+="<option value='"+v.v+"'>"+v.n+"</option>";
				};
			});

			return _html;
		};
		
		// 初始化
		var init_val=[];

		var init=function(){
			for(var i=0;i<select_sum;i++){
				select_arr.push(box_obj.find("select."+settings.selects[i]));
			};

			// 遍历数据写入第一个下拉选框
			temp_html=getNewOption(data_json,select_arr[0].data("title"));
			select_arr[0].html(temp_html);

			for(var i=0;i<select_sum;i++){
				if(select_arr[i].data("val")){
					init_val.push(i);
				}else if(select_arr[i].attr("disabled")){
					if(settings.nodata=="none"){
						select_arr[i].css("display","none");
					}else if(settings.nodata=="hidden"){
						select_arr[i].css("visibility","hidden");
					};
				};
			};
			box_obj.delegate("select","change",function(){
				selectChange(this.className);
			});
			
			init_timeout();
		};

		var init_timeout=function(n){
			if(!init_val.length){return;};
			var _n=n||0;
			if(_n<init_val.length){
				setTimeout(function(){
					select_arr[_n].val(select_arr[_n].data("val")).trigger("change");
					_n++;
					init_timeout(_n);
				},1);
			};
		};

		// 改变选择时
		var selectChange=function(name){
			var select_val=[];
			var select_index;
			var select_next;
			var select_data;

			// 获取当前 select 的位置
			for(var i=0;i<select_sum;i++){
				select_val.push(getIndex(select_arr[i].get(0).selectedIndex));

				if(select_index||i>select_index){
					select_arr[i].empty().attr("disabled",true);
					if(settings.nodata=="none"){
						select_arr[i].css("display","none");
					}else if(settings.nodata=="hidden"){
						select_arr[i].css("visibility","hidden");
					};
				};
				
				if(name.indexOf(settings.selects[i])>-1){
					select_index=i;
				};
			};

			// 获取下级的列表数据
			select_next=select_index+1;
			select_data=data_json;
			for(var i=0;i<select_next;i++){
				if(typeof(select_data[select_val[i]])=="undefined"||!select_data[select_val[i]].s||!select_data[select_val[i]].s.length){
					return;
					break;
				};
				select_data=select_data[select_val[i]].s;
			};

			// 遍历数据写入下拉选框
			if(select_arr[select_next]){
				temp_html=getNewOption(select_data,select_arr[select_next].data("title"));
				select_arr[select_next].html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
			};
		};

		// 获取数据，初始化
		$.getJSON(settings.url,function(json){
			data_json=json;
			init();
		});
	};
	
	// 默认值
	$.cxSelect={defaults:{
		url:"js/city.js",	// 列表数据文件路径（josn格式）
		selects:[],			// 下拉选框组
		nodata:null,		// 无数据状态
		required:false		// 是否为必选
	}};
})(jQuery);