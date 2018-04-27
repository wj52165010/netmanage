//拖动排序插件(需要重新布局拖动元素)

let Drag=function(el,options){
        let cW=el.width();//容器宽度
        let cH=0;//容器高度
        let childs =null;
        let setting=$.extend({columns:3},options ||{});
        let pos=[];
        let Position=function(x,y){this.x=x;this.y=y;} 
        let oldPos=new Position();
        let oldPoi=new Position();
        let isDrag=false;
        let curItem=null;
        let replaceIndex=null;//替换位置的元素索引
        let dragIndex=null;//拖动元素索引
        let dragDistan=0;//拖拽距离
        //初始化拖动元素位置
        let initPos=function(){
            cW=el.width();//容器宽度
            pos=[];
            let row=0;//行数
            childs=el.children('div[class!="clearfix"]');
            let iH=$(childs[0]).height(); //拖动项高度
            cH=0;
            el.css({
                position:'relative',
                height:'0px'
            })
            _.each(childs,((e,i)=>{
                let el = $(e),w=el.width(),h=el.height(),ops=setting;
                let column=i%ops.columns;
                if(column<ops.columns){
                    let posItem={
                        x:column*w,
                        y:row*h,
                        w:w,
                        h:h,
                        el:el
                    };
                    el.css({
                        position:'absolute',
                        top:posItem.y,
                        left:posItem.x
                    });

                    pos.push(posItem);
                }
      
                if(column==(ops.columns-1) && i<(childs.length-1)){
                    row++;
                }
            }));
            cH=(row+1)*iH+2;
            //设置容器样式
            el.css({
                position:'relative',
                height:cH+'px'
            })
        };

        //比较当前拖动节点所在位置
        let compare=function(curPos,curEl){
            dragIndex = _.findIndex(pos,p=>{return p.el.is(curEl)});
            let distances=[];//拖动节点相对其他节点的距离
            _.each(pos,(p,index)=>{
                if(index!=dragIndex){
                    let tmp={index:-1,distance:0};
                    //判断拖动元素是否进入其他元素(中间部位)
                    //左上角进入
                    if(curPos.x>p.x && curPos.x<(p.x+p.w/2) && curPos.y>p.y && curPos.y<(p.y+p.h/2)){
                        tmp={index:index,distance:Math.pow(curPos.x-p.x,2)+Math.pow(curPos.y-p.y,2)}
                        distances.push(tmp);
                    }
                    //右上角进入
                    if((curPos.x+curPos.w)<(p.x+p.w) && (curPos.x+curPos.w) > (p.x+p.w/2) && curPos.y>p.y && curPos.y<(p.y+p.h/2)){
                        tmp={index:index,distance:Math.pow((curPos.x+curPos.w)-(p.x+p.w),2)+Math.pow(curPos.y-p.y,2)}
                        distances.push(tmp);
                    }
                    //左下角进入
                    if(curPos.x>p.x && curPos.x<(p.x+p.w/2) && (curPos.y+curPos.h) >(p.y+p.h/2) && (curPos.y+curPos.h)<(p.y+p.h)){
                        tmp={index:index,distance:Math.pow(curPos.x-p.x,2)+Math.pow((p.y+p.h)-(curPos.y+curPos.h),2)}
                        distances.push(tmp);
                    }
                    //右下角进入
                    if((curPos.x+curPos.w)<(p.x+p.w) && (curPos.x+curPos.w) > (p.x+p.w/2) && (curPos.y+curPos.h) >(p.y+p.h/2) && (curPos.y+curPos.h)<(p.y+p.h) ){
                        tmp={index:index,distance:Math.pow((curPos.x+curPos.w)-(p.x+p.w),2)+Math.pow((curPos.y+curPos.h)-(p.y+p.h),2)}
                        distances.push(tmp);
                    }
                }
            });

            //获取最小值
            let minDistance=null;
            for(let i=0;i<distances.length;i++){
                if(!minDistance){minDistance=distances[i];continue;}
                if(distances[i].distance>minDistance.distance){continue;}
                minDistance=distances[i];
            }
            if(minDistance){
                replaceIndex=minDistance.index;
                _.each(pos,p=>{$(p.el).removeClass('menuReplace')})
                $(pos[replaceIndex].el).addClass('menuReplace');
            }else{
                 _.each(pos,p=>{$(p.el).removeClass('menuReplace')})
                replaceIndex=null;
            }   
        };
        //注册拖动元素相关事件
        let regEvent=function(){
            $(childs).mousedown(function(e){
                e.preventDefault();
                oldPos.x = $(this).position().left ;
                oldPos.y =  $(this).position().top ;
                oldPoi.x = e.clientX ;
                oldPoi.y = e.clientY ;
                curItem=this;
                isDrag=true;
                dragDistan=0;
            });

            //鼠标移动事件
            $(document).mousemove(function(e){
                if(!isDrag ){return;}
                if(!Math.pow(dragDistan,2)){
                    dragDistan =e.clientX;

                    return;
                }
                else{
                    dragDistan=dragDistan-e.clientX;
                }

                if(Math.pow(dragDistan,2)<25){return;}

                $(curItem).css({
                    'position':'absolute',
                    'opacity':'0.8',
                    'z-index':'99999'
                });
                var left = e.clientX - oldPoi.x + oldPos.x ;
                var top =  e.clientY - oldPoi.y + oldPos.y ;
                var h=$(curItem).height();
                var w=$(curItem).width();
                let posItem={x:left,y:top,h:h,w:w};
                compare(posItem,$(curItem));


                $(curItem).css({
                    left:left,
                    top:top
                });

                if(setting.remove){
                    setting.remove();
                }
            });

            //鼠标放下事件
            $(document).mouseup(function(){
                isDrag=false;
                dragDistan=0;
                if(dragIndex==null && replaceIndex==null){ return;}
                if(curItem==null){return;}
                if(replaceIndex==null){
                    $(curItem).css({top:pos[dragIndex].y,left:pos[dragIndex].x});
                }else{
                    $(pos[replaceIndex].el).removeClass('menuReplace');
                    let dragEl=pos[dragIndex].el,
                        dragPos={
                            x:pos[dragIndex].x,
                            y:pos[dragIndex].y,
                            h:pos[dragIndex].h,
                            w:pos[dragIndex].w
                        },
                        replaceEl=pos[replaceIndex].el,
                        replacePos={
                            x:pos[replaceIndex].x,
                            y:pos[replaceIndex].y,
                            h:pos[replaceIndex].h,
                            w:pos[replaceIndex].w
                        };

                    dragEl.css({top:replacePos.y,left:replacePos.x});
                    replaceEl.css({top:dragPos.y,left:dragPos.x});

                    pos[dragIndex].el=replaceEl;
                    pos[replaceIndex].el=dragEl;
                }

                $(curItem).css('z-index',0);
                dragIndex=null;
                replaceIndex=null;
                curItem=null;
                dragDistan=0;

                if(setting.mouseup){
                    setting.mouseup(_.pluck(pos,'el'));
                }

            });
        };


        this.reload=function(){
            initPos();
            $(childs).mousedown(function(e){
                e.preventDefault();
                oldPos.x = $(this).position().left ;
                oldPos.y =  $(this).position().top ;
                oldPoi.x = e.clientX ;
                oldPoi.y = e.clientY ;
                curItem=this;
                isDrag=true;
            });
        };
        //初始化控件相关对象
        let init=function(){
            initPos();
            regEvent();
        };
        init();
     };

 $.fn.extend({
    dragsort: function(options) {
        return new Drag(this,options);
    }
 });