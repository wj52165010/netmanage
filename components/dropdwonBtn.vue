<!-- 下拉框包含按钮 -->
<template>
    <div class="DropDwonBtn">
        <!--按钮-->
        <div class="btn_container" name="btn_container" v-if="btn" @click="btnClick">{{btn.name}}</div>
        <!--输入框-->
        <div class="input_container" name="input_container">
            <input type="txt" v-model="val" :placeholder="placeholder" @focus.stop="blnShow=true" />
            <!--下拉选项框-->
            <div class="drop_content" v-show="blnShow" :style="{'max-height':dropH}">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'DropDwonBtn',
  props:['placeholder','data','btn','store','dropH'],
  data () {
    return {
      mousedownid:'',
      blnShow:false,
      changeSub:null,
      noEmit:false,
      val:'',
    }
  },
  watch:{
      data(){
          this.blnShow=true;
      },
      val(){
          if(this.noEmit){this.noEmit=false;return;}
          this.changeSub.next(this.val);
      }
  },
  mounted(){
     this.store=this.store || this.$store;
     let Rx=this.store.getters.Rx;
     this.changeSub=(new Rx.Subject()).debounceTime(600);
     this.changeSub.subscribe(res=>{
         this.$emit('change',res);
     });

     //设置输入框容器宽度
     this.$nextTick(()=>{
         let el=$(this.$el);
         let inputEl=el.find('div[name="input_container"]');
         let btnEl=el.find('div[name="btn_container"]');
          
         inputEl.css('margin-right',(btnEl.width()<0?(this.btn?27+20+1:0):btnEl.width()+20+1));
     });

    //注册页面被单击事件
    this.mousedownid = Fx.SingleBind('mousedown',$('body'), (e)=> {
        e.stopPropagation();this.blnShow=false;
    });
  },
  destroyed(){
    Fx.ClearBind('mousedown',$('body'),this.mousedownid);
  },
  methods:{
     setVal(val){
         this.noEmit=true;
         this.val=val;
     },
     btnClick(){
         if(!this.btn)return;
         if(!this.btn.action)return;
         this.$emit(this.btn.action,this.val);
     }
  }
}
</script>

<style scoped lang="less">
@import "../css/variables.less";

@H:34px;
@col:#C0CCDA;
@borderCol:#c0ccda;
.DropDwonBtn{height:@H;width:100%;.border('',@borderCol);border-radius:5px;}
.input_container{height:100%;position:relative;}
.input_container > input{width:98%;border:none;height:100%;background-color:transparent;outline:none;padding:0px 5px;}

.btn_container{
    float:right;
    height:100%;
    padding:0px 10px;
    text-align:center;
    line-height:@H;
    color:@col;
    .border('left',@borderCol);
    cursor:pointer;
    background-color:#20a0ff;
    color:white;
}
.btn_container:hover{color:@FontCol;}

.drop_content{width:100%;position: absolute;z-index:10;background-color:white;.border('',@borderCol);overflow-y:auto;}
.drop_content:empty{border:none;}

@itemH:30px;
.drop_content:nth-child(n){line-height:@itemH;}
.drop_content > *{.border('bottom');text-align:left;padding:0px 5px;}
.drop_content > *:hover{background-color:@Font_Hover_Col;color:white;cursor:pointer;}

</style>
