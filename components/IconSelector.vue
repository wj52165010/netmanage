<!-- 图标选择组件 -->
<template>
    <div class="iconSelector" :class="{blnPage:blnPage}">
        <div class="iconSelector_scrollContainer">
            <div class="slidee">
                <div class="position:relative;width:100%;">
                    <div class="icon_item" v-for="icon in icons" :class="{active:getIcon(icon)==value}" @click="item_click(icon)"><i :class="getIcon(icon)"></i></div>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
        <div class="scrollbar iconSelector_scrollbar">
            <div class="handle"></div>
        </div>
    </div>
</template>

<script>
import {BODY_RESIZE} from '../store/mutation-types'
export default {
  name: 'IconSelector',
  props:['store','value'],
  data () {
    return {
      sly:null,
      blnPage:false,
      icons:[
         'address-book','address-book-o','address-card','address-card-o','bandcamp','bath','bathtub','drivers-license','drivers-license-o','eercast',
         'envelope-open','envelope-open-o','etsy','free-code-camp','grav','handshake-o','id-badge','id-card','id-card-o','imdb','linode','meetup',
         'microchip','podcast','quora','ravelry','s15','shower','snowflake-o','superpowers','telegram','thermometer','thermometer-0','thermometer-1',
         'thermometer-2','thermometer-3','thermometer-4','thermometer-empty','thermometer-full','thermometer-half','thermometer-quarter','thermometer-three-quarters',
         'times-rectangle','times-rectangle-o','user-circle','user-circle-o','user-o','vcard','vcard-o','window-close','window-close-o','window-maximize',
         'window-minimize','window-restore','wpexplorer','address-book','address-book-o','address-card','address-card-o','adjust','american-sign-language-interpreting',
         'anchor','archive','area-chart','arrows','arrows-h','arrows-v','asl-interpreting','assistive-listening-systems','asterisk','at','audio-description',
         'automobile','balance-scale','ban','bank','bar-chart','bar-chart-o','barcode','bars','bath','bathtub','battery','battery-0','battery-1','battery-2',
         'battery-3','battery-4','battery-empty','battery-full','battery-half','battery-quarter','battery-three-quarters','bed','beer','bell','bell-o','bell-slash',
         'bell-slash-o','bicycle','binoculars','birthday-cake','blind','bluetooth','bluetooth-b','bolt','bomb','book','bookmark','bookmark-o','braille','briefcase',
         'bug','building','building-o','bullhorn','bullseye','bus','cab','calculator','calendar','calendar-check-o','calendar-minus-o','calendar-o','calendar-plus-o',
         'calendar-times-o','camera','camera-retro','car','caret-square-o-down','caret-square-o-left','caret-square-o-right','caret-square-o-up','cart-arrow-down',
         'cart-plus','cc','certificate','check','check-circle','check-circle-o','check-square','check-square-o','child','circle','circle-o','circle-o-notch',
         'circle-thin','clock-o','clone','close','cloud','cloud-download','cloud-upload','code','code-fork','coffee','cog','cogs','comment','comment-o','commenting',
         'commenting-o','comments','comments-o','compass','copyright','creative-commons','credit-card','credit-card-alt','crop','crosshairs','cube','cubes','cutlery',
         'dashboard','database','deaf','deafness','desktop','diamond','dot-circle-o','download','drivers-license','edit','ellipsis-h','ellipsis-v','envelope','envelope-o',
         'envelope-open','envelope-open-o','envelope-square','eraser','exchange','exclamation','exclamation-circle','exclamation-triangle','external-link','external-link-square',
         'eye','eye-slash','eyedropper','fax','feed','female','fighter-jet','file-archive-o','file-audio-o','file-code-o','file-excel-o','file-image-o','file-movie-o',
         'file-pdf-o','file-photo-o','file-picture-o','file-powerpoint-o','file-sound-o','file-video-o','file-word-o','file-zip-o','film','filter','fire','fire-extinguisher',
         'flag','flag-checkered','flag-o','flash','flask','folder','folder-o','folder-open','folder-open-o','frown-o','futbol-o','gamepad','gavel','gear','gears','gift','glass',
         'globe','graduation-cap','group','hand-grab-o','hand-lizard-o','hand-paper-o','hand-peace-o','hand-pointer-o','hand-rock-o','hand-scissors-o','hand-spock-o','hand-stop-o',
         'handshake-o','hard-of-hearing','hashtag','hdd-o','headphones','heart','heart-o','heartbeat','history','home','hotel','hourglass','hourglass-1','hourglass-2','hourglass-3',
         'hourglass-end','hourglass-half','hourglass-o','hourglass-start','i-cursor','id-badge','id-card','inbox','industry','info','info-circle','institution','key','keyboard-o',
         'language','laptop','leaf','legal','lemon-o','level-down','level-up','life-bouy','life-buoy','life-ring','life-saver','lightbulb-o','line-chart','location-arrow','lock',
         'low-vision','magic','magnet','mail-forward','mail-reply','mail-reply-all','male','map','map-marker','map-o','map-pin','map-signs','meh-o','microchip','microphone','microphone-slash',
         'minus','minus-circle','minus-square','minus-square-o','mobile','mobile-phone','money','moon-o','mortar-board','motorcycle','mouse-pointer','music','navicon','newspaper-o','object-group',
         'object-ungroup','paint-brush','paper-plane','paper-plane-o','paw','pencil','pencil-square','pencil-square-o','percent','phone','phone-square','photo','picture-o','pie-chart','plane','plug',
         'plus','plus-circle','plus-square','plus-square-o','podcast','power-off','print','puzzle-piece','qrcode','question','question-circle','question-circle-o','quote-left','quote-right','random',
         'recycle','refresh','registered','remove','reorder','reply','reply-all','retweet','road','rocket','rss','rss-square','s15','search','search-minus','search-plus','send','send-o','server',
         'share','share-alt','share-alt-square','share-square','share-square-o','shield','ship','shopping-bag','shopping-basket','shopping-cart','shower','sign-in','sign-language','sign-out','signal',
         'sitemap','sliders','smile-o','snowflake-o','soccer-ball-o','sort','sort-alpha-asc','sort-alpha-desc','sort-amount-asc','sort-amount-desc','sort-asc','sort-desc','sort-down','sort-numeric-asc',
         'sort-numeric-desc','space-shuttle','spinner','spoon','square','square-o','star','star-half','star-half-empty','star-half-full','star-half-o','star-o','sticky-note','sticky-note-o','street-view',
         'suitcase','sun-o','support','tablet','tachometer','tag','tags','tasks','taxi','television','terminal','thumbs-o-up','thumbs-up','ticket','times','times-circle','times-circle-o','times-rectangle',
         'times-rectangle-o','tint','toggle-down','toggle-left','toggle-off','toggle-on','toggle-right','toggle-up','trademark','trash','trash-o','tree','trophy','truck','tty','tv','umbrella','universal-access',
         'university','unlock','unlock-alt','unsorted','upload','user','user-circle','user-circle-o','user-o','user-plus','user-secret','user-times','users','vcard','vcard-o','video-camera','volume-control-phone',
         'volume-down','volume-off','wifi','window-close','window-close-o','window-maximize','window-minimize','window-restore','wrench'
      ],
    }
  },
  mounted(){
    this.$nextTick(()=>{
        this.sly=new Sly($('.iconSelector_scrollContainer'),{
            speed:200,
            scrollBy:50,
            scrollBar:'.iconSelector > .iconSelector_scrollbar',
            dragHandle:true,
            dynamicHandle:true,
            smart:1
        });
        this.sly.init();       
        this.blnPage=this.sly.rel.slideeSize>this.sly.rel.frameSize;
    });

    if(this.store){
        this.store.commit(BODY_RESIZE,()=>{
            this.sly.reload();
            this.blnPage=this.sly.rel.slideeSize>this.sly.rel.frameSize;
        });
    }
  },
  methods:{
      getIcon(icon){
          return 'fa fa-'+icon;
      },
      reloadSly(){
          this.sly.reload();
          this.blnPage=this.sly.rel.slideeSize>this.sly.rel.frameSize;
      },
      item_click(icon){
          this.$emit('iconChange',this.getIcon(icon));
      }
  }
}
</script>

<style scoped lang="less">
 @import "../css/variables.less";
 .iconSelector .iconSelector_scrollContainer,
 .iconSelector{width:100%;height:100%;}
 .iconSelector .icon_item{float:left;margin-right:30px;font-size:20px;width:30px;text-align:center;cursor:pointer;}
 .iconSelector .icon_item:hover{color:@Font_Hover_Col;}
 .iconSelector .icon_item.active{background-color:@Font_Hover_Col;color:@FrontCol;border-radius:5px;}

 .scrollbar:hover {cursor:pointer;}
 .scrollbar { border:1px solid @borderCol;border-radius:5px;width: 10px; height: ~'calc(100% - 20px)'; position: absolute;right: 5px;top: 0px;background:white;display:none;margin-top:10px;}
 .scrollbar .handle {width: 100%;height: 100px;background: @btn_Bg_Col_1;border-radius:5px;}
 .blnPage .scrollbar{display:block;}
</style>
