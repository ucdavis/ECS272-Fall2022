<template>
  <a-table :row-selection="rowSelection" :data-source="myData" :columns="columns" :scroll="{ y: 100 }" :pagination="{ pageSize: 10 }">
    <template #filterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          Search
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Reset
        </a-button>
      </div>
    </template>
    <template #filterIcon="filtered">
      <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
    </template>
    <template #customRender="{ text, column }">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
          v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
            v-if="fragment.toLowerCase() === searchText.toLowerCase()"
            class="highlight"
            :key="i"
          >
            {{ fragment }}
          </mark>
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
      <template v-else>
        {{ text }}
      </template>
    </template>
  </a-table>
</template>

<script>
import { SearchOutlined } from '@ant-design/icons-vue';
import { defineComponent, reactive, ref, toRefs } from 'vue';
let data = [];
// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//   },
//   {
//     key: '2',
//     name: 'Joe Black',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//   },
//   {
//     key: '3',
//     name: 'Jim Green',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//   },
//   {
//     key: '4',
//     name: 'Jim Red',
//     age: 32,
//     address: 'London No. 2 Lake Park',
//   },
// ];
export default defineComponent({
  components: {
    SearchOutlined,
  },
  name: 'Table',

  props:{ // received data from others
      myData: Array
  },
  watch: { 
      myData: function(newVal, oldVal) { // watch it
          data = this.myData;
      }
  },
  setup(props, context) {
    const state = reactive({
      searchText: '',
      searchedColumn: ''
    });
    const searchInput = ref();
    const columns = [
      {
        title: 'Singer',
        dataIndex: 'singer',
        key: 'singer',
        slots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender',
        },
        onFilter: (value, record) =>
          record.singer.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              console.log(searchInput.value);
              searchInput.value.focus();
            }, 100);
          }
        },
      },
    ];
    let selectText = '';
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // this.$emit('selectCenterChange', "test");
            if (selectedRows.length>0){
              console.log(selectedRows[0].singer);
              selectText = String(selectedRows[0].singer);
            }
            else{
              selectText = '';
            }
            context.emit("selectCenterChange", selectText);
        },
        getCheckboxProps: record => ({
            disabled: record.singer === 'Disabled User',
            // Column configuration not to be checked
            singer: record.singer,
        }),
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        state.searchText = selectedKeys[0];
        state.searchedColumn = dataIndex;
    };

    const handleReset = clearFilters => {
        clearFilters();
        state.searchText = '';
    };

    return {
        data,
        columns,
        rowSelection,
        handleSearch,
        handleReset,
        searchInput,
        ...toRefs(state),
        selectText
    };
  },
  method: {
      update_selection(){
          console.log("test");  
      }
  },
});
</script>
<style scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>