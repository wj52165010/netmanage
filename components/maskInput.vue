<!-- 遮罩输入框组件 -->
<template>
    <div class="MaskInput">
        <input v-show="mask!=1" :placeholder="placeholder" type="txt" />
        <input v-show="mask==1" :placeholder="placeholder" type="txt" />
    </div>
</template>

<script>
import Inputmask from "inputmask";
import maskType from '../enum/MaskType.js'
export default {
  name: 'MaskInput',
  props:['val','context','placeholder','mask'],
  data () {
    return {
      input:null,
      normalMask:'*',
      MacMask:'(9|A){1}(9|A){1}-(9|A){1}(9|A){1}-(9|A){1}(9|A){1}-(9|A){1}(9|A){1}-(9|A){1}(9|A){1}-(9|A){1}(9|A){1}'
    }
  },
  watch:{
      val(){
          //this.input.val(this.val);
          //this.$emit('change',this.input.val(),this.context);
      },
  },
  mounted(){
     this.input=$(this.$el).find('input');
     let mask=this.normalMask;
     if(this.mask==maskType.MAC){
         mask=this.MacMask;
         $(this.input[1]).val(this.val || '');
     }

     $(this.input[0]).val(this.val || '');

     this.input.keyup(r=>{
         let val=this.mask==maskType.MAC?$(this.input[1]).val():$(this.input[0]).val();
         if(this.mask==maskType.LowerCase){
             val=val.toLowerCase();
         }

         if(this.mask==maskType.UpCase){
             val=val.toUpperCase();
         }

         if(this.mask==maskType.ipNumber){

            var numbers = val.split(".");

            val = parseInt(numbers[0] || 0) * 256 * 256 * 256 +
                parseInt(numbers[1] || 0) * 256 * 256 +
                parseInt(numbers[2] || 0) * 256 +
                parseInt(numbers[3] || 0);
         }

        this.$emit('change',val,this.context);
     });

     this.input.change(r=>{
         let val=this.mask==maskType.MAC?$(this.input[1]).val():$(this.input[0]).val();
         if(this.mask==maskType.LowerCase){
             val=val.toLowerCase();
         }

         if(this.mask==maskType.UpCase){
             val=val.toUpperCase();
         }

         if(this.mask==maskType.ipNumber){
              var numbers = val.split(".");
              val = parseInt(numbers[0] || 0) * 256 * 256 * 256 +
                    parseInt(numbers[1] || 0) * 256 * 256 +
                    parseInt(numbers[2] || 0) * 256 +
                    parseInt(numbers[3] || 0);
         }

         if(this.mask==maskType.MacMobile){
             //首先判断位数是否为去掉横杠后输入的mac数据
             if(val.length==12 && val.indexOf('-')<0){
                let arr=val.match(/([\w]{2})([\w]{2})([\w]{2})([\w]{2})([\w]{2})([\w]{2})/i);
                arr.shift();
                val=arr.join('-');
             }

             val=val.toUpperCase();
         }
         
         this.$emit('change',val,this.context);
     });

     if(!this.mask || this.mask==maskType.LowerCase || this.mask==maskType.UpCase || this.mask==maskType.MacMobile || this.mask==maskType.ipNumber)return;
     let im = new Inputmask(mask);
     im.mask(this.input[1]);
  }
}
</script>
<style scoped lang="less">
  @import "../css/variables.less";

  .MaskInput input{
      display: block;
    padding: 3px 10px;
    width: 100%;
    height: 36px;
    color: #1f2d3d;
    background-color: #fff;
    border: 1px solid #C0CCDA;
    border-radius: 4px;
    outline: 0;
    font-size: inherit;
    line-height: normal;
  }
  .MaskInput input:focus{
    outline: 0;
    border-color: #20a0ff;
  }
</style>
