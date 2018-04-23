//地图画点
export default class DrowPoint {
    constructor(map){
        this.map=map;
    }

    draw(data){
        let map=this.map;
        _.each(data,d=>{
            let point = new BMap.Point(d.equipment_longitude, d.equipment_latitude);
            let marker = new BMap.Marker(point);  // 创建标注
            map.addOverlay(marker);               // 将标注添加到地图中
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
            
        });
        
    }

    clear(){
        this.map.clearOverlays();
    }
}