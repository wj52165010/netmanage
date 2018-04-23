
import cInput from 'components/Input'
import {AddCase,UpdateCase} from '../../store/mutation-types'
export default {
  addCase(dp){
    dp=dp || [];
    let d=dp.slice(0,dp.length-1)[0] || '';
    let callback=dp[dp.length-1];

    let s=this;
    let html=`
            <cInput label="案件名称" @change="nameChange" :val="name" />

            <div style="line-height: 40px;margin-top: 10px;border-bottom: 1px solid;color: #bdbdbd;">
                <div style="float:left;width:80px;padding-left: 5px;">案发日期</div>
                <div style="margin-left:80px;"><el-date-picker style="width:100%;" v-model="time" type="datetime" placeholder="案发日期" :picker-options="beforeToday"> </el-date-picker></div>
            </div>

            <cInput label="案发地点" @change="addressChange" :val="address" />

            <div style="color:#bdbdbd;line-height: 30px;padding-left: 5px;">备注</div>
            <textarea rows="3" v-model="remarke" style="width: 100%;resize:none;outline:none;"></textarea>

            <div style="margin-top:10px; text-align:right;">
                <button type="button" class="btn btn-success" style="font-size:12px;"  @click="submit">确定</button> 
                <button type="button" class="btn btn-default" style="font-size:12px;" @click="cancel">取消</button>
            </div>
        `;
    tool.open(function(){
        let param={
            title:d?'修改':'新增',
            area:'400px',
            content:`<div class="caseManagePop" style="width:100%;height:100%;overflow-y:auto;padding:10px;">${html}</div>`,
            components:{cInput},
            context:{
                beforeToday:{//限制只能选择今天之前的日期
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                blnAdd:false,
                name:d?d.name ||'':'',//案件名称
                time:d?d.law_case_time?new Date(tool.DateByTimestamp(d.law_case_time,'yyyy-MM-dd hh:mm:ss')):'':'',//案发时间
                address:d?d.address ||'':'',//案发地点
                clue:d?d.clue ||'':'',//线索信息
                remarke:d?d.law_case_note ||'':'',//备注
                nameChange(val){param.selfData.name=val;},
                addressChange(val){param.selfData.address=val;},
                submit(){
                    let data=param.selfData;
                    if(data.blnAdd){return;}
                    data.blnAdd=true;
                    if(!data.name || !data.time || !data.address){
                        tool.info('案件名,案发时间,案发地点,必填!');
                        data.blnAdd=false;
                        return;
                    }
                    
                    if(!d){
                        //添加案件
                        s.$store.dispatch(AddCase,{
                            law_case_title:data.name,
                            law_case_status:'running',
                            law_case_place:data.address,
                            law_case_time:tool.Timestamp(data.time),
                            law_case_note:data.remarke || ''
                        }).then(res=>{
                            if(!tool.msg(res,'新增成功!','新增失败!')) return;
                            callback(res.biz_body[0]);

                            param.close();
                        });
                    }else{
                        //修改案件
                        let temp={
                            law_case_id:d.law_case_id,
                            law_case_title:data.name,
                            law_case_status:data.law_case_status,
                            law_case_place:data.address,
                            law_case_time:tool.Timestamp(data.time),
                            law_case_note:data.remarke || ''
                        };
                        s.$store.dispatch(UpdateCase,temp).then(res=>{
                            if(!tool.msg(res,'修改成功!','修改失败!')) return;
                            callback(temp);

                            param.close();
                        });
                    }

                },
                cancel(){
                    param.close();
                }
            }
        };

    return param;
    }());     
  }
}