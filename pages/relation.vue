<!-- 导航组件 -->
<template>
    <div class="Relation">
        <svg>
            <!--手机-->
            <symbol id="mobile" viewBox="0 0 100 100" width="50" height="50">
                    <path d="M42.595,0H17.405C14.977,0,13,1.977,13,4.405v51.189C13,58.023,14.977,60,17.405,60h25.189C45.023,60,47,58.023,47,55.595   V4.405C47,1.977,45.023,0,42.595,0z M15,8h30v38H15V8z M17.405,2h25.189C43.921,2,45,3.079,45,4.405V6H15V4.405   C15,3.079,16.079,2,17.405,2z M42.595,58H17.405C16.079,58,15,56.921,15,55.595V48h30v7.595C45,56.921,43.921,58,42.595,58z" fill="#006DF0"/>
                    <path d="M30,49c-2.206,0-4,1.794-4,4s1.794,4,4,4s4-1.794,4-4S32.206,49,30,49z M30,55c-1.103,0-2-0.897-2-2s0.897-2,2-2   s2,0.897,2,2S31.103,55,30,55z" fill="#006DF0"/>
                    <path d="M26,5h4c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4c-0.553,0-1,0.447-1,1S25.447,5,26,5z" fill="#006DF0"/>
                    <path d="M33,5h1c0.553,0,1-0.447,1-1s-0.447-1-1-1h-1c-0.553,0-1,0.447-1,1S32.447,5,33,5z" fill="#006DF0"/>
                    <path d="M56.612,4.569c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414c3.736,3.736,3.736,9.815,0,13.552   c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293   C61.128,16.434,61.128,9.085,56.612,4.569z" fill="#006DF0"/>
                    <path d="M52.401,6.845c-0.391-0.391-1.023-0.391-1.414,0s-0.391,1.023,0,1.414c1.237,1.237,1.918,2.885,1.918,4.639   s-0.681,3.401-1.918,4.638c-0.391,0.391-0.391,1.023,0,1.414c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293   c1.615-1.614,2.504-3.764,2.504-6.052S54.017,8.459,52.401,6.845z" fill="#006DF0"/>
                    <path d="M4.802,5.983c0.391-0.391,0.391-1.023,0-1.414s-1.023-0.391-1.414,0c-4.516,4.516-4.516,11.864,0,16.38   c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414   C1.065,15.799,1.065,9.72,4.802,5.983z" fill="#006DF0"/>
                    <path d="M9.013,6.569c-0.391-0.391-1.023-0.391-1.414,0c-1.615,1.614-2.504,3.764-2.504,6.052s0.889,4.438,2.504,6.053   c0.195,0.195,0.451,0.293,0.707,0.293s0.512-0.098,0.707-0.293c0.391-0.391,0.391-1.023,0-1.414   c-1.237-1.237-1.918-2.885-1.918-4.639S7.775,9.22,9.013,7.983C9.403,7.593,9.403,6.96,9.013,6.569z" fill="#006DF0"/>
            </symbol>
            <!--真实身份-->
            <symbol id="idcard" viewBox="0 0 100 100" width="50" height="50">
                <path d="M55.783,8H4.217C1.892,8,0,9.892,0,12.217v35.566C0,50.108,1.892,52,4.217,52h51.566C58.108,52,60,50.108,60,47.783V12.217   C60,9.892,58.108,8,55.783,8z M58,47.783C58,49.006,57.006,50,55.783,50H4.217C2.994,50,2,49.006,2,47.783V12.217   C2,10.994,2.994,10,4.217,10h51.566C57.006,10,58,10.994,58,12.217V47.783z" fill="#006DF0"/>
                <path d="M22.638,36.246L19,34.388v-0.387c1.628-0.889,2.773-2.353,3.412-4.364C23.381,29.123,24,28.122,24,27v-1   c0-0.926-0.431-1.785-1.151-2.349c-0.624-3.78-3.262-5.696-7.849-5.696c-0.217,0-0.429,0.008-0.636,0.024   c-0.864,0.071-2.129-0.004-3.224-0.74c-0.409-0.276-0.718-0.544-0.915-0.793c-0.336-0.429-0.901-0.579-1.402-0.373   c-0.502,0.206-0.797,0.708-0.734,1.247c0.042,0.374,0.105,0.809,0.2,1.286c0.193,0.975,0.193,0.975-0.078,1.558   c-0.102,0.221-0.228,0.49-0.376,0.853c-0.331,0.811-0.566,1.699-0.701,2.647C6.424,24.229,6,25.083,6,26v1   c0,1.122,0.619,2.123,1.588,2.637c0.639,2.012,1.784,3.476,3.412,4.364v0.376l-3.769,1.858C5.855,36.985,5,38.425,5,39.993v1.325   C5,42.121,5,44,15,44s10-1.879,10-2.682v-1.245C25,38.442,24.095,36.977,22.638,36.246z M23,41.092C22.376,41.472,19.838,42,15,42   s-7.376-0.528-8-0.908v-1.099c0-0.835,0.455-1.603,1.152-1.982l3.857-1.901c0.602-0.294,0.99-0.917,0.99-1.588v-1.803l-0.604-0.26   c-1.517-0.654-2.503-1.901-3.015-3.814l-0.143-0.533l-0.526-0.164C8.293,27.817,8,27.428,8,27v-1c0-0.362,0.207-0.698,0.541-0.876   l0.469-0.25l0.055-0.529c0.099-0.938,0.308-1.803,0.622-2.57c0.133-0.325,0.246-0.568,0.338-0.767   c0.339-0.728,0.462-1.104,0.377-1.875c1.176,0.672,2.589,0.958,4.122,0.841c0.155-0.013,0.314-0.019,0.477-0.019   c3.744,0,5.572,1.356,5.929,4.398l0.062,0.522l0.465,0.246C21.791,25.299,22,25.636,22,26v1c0,0.428-0.293,0.817-0.712,0.947   l-0.526,0.164l-0.143,0.533c-0.512,1.913-1.498,3.16-3.015,3.814L17,32.719v1.811c0,0.669,0.37,1.272,0.964,1.575l3.775,1.929   C22.517,38.422,23,39.204,23,40.073V41.092z" fill="#006DF0"/>
                <path d="M30,23h10c0.553,0,1-0.447,1-1s-0.447-1-1-1H30c-0.553,0-1,0.447-1,1S29.447,23,30,23z" fill="#006DF0"/>
                <path d="M44,23h1c0.553,0,1-0.447,1-1s-0.447-1-1-1h-1c-0.553,0-1,0.447-1,1S43.447,23,44,23z" fill="#006DF0"/>
                <path d="M31,38h-1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1c0.553,0,1-0.447,1-1S31.553,38,31,38z" fill="#006DF0"/>
                <path d="M37,38h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S37.553,38,37,38z" fill="#006DF0"/>
                <path d="M42,38h-1c-0.553,0-1,0.447-1,1s0.447,1,1,1h1c0.553,0,1-0.447,1-1S42.553,38,42,38z" fill="#006DF0"/>
                <path d="M48,38h-2c-0.553,0-1,0.447-1,1s0.447,1,1,1h2c0.553,0,1-0.447,1-1S48.553,38,48,38z" fill="#006DF0"/>
                <path d="M51.29,38.29C51.109,38.479,51,38.74,51,39s0.109,0.52,0.29,0.71C51.479,39.89,51.74,40,52,40s0.52-0.11,0.71-0.29   C52.89,39.52,53,39.26,53,39s-0.11-0.521-0.29-0.71C52.33,37.92,51.66,37.92,51.29,38.29z" fill="#006DF0"/>
                <path d="M52,27H30c-0.553,0-1,0.447-1,1s0.447,1,1,1h22c0.553,0,1-0.447,1-1S52.553,27,52,27z" fill="#006DF0"/>
                <path d="M52,33H30c-0.553,0-1,0.447-1,1s0.447,1,1,1h22c0.553,0,1-0.447,1-1S52.553,33,52,33z" fill="#006DF0"/>
            </symbol>
            <!--虚拟身份-->
            <symbol id="virtual" viewBox="0 0 500 500" width="50" height="50">
                <path d="M240.476,247.619h-33.333v-32.333l1.005-0.567c24.971-14.048,41.948-39.243,45.738-67.629     c6.519-7.69,10.4-17.743,10.4-28.529v-20.31c0-9.505-4.457-17.052-11.295-20.31C244.69,32.624,205.886,0,159.524,0     c-25.8,0-49.814,10.129-67.852,28.571H40.476v4.762c0,18.957,10.157,35.548,25.281,44.743c-3.49,1.652-6.367,4.324-8.31,7.638H50     c-7.876,0-14.286,6.41-14.286,14.286v5.19c-13.49,2.281-23.81,14.014-23.81,28.143v38.095c0,15.757,12.814,28.571,28.571,28.571     h4.762c10.505,0,19.048,8.543,19.048,19.048v31.071c-16.619,5.905-28.571,21.743-28.571,40.357v4.762h9.524v-4.762     c0-13.262,7.805-24.71,19.048-30.071v34.833h9.524v-37.714c1.562-0.224,3.143-0.381,4.762-0.381h36.462l44.49,34.605     l44.49-34.605h36.462c18.376,0,33.333,14.952,33.333,33.333v4.762h9.524v-4.762C283.333,266.848,264.11,247.619,240.476,247.619z      M50.267,38.095h45.5l1.414-1.505c16.367-17.452,38.51-27.067,62.343-27.067c39.824,0,74.657,28.219,83.452,66.59     c-11.619-0.805-21.881-8.024-26.519-18.843l-9.314-21.748l-9.314,21.743c-4.929,11.495-16.19,18.924-28.695,18.924H92.857     C70.833,76.19,52.643,59.495,50.267,38.095z M219.071,76.19h-23.857c4.824-4.029,8.781-9.143,11.367-15.171l0.562-1.305     l0.562,1.31C210.29,67.048,214.252,72.162,219.071,76.19z M64.285,95.324c0-5.3,4.31-9.61,9.61-9.61h18.962h76.276h76.024     c5.833,0,9.605,4.919,9.605,12.538v20.31c0,15.21-9.748,28.567-23.705,32.471c-11.429,3.19-22.952,0.648-31.624-6.986     l-1.343-1.19h-77.133l-1.348,1.19c-7.724,6.805-18.043,9.629-28.267,7.757c-15.676-2.862-27.057-17.186-27.057-34.062V95.324z      M45.238,100c0-2.624,2.133-4.762,4.762-4.762h4.762v0.086v22.419v6.067H50c-2.629,0-4.762-2.052-4.762-4.676V100z      M111.906,247.619H78.571c-1.609,0-3.195,0.105-4.761,0.281v-28.852c0-15.757-12.814-28.571-28.571-28.571h-4.762     c-10.505,0-19.048-8.543-19.048-19.048v-38.095c0-8.848,6.09-16.243,14.286-18.371v4.171c0,7.876,6.41,14.2,14.286,14.2h7.51     c1.771,4.762,4.362,9.414,7.6,13.314c3.681,28.557,20.681,53.929,45.79,68.052l1.005,0.586V247.619z M197.619,250.052     l-38.095,29.629l-38.095-29.629v-29.41l9.024,5.076c8.857,4.981,18.91,7.614,29.071,7.614c10.162,0,20.214-2.633,29.071-7.614     l9.024-5.076V250.052z M203.476,206.419l-19.548,11c-14.871,8.362-33.938,8.362-48.81,0l-19.548-11     c-19.214-10.81-33.119-28.962-38.824-49.971c3.938,2.238,8.257,3.881,12.89,4.729c12.524,2.286,25.11-0.914,34.862-8.795h70.052     c7.733,6.271,17.057,9.538,26.795,9.533c4.052,0,8.176-0.567,12.281-1.714c3.048-0.852,5.924-2.076,8.629-3.571     C236.51,177.562,222.619,195.652,203.476,206.419z" fill="#006DF0"/>
                <rect x="83.333" y="119.048" width="128.571" height="9.524" fill="#006DF0"/>
                <rect x="221.429" y="119.048" width="14.286" height="9.524" fill="#006DF0"/>
            </symbol>
            <!--MAC-->
            <symbol id="mac" viewBox="0 0 1000 1000" width="50" height="50">
                <path d="M479.4,408h-51V142.8h51c39.372,0,71.4-32.028,71.4-71.4S518.772,0,479.4,0S408,32.028,408,71.4v51H142.8v-51    C142.8,32.028,110.772,0,71.4,0S0,32.028,0,71.4s32.028,71.4,71.4,71.4h51V408h-51C32.028,408,0,440.028,0,479.4    s32.028,71.4,71.4,71.4s71.4-32.028,71.4-71.4v-51H408v51c0,39.372,32.028,71.4,71.4,71.4s71.4-32.028,71.4-71.4    S518.772,408,479.4,408z M428.4,71.4c0-28.152,22.848-51,51-51c28.152,0,51,22.848,51,51s-22.848,51-51,51h-51V71.4z M122.4,479.4    c0,28.152-22.848,51-51,51s-51-22.848-51-51s22.848-51,51-51h51V479.4z M122.4,122.4h-51c-28.152,0-51-22.848-51-51    s22.848-51,51-51s51,22.848,51,51V122.4z M408,408H142.8V142.8H408V408z M479.4,530.4c-28.152,0-51-22.848-51-51v-51h51    c28.152,0,51,22.848,51,51C530.4,507.552,507.552,530.4,479.4,530.4z" fill="#006DF0"/>
                <path d="M35.7,479.4c0,2.856,2.244,5.1,5.1,5.1s5.1-2.244,5.1-5.1c0-14.076,11.424-25.5,25.5-25.5c2.856,0,5.1-2.244,5.1-5.1    s-2.244-5.1-5.1-5.1C51.816,443.7,35.7,459.816,35.7,479.4z" fill="#006DF0"/>
                <path d="M71.4,35.7c-19.584,0-35.7,16.116-35.7,35.7c0,2.856,2.244,5.1,5.1,5.1s5.1-2.244,5.1-5.1c0-14.076,11.424-25.5,25.5-25.5    c2.856,0,5.1-2.244,5.1-5.1S74.256,35.7,71.4,35.7z" fill="#006DF0"/>
                <path d="M484.5,40.8c0-2.856-2.244-5.1-5.1-5.1c-19.584,0-35.7,16.116-35.7,35.7c0,2.856,2.244,5.1,5.1,5.1s5.1-2.244,5.1-5.1    c0-14.076,11.424-25.5,25.5-25.5C482.256,45.9,484.5,43.656,484.5,40.8z" fill="#006DF0"/>
                <path d="M479.4,443.7c-19.584,0-35.7,16.116-35.7,35.7c0,2.856,2.244,5.1,5.1,5.1s5.1-2.244,5.1-5.1    c0-14.076,11.424-25.5,25.5-25.5c2.856,0,5.1-2.244,5.1-5.1S482.256,443.7,479.4,443.7z" fill="#006DF0"/>
            </symbol>
            <!--轨迹-->
            <symbol id="path" viewBox="0 0 500 500" width="50" height="50">
                <path d="M263.999,8.144c-18.223,0-32.998,14.786-32.998,33.024c0,18.242,14.775,33.026,32.998,33.026   C282.225,74.194,297,59.41,297,41.168C297,22.93,282.225,8.144,263.999,8.144z" fill="#006DF0"/>
                <ellipse cx="33" cy="255.832" rx="33" ry="33.025" fill="#006DF0"/>
                <path d="M178.701,95.883l48.232-24.133c-4.556-5.519-7.896-12.072-9.635-19.244l-48.232,24.133   C173.622,82.157,176.962,88.71,178.701,95.883z" fill="#006DF0"/>
                <path d="M159.23,251.188c-4.338-5.914-7.353-12.852-8.618-20.379l-71.381,11.905c1.184,4.173,1.832,8.569,1.832,13.116   c0,2.91-0.274,5.755-0.771,8.523L159.23,251.188z" fill="#006DF0"/>
                <path d="M185.499,176.379l-21.94-32.938c-5.424,4.737-11.912,8.278-19.059,10.205l21.94,32.936   C171.863,181.847,178.352,178.307,185.499,176.379z" fill="#006DF0"/>
                <path d="M197.998,189.783c-18.225,0-33,14.782-33,33.023c0,18.236,14.775,33.023,33,33.023c18.226,0,33.003-14.787,33.003-33.023   C231.001,204.565,216.224,189.783,197.998,189.783z" fill="#006DF0"/>
                <ellipse cx="131.999" cy="107.219" rx="32.999" ry="33.024" fill="#006DF0"/>
            </symbol>
            <!--场所-->
            <symbol id="site" viewBox="0 0 60 60" width="50" height="50">
                <circle cx="4.002" cy="28" r="4.001" fill="#006DF0"/>
                <g>
                    <path d="M6.023,20.004c3.309,0,6,2.691,6,6.004h4.002C16.025,20.492,11.537,16,6.023,16V20.004z" fill="#006DF0"/>
                </g>
                <g>
                    <path d="M5.996,12c7.719,0,14.002,6.285,14.002,14.008H24C24,16.078,15.924,8,5.996,8V12z" fill="#006DF0"/>
                </g>
                <g>
                    <path d="M5.996,4C18.129,4,28,13.871,28,26.008h4C32,11.664,20.337,0,5.996,0V4z" fill="#006DF0"/>
                </g>
            </symbol>
        </svg>

        <!--<svg width="30" height="35"><use xlink:href="#heart"/></svg>-->
        
        <div class="info" style="display:none;"></div>
        <div class="map"></div>
        <div class="option_bar" style="display:none;">
            <button type="button" class="btn btn-default" style="font-size:12px;" @click="addPerson()" >新增人员</button>
            <button type="button" class="btn btn-default" style="font-size:12px;" @click="addRelation()" >添加关系</button>
        </div>

        <!--详细内容展示区域-->
        <div class="infoContent" :class="{infoShow:infoShow}">
            <div class="holder">
                <Scroll :listen="contentData" ref="detailScroll" :store="store">
                    <div class="item" v-for="c in contentData">
                        <div class="unit" v-for="(val,key) in c">
                            <span>{{key}}:</span>{{val}}
                        </div>
                    </div>
                </Scroll>
                <!--关闭按钮-->
                <div class="closeBtn" @click="infoShow=false"><i class="fa fa-angle-right"></i></div>
            </div>
        </div>
        <!--提示窗体-->
        <div class="tipinfoPop" name="tipinfoPop"></div>
    </div>
