//热力图

import {baiduMapLayer,utilCityCenter,DataSet} from 'mapv'
export default class HeardMap {
    constructor(map,opt){
        this.map=map;

        var options = {
            size: 13,
            gradient: { 0.25: "rgb(0,0,255)", 0.55: "rgb(0,255,0)", 0.85: "yellow", 1.0: "rgb(255,0,0)"},
            max: 10,
            draw: 'heatmap',
            methods: { // 一些事件回调函数
                click:function(item){
                    if(!opt.click) return;
                    opt.click(item);
                }
            },
        }

        this.dataSet =new DataSet([]);
        this.mapv = new baiduMapLayer(map, this.dataSet, options);
    }

    draw(d,blnPoint){
        let map=this.map;
        var randomCount = 300;

        var data = [];

       for(let key in d){
           let c=d[key];
           data.push({
                geometry: {
                    type: 'Point',
                    coordinates: [key.split('_')[0], key.split('_')[1]]
                },
                count: c.length,
                data:c
            });

            if(blnPoint){
                let point = new BMap.Point(key.split('_')[0], key.split('_')[1]);
                let marker = new BMap.Marker(point);  // 创建标注
                map.addOverlay(marker);               // 将标注添加到地图中
            }
       }

        this.dataSet.set(data);
        this.mapv.show();
    }
    
    hidden(){
        this.mapv.hide();
    }

    destroy(){
        this.mapv.destroy();
    }
}