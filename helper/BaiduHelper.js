//百度地图帮助类
export default {
    /**
     * 根据线段画出线段终结点三角形箭头
     * @param {地图句柄} map 
     * @param {线段对象} polyline 
     * @param {三角边长} length 
     * @param {三角角度} angleValue 
     * @param {距离终结点位置} distance
     * @param {箭头颜色} strokeColor 
     * @param {箭头边长宽度} width
     */
    arrows(map,polyline,length,angleValue,distance,strokeColor,width){
        let arrows=[];
        var linePoint=polyline.getPath();//线的坐标串

        var arrowCount=linePoint.length;
        
        for(var i =1;i<arrowCount;i++){ //在拐点处绘制箭头
            var arrowPoint={x:0,y:0};
            var pixelStart=map.pointToPixel(linePoint[i-1]);
            var pixelEnd=map.pointToPixel(linePoint[i]);
            var angle=angleValue;//箭头和主线的夹角
            var r=length; // r/Math.sin(angle)代表箭头长度
            var delta=0; //主线斜率，垂直时无斜率
            var param=0; //代码简洁考虑
            var pixelTemX,pixelTemY;//临时点坐标
            var pixelX,pixelY,pixelX1,pixelY1;//箭头两个点

            
            //判断箭头点的位置
            if(pixelEnd.x-pixelStart.x==0){//斜率不存在
                arrowPoint.x=pixelEnd.x;
                arrowPoint.y=pixelEnd.y>pixelStart.y?pixelEnd.y-distance:pixelEnd.y+distance;
                pixelEnd=arrowPoint;

            }else if(pixelEnd.y-pixelStart.y==0){
                arrowPoint.x=pixelEnd.x>pixelStart.x?pixelEnd.x-distance:pixelEnd.x+distance;
                arrowPoint.y=pixelEnd.y;
                pixelEnd=arrowPoint;
            }
            else{//存在斜率
                delta=(pixelEnd.y-pixelStart.y)/(pixelEnd.x-pixelStart.x);
                let lineW=Math.sqrt(Math.pow(pixelEnd.y-pixelStart.y,2) + Math.pow(pixelEnd.x-pixelStart.x,2));

                let x= Math.abs((pixelEnd.x-pixelStart.x)/lineW*distance);
                let y= Math.abs((pixelEnd.y-pixelStart.y)/lineW*distance);
                    //判断象限
                if(pixelEnd.x<pixelStart.x && pixelEnd.y>pixelStart.y){//第一象限
                  arrowPoint.x=pixelEnd.x+x;
                  arrowPoint.y=pixelEnd.y-y;
                  pixelEnd=arrowPoint;
                }
                if(pixelEnd.x>pixelStart.x && pixelEnd.y>pixelStart.y){//第二象限
                   arrowPoint.x=pixelEnd.x-x;
                   arrowPoint.y=pixelEnd.y-y;
                   pixelEnd=arrowPoint;
                }
                if(pixelEnd.x>pixelStart.x && pixelEnd.y<pixelStart.y){//第三象限
                    arrowPoint.x=pixelEnd.x-x;
                    arrowPoint.y=pixelEnd.y+y;
                    pixelEnd=arrowPoint;
                }
                if(pixelEnd.x<pixelStart.x && pixelEnd.y<pixelStart.y){//第四象限
                    arrowPoint.x=pixelEnd.x+x;
                    arrowPoint.y=pixelEnd.y+y;
                    pixelEnd=arrowPoint;
                }
            }
            
            //获取箭头三个点位置
            if(pixelEnd.x-pixelStart.x==0){ //斜率不存在是时
                pixelTemX=pixelEnd.x;
                if(pixelEnd.y>pixelStart.y)
                {
                    pixelTemY=pixelEnd.y-r;
                }
                else
                {
                    pixelTemY=pixelEnd.y+r;
                }    
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX=pixelTemX-r*Math.tan(angle); 
                pixelX1=pixelTemX+r*Math.tan(angle);
                pixelY=pixelY1=pixelTemY;
            }else  //斜率存在时
            {
                delta=(pixelEnd.y-pixelStart.y)/(pixelEnd.x-pixelStart.x);
                param=Math.sqrt(delta*delta+1);

                if((pixelEnd.x-pixelStart.x)<0) //第二、三象限
                {
                    pixelTemX=pixelEnd.x+ r/param;
                    pixelTemY=pixelEnd.y+delta*r/param;
                }
                else//第一、四象限
                {
                    pixelTemX=pixelEnd.x- r/param;
                    pixelTemY=pixelEnd.y-delta*r/param;
                }
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX=pixelTemX+ Math.tan(angle)*r*delta/param;
                pixelY=pixelTemY-Math.tan(angle)*r/param;

                pixelX1=pixelTemX- Math.tan(angle)*r*delta/param;
                pixelY1=pixelTemY+Math.tan(angle)*r/param;
            }

            var pointArrow=map.pixelToPoint(new BMap.Pixel(pixelX,pixelY));
            var pointArrow1=map.pixelToPoint(new BMap.Pixel(pixelX1,pixelY1));
            
            var arrowCenterPointer=arrowPoint.x!=0?map.pixelToPoint(new BMap.Pixel(arrowPoint.x,arrowPoint.y)):map.pixelToPoint(new BMap.Pixel(pixelEnd.x,pixelEnd.y));
            var Arrow = new BMap.Polyline([
                pointArrow,
                arrowCenterPointer,
                pointArrow1
            ], {strokeColor:strokeColor || "green", strokeWeight:width || 5, strokeOpacity:1});

            arrows.push(Arrow);
        }

        return arrows;
    },
    /**
     * 根据线段画出线段终间间隔的三角形箭头
     * @param {地图句柄} map 
     * @param {线段对象} polyline 
     * @param {三角边长} length 
     * @param {三角角度} angleValue 
     * @param {距离终结点位置} distance
     * @param {箭头颜色} strokeColor 
     * @param {箭头边长宽度} width
     * @param {每个箭头之间的距离} step
     */
    stepArrows(map,polyline,length,angleValue,distance,strokeColor,width,step){
        let arrows=[];
        let linePoints=polyline.getPath();//线的坐标串
        for(let i=1;i<linePoints.length;i++){
            let pixelStart=map.pointToPixel(linePoints[i-1]);
            let pixelEnd=map.pointToPixel(linePoints[i]);
            let lineW=Math.sqrt(Math.pow(pixelEnd.y-pixelStart.y,2) + Math.pow(pixelEnd.x-pixelStart.x,2));//两点线长度
            for(let j=0;j<lineW;j+=step){
                let arrowDis=j + distance;

                if(arrowDis+distance<lineW){
                    arrows.push(this.arrows(map,polyline,length,angleValue,arrowDis,strokeColor,width));
                }
            }
        }

        return _.flatten(arrows);
    }
}