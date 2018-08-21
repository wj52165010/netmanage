<!-- 导航组件 -->
<template>
    <div class="Test">
        <v-table :data="data">
            <v-table-header ></v-table-header>
            <v-table-body>
                <v-table-column>1</v-table-column>
                <v-table-column>2</v-table-column>
                <v-table-column>3</v-table-column>
            </v-table-body>
        </v-table>
    </div>
</template>

<script>
import {VTable,VTableBody,VTableHeader,VTableColumn} from 'components/table/index'
export default {
  name: 'Test',
  components:{VTable,VTableBody,VTableHeader,VTableColumn},
  data () {
    return {
      data:[
        {name:1},{name:2},{name:3}
      ]
    }
  }
}
</script>
<style scoped lang="less">
.Test{width:100%;height:100%;}

</style>
