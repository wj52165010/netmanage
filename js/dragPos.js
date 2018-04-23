//拖动元素调换位置(排序)
let Drag=function(el,options){
    options=$.extend({},options ||{});
    let dragDoms=null,
        triggerDoms=null,
        appendDom=null,
        dragDom=null,
        nearEl=null;
    let blnDrag=false;
    let Position=function(x,y){this.x=x;this.y=y;} 
    let oldPos=new Position();
    let oldPoi=new Position();

    let init=function(){
        let dragDomSel=options.dragDomSel,
            triggerDomSel=options.triggerDomSel || options.dragDomSel;

        dragDoms = $(el).find(dragDomSel);
        triggerDoms=$(el).find(triggerDomSel);

        regEvent();
    }

    let regEvent=function(){
       
        $(el).on('mousedown',options.triggerDomSel || options.dragDomSel,function(e){
            let dom =$(e.target || e.srcElement);
            if(!dom) return;

            let parentDom=$('body');
            
            dragDom = dom.parents(options.dragDomSel);
            appendDom =$('<div></div>');

         
            appendDom.addClass('dragDomItem');
            appendDom.css({'position':'absolute',
                        top:dragDom.offset().top+'px',
                        left:dragDom.offset().left+'px',
                        'border':'2px dashed black',
                        width:dragDom.width()+'px',
                        height:dragDom.height()+'px',
                        'background-color':'white',
                        'cursor':'pointer'
                        });
            appendDom.appendTo(parentDom);
            oldPoi.x = e.clientX ;
            oldPoi.y = e.clientY ;
            blnDrag=true;
        });

        $(document).mousemove(function(e){
            if(!appendDom)return;
            if(!blnDrag) return;
            var left = e.clientX;
            var top =  e.clientY;
            appendDom.css({
                left:left,
                top:top
            });

            decidePos();
        });

        $(document).mouseup(function(){
            blnDrag=false;
            if(!appendDom) return;
            appendDom.remove();
            appendDom=null;
            let childs=$(el).find(options.dragDomSel);
            childs.css({'border':'none'});

            if(options.posChange && dragDom && nearEl){
                options.posChange(dragDom,nearEl.el);
            }

            dragDom=null;
            nearEl=null;
        });
    }

    //判断当前拖动元素是否进入其他元素范围类
    let decidePos=function(){
        let childs=$(el).find(options.dragDomSel);
        let dragPos={
            left:appendDom.offset().left,
            top:appendDom.offset().top,
            height:appendDom.height(),
            width:appendDom.width()
        };

        let childsPos=_.map(childs,c=>{
            let offset=$(c).offset()
            return {
              left:offset.left,
              top:offset.top,
              height:$(c).height(),
              width:$(c).width(),
              el:$(c)
            } 
        });


        nearEl=null,minDistance=-1;
        for(let i=0;i<childsPos.length;i++){
            let pos=childsPos[i];
            let distance = Math.pow(pos.left-dragPos.left,2)+Math.pow(pos.top-dragPos.top,2);
            if(minDistance<0){
                minDistance = distance;
                nearEl=pos;
            }else{
                nearEl=distance<minDistance?pos:nearEl;
                minDistance = distance<minDistance?distance:minDistance;
            }
        }

        childs.css({'border':'none'});
        nearEl.el.css({
            border:'1px dashed gray'
        });
    }


    init();
};

$.fn.extend({
    dragpos: function(options) {
        return new Drag(this,options);
    }
 });