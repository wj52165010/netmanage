<!-- 登录页面组件 -->
<template>
    <div id="login" class="Login">
        <!--动态登录页面-->
        <div class="dynLogin" v-if="!blnStaticShow">
            <div class="title">互联网管理综合应用系统</div>
            <div class="logo"><img src="/static/logo.png" style="width:100px;height:100px;" /></div>
            <div class="input"><div class="label"><i class="fa fa-user" /></div><div class="option"><input class="form-control" placeholder="请输入账号" type="text" v-model="name"  autocomplete="off"  /></div></div>
            <div class="input"><div class="label"><i class="fa fa-unlock-alt" /></div><div class="option"><input type="password" placeholder="请输入密码" v-model="password" /></div></div>
            <div class="input" style="margin-right:150px;overflow: visible;position: relative;">
                <div class="label"><i class="fa fa-bell" style="font-size:20px;" /></div>
                <div class="option"><input type="password" style="height:36px;" placeholder="请输入验证码" v-model="certCode" /></div>
                <img class="certCode" :src="'/cert_code?'+certCodeRand" @click="genRand()" style=" position: absolute;right: -150px;top: 5px;height: 100%;width: 100px;background-color:white;" />
            </div>

            <div class="loginBtn" @click="login()">
                <i v-show="blnLogin" class="fa fa-spinner fa-pulse"></i>
                <span v-show="!blnLogin">登&nbsp;录</span>
            </div>
        </div>
        <!--静态登录页面-->
        <div style="width:100%;height:100%;" v-if="blnStaticShow">
            <div class="top">
                <div class="left">
                    <div class="left_left"> </div><div class="left_right_container"><div class="left_right"></div></div>
                </div>
                <div class="right"></div>
                <div class="middle">
                    <div class="middle_left"><span>OPEN</span></div><div class="middle_right_container"><div class="middle_right"></div></div>
                </div>
            </div>
            <div class="center">
                <div class="left">
                <img id="logo_img" src="./assets/07.png"  />
                </div>
                <div class="right"></div>
                <div class="middle">
                    <div class="input_container">
                        <div class="input_container_left">
                            <div class="btn">
                                <div class="icon"><i class="fa fa-user" /></div>
                                <input type="text" placeholder="请输入账号" v-model="name"/>
                            </div>
                            <div class="btn" style="margin-top:10px;">
                                <div class="icon"><i class="fa fa-unlock-alt" /></div>
                                <input type="password"  placeholder="请输入密码" v-model="password"  />
                            </div>
                        </div>
                        <div class="input_container_right" @click="login()">
                            <i v-show="blnLogin" class="fa fa-spinner fa-pulse"></i>
                            <span v-show="!blnLogin">登&nbsp;录</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="left">
                    <div class="left_left">
                        <div class="left_left_top">
                            <div class="imageContainer"><div class="image"></div></div>
                        </div>
                        <div class="left_left_bottom"><div>ARTIFICIAL</br>INTELLIGENCE</div></div>
                    </div>
                    <div class="left_right">
                        <div style="width:50%;height:100%;float:left;">
                            <div class="left_right_top"><span>BIGDATA</span></div>
                            <div class="left_right_bottom_container"><div class="left_right_bottom"></div></div>
                        </div>
                        <div style="width:25%;height:100%;float:left;"></div>
                        <div class="left_right_right_container"><div class="left_right_right"></div></div>
                    </div>
                </div>
                <div class="right"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '../static/font-awesome-4.7.0/less/font-awesome.less'
import '../static/layer/skin/layer.css'
import '../static/layer/layer.js'
import '../static/jquery.particleground.js'


