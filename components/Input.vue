<!-- 导航组件 -->
<template>
    <div class="inputDir_container">
      <!--[if IE 9]><style>.inputDir_container .form-control{border-bottom:1px solid #d2d2d2;}.inputDir_container .form-control:focus{border-bottom-color:#009688;}</style><![endif]-->
      
      <input class="form-control date" @blur="validFormat()" v-model="value" :class="{empty:!value}" :disabled='blnDisabled' type="text" v-if="!type" />
      <input class="form-control date" @blur="validFormat()" v-model="value" :class="{empty:!value}" :disabled='blnDisabled' type="password" v-if="type=='pwd'" />
      <div class="floating-label"><span style="color:red;" v-if="blnRequire">*</span>{{label}}</div>
      <div style="text-align:center;" v-show="blnLoad"><img src="../assets/loading-validator.gif" /></div>
      <div class="validInfo fadeIn" v-if="validInfo">{{validInfo}}</div>
    </div>
</template>

<script>
export default {
  name: 'inputDir',
  props:['label','blnLoad','extra','val','valid','type','require','tip','reg','blnDisabled'],
  data () {
    return {
      value:'',
      validInfo:'',
      blnRequire:false,
    }
  },
  mounted(){
    this.blnRequire=!!this.require;
    this.value=this.val || '';
  },
  watch:{
    val(){
      this.value=this.val || '';
    },
    value(){
      if(!this.validFormat() && !this.require)return;
      this.$emit('change',this.value.replace('，',','),this.extra);
    }
  },
  methods:{
    //设置提示信息
    setVaildInfo(v){
      this.validInfo=v;
    },
    //获取验证结果
    Valid(){
      return this.validFormat();
    },
    //验证输入类容是否正确
    validFormat(){
      let blnValid=true;

      if(this.require){blnValid = !(this.value=='');}
      if(!blnValid){this.validInfo=this.tip || '';return blnValid;}else{this.validInfo='';}

      if(this.reg){
        //this.reg='\\d{15}';

        let exp =eval('/'+this.reg+'/i');
        blnValid=!!this.value.match(exp);
      }
      if(!blnValid){this.validInfo=this.tip || '';return blnValid;}else{this.validInfo='';}

      // if(!this.valid || this.valid.length<=0)return blnValid;
      
      // for(let item of this.valid){
      //   if(item.exp){
      //     try{
      //       if(!eval(item.exp.replace('%d',this.value))){this.validInfo=item.note;blnValid=false;break;}
      //     }catch(e){
      //       this.validInfo='';
      //     }
      //   }
      // }

      
      // if(blnValid){this.validInfo='';}

      return blnValid;
    }
  }
}
</script>
<style scoped lang="less">
.inputDir_container{
    position:relative;
    margin-top:10px;
}
.inputDir_container > input{padding-left:5px !important;}

.inputDir_container .form-control{
    border: 0;
    background-image: linear-gradient(#009688,#009688),linear-gradient(#d2d2d2,#d2d2d2);
    background-size: 0 2px,100% 1px;
    background-repeat: no-repeat;
    background-position: center bottom,center calc(100% - 1px);
    background-color: transparent;
    transition: background 0s ease-out;
    padding:0px;
    border-radius: 0px;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
    font-weight: 300;
    box-shadow: none;
}

.inputDir_container .form-control:focus{
    outline: none;
    background-image: linear-gradient(#009688,#009688),linear-gradient(#d2d2d2,#d2d2d2);
    background-size: 100% 2px,100% 1px;
    box-shadow: none;
    border-radius: 0px;
    transition-duration: .3s;
}

.inputDir_container .form-control + .floating-label{
    font-size:14px;
    color: #bdbdbd;
    position: absolute;
    pointer-events: none;
    left: 5px;
    top: 5px;
    transition: .3s ease all;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", "FontAwesome", sans-serif;
    font-weight: 300;
}

.inputDir_container .form-control:focus + .floating-label{
     font-size:9.8px;
     top:-10px;
     color:#009688;
}

.inputDir_container .form-control:not(.empty) + .floating-label{
    font-size:9.8px;
    top:-10px;
}

.inputDir_container .validInfo{
  position: absolute;
  top: -10px;
  right: 0px;
  font-size: 12px;
  color: red;
}
</style>
