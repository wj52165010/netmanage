<!-- 数字显示组件(增加数字显示效果) -->
<template>
    <div class="NumShow">
        {{cNum}}
    </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'NumShow',
  props:['num'],
  data () {
    return {
        cNum:'0',
        tmpNum:'',
    }
  },
  watch:{
      num(){
         this.reset();
      }
  },
  mounted(){

  },
  methods:{
    reset(){
        let tmpStr='',s=this;
        for(let i=0;i<this.num.length;i++){
            if(s.num[i].match(/^[0-9]*$/)){
                tmpStr+='0';
            }else{
                tmpStr+=s.num[i];
            }
        }
        this.cNum=tmpStr || '0';
        this.tmpNum=tmpStr || '0';

        this.run();
    },
    run(){
        let s=this;
        let timeSep=200;
        let time= d3.scaleLinear().domain([0, 1]).range([0, timeSep]);

        let funcArr=[],cacheStr=s.tmpNum;
        for(let i=this.num.length-1;i>=0;i--){
            if(!s.num[i].match(/^[0-9]*$/))continue;
            if(parseInt(s.num[i])==0)continue;

            let strTmp=cacheStr.substring(0,i)+'{0}'+s.num.substring(i+1,s.num.length); 
            
            funcArr.push((function(num,tmp){
                return function(){
                    let timeMap=[];
                    for(let i=1;i<=num;i++){
                        timeMap.push(d3.easeLinear(1/num*i))
                    }

                    for(let i=0;i<timeMap.length;i++){
                        (function(index){
                            setTimeout(()=>{
                                s.cNum=tool.format(tmp,index+1);
                            },time(timeMap[index]));
                        })(i);
                    }
                };

            })(parseInt(s.num[i]),strTmp));

            cacheStr=tool.format(cacheStr,s.num[i]);
        }
        
        //执行
        for(let i=0;i<funcArr.length;i++){
            (function(func){
                setTimeout(()=>{
                   func();
                },timeSep*i);
            })(funcArr[i]);
        }
    },
  }
}
</script>

<style scoped lang="less">
  
</style>