</template>

<script>

import * as d3 from 'd3'
import {Nav_Page_Switch,GetAnalyTaskData,RelationSecond} from '../store/mutation-types'
import Scroll from 'components/scroll'
export default {
  name: 'Relation',
  props:['store','blnNoInit','taskid'],
  components:{Scroll},
  data () {
    return {
      taskType:'',//任务类型
      transformX:0,//画布X轴移动位置
      transformY:0,//画布Y轴移动位置
      contentData:[],//二次查询详细内容数据
      infoShow:false,//详细内容框是否显示
      tipDom:null,//提示窗体对象
      svg:null,
      rect:null,
      simulation:null,//力学图实例化对象
      cline:null,//动态链接关系之间的线条
      startTarget:-1,
      endTarget:-1,
      img_w:30,
      img_h:30,
      radius:15,
      distance:200,
      edges_line:null,
      edges_text:null,
      nodes_img:null,
      nodes_text:null,
      nodes_icon:null,
      text_dx:-20,
      text_dy:10,
      imgaes:[],
      texts:[],
      blnDroging:false,//是否正在拖动中
      blnDrog:true,//是否允许拖动
      blnDrowLine:false,//是否连线
      data:{
        // "nodes":[{ id:0, "name": "行为分析" ,type:'image',"image" : "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494497445139&di=28f7608bde97b96a41bb9f92fc94cb81&imgtype=0&src=http%3A%2F%2Fimg.taopic.com%2Fuploads%2Fallimg%2F140320%2F240381-1403200H43713.jpg" }],
        // "edges":[]
        "nodes":[
            { id:0, "name": "行为分析" ,type:'image',top:100,"image" : "static/relation/2.png" },
            { id:1,"name": "50010919861212533",type:"text",left:true},
            { id:2,"name": "经常出入场所",type:"text",right:true,sep:50},
            { id:3,"name": "最后2次所在场所",type:"text",right:true,sep:50},
            { id:4,"name": "上网频次分析",type:"text",right:true,sep:50},
            { id:5,"name": "上网路线图",type:"text",right:true,sep:50},
            { id:6,"name": "银河网吧",type:"text",right:true,distance:100,sep:10},
            { id:7,"name": "太阳神网吧",type:"text",right:true,distance:100,sep:10},
            { id:8,"name": "新大陆网络会所",type:"text",right:true,distance:100,sep:10},
            { id:10, "name": "安全数据" ,type:'image',left:true,"image" : "static/relation/3.png" },
            { id:9, "name": "真实身份" ,type:'image',left:true,"image" : "static/relation/1.png" },
            { id:11, "name": "好友分析" ,type:'image',left:true,"image" : "static/relation/4.png" },
            { id:12,"name": "实名信息",type:"text",left:true,distance:80},
            { id:13,"name": "重点人员",type:"text",left:true,distance:80},
            { id:14,"name": "在逃人员",type:"text",left:true,distance:80},
            { id:15,"name": "刷卡记录轨迹",type:"text",left:true,distance:80},
            { id:16,"name": "上下机记录轨迹",type:"text",left:true,distance:80},
            { id:17,"name": "虚拟身份",type:"text",left:true,distance:80},
            { id:18,"name": "右键 论坛 搜索",type:"text",left:true,distance:80},
            { id:19,"name": "u盘目录列表",type:"text",left:true,distance:80},
            { id:20,"name": "真实好友",type:"text",left:true,distance:100},
            { id:21,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:22,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:23,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:24,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:25,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:26,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:27,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:28,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:29,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:30,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:31,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:32,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:33,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:34,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:35,"name": "500109198612122533",type:"text",left:true,distance:100,sep:15},
            { id:36,"name": "银河网吧",type:"text",right:true,distance:100,sep:10},
            { id:37,"name": "新大陆网络会所",type:"text",right:true,distance:100,sep:10},
            { id:38,"name": "一周7天分析",type:"text",right:true,distance:80,sep:10},
            { id:39,"name": "一天24小分析",type:"text",right:true,distance:80,sep:10},
            { id:40,"name": "到场所的行为轨迹",type:"text",right:true,distance:100,sep:10},
            { id:41,"name": "网络好友",type:"text",top:600,right:true,distance:400,sep:10},
            { id:42,"name": "好友",type:"text",right:true,distance:100,sep:30},
            { id:43,"name": "家人",type:"text",right:true,distance:100,sep:30},
            { id:44,"name": "同学",type:"text",right:true,distance:100,sep:30},
            { id:45,"name": "同事",type:"text",right:true,distance:100,sep:30},
            { id:46,"name": "老乡",type:"text",right:true,distance:100,sep:30},
            { id:47,"name": "陌生人",type:"text",right:true,distance:100,sep:30},
            { id:48,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:49,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:50,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:51,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:52,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:53,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:54,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:55,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:56,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:57,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:58,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            { id:59,"name": "QQ:52165010",type:"text",right:true,distance:100,sep:15},
            ],
        "edges":[
            { "source": 0 , "target": 1 , "relation":"" },
            { "source": 0 , "target": 2 , "relation":"" },
            { "source": 0 , "target": 3 , "relation":"" },
            { "source": 0 , "target": 4 , "relation":"" },
            { "source": 0 , "target": 5 , "relation":"" },
            { "source": 2 , "target": 6 , "relation":"" },
            { "source": 2 , "target": 7 , "relation":"" },
            { "source": 2 , "target": 8 , "relation":"" },
            { "source": 1 , "target": 9 , "relation":"" },
            { "source": 1 , "target": 11 , "relation":"" },
            { "source": 1 , "target": 10 , "relation":"" },
            { "source": 9 , "target": 12 , "relation":"" },
            { "source": 9 , "target": 13 , "relation":"" },
            { "source": 9 , "target": 14 , "relation":"" },
            { "source": 10 , "target": 15 , "relation":"" },
            { "source": 10 , "target": 16 , "relation":"" },
            { "source": 10 , "target": 17 , "relation":"" },
            { "source": 10 , "target": 18 , "relation":"" },
            { "source": 10 , "target": 19 , "relation":"" },
            { "source": 11 , "target": 20 , "relation":"" },
            { "source": 20 , "target": 21 , "relation":"" },
            { "source": 20 , "target": 22 , "relation":"" },
            { "source": 20 , "target": 23 , "relation":"" },
            { "source": 20 , "target": 24 , "relation":"" },
            { "source": 20 , "target": 25 , "relation":"" },
            { "source": 20 , "target": 26 , "relation":"" },
            { "source": 20 , "target": 27 , "relation":"" },
            { "source": 20 , "target": 28 , "relation":"" },
            { "source": 20 , "target": 29 , "relation":"" },
            { "source": 20 , "target": 30 , "relation":"" },
            { "source": 20 , "target": 31 , "relation":"" },
            { "source": 20 , "target": 32 , "relation":"" },
            { "source": 20 , "target": 33 , "relation":"" },
            { "source": 20 , "target": 34 , "relation":"" },
            { "source": 20 , "target": 35 , "relation":"" },
            { "source": 3 , "target": 36 , "relation":"" },
            { "source": 3 , "target": 37 , "relation":"" },
            { "source": 4 , "target": 38 , "relation":"" },
            { "source": 4 , "target": 39 , "relation":"" },
            { "source": 5 , "target": 40 , "relation":"" },
            { "source": 11 , "target": 41 , "relation":"" },
            { "source": 41 , "target": 42 , "relation":"" },
            { "source": 41 , "target": 43 , "relation":"" },
            { "source": 41 , "target": 44 , "relation":"" },
            { "source": 41 , "target": 45 , "relation":"" },
            { "source": 41 , "target": 46 , "relation":"" },
            { "source": 41 , "target": 47 , "relation":"" },
            { "source": 42 , "target": 48 , "relation":"" },
            { "source": 42, "target": 49 , "relation":"" },
            { "source": 43 , "target": 50 , "relation":"" },
            { "source": 43, "target": 51 , "relation":"" },
            { "source": 44 , "target": 52 , "relation":"" },
            { "source": 44, "target": 53 , "relation":"" },
            { "source": 45 , "target": 54 , "relation":"" },
            { "source": 45, "target": 55 , "relation":"" },
            { "source": 46 , "target": 56 , "relation":"" },
            { "source": 46, "target": 57 , "relation":"" },
            { "source": 47 , "target": 58 , "relation":"" },
            { "source": 47, "target": 59 , "relation":"" },
            ]
        }
    }
  },
  mounted(){
      this.tipDom=$(this.$el).find('div[name="tipinfoPop"]');

      //订阅页面切换事件
      let store=this.$store || this.store;
      store.commit(Nav_Page_Switch,menu=>{
        if(menu.keyid!='11013' && this.simulation){
            this.simulation.stop();
        }
      });
      if(this.blnNoInit){return;}
      this.load();
      //加载数据
      //先清空画布上的东西
      setTimeout(()=>{
        this.simulation.stop();
        d3.selectAll('defs').remove();
        this.edges_line.remove();
        this.edges_line=[];
        this.nodes_img.remove();
        this.nodes_img=[];
        this.edges_text.remove();
        this.edges_text=[];
        this.nodes_text.remove();
        this.nodes_text=[];
        this.nodes_icon.remove();
        this.nodes_icon=[];
        this.data.nodes=[];
        this.data.edges=[];
        store.dispatch(GetAnalyTaskData,{id:this.taskid || 1695117}).then(res=>{
            if(!tool.msg(res,'','获取数据失败!'))return;
            this.taskType=res.biz_body.task_target_type;
            //映射对象
            let root={id:0,"name":res.biz_body.keyword,type:"text"};
            this.data.edges=[{ "source": 0 , "target": 1 , "relation":"" }];
            let child=[],index=0,limit=3;
            _.each(res.biz_body.datas,(d,i)=>{
                index++;
                switch(d.table_name){
                    case 'customer'://实名数据
                        let tarIndex=index;
                        child.push({id:tarIndex,"name":'实名数据',type:"icon",right:true,icon:'idcard'})
                        this.data.edges.push({ "source": 0 , "target": index , "relation":"" });
                        if(d.data.length>limit){
                            let data=d.data.splice(0,limit-1);
                            _.each(data,(c,ci)=>{
                                index++;
                                 child.push({id:index,"name":c['姓名'],type:"text",right:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndex , "target": index , "relation":"" });
                            });
                            index++;
                            child.push({id:index,"name":'更多',type:"text",left:true,pop:true,data:d.data,datatype:d.table_name})
                            this.data.edges.push({ "source": tarIndex , "target": index , "relation":"" });
                        }else{
                            _.each(d.data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['姓名'],type:"text",right:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndex , "target": index , "relation":"" });
                            });
                        }

                        break;
                    case 'vid'://虚拟身份
                        let tarIndexVid=index;
                        child.push({id:tarIndexVid,"name":'虚拟身份',type:"icon",right:true,icon:'virtual'})
                        this.data.edges.push({ "source": 0 , "target": index , "relation":"" });
                        if(d.data.length>limit){
                            let data=d.data.splice(0,limit-1);
                            _.each(data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['虚拟身份类型'],type:"text",right:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexVid , "target": index , "relation":"" });
                            });
                            index++;
                            child.push({id:index,"name":'更多',type:"text",left:true,pop:true,data:d.data,datatype:d.table_name})
                            this.data.edges.push({ "source": tarIndexVid , "target": index , "relation":"" });
                        }else{
                            _.each(d.data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['虚拟身份类型'],type:"text",right:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexVid , "target": index , "relation":"" });
                            });
                        }
                        break;
                    case 'mobile'://手机
                        let tarIndexMobile=index;
                        child.push({id:tarIndexMobile,"name":'手机',type:"icon",right:true,icon:'mobile'})
                        this.data.edges.push({ "source": 0 , "target": index , "relation":"" });

                        if(d.data.length>limit){
                            let data=d.data.splice(0,limit-1);
                            _.each(data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['手机号'],type:"text",right:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexMobile , "target": index , "relation":"" });
                            });
                            index++;
                            child.push({id:index,"name":'更多',type:"text",left:true,pop:true,data:d.data,datatype:d.table_name})
                            this.data.edges.push({ "source": tarIndexMobile , "target": index , "relation":"" });
                        }else{
                            _.each(d.data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['手机号'],type:"text",right:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexMobile , "target": index , "relation":"" });
                            });
                        }
                        break;
                    case 'mac'://MAC
                        let tarIndexMac=index;
                        child.push({id:tarIndexMac,"name":'MAC',type:"icon",left:true,icon:'mac'})
                        this.data.edges.push({ "source": 0 , "target": index , "relation":"" });
                        if(d.data.length>limit){
                            let data=d.data.splice(0,limit-1);
                            _.each(data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['MAC'],type:"text",left:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexMac , "target": index , "relation":"" });
                            });
                            index++;
                            child.push({id:index,"name":'更多',type:"text",left:true,pop:true,data:d.data,datatype:d.table_name})
                            this.data.edges.push({ "source": tarIndexMac , "target": index , "relation":"" });
                        }else{
                            _.each(d.data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['MAC'],type:"text",left:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexMac , "target": index , "relation":"" });
                            });
                        }
                        break;
                    case 'site'://场所
                        let tarIndexSite=index;
                        child.push({id:tarIndexSite,"name":'场所',type:"icon",left:true,icon:'site'})
                        this.data.edges.push({ "source": 0 , "target": index , "relation":"" });
                        
                         if(d.data.length>limit){
                            let data=d.data.splice(0,limit-1);
                            _.each(data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['场所名称'] || c['场所编码'],type:"text",left:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexSite , "target": index , "relation":"" });
                            });
                            index++;
                            child.push({id:index,"name":'更多',type:"text",left:true,pop:true,data:d.data,datatype:d.table_name})
                            this.data.edges.push({ "source": tarIndexSite , "target": index , "relation":"" });
                        }else{
                            _.each(d.data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['场所名称'] || c['场所编码'],type:"text",left:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexSite , "target": index , "relation":"" });
                            });
                        }
                        break;
                    case 'log': //轨迹
                        let tarIndexLog=index;
                        child.push({id:tarIndexLog,"name":'轨迹',type:"icon",left:true,icon:'path'})
                        this.data.edges.push({ "source": 0 , "target": index , "relation":"" });

                        if(d.data.length>limit){
                            let data=d.data.splice(0,limit-1);
                            _.each(data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['场所名称'] || c['场所编码'],type:"text",left:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexLog , "target": index , "relation":"" });
                            });
                            index++;
                            child.push({id:index,"name":'更多',type:"text",left:true,pop:true,data:d.data,datatype:d.table_name})
                            this.data.edges.push({ "source": tarIndexLog , "target": index , "relation":"" });
                        }else{
                            _.each(d.data,(c,ci)=>{
                                index++;
                                child.push({id:index,"name":c['场所名称'] || c['场所编码'],type:"text",left:true,tip:true,data:c,datatype:d.table_name})
                                this.data.edges.push({ "source": tarIndexLog , "target": index , "relation":"" });
                            });
                        }
                        break;
                }

            });
            this.data.nodes=[root,...child];
             setTimeout(()=>{
                this.$nextTick(()=>{
                    this.restart();
                    this.simulation.restart();
                });
             },100);
        });
      },100);
  },
  methods:{
      load(){
        setTimeout(()=>{
            this.init($(this.$el).find('.map').width(),$(this.$el).find('.map').height());
        },100);
      },
      stop(){
        this.simulation.stop();
      },
      destroy(){
        if(!this.simulation)return;
        this.simulation.stop();
        this.simulation=null;
      },
      //新增人员
      addPerson(){
        this.data.nodes.push(
            { id:3,"name": "笑笑"   , "image" : "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1494497445139&di=28f7608bde97b96a41bb9f92fc94cb81&imgtype=0&src=http%3A%2F%2Fimg.taopic.com%2Fuploads%2Fallimg%2F140320%2F240381-1403200H43713.jpg" }
        );

        this.restart();
      },
      //添加关系
      addRelation(){
        this.blnDrog=!this.blnDrog;
        this.blnDrowLine=!this.blnDrowLine;
      },
      dragsubject(){
        return this.simulation.find(d3.event.x, d3.event.y);
      },
      dragstarted(){
        if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
        d3.event.subject.fx = d3.event.subject.x;
        d3.event.subject.fy = d3.event.subject.y;
        if(this.blnDrog || !this.blnDrowLine){return}
        this.cline.attr('x1',d3.event.subject.x);
        this.cline.attr('y1',d3.event.subject.y);
        this.cline.attr('x2',d3.event.subject.x);
        this.cline.attr('y2',d3.event.subject.y);
      },
      dragged() {
          if(this.blnDrog){
            this.blnDroging=true;
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
          }else if(this.blnDrowLine){
            this.cline.attr('x2',d3.event.x);
            this.cline.attr('y2',d3.event.y);
          }
      },
      dragended(d) {
        this.blnDroging=false;
        if (!d3.event.active) this.simulation.alphaTarget(0.3);
        d3.event.subject.fx = null;
        d3.event.subject.fy = null;
        if(this.blnDrog || !this.blnDrowLine){return}
        this.cline.attr('x1',0);
        this.cline.attr('y1',0);
        this.cline.attr('x2',0);
        this.cline.attr('y2',0);
        if(this.endTarget<0){return;}
        this.data.edges.push({source:this.startTarget,target:this.endTarget,relation:'朋友'});
        //this.restart();
      },
      restart(){
        let self=this;
        var img_w = this.img_w;
        var img_h = this.img_h;
        var radius = this.radius; 
        self.simulation.nodes(self.data.nodes);
        this.images=_.filter(self.data.nodes,node=>{return node.type=='image'});
        this.texts=_.filter(self.data.nodes,node=>{return node.type=='text'});
        this.icons=_.filter(self.data.nodes,node=>{return node.type=='icon'});
        
        self.simulation.force("link").links(self.data.edges).distance((d)=>{
            let edge = d;
            let node = _.find(self.data.nodes,(node)=>{return node.id==edge.target.id}) || {};
           
            return node.distance || self.distance;
        });

        self.svg.selectAll(".r_line")
                        .data(self.data.edges)
                        .enter()
                        .append("line")
                        .attr('class','r_line');
        self.edges_line = self.svg.selectAll(".r_line");


        self.svg.selectAll(".linetext")
                            .data(self.data.edges)
                            .enter()
                            .append("text")
                            .attr("class","linetext")
                            .text(function(d){
                                return d.relation || '';
                            });
        self.edges_text=self.svg.selectAll(".linetext");

        // 圆形图片节点（人物头像）
        self.svg.selectAll("image")
                    .data(self.images)
                    .enter()
                    .append("circle")
                    .attr("class", "circleImg")
                    .attr("r", radius)
                    .attr("id",(d)=>{return "circleImg"+d.id;})
                    .attr("fill", function(d, i){
                        //创建圆形图片
                        var defs = self.svg.append("defs").attr("id", "imgdefs")

                        var catpattern = defs.append("pattern")
                                                .attr("id", "catpattern" + i)
                                                .attr("height", 1)
                                                .attr("width", 1)

                        catpattern.append("image")
                                .attr("x", - (img_w / 2 - radius))
                                .attr("y", - (img_h / 2 - radius))
                                .attr("width", img_w)
                                .attr("height", img_h)
                                .attr("xlink:href", d.image)

                        return "url(#catpattern" + i + ")";

                    }).on("mousedown",function(d,i){
                        self.startTarget=d.id;
                    })
                    .on("mouseenter",function(d,i){
                        self.endTarget=d.id;
                    })
                    .on("mouseleave",function(d,i){
                        self.endTarget=-1;
                    })
                    .call(d3.drag()
                        .container(document.querySelector("svg"))
                        .subject(self.dragsubject)
                        .on("start", self.dragstarted)
                        .on("drag", self.dragged)
                        .on("end", self.dragended));
            self.nodes_img=self.svg.selectAll(".circleImg");
            
            self.svg.selectAll(".nodetext")
                        .data(self.texts)
                        .enter()
                        .append("text")
                        .attr("class",(d)=>{return "nodetext"+(d.tip?" tipinfo":d.pop?' popInfo':'') +(d.tipContent?" tipContent":'');})
                        .attr('id',(d)=>{return 'nodetext'+d.id})
                        .attr("dx",self.text_dx)
                        .attr("dy",self.text_dy)
                        .text(function(d){
                            return d.name;
                        })
                        .call(d3.drag()
                        .container(document.querySelector("svg"))
                        .subject(self.dragsubject)
                        .on("start", self.dragstarted)
                        .on("drag", self.dragged)
                        .on("end", self.dragended));

            self.nodes_text = self.svg.selectAll(".nodetext").on('mouseover',function(d){
                let s=$(this),dx=parseFloat(s.attr('dx')),dy=parseFloat(s.attr('dy')),x=parseFloat(s.attr('x')),y=parseFloat(s.attr('y')),blnHover=s.attr('class').indexOf('tipinfo')>=0;
                if(!blnHover)return;
                if(!d.data)return;
                let html=_.map(d.data,(val,key)=>{return `<div class="tip_item"><span>${key}:</span>${val}</div>`;})

                self.tipDom.children().remove();
                self.tipDom.append(html);
                let domH=self.tipDom.height();
                self.tipDom.css({
                    top:(y+dy-s[0].getBBox().height/2-domH/2-11)+self.transformY+'px',
                    left:(x+dx+s[0].getBBox().width+10)+self.transformX+'px',
                    display:'block',
                    'z-index':100,
                    'opacity':1,
                });  
            }).on('mouseout',function(){
                let s=$(this),blnHover=s.attr('class').indexOf('tipinfo')>=0;
                if(!blnHover)return;
                self.tipDom.css({'opacity':0,'z-index':-1,top:-10000+'px',left:-10000+'px'});
            }).on('click',function(d){
                if(d.pop){//更多弹窗
                    tool.open(function(){
                        let html=_.map(d.data,(d,i)=>{
                            let item=_.map(d,(val,key)=>{
                                    return  `<div class="item"><span style="color:#2f3341;">${key}</span><span style="margin:0px 5px;">:</span>${val}</div>`
                                }).join(''); 
                            return `<div class="relation_item">
                                        <div class="number"><div><div><span>${i+1}</span></div></div></div><div class="content">${item}</div>
                                    </div>`;
                        }).join('');
                        let param={
                            title:'更多信息',
                            area:['600px','300px'],
                            content:`<div class="relativeTmp" style="width:100%;height:100%;overflow-y:auto;">${html}</div>`,
                        };

                        return param;
                    }());
                    return;
                }

                if(d.tipContent){
                    //二次查询结果集展示
                    self.contentData = d.data;
                    self.infoShow=true;
                    return;
                }
                if(!d.tip)return;
                //二次查询单击
                let store=self.$store || self.store;
                let vidType='',keyword='';
                switch(d.datatype){
                    case 'customer'://实名数据
                        keyword=d.data['身份证编码'];
                        break;
                    case 'vid'://虚拟身份
                        vidType=d.data['虚拟身份类型'];
                        keyword=d.data['虚拟身份账号'];
                        break;
                    case 'mobile'://手机
                        keyword=d.data['手机号'];
                        break;
                    case 'mac'://MAC
                        keyword=d.data['MAC'];
                        break;
                    case 'site'://场所

                        break;
                    case 'log'://轨迹

                        break;
                }
                if(d.datatype=='site' || d.datatype=='log' || d.hasChild){return;}
                d.hasChild=true;

                store.dispatch(RelationSecond,{
                    task_target_type:self.taskType,
                    account_type:vidType,
                    keyword:keyword})
                    .then(res=>{
                        if(!tool.msg(res,'','获取数据失败!'))return;
                        let data=res.biz_body;
                        let limitNum=5;//限制每个子节点的节点多(节点过多用户体验不好)
                        
                        _.each(data,(val,m)=>{
                            let _index = self.data.nodes.length;
                            switch(m){
                                case 'customers':
                                    if(val.length<=0)break;
                                    if(val.length>limitNum){
                                        //转化真实身份数据为展示格式数据
                                        val=_.map(val,v=>{
                                            return {'姓名':v.customer_name,
                                                    '证件号':v.certificate_code,
                                                    '证件类型':v.certificate_type,
                                                    '使用日期':tool.DateByTimestamp(v.last_time || '','yyyy-MM-dd hh:mm:ss')}
                                        });
                                        self.data.nodes.push({id:_index,"name":'真实身份('+val.length+')',type:"text",tipContent:true,right:d.right,left:d.left,data:val});
                                        self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                        break;
                                    }
                                    self.data.nodes.push({id:_index,"name":'真实身份',type:"text",right:d.right,left:d.left});
                                    self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                    _.each(val,v=>{
                                        let index = self.data.nodes.length;
                                        self.data.nodes.push({id:index,"name":v.certificate_code,type:"text",right:d.right,left:d.left});
                                        self.data.edges.push({ "source": _index , "target": index , "relation":"" });
                                    })
                                    break;
                                case 'mobiles':
                                    if(val.length<=0)break;
                                    if(val.length>limitNum){
                                        //转化手机数据为展示格式数据
                                        val=_.map(val,v=>{
                                            return {'手机号':v.mobile,
                                                    '使用日期':tool.DateByTimestamp(v.last_time || '','yyyy-MM-dd hh:mm:ss')}
                                        });
                                        self.data.nodes.push({id:_index,"name":'手机('+val.length+')',type:"text",tipContent:true,right:d.right,left:d.left,data:val});
                                        self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                        break;
                                    }
                                    self.data.nodes.push({id:_index,"name":'手机',type:"text",right:d.right,left:d.left});
                                    self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                    _.each(val,v=>{
                                        let index = self.data.nodes.length;
                                        self.data.nodes.push({id:index,"name":v.mobile,type:"text",right:d.right,left:d.left});
                                        self.data.edges.push({ "source": _index , "target": index , "relation":"" });
                                    })
                                    break;
                                case 'virtuals':
                                    if(val.length<=0)break;
                                    if(val.length>limitNum){
                                        //转化虚拟身份数据为展示格式数据
                                        val=_.map(val,v=>{
                                            return {'账号':v.account,
                                                    '昵称':v.account_nick,
                                                    '账号类型':v.account_type,
                                                    '登录日期':tool.DateByTimestamp(v.last_time || '','yyyy-MM-dd hh:mm:ss')}
                                        });

                                        self.data.nodes.push({id:_index,"name":'虚拟身份('+val.length+')',type:"text",tipContent:true,right:d.right,left:d.left,data:val});
                                        self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                        break;
                                    }
                                    self.data.nodes.push({id:_index,"name":'虚拟身份',type:"text",right:d.right,left:d.left});
                                    self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                    _.each(val,v=>{
                                        let index = self.data.nodes.length;
                                        self.data.nodes.push({id:index,"name":v.account,type:"text",right:d.right,left:d.left});
                                        self.data.edges.push({ "source": _index , "target": index , "relation":"" });
                                    })
                                    break;
                                case 'macs':
                                    if(val.length<=0)break;
                                    if(val.length>limitNum){
                                        //转化MAC数据为展示格式数据
                                        val=_.map(val,v=>{
                                            return {'mac':v.mac,
                                                    '使用日期':tool.DateByTimestamp(v.last_time || '','yyyy-MM-dd hh:mm:ss')}
                                        });
                                        self.data.nodes.push({id:_index,"name":'Mac('+val.length+')',type:"text",tipContent:true,right:d.right,left:d.left,data:val});
                                        self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                        break;
                                    }
                                    self.data.nodes.push({id:_index,"name":'Mac',type:"text",right:d.right,left:d.left});
                                    self.data.edges.push({ "source": d.id , "target": _index , "relation":"" });
                                    _.each(val,v=>{
                                        let index = self.data.nodes.length;
                                        self.data.nodes.push({id:index,"name":v.mac,type:"text",right:d.right,left:d.left});
                                        self.data.edges.push({ "source": _index , "target": index , "relation":"" });
                                    })
                                    break;
                            }
                        })

                         self.$nextTick(()=>{
                            self.restart();
                            self.simulation.restart();
                        });
                    });
            });


            //ICON
            self.svg.selectAll(".nodeIcon")
                        .data(self.icons)
                        .enter()
                        .append('svg')
                        .attr('class','nodeIcon')
                        .attr('id',(d)=>{return 'nodeIcon'+d.id})
                        .append('svg')
                        .attr('width',30)
                        .attr('height',35)
                        .append('use')
                        .attr('xlink:href',function(d){ return '#'+d.icon});

            self.svg.selectAll(".nodeIcon").selectAll(".nodeIconText").remove();
            self.svg.selectAll(".nodeIcon")
                        .append('text')
                        .attr('class','nodeIconText')
                        .attr('dy',function(){return 35;})
                        .text((d)=>{return d.name;});
            self.nodes_icon=self.svg.selectAll(".nodeIcon");
      },
      //初始化关系图
      init(w,h){
        let self=this;
        let startTarget=-1,endTarget=-1;
        var width = w;
        var height = h;
        var img_w = this.img_w;
        var img_h = this.img_h;
        var radius = this.radius; 
        var text_dx=this.text_dx;
        var text_dy=this.text_dy;
        var distance=self.distance;
        var downEven=null;//案件按下事件
        var transformVal=[0,0];

        function rescale() {
            if(!downEven){return;}
            self.svg.attr("transform",
                "translate(" + (d3.event.clientX-downEven.clientX) +","+ (d3.event.clientY-downEven.clientY) + ")");
        }

        this.rect = d3.select(".Relation .map").append("svg")
                    .attr('id','svg_relation')
                    .attr('class','svg_class')
                    .attr("width",w)
                    .attr("height",h);

        this.svg=this.rect.append('svg:g')
            .on("mousedown",()=>{
                downEven=d3.event;
            }) 
            .on("mouseup",()=>{downEven=null}); 

        this.svg.call(d3.zoom()
            .scaleExtent([1 / 2, 4])
            .on("zoom", ()=>{
                if(!d3.event.sourceEvent)return;
                downEven=downEven || {clientX:0,clientY:0};
                transformVal[0]=transformVal[0]+(d3.event.sourceEvent.clientX-downEven.clientX);
                transformVal[1]=transformVal[1]+(d3.event.sourceEvent.clientY-downEven.clientY);

                self.svg.attr("transform",
                "translate(" +  transformVal[0] +","+ transformVal[1] + ")");
                downEven=d3.event.sourceEvent;
                self.transformX=transformVal[0];
                self.transformY=transformVal[1];

                // self.svg.attr("transform",
                // "translate(" +  transformVal[0] +","+ transformVal[1] + ")" + " scale("+d3.event.transform.k+","+d3.event.transform.k+")");
                // downEven=d3.event.sourceEvent;
            }));

        this.svg.append('svg:rect')
        .attr('width', w)
        .attr('height', h)
        .attr('fill', 'white');

        this.simulation = d3.forceSimulation()
                             .force("link", d3.forceLink().id(function(d) { return d.id; }))
                             .force("collide", d3.forceCollide().radius(function(d) {
                                  if(d.type=='image'){
                                    return 80;
                                  }else if(d.type=='text'){
                                    return d.sep || 20;
                                  }else if(d.type=='icon'){
                                    return 50;
                                  }
                                  return 10; 
                              }))
                             .force("charge", d3.forceManyBody())
                             .force("center", d3.forceCenter(w/2-100, h / 2))
                             .on("tick", ticked);
    

         this.cline=this.svg.selectAll(".c_line")
                                .data([1])
                                .enter()
                                .append("line")
                                .attr('class','c_line')
                                .style("stroke","#ccc")
                                .style("stroke-width",2);

        this.restart();
        
        function ticked(){
            //限制结点的边界
            self.images.forEach(function(d,i){
                // d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
                // d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
                // d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
                // d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
                if(!self.blnDroging){
                    d.y=d.top || d.y;
                }
            });
            self.data.nodes.forEach(function(d,i){
                if(!self.blnDroging){
                    d.y=d.top || d.y;
                }
            });

            // //更新连接线的位置
            self.edges_line.attr("x1",function(d){
                if(d.source.type=='image'){
                    d.source.el = d.source.el || $('#circleImg'+d.source.id)[0];
                }else if(d.source.type=='icon'){
                    d.source.el = d.source.el || $('#nodeIcon'+d.source.id)[0];
                }else{
                    d.source.el = d.source.el || $('#nodetext'+d.source.id)[0];
                }
                if(d.target.left){
                    switch(d.source.type){
                        case 'image':
                            return d.source.x-d.source.el.getBBox().width/2+text_dx;
                            break;
                        case 'text':
                            return d.source.x+text_dx;
                            break;
                        case 'icon':
                            return d.source.x;
                            break;
                    }
                    //return d.source.x-(d.source.type=='text'?d.source.el.getBBox().width:d.source.el.getBBox().width/2)+text_dx;
                }
                if(d.target.right){
                    switch(d.source.type){
                        case 'image':
                            return d.source.x + d.source.el.getBBox().width/2+text_dx;
                            break;
                        case 'text':
                            return d.source.x + d.source.el.getBBox().width+text_dx;
                            break;
                        case 'icon':
                            return d.source.x+30;
                            break;
                    }
                   //return d.source.x +  (d.source.type=='text'?d.source.el.getBBox().width:d.source.el.getBBox().width/2)+text_dx;
                }

                return d.source.x+text_dx;; 
            });
            self.edges_line.attr("y1",function(d){ 
                 switch(d.source.type){
                        case 'image':
                            return d.source.y; 
                            break;
                        case 'text':
                            return d.source.y; 
                            break;
                        case 'icon':
                            return d.source.y+18;
                            break;
                    }
            });

            self.edges_line.attr("x2",function(d){
                if(self.blnDroging){
                    if(d.target.type=='icon'){
                        return d.target.x+30;
                    }
                    return d.target.x;
                }
                if(d.target.left){
                    d.target.lineX=d.source.x-(d.target.distance || distance);
                    d.target.x=d.target.lineX;
                    if(d.target.type=='icon'){
                        return d.target.x+30;
                    }
                    return d.target.x;
                    //return d.source.x-200;
                }else if(d.target.right){
                    d.target.lineX=d.source.x+(d.target.distance || distance);
                    d.target.x=d.target.lineX;
                    return d.target.lineX;

                    //return d.source.x+200;
                } 

                return d.target.x; 
            });
            
            self.edges_line.attr("y2",function(d){ 
                if(d.target.type=='icon'){
                    return d.target.y +18; 
                }else{
                    return d.target.y;
                }
                return d.target.y;
            });

            //更新连接线上文字的位置
            self.edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
            self.edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });


            //更新结点图片和文字
            self.nodes_img.attr("cx",function(d){ return d.x });
            self.nodes_img.attr("cy",function(d){ return d.y });

            self.nodes_text.attr("x",function(d){
                if(d.left && d.type=='text'){
                    d.x=d.x-text_dx-this.getBBox().width;
                }
                if(d.right && d.type=='text'){
                    d.x=d.x-text_dx;
                }

                return d.x 
            });

            self.nodes_text.attr("y",function(d){
                if(d.type=='text'){
                    return d.y-this.getBBox().height/2+text_dy/2;
                }
                return d.y + img_w/2; 
            });

            //跟新Icon图片显示位置
            self.nodes_icon.attr("x",function(d){ return d.x });
            self.nodes_icon.attr("y",function(d){ return d.y });

            //跟新Icon图片下的文字位置
            self.nodes_icon.selectAll('.nodeIconText').attr('dy',function(d){return 35+this.getBBox().height/2;});
            self.nodes_icon.selectAll('.nodeIconText').attr('dx',function(d){return ((30-this.getBBox().width)/2<0?0:(30-this.getBBox().width)/2);});
        } 
      }
  }

}
</script>
<style lang="less">
    @import "../css/variables.less";
    .nodeIconText,
    .nodetext {
        font-size: 12px ;
        font-family: 微软雅黑;
        fill:@HeaderBgCol;
    }
    
    .nodetext.popInfo,
    .nodetext.tipContent,
    .nodetext.tipinfo{cursor:pointer;}

    .linetext {
        font-size: 14px ;
        font-family: 微软雅黑;
        fill:@btn_Bg_Col_hover_1;
        fill-opacity:1;
    }

    .circleImg {
        stroke-width: 3px;
    }

    .r_line{
        stroke:@btn_Bg_Col_5;
        stroke-width:1px;
    }
    .map .svg_class{position:absolute;left:0px;top:0px;}
    .Relation .tipinfoPop .tip_item{line-height:20px;}
    
    .relation_item {.border('bottom');padding:5px 10px;position:relative;}
    .relation_item .item{display:inline-block;width:50%;font-size:12px;}

    @numberW:30px;
    .relation_item .number{height:100%;width:@numberW;position:absolute;}
    .relation_item .number div{height: 100%;display: table;width: 100%;text-align: center;}
    .relation_item .number div div{display: table-cell;vertical-align: middle;}
    .relation_item .number div div span{width: 26px;display: block;height: 26px;font-size: 12px;border-radius: 13px;background-color: @Font_Hover_Col;color: white;padding-top: 5px;}
    .relation_item .content{display:inline-block;width:~"calc(100% - @{numberW})";margin-left:@numberW;}

