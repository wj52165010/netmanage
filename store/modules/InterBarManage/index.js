/**
 * 网吧管理
 */
import * as types from './types'

const state={
    
}




const actions={
    //发布停业计划
    [types.netbar_stop_add]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Stop_Add(data).then(res=>{
                resolve(res);
            });
        });
    },
    //查询停业计划列表
    [types.netbar_stop_plan_list]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Stop_Plan_List(data).then(res=>{
                resolve(res);
            });
        });
    },
    //停业计划列表导出
    [types.netbar_stop_plan_export]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Stop_Plan_Export(data).then(res=>{
                resolve(res);
            });
        });
    },
    //撤销停业计划列表
    [types.netbar_stop_cancel]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Stop_Plan_Cancel(data).then(res=>{
                resolve(res);
            });
        });
    },
    //上传通知附件
    [types.netbar_notice_attachment_upload]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Stop_Plan_Upload(data).then(res=>{
                resolve(res);
            });
        });
    },
    //发布通知
    [types.netbar_notice_add]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Notice_ADD(data).then(res=>{
                resolve(res);
            });
        });
    },
    //查询通知列表
    [types.netbar_notice_list]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Notice_List(data).then(res=>{
                resolve(res);
            });
        });
    },
    //通知详情
    [types.netbar_notice_detail]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Notice_Detail(data).then(res=>{
                resolve(res);
            });
        });
    },
    //通知签收列表
    [types.netbar_notice_sign_list]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Notice_Sign_List(data).then(res=>{
                resolve(res);
            });
        });
    },
    //通知回复列表
    [types.netbar_notice_reply_list]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Notice_Reply_List(data).then(res=>{
                resolve(res);
            });
        });
    },
    //通知删除
    [types.netbar_notice_del]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.NetBar_Notice_Remove(data).then(res=>{
                resolve(res);
            });
        });
    },
    //电子登记配置可用
    [types.netbar_electronic_option_allow]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.Netbar_Electronic_Option_Allow(data).then(res=>{
                resolve(res);
            });
        });
    },
    //电子登记列表
    [types.netbar_electronic_list]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.Netbar_Electronic_List(data).then(res=>{
                resolve(res);
            });
        });
    },
    //电子登记导出
    [types.netbar_electronic_list_export]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.Netbar_Electronic_Export(data).then(res=>{
                resolve(res);
            });
        });
    },
    //电子登记编辑可用次数
    [types.netbar_electronic_edit_allow]({commit},data){
        return new Promise((resolve,reject)=>{
            ser.Netbar_Electronic_Edit_Allow(data).then(res=>{
                resolve(res);
            });
        });
    },

}

export default{
    state,
    actions

}