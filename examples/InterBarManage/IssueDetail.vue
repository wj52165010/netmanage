<!-- 问题详情页面组件 -->
<template>
    <div class="IssueDetail">
      <!--标题栏-->
      <div class="title_bar">
        {{date.toString('yyyy年MM月')}}
        <div class="option_bar">
            <i class="fa fa-angle-left"  @click="reduceMonth()" />
            <i class="fa fa-angle-right" @click="addMonth()" style="margin-left:10px;" />
        </div>
      </div>
      <!--日期显示区域-->
      <div class="dateShow">
        <ul class="row">
            <li>星期一</li>
            <li>星期二</li>
            <li>星期三</li>
            <li>星期四</li>
            <li>星期五</li>
            <li>星期六</li>
            <li>星期日</li>
        </ul>
        <ul v-for="d in data" class="row">
            <li v-for="c in d" :class="{curDate:c.blnCur,blnCurMonth:c.blnCurMonth}">
                {{c.val}}
                <i class="fa fa-exclamation-circle warm" v-if="c.alarm" />
            </li>
        </ul>
      </div>

      <!--分隔线-->
      <div class="sepLine"></div>
      
      <!--问题详情容器-->
      <div class="issue_container">
            <!--标题栏-->
            <div class="label_bar"><span class="title">问题详情 : </span>场所今天共使用外挂6次共计2小时03分钟</div>
            <!--列表容器-->
            <div class="list_container">
                <v-table :listen="listData">
                    <v-table-header>

                        <v-table-column>
                            <span style="margin-right:5px;">开始时间</span>
                            <i class="fa fa-caret-up" :class="{active:!placeOrder}" @click="placeOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeOrder}" @click="placeOrder=true"></i>
                        </v-table-column>

                        <v-table-column>
                            <span style="margin-right:5px;">使用时长</span>
                            <i class="fa fa-caret-up" :class="{active:!placeOrder}" @click="placeOrder=false"></i><i class="fa fa-caret-down" :class="{active:placeOrder}" @click="placeOrder=true"></i>
                        </v-table-column>

                        <v-table-column>
                            外挂名称
                        </v-table-column>

                        <v-table-column>
                            进程名称
                        </v-table-column>

                    </v-table-header>

                    <v-table-body>
                        <v-table-row v-for="d in listData">
                            <v-table-column>{{d.name}}</v-table-column>
                            <v-table-column>{{d.firm}}</v-table-column>
                            <v-table-column>{{d.region}}</v-table-column>
                            <v-table-column>{{d.region}}</v-table-column>
                        </v-table-row>
                    </v-table-body>
                </v-table>
            </div>
      </div>

    </div>
</template>

