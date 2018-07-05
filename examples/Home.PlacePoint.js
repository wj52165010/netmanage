//首页场所在离线秒点
import { Get_Place_Count,SiteMapData} from '../store/mutation-types'
import * as d3 from 'd3'

let photo={
    '网吧在线':'static/images/site_online.png',
    '网吧离线':'static/images/site_unline.png',
    '非经在线':'static/images/hotal_online.png',
    '非经离线':'static/images/hotal_unline.png',
    '无线采集在线':'static/images/wifi_online.png',
    '无线采集离线':'static/images/wifi_unline.png'
};

export default class PlacePoint {
    /**
     * @param {地图对象} map 
     * @param {数据仓库对象} store 
     */
    constructor(map,store){
        this.map=map;
        this.store=store;
        this.marks=[];
        this.cachePlace={};
        this.cacheData={};
        this.labels={};
        this.colorScale=(val)=>{
            let scale= d3.scaleSequential(d3.interpolateCool);
            let num=d3.scaleLinear().domain([0,5000]).range([0,1]);
           return scale(num(val));
        }

        this.clus=this.MarkerClusterer();
    }
    
    AddMarker(){
        return new Promise((resolve,reject)=>{
            let s=this,map=this.map;
            let zoom = map.getZoom();
            if(zoom<15){
                this.store.dispatch(Get_Place_Count).then(res=>{
                    
                    this.ClearMarkers();

                    if(res.biz_body.length<=0){tool.info('暂无数据!');return;}

                    let data=_.filter(res.biz_body,r=>r.latitude);
                    for(let i=0;i<data.length;i++){
                        let item=data[i],point=new BMap.Point(item.longitude, item.latitude);
                        var label= new BMap.Label(`<div class="pulse placeCount" style="background-color:${s.colorScale(item.count)};">
                                                        <div style="padding-top:20px;">${item.name}</div>
                                                        <div>${item.count}</div>
                                                    </div>`,
                            {position:point, offset:new BMap.Size(0, 0)});
                            label.setStyle({
                                fontSize : "12px",
                                lineHeight : "20px",
                                fontFamily:"微软雅黑",
                                fontWeight:'400',
                                border:'0px solid black',
                                'background-color':'transparent',
                                'max-width':'none'
                            });
                        
                        s.marks.push(label);
                        map.addOverlay(label);
                    }

                    resolve(data);
                });
            }else{
                _.each(this.marks,m=>{
                    this.map.removeOverlay(m);
                });
                
                this.AddClusterer().then(res=>{
                    resolve(res);
                });
                
            }
        });
    }

    /**
     * 添加聚合遮罩
     * 
     */
    AddClusterer(){
        return new Promise((resolve,reject)=>{                 
            let s=this;
            let map=this.map;
            let bounds=s.map.getBounds();
            let lb=bounds.getSouthWest(),rt=bounds.getNorthEast();

            this.store.dispatch(SiteMapData,{lb,rt}).then(res=>{
                let data = res.biz_body;
                let tempMarker = [];

                if(res.biz_body.length<=0){tool.info('暂无数据!');return;}

                for (var i = 0; i < data.length; i++) {
                    if (s.cachePlace[data[i]['netbar_wacode']]) {
                        continue;
                    }
                    s.cachePlace[data[i]['netbar_wacode']] = data[i];

                    s.cacheData[parseFloat(data[i].longitude)+'-'+parseFloat(data[i].latitude)]=data[i];

                    var myIcon = new BMap.Icon(photo[data[i].netbar_type+data[i].online], new BMap.Size(28,36));

                    var marker=new BMap.Marker(new BMap.Point(data[i].longitude, data[i].latitude),{icon:myIcon});
                    //添加数遍移上/移下事件(添加描述遮罩)
                    var marker_triangle_html='<div class="triangle pulse" style="background-color:rgb(0, 204, 102);color: white;padding: 0px 10px;border-radius: 5px;min-width:140px;padding:5px 10px;">{0}</div>';
                    var posSearchHtml=function(data){
                        var result='';
                        var template='<div>{0}&nbsp;&nbsp;:&nbsp;&nbsp;{1}</div>';
                        result+=Fx.format(template,'全称',data.netbar_name || '');
                        result+=Fx.format(template,'地址',data.netbar_address || '');
                        result+=Fx.format(template,'状态',data.online || '');
                        result+=Fx.format(template,'类型',(data.netbar_type || '').replace('非经','宾馆酒店'));
                        result+=Fx.format(template,'编码',data.netbar_wacode || '');

                        return result;
                    };
                    
                    marker.addEventListener("mouseover",function(e){
                        
                            var point=e.target.point;
                            $('.BMapLabel').parent('div').css('z-index',10000);

                            if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                            var label= new BMap.Label(Fx.format(marker_triangle_html,posSearchHtml(s.cacheData[point.lng+'-'+point.lat])),{position:point, offset:new BMap.Size(-70, -150)});
                            label.setStyle({
                            fontSize : "12px",
                            lineHeight : "20px",
                            fontFamily:"微软雅黑",
                            fontWeight:'600',
                            border:'0px solid black',
                            'background-color':'transparent',
                            'max-width':'none'
                            });
                            map.addOverlay(label);
                            s.labels[point.lng+'-'+point.lat]=label;
                    });
                    marker.addEventListener("mouseout",function(e){
                        $('.BMapLabel').parent('div').css('z-index',500);
                        var point=e.target.point;
                        if(!s.cacheData[point.lng+'-'+point.lat]){return;}
                        var label=s.labels[point.lng+'-'+point.lat];
                        map.removeOverlay(label);
                        delete s.labels[point.lng+'-'+point.lat];
                    });

                   
                    tempMarker.push(marker);
                }

                s.clus.addMarkers(tempMarker);

                resolve(data);
            })
        });
    }

    /**
     * 聚合遮罩 
     */
    MarkerClusterer(){
        return new BMapLib.MarkerClusterer(this.map, {markers:[]});
    }
    
    /**
     * 清除遮罩物
     */
    ClearMarkers(){
        if(this.clus){this.clus.clearMarkers();this.cachePlace={};this.cacheData={};}
        _.each(this.labels,m=>{
            this.map.removeOverlay(m);
        });
        this.labels={};
        this.map.clearOverlays();
    }
}
