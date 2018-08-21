<!-- 导航组件 -->
<template>
    <div class="Test">
        <v-table :data="data">
            <v-table-header>
              <v-table-column>姓名</v-table-column>
              <v-table-column>标识</v-table-column>
            </v-table-header>
            <v-table-body>
                <v-table-row v-for="d in data">
                  <v-table-column>{{d.name}}</v-table-column>
                  <v-table-column>{{d.id}}</v-table-column>
                </v-table-row>
            </v-table-body>
        </v-table>
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
        {name:1,id:2},{name:2,id:3},{name:3,id:4}
      ]
    }
  }
}
</script>
<style scoped lang="less">
.Test{width:100%;height:100%;}

</style>
