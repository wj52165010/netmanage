<!-- 可在文本和输入框之间切换的输入组件 -->
<template>
    <div class="ToggleInput" :class="{noVaild:!blnVaild}">
        <!--文本显示内容-->
        <div class="label_info divEllipsis" @mousedown="mousedown()" v-show="!blnShowInput">{{val || placeholder}}</div>
        <!--输入框内容-->
        <div class="input_info" v-show="blnShowInput">
           <!-- <input type="txt" v-model="val"  @blur="inputBlur()" :placeholder="placeholder" />-->

            <input type="txt" style="outline:none;" :value="val"  @blur="inputBlur()" :placeholder="placeholder" @input="handleInput" />
            <div class="line"></div>
            <i class="fa fa-pencil"></i>
        </div>
        <!--验证提示信息-->
        <div class="tip">
            {{info}}
        </div>
    </div>
</template>

<script>
export default {
  name: 'ToggleInput',
  props:['value','extra','tip','reg','require','placeholder','validFunc'],
  data () {
    return {
      val:'',
      blnShowInput:false,
      blnVaild:true,//是否验证成功
      info:'',
      mousedownPress:false,//为了兼容google会触发input失去焦点事件
      RxSub:null,
    }
  },
  watch:{
      value(){
        this.val=this.value;
        this.RxSub.next();
      },
      val(){
        this.val=this.val.replace(/(^\s*)|(\s*$)/g, "");
        this.$emit('input', this.val);
        this.$emit('change',this.val,this.extra);
      }
  },
  mounted(){
    this.RxSub=new this.$store.getters.Rx.Subject();
    
    this.RxSub.debounceTime(2500).subscribe(()=>{
        this.inputBlur();
    });

    this.val=this.value;
  },
  methods:{
    //验证并设置显示
    ValidAndShow(){
        let valid=this.Valid();

        if(valid.flag)this.blnVaild =valid.flag;

        return valid;
    },
    //验证输入格式
    Valid(){
        if(this.require && !this.val){ return  {flag:false,info:'字段必填'};}
        let res=true;
        if(this.reg){ 
            let exp =eval('/'+this.reg+'/i');
            res=!!this.val.match(exp);
            if(!res){ return {flag:res,info:this.tip};}
        }
        
        //额外的验证方法函数
        if(this.validFunc){
            let val=this.val;
            if(this.validFunc instanceof Array){
                let validFunc=this.validFunc;
                let vaildRed=null;
                for(let i=0;i<validFunc.length;i++){
                    vaildRed=validFunc(val);
                    if(!vaildRed.flag){break;}
                }

                return vaildRed;
            }else{
                return this.validFunc(val);
            }
        }

        return {flag:res};
    },
    mousedown(){
        this.blnShowInput=true;
        this.mousedownPress=true;
        setTimeout(()=>{
            this.mousedownPress=false;
        },100);
        this.$nextTick(()=>{
            $(this.$el).find('input').focus();
        }); 
    },
    inputBlur(){
        if(this.mousedownPress){$(this.$el).find('input').focus();this.mousedownPress=false; return;}
        this.blnShowInput=false;
        let valid=this.Valid();
        this.blnVaild =valid.flag;
        
        this.info=valid.info;

    },
    handleInput(event){
        this.val=event.target.value;
    }
  }
}
</script>

<style scoped lang="less">
  @import "../css/variables.less";
  .ToggleInput{position: relative;}
  .ToggleInput input{border:none;background-color:transparent;width:~'calc(100% - 20px)';}
  .ToggleInput .line{border-top:1px solid @Font_Hover_Col;}
  .ToggleInput .label_info{width:100%;cursor:pointer;height:30px;line-height:30px;}
  .ToggleInput .input_info{width:100%;position:relative;line-height:20px;}
  .ToggleInput .fa-pencil{position:absolute;right:0px;top:5px;}

  .ToggleInput.noVaild{}

  .ToggleInput .tip{display:none;}
  .ToggleInput.noVaild .tip{
        width:100%;
        display: block;
        position: absolute;
        font-size: 12px;
        word-break: break-all;
        word-wrap: break-word;white-space:normal;text-align: left;
        margin-top:10px;
        .border('',red);border-radius:5px;
        padding:5px;
        background-color:white;
        z-index: 100;
        }

    .ToggleInput.noVaild .tip:before {
        content:'';
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid red;
        position:absolute;
        top:-5px;
        left:~'calc(50% - 2.5px)';
    }
</style>