export default {
  name: 'Login',
  components:{},
  data () {
    return {
        name:'',
        password:'',
        certCode:'',//验证码
        blnLogin:false,
        blnStaticShow:false,//是否显示静态登录页面
        certCodeRand:'',//验证码随机数
    }
  },
  mounted(){

    if(this.blnStaticShow){//静态显示
        let img =$(this.$el).find('#logo_img');
        img.css('margin-top',-img.height()/2);
        $(window).resize(()=>{
            img.css('margin-top',-img.height()/2);
        });
    }else{//动态展示
        $('#login').particleground({
            dotColor: '#0d8eb5',
            lineColor: '#0d8eb5',
            bgImgUrl: '/static/logo.jpg'
        });
    }

    //监听鼠标按下事件
    $(window).keydown(e=>{
        if(e.which!=13){return;}//回车
        this.login();
    })
  },
  methods:{
      login(){
         if(!this.name || !this.password){
             tool.info('账号密码不能为空!');
             return;
         }

         this.blnLogin=true;
         ser.login({account:this.name,pwd:this.password,cert_code:this.certCode}).then(res=>{
             this.blnLogin=false;
             if(res.msg.code=='authen_failed_logined'){
                 //用户已经登录
                 tool.confirm('用户已经登录,是否强制登录?',['是','否'],()=>{
                    ser.LoginForce(this.name).then(res=>{
                        if(res.msg.code!='successed'){return;}
                        let cookie=tool.cookie,expTime='s'+res.biz_body.exp;
                        cookie.set('token',res.biz_body.token,expTime);
                        cookie.set('userid',res.biz_body.user_id,expTime);
                        cookie.set('exp',res.biz_body.exp,expTime);
                        cookie.set('permissions',res.biz_body.permissions.join(','),expTime);
                        cookie.set('account',this.name,expTime);
                        cookie.set('centerPoint','114.35,36.10',expTime);//中心点(106.33,29.35:重庆中心点)(114.35,36.10:河南)(101.527660,25.044943:楚雄)
                        cookie.del('Invalid');
                        window.location='index.html'
                    });

                 },function(){});
                 return;
             }

             if(res.msg.code!='successed'){this.genRand();return;}
             
             let cookie=tool.cookie,expTime='s'+res.biz_body.exp;
             cookie.set('token',res.biz_body.token,expTime);
             cookie.set('userid',res.biz_body.user_id,expTime);
             cookie.set('exp',res.biz_body.exp,expTime);
             cookie.set('permissions',res.biz_body.permissions.join(','),expTime);
             cookie.set('account',this.name,expTime);
             cookie.set('centerPoint','114.35,36.10',expTime);//中心点(106.33,29.35:重庆中心点)
             cookie.del('Invalid');
             window.location='index.html'
         });
      },
      //生成验证码随机数
      genRand(){
        this.certCodeRand=tool.guid();
      }
  }
}
</script>

