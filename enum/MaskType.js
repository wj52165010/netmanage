//输入框掩码类型
let Mask_Type={
  'MAC':1,
  'LowerCase':2,
  'UpCase':3,
  'MacMobile':4,
  'ipNumber':5
};

export const mask=[
  {name:'MAC',val:1},
  {name:'小写',val:2},
  {name:'大写',val:3},
  {name:'手机|MAC',val:4},
  {name:'IPNumber',val:5}
];

export default Mask_Type;