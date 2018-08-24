<!-- 导航组件 -->
<template>
    <div class="Test">
        <div style="position:absolute;top:100px;left:100px;right:200px;bottom:200px;">
          <v-table :listen="data">
              <v-table-header>
                <v-table-column v-show="blnShow" :width="50" :title="123">
                    
                 
                    <i @click.stop="placeCodeOrder=!placeCodeOrder" :class="{'fa fa-check-square-o':placeCodeOrder,'fa fa-square-o':!placeCodeOrder}" ></i>
                    
                </v-table-column>
                <v-table-column :width="100" :title="123">
                    
                    <span style="margin-right:5px;">场所编码</span>
                 
                    <i class="fa fa-caret-up" :class="{active:!placeCodeOrder}" @click="orderChange('placeCodeOrder',false);"></i><i class="fa fa-caret-down" :class="{active:placeCodeOrder}" @click="orderChange('placeCodeOrder',true);"></i>
                    
                </v-table-column>
                

                <v-table-column :width="1000">标识</v-table-column>
                <v-table-column :width="500">内容</v-table-column>
              </v-table-header>
              <v-table-body>
                  <v-table-row v-for="d in data">
                    <v-table-column v-show="blnShow" :width="50" :title="123">
                    
                      <i :class="{'fa fa-check-square-o':placeCodeOrder,'fa fa-square-o':!placeCodeOrder}" ></i>
                    </v-table-column>
                    <v-table-column :title="d.name">
                        <span style="margin-right:5px;">场所编码</span>
                    
                    </v-table-column>
                    <v-table-column>{{d.id}}</v-table-column>
                    <v-table-column>{{d.content}}</v-table-column>
                  </v-table-row>
              </v-table-body>
          </v-table>
        </div>
        <button style="position:absolute;bottom:0px;" @click="blnShow=!blnShow">Test</button>
        <button style="position:absolute;bottom:30px;" @click="data.push({name:5,id:4,content:''})">添加</button>
    </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      data:[
        {name:1,id:2,content:'421421'},{name:2,id:3,content:'421421'},{name:3,id:4,content:'421421'},{name:3,id:4,content:'421421'},{name:3,id:4,content:'421421'},{name:3,id:4,content:'421421'}
      ],
      placeCodeOrder:false,
      blnShow:false,
    }
  },
  methods:{
     orderChange(){
       this.placeCodeOrder=!this.placeCodeOrder;
       //console.log(this.placeCodeOrder);
     }
  }
}
</script>
<style scoped lang="less">
.Test{width:100%;height:100%;}

</style>
