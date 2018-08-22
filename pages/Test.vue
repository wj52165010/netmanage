<!-- 导航组件 -->
<template>
    <div class="Test">
        <div style="position:absolute;top:100px;left:100px;right:200px;bottom:200px;">
          <v-table :listen="data">
              <v-table-header>
                <v-table-column :width="100" :title="123">
                    姓名
                </v-table-column>
                <v-table-column :width="1500">标识</v-table-column>
                <v-table-column :width="1500">内容</v-table-column>
              </v-table-header>
              <v-table-body>
                  <v-table-row v-for="d in data">
                    <v-table-column :title="d.name">{{d.name}}</v-table-column>
                    <v-table-column>{{d.id}}</v-table-column>
                    <v-table-column>{{d.content}}</v-table-column>
                  </v-table-row>
              </v-table-body>
          </v-table>
        </div>
        <button style="position:absolute;bottom:0px;" @click="data.push({name:5,id:4,content:''})">Test</button>
    </div>
</template>

<script>
import {VTable,VTableBody,VTableHeader,VTableColumn,VTableRow} from 'components/table/index'
export default {
  name: 'Test',
  components:{VTable,VTableBody,VTableHeader,VTableColumn,VTableRow},
  data () {
    return {
      data:[
        {name:1,id:2,content:'421421'},{name:2,id:3,content:'421421'},{name:3,id:4,content:'421421'}
      ]
    }
  }
}
</script>
<style scoped lang="less">
.Test{width:100%;height:100%;}

</style>