</style>
<style scoped lang="less">
    @import "../css/variables.less";
    @option_barH:0px;
    @infoW:0px;
    .Relation{width:100%;height:100%;background-color:@FrontCol;position:relative;overflow:hidden;}
    .Relation .map{width:~"calc(100% - @{infoW} )";height:~"calc(100% - @{option_barH} )";}

    .Relation .option_bar{width:~"calc(100% - @{infoW} )";height: @option_barH;.border('top');text-align:left;line-height:@option_barH;padding:0px 10px;}
    .Relation .info{float:right;width:@infoW;height:100%;.border('left');}

    .Relation .tipinfoPop{
        position:absolute;z-index:-1;top:0px;.border("");background-color:@BgCol;border-radius:5px;
        text-align:left;font-size:12px;padding:10px;.transAtt(opacity);
        -moz-box-shadow: 2px 2px 2px #666;
        -webkit-box-shadow: 2px 2px 2px #666@BgCol;
        box-shadow: 2px 2px 2px #666;

    }
    .Relation .tipinfoPop:before{
        content: '';
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-right: 10px solid @BgCol;
        border-bottom: 5px solid transparent;
        position: absolute;
        left: -10px;
        top: 50%;
        margin-top: -2.5px;

    }

    //详细内容展示区域
    @infoContenW:400px;
    .Relation .infoContent{
        width:@infoContenW;height:100%;.border('left');position:absolute;right:-@infoContenW;top:0px;.trans(.3s);background-color:white;
    }
    .Relation .infoContent .holder{height:100%;width:100%;position:relation;}
    .Relation .infoContent .holder .closeBtn{
        position:absolute;background-color:@Font_Hover_Col;top:50%;left:-28px;padding:15px 10px;margin-top:-25px;border-top-left-radius:5px;border-bottom-left-radius:5px;
        cursor:pointer;display:none;
    }
    .Relation .infoContent .holder .closeBtn:hover{background-color:green;}
    .Relation .infoContent .holder .closeBtn i{font-size:20px;color:white;}
    .Relation .infoContent.infoShow{right:0px;-moz-box-shadow:-1px 1px 2px #666; -webkit-box-shadow:-1px 1px 5px #666; box-shadow:-1px 1px 5px #666;}
    .Relation .infoContent.infoShow .closeBtn{display:block;}

    .Relation .infoContent .item{.border('bottom');padding:10px;font-size:12px;}
    .Relation .infoContent .item .unit{width:50%;display:inline-block;}
</style>
