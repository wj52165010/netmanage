//菜单按钮d3构造函数

import * as d3 from 'd3'
import drag from './drag'

class MenuBtn{
    /****************
    /*h:按钮容器高度
    /*w:按钮容器宽度
    /*data:菜单数据
    *****************/
    constructor(h,w,data){
        this.container={width:300,height:300};
        this.menus=data;
        this.height=h || 0,this.width=w || 0,this.r=(Math.min(this.height,this.width)-2)/2,
        this.center={x:this.container.height/2,y:this.container.width/2};
        this.init();
    }

    init(){
        let self=this;
        this.chart=d3.select(".menu_btn")
            .style("transform", "translate(" + (this.width-this.container.width) /2 + "px," + (this.height-this.container.height) /2 + "px)")
            .style("width",this.container.width+'px')
            .style("height",this.container.height+'px')
            .append("svg")
            .attr("width", this.container.width)
            .attr("height", this.container.height);
        let circles= this.chart.selectAll('circle').data([60]).enter().append('circle').attr('class','circle').attr('id','test')
        .attr("r", function(d) { return self.r; })
        .attr("cy",self.center.y)
        .attr("cx",function(d){ return self.center.x})
        .on('click',(d,i)=>{
            if(dragIns.isDragTri){return;}
            self.menu_svg.style('display','block');
            self.closeMenu.style('display','block');
        });
        this.genMenus();

        let dragIns=new drag();
        dragIns.Init(document.getElementById('test'),document.getElementById('test1'));
    }

    genMenus(){
        let self=this;

        let svg = this.chart
            .append('g')
            .attr("transform", "translate(" + this.center.x + "," + this.center.y + ")")
            .style('display','none');

        let pie=d3.pie()
                .value((d)=>{return d.value;})
                .startAngle(-0.5 * Math.PI)
                .endAngle(0.5 * Math.PI);
        let arc=d3.arc()
                .innerRadius(self.r)
                .outerRadius((d)=>{
                    return Math.min(self.container.width,self.container.height)/2-self.r-2;
                });
                
        let textArc=d3.arc().innerRadius(0).outerRadius((d)=>{return (Math.min(self.container.width,self.container.height)/2-self.r-2)/1.5});
        let centerPoins= pie(self.menus).map(function(d){return arc.centroid(d);});

        let pieAreas=svg.selectAll(".textArc")
        .data(pie(self.menus))
        .enter().append("g")
        .attr('class','menuItem');

        pieAreas.append('path').attr("fill", function(d,i) { return "transparent"; })
        .attr("class", "textArc")
        .attr('id',(d,i)=>{return 'group'+i;})
        .attr("d", textArc);

        pieAreas.append("path")
            .attr("class", "solidArc")
            .attr("d", arc);


        pieAreas.append("text")
        .attr('x',(d)=>{return d[0];})
        .attr('y',(d)=>{return d[1];})
        .attr('class','title')
        .attr('text-anchor','middle')
        .attr('fill','#333')
        .append("textPath")
        .attr('startOffset','12%')
        .attr('class','fa fa-search')
        .attr("xlink:href", function(d,i) { return "#group" + i; })
        .text('测试');
        
        let circles= this.chart.selectAll('.close_circle').data([60]).enter().append('circle').attr('class','close_circle')
        .attr("r", function(d) { return self.r; })
        .attr("cy",self.center.y)
        .attr("cx",function(d){ return self.center.x})
        .style('display','none')
        .on('click',(d,i)=>{
            svg.style('display','none');
            circles.style('display','none');
        });
        this.menu_svg=svg;
        this.closeMenu=circles;
    }
}


export default MenuBtn;