<style scoped lang="less">
    @topH:20%;
    @bottomH:@topH*2;
    @centerH:~"calc(100% - @{topH} - @{bottomH})";

    .img-trans(){
       -webkit-transition: 1s;
        transition: 1s;
        -webkit-transform-origin: bottom right;
        transform-origin: bottom right;
    }
    .Login {height:100%;width:100%;overflow:hidden;font-family: 微软雅黑;}
    .Login .top{height:@topH;}
    .Login .center{height:@centerH;}
    .Login .bottom{height:@bottomH;}

    @fontFamily:arial;
    @rightW:120px;
    @unitW:20%;
    @leftW:~"calc(50% - @{rightW}/2 + @{unitW})";
    @color1:#afb5c2;
    @color2:#606b85;
    @color3:#525b77;
    @color4:#111d39;
    @color5:#009cdc;
    .Login .top {background-color:@color1;}
    .Login .top .left{height:100%;width:@leftW;float:left;}
    .Login .top .left .left_left{height:100%;width:40%;float:left;}
    .Login .top .left .left_right_container{height:100%;margin-left:40%;margin-right:0px;overflow:hidden;}
    .Login .top .left .left_right_container .left_right{height:100%;margin-left:0px;margin-right:0px;background-image: url(./assets/01.png);background-size:100% 100%;.img-trans();}
    .Login .top .left .left_right_container .left_right:hover{transform: scale(1.25);}

    .Login .top .middle{height:100%;margin-left: @leftW;margin-right:@rightW;}
    .Login .top .middle .middle_left{height:100%;width:@rightW;float:left;background-color:@color2;color:white;font-weight: 600;position:relative;}
    .Login .top .middle .middle_left span{position:absolute;bottom:2px;left:5px;font-family:@fontFamily;}
    .Login .top .middle .middle_right_container{height:100%;margin-left:@rightW;margin-right:0%;overflow:hidden;}
    .Login .top .middle .middle_right_container .middle_right{height:100%;width:100%;background-image: url(./assets/02.png);background-size:100% 100%;.img-trans();}
    .Login .top .middle .middle_right_container .middle_right:hover{transform: scale(1.25);}

    .Login .top .right{height:100%;width:@rightW;float:right;background-color: @color2;}


    .Login .bottom .left{height:100%;width:~"calc(100% - @{rightW})";float:left;background-color:@color1;}
    .Login .bottom .left_right,
    .Login .bottom .left_left{height:100%;width:50%;float:left;}
    .Login .bottom .left_left .left_left_top{height:50%;width:100%;background-color: @color2;}
    .Login .bottom .left_left .left_left_top .imageContainer{margin-left:20%;margin-right:0px;height:100%;overflow:hidden;}
    .Login .bottom .left_left .left_left_top .image{width:100%;height:100%;background-image: url(./assets/05.png);background-size:100% 100%;.img-trans();}
    .Login .bottom .left_left .left_left_top .image:hover{transform: scale(1.25);}

    .Login .bottom .left_left .left_left_bottom{height:50%;width:100%;color:white;font-weight:600;position: relative;background-color: @color2;}
    .Login .bottom .left_left .left_left_bottom div{position: absolute;left:20%;bottom:20px;font-family: @fontFamily;}

    .Login .bottom .left_right .left_right_right_container{width:25%;height:100%;float:left;overflow:hidden;}
    .Login .bottom .left_right .left_right_right_container .left_right_right{width:100%;height:100%;background-image: url(./assets/03.png);background-size:100% 100%;.img-trans();}
    .Login .bottom .left_right .left_right_right_container .left_right_right:hover{transform: scale(1.25);}

    .Login .bottom .left_right .left_right_top{height:50%;width:100%;background-color: @color2;color:white;font-weight:600;position:relative;}
    .Login .bottom .left_right .left_right_top span{position: absolute;bottom:2px;left:5px;font-family: @fontFamily;}
    .Login .bottom .left_right .left_right_bottom_container{height:50%;width:100%;overflow:hidden;}
    .Login .bottom .left_right .left_right_bottom{height:100%;width:100%;background-image: url(./assets/04.png);background-size:100% 100%;.img-trans();}
    .Login .bottom .left_right .left_right_bottom:hover{transform: scale(1.25);}

    .Login .bottom .right{height:100%;width:@rightW;float:right;background-color: @color3;}

    .Login .center .left{height:100%;width:@leftW;float:left;position: relative;}

    .Login .center .left img{width:40%;height:40%;position: absolute; right:10%;top:50%;}
    .Login .center .middle{height:100%;margin-left: @leftW;margin-right:@rightW;background-color: @color4;position:relative;}
    .Login .center .right{height:100%;width:@rightW;float:right;background-color: @color3;}

    .Login .center .middle .input_container{margin:0px 20px;position: absolute;width:~"calc(100% - 40px)";top:50%;margin-top:-35px;}
    .Login .center .middle .input_container .input_container_left{float:left;width:65%;}
    .Login .center .middle .input_container .input_container_right{
        margin-left:~"calc(65% + 20px)";height:70px;;margin-right:0px;
        background-color:@color5;color:white;
        text-align:center;line-height: 70px;
        cursor:pointer;
    }

    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        border:none !important;
        height: 27px!important;
        line-height: 27px!important;
        border-radius: 0 4px 4px 0;
        background-color:transparent !important;
        background-image:none;
        outline: none;
    }

    .Login .btn{background-color: white;}
    .Login .btn input{width:~"calc(100% - 50px)";border:none;background-color:transparent !important;outline:none;}
    .Login .btn .icon{color:@color5;
        display: inline-block;
        line-height: 30px;
        width: 30px;
        text-align: center;
        background: #e6e6e6;}

    @media screen and (max-width: 1240px) {
        .Login .center .left,
        .Login .top .left{width:60%;}
        .Login .center .middle,
        .Login .top .middle{margin-left:60%;}
        .Login .center .left img{width:50%;height:50%;}
    }
    @media screen and (max-width: 1000px) {
        .Login .center .left,
        .Login .top .left{width:45%;}
        .Login .center .middle,
        .Login .top .middle{margin-left:45%;}
        .Login .center .left img{width:70%;height:30%;}
    }

    //动态登录页面样式设置
    @dynH:360px;
    @mdynW:570px;
    @padding:40px;
    @dynW:300px;
    @borderCol:#323642;
    .dynLogin{
        position: absolute;width:@mdynW;height:@dynH;top:50%;margin-top:-(@dynH+@padding)/2;left:50%;margin-left:-@mdynW/2;
        border-radius:10px;
        background-color:#2b2b35;
        padding:20px;color:white;
        overflow:hidden;
    }
    .dynLogin .title{text-align:center;margin-bottom:20px;}
    .dynLogin .logo{text-align:center;margin-bottom:20px;}
    .dynLogin .input{line-height:40px;height:40px;border-bottom:1px solid #5e5e66;color:#5e5e66;padding-left:10px;overflow:hidden;}
    .dynLogin .input .label{float:left;}
    .dynLogin .input .label i{font-size:25px;margin-top:10px;}
    .dynLogin .input .option{margin-left:35px;}
    .dynLogin .input .option input{width:100%;height:40px;font-size:18px;border:none;background-color:transparent;color:#6a8baa;outline:none;}
    .dynLogin .loginBtn{
        margin-top:20px;text-align:center;height:76px;line-height:76px;background-color:#0d8eb5;margin-left:-20px;margin-right:-20px;
        font-size:20px;
        transition: 1s all;
        -webkit-transition: 1s all;
        -moz-transition: 1s all;
        -o-transition: 1s all;
    }

    .dynLogin .input .option .test{background-color:red;}
    .dynLogin .loginBtn:hover{background-color:#3ea751;cursor:pointer;}

    .dynLogin input{
        -webkit-box-shadow: 0 0 0px 1000px #2b2b35 inset;
        -webkit-text-fill-color:#6a8baa;
    }
    @media screen and (max-width: 1240px) {
        .dynLogin{position: absolute;width:@dynW;height:@dynH;top:50%;margin-top:-(@dynH+@padding)/2;left:50%;margin-left:-@dynW/2;}
    }

    .Login .certCode:hover{cursor:pointer;}
</style>
