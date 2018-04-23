//任务类型类型
export default[
    {name:'同行分析',icon:'fa fa-group',val:'together',id:'同行分析'},
    {name:'关联分析',icon:'fa fa-usb',val:'correlation',id:'关联分析'},
    {name:'碰撞分析',icon:'fa fa-random',val:'collide',id:'碰撞分析'},
    {name:'行为分析',icon:'fa fa-share-alt',val:'behavior',id:'行为分析',blnDisabled:true}
]

//任务对象类型
export const taskObject=[
    {name: '身份证', val: 'cert',reg:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/},
    {name: '虚拟身份', val: 'vid'},
    {name: 'MAC地址', val: 'mac',reg:/([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}/},
    {name: '手机号', val: 'mobile',reg:/^[1][3,4,5,7,8][0-9]{9}$/},
    {name: 'imsi', val: 'imsi',reg:/^\d{15}$/},
]

//分析任务状态
export const taskStatus=[
    {name:'同行分析',val:'together'},
    {name:'关联分析',val:'correlation'},
    {name:'碰撞',val:'collide'}
]