<script>
export default {
  name: 'IssueDetail',
  data () {
    return {
      date:new XDate(),
      data:[
        [{val:1,blnCur:false,alarm:true,blnCurMonth:false},{val:2,blnCur:false,alarm:false,blnCurMonth:false},{val:3,blnCur:false,alarm:false,blnCurMonth:false},{val:4,blnCur:false,alarm:false,blnCurMonth:false},{val:5,blnCur:false,alarm:false,blnCurMonth:false},{val:6,blnCur:false,alarm:false,blnCurMonth:false},{val:7,blnCur:false,alarm:false,blnCurMonth:false}],
        [{val:1,blnCur:false,alarm:false,blnCurMonth:false},{val:2,blnCur:false,alarm:false,blnCurMonth:false},{val:3,blnCur:false,alarm:false,blnCurMonth:false},{val:4,blnCur:false,alarm:false,blnCurMonth:false},{val:5,blnCur:false,alarm:false,blnCurMonth:false},{val:6,blnCur:false,alarm:false,blnCurMonth:false},{val:7,blnCur:false,alarm:false,blnCurMonth:false}],
        [{val:1,blnCur:false,alarm:false,blnCurMonth:false},{val:2,blnCur:false,alarm:false,blnCurMonth:false},{val:3,blnCur:false,alarm:false,blnCurMonth:false},{val:4,blnCur:false,alarm:false,blnCurMonth:false},{val:5,blnCur:false,alarm:false,blnCurMonth:false},{val:6,blnCur:false,alarm:false,blnCurMonth:false},{val:7,blnCur:false,alarm:false,blnCurMonth:false}],
        [{val:1,blnCur:false,alarm:false,blnCurMonth:false},{val:2,blnCur:false,alarm:false,blnCurMonth:false},{val:3,blnCur:false,alarm:false,blnCurMonth:false},{val:4,blnCur:false,alarm:false,blnCurMonth:false},{val:5,blnCur:false,alarm:false,blnCurMonth:false},{val:6,blnCur:false,alarm:false,blnCurMonth:false},{val:7,blnCur:false,alarm:false,blnCurMonth:false}],
        [{val:1,blnCur:false,alarm:false,blnCurMonth:false},{val:2,blnCur:false,alarm:false,blnCurMonth:false},{val:3,blnCur:false,alarm:false,blnCurMonth:false},{val:4,blnCur:false,alarm:false,blnCurMonth:false},{val:5,blnCur:false,alarm:false,blnCurMonth:false},{val:6,blnCur:false,alarm:false,blnCurMonth:false},{val:7,blnCur:false,alarm:false,blnCurMonth:false}],
      ],
      listData:[],
      placeOrder:false,
    }
  },
  watch:{
    date(){this.calcDate();}
  },
  mounted(){
    this.calcDate();
  },
  methods:{
    //计算日期
    calcDate(){
        let firstDate=new XDate(this.date),s=this,curDate=new XDate();
        firstDate.setDate(1);
        let firstIndex=firstDate.getDay() || 7,days=XDate.getDaysInMonth(firstDate.getFullYear(),firstDate.getMonth());
        let lastIndex=0;

        //设置当月及之后的日期
        for(let i=firstIndex-1,j=1;i<35;i++,j++){
            let rowIndex=Math.floor(i/7),data=s.data[rowIndex];

            data[i%7].val=j<=days?j:++lastIndex;
            data[i%7].blnCurMonth=j<=days;
            
            //判断是否为当前日期
            if(j<=days){

                firstDate.setDate(j);
                data[i%7].blnCur=curDate.toString('yyyyMMdd')==firstDate.toString('yyyyMMdd');

            }else{
              
                let date=new XDate(firstDate),month=date.getMonth(),year=date.getFullYear();
                if(month==11){
                    date.setFullYear(year+1).setMonth(0);
                }else{
                    date.setMonth(month+1);
                }

                date.setDate(j);
                data[i%7].blnCur=curDate.toString('yyyyMMdd')==date.toString('yyyyMMdd');
            }
        }
        if(firstIndex==1) return;

        let beforeDate=new XDate(this.date);//上一月
        let month=firstDate.getMonth(),year=firstDate.getFullYear();

        if(month==0){
            beforeDate.setFullYear(year-1).setMonth(11);
        }else{
            beforeDate.setMonth(month-1);
        }
        let beforeDays=XDate.getDaysInMonth(beforeDate.getFullYear(),beforeDate.getMonth());

        //设置日期之前的数据
        for(let i=0;i<firstIndex-1;i++){
            let day =beforeDays-firstIndex+i+2;
            s.data[0][i].val=day;
            s.data[0][i].blnCurMonth=false;

            //判断是否为当前日期
            let date=new XDate(firstDate),month=date.getMonth(),year=date.getFullYear();
            if(month==0){
                date.setFullYear(year-1).setMonth(11);
            }else{
                date.setMonth(month-1);
            }

            date.setDate(day);
            s.data[0][i].blnCur=curDate.toString('yyyyMMdd')==date.toString('yyyyMMdd');
        }
    },
    //减少月
    reduceMonth(){
        let date=this.date,month=date.getMonth(),year=date.getFullYear();
        if(month==0){
            date.setFullYear(year-1).setMonth(11);
        }else{
            date.setMonth(month-1);
        }
        
        this.date=new XDate(date);
    },
    //增加月
    addMonth(){
        let date=this.date,month=date.getMonth(),year=date.getFullYear();
        if(month==11){
            date.setFullYear(year+1).setMonth(0);
        }else{
            date.setMonth(month+1);
        }

        this.date=new XDate(date);
    },
  }
}
</script>

<style scoped lang="less">
    @import "../../css/variables.less";
    .IssueDetail{width:100%;height:100%;}
    .title_bar{text-align:center;line-height:30px;position:relative;}
    .option_bar{position:absolute;right:50px;top: 2px;font-size: 20px;}

    .option_bar i:hover{cursor:pointer;}
    html{.TCol(~".option_bar i:hover");}

    .dateShow{.border('');width:702px;margin:auto;color:gray;}
    .row{list-style: none;margin:0px;padding:0px;}
    .row li{float:left;width:100px;text-align:center;line-height:30px;.border('right');position:relative;}
    .row li.blnCurMonth{color:black;}
    .row li:last-child{border-right:none;}
    .row {.border('bottom');}
    .row:last-child{border-bottom:none;}

    html{.TCol(~".row .curDate","bg");}
    .row .curDate{color:white !important;}
    .row .warm{float:right;position: absolute;right: 20px;top: 7px;color:red;}

    .sepLine{.border('top');width:96%;margin:10px auto;}

    .issue_container{width:702px;margin:auto;}

    .label_bar{text-align:left;}
    .label_bar .title{font-weight:600;margin-bottom:10px;}

    .list_container{width:100%;height:260px;margin-bottom:10px;padding-top:10px;}

    .list_container .fa-caret-up{position:absolute;top:8px;cursor:pointer;font-size:14px;color:gray;}
    .list_container .fa-caret-down{position:absolute;top:17px;cursor:pointer;font-size:14px;color:gray;}

    .list_container .fa-caret-up.active,
    .list_container .fa-caret-down.active,
    .list_container .fa-caret-up:hover,
    .list_container .fa-caret-down:hover{
        color:white;
    }

</style>
