(function (factory) {
    if (typeof define === 'function') {
        // 如果define已被定义，模块化代码
        define('citySelect',['jquery'], function(){
            // 返回构造函数
            return factory
        });
    } else {
        // 如果define没有被定义，正常执行插件代码
        factory(jQuery);
    }
}(function($){
    $.fn.citySelect=function(settings){
        if(this.length<1){return;};

        // 默认值
        settings=$.extend({
            url:"js/city.min.js",
            prov:null,
            city:null,
            dist:null,
            nodata:null,
            required:true
        },settings);

        var box_obj=this;
        var prov_obj=box_obj.find(".prov");
        var city_obj=box_obj.find(".city");
        var dist_obj=box_obj.find(".dist");
        var prov_val=settings.prov;
        var city_val=settings.city;
        var dist_val=settings.dist;
        var select_prehtml=(settings.required) ? "" : "<option value=''>请选择</option>";
        var city_json;

        // 赋值市级函数
        var cityStart=function(){
            var prov_id=prov_obj.get(0).selectedIndex;
            if(!settings.required){
                prov_id--;
            };
            city_obj.empty().attr("disabled",true);
            dist_obj.empty().attr("disabled",true);

            if(prov_id<0||typeof(city_json.citylist[prov_id].childs)=="undefined"){
                if(settings.nodata=="none"){
                    city_obj.css("display","none");
                    dist_obj.css("display","none");
                }else if(settings.nodata=="hidden"){
                    city_obj.css("visibility","hidden");
                    dist_obj.css("visibility","hidden");
                };
                return;
            };
            
            // 遍历赋值市级下拉列表
            temp_html=select_prehtml;
            $.each(city_json.citylist[prov_id].childs,function(i,city){
                temp_html+="<option value='"+city.dmId+"'>"+city.name+"</option>";
            });
            city_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
            distStart();
        };

        // 赋值地区（县）函数
        var distStart=function(){
            var prov_id=prov_obj.get(0).selectedIndex;
            var city_id=city_obj.get(0).selectedIndex;
            if(!settings.required){
                prov_id--;
                city_id--;
            };
            dist_obj.empty().attr("disabled",true);

            if(prov_id<0||city_id<0||typeof(city_json.citylist[prov_id].childs[city_id].name)=="undefined"){
                if(settings.nodata=="none"){
                    dist_obj.css("display","none");
                }else if(settings.nodata=="hidden"){
                    dist_obj.css("visibility","hidden");
                };
                return;
            };
            
            // 遍历赋值市级下拉列表
            temp_html=select_prehtml;
            $.each(city_json.citylist[prov_id].childs[city_id].childs,function(i,dist){
                temp_html+="<option value='"+dist.dmId+"'>"+dist.name+"</option>";
            });
            dist_obj.html(temp_html).attr("disabled",false).css({"display":"","visibility":""});
        };

        var init=function(){
            // 遍历赋值省份下拉列表
            temp_html=select_prehtml;
            $.each(city_json.citylist,function(i,prov){
                temp_html+="<option value='"+prov.dmId+"'>"+prov.name+"</option>";
            });
            prov_obj.html(temp_html);

            // 若有传入省份与市级的值，则选中。（setTimeout为兼容IE6而设置）
            setTimeout(function(){
                if(settings.prov!=null){
                    $("select option:contains('"+settings.prov+"')").attr('selected', true);
                    //prov_obj.val(settings.prov);
                    cityStart();
                    setTimeout(function(){
                        if(settings.city!=null){
                            $("select option:contains('"+settings.city+"')").attr('selected', true);
                            //city_obj.val(settings.city);
                            distStart();
                            setTimeout(function(){
                                if(settings.dist!=null){
                                    $("select option:contains('"+settings.dist+"')").attr('selected', true);
                                    //dist_obj.val(settings.dist);
                                };
                            },1);
                        };
                    },1);
                };
            },1);

            // 选择省份时发生事件
            prov_obj.bind("change",function(){
                cityStart();
            });

            // 选择市级时发生事件
            city_obj.bind("change",function(){
                distStart();
            });
        };

        // 设置省市json数据
        if(typeof(settings.url)=="string"){
            $.getJSON(settings.url,function(json){
                city_json=json;
                init();
            });
        }else{
            city_json=settings.url;
            init();
        };
    };
}));