<template>
    <a-table
        :dataSource="data" 
        :columns="columns"
        :pagination="{pageSize:100}"
        :scroll="{y:200}" >
        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
        <div style="padding: 8px">
            <a-input
                ref="searchInput"
                :placeholder="`Search ${column.dataIndex}`"
                :value="selectedKeys[0]"
                style="width: 188px; margin-bottom: 8px; display: block"
                @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"/>
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
        <template #customFilterIcon="{ filtered }">
            <search-outlined :style="{ color: filtered ? '#108ee9' : 'black' }" />
        </template>
        <template #bodyCell="{ text, column, record }">
            <span v-if="searchText && searchedColumn === column.dataIndex ">
                <template 
                    v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))" >
                    <mark
                        v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                        :key="i"
                        class="highlight"
                    >
                        {{ fragment }}
                    </mark>
                    <template v-else>{{ fragment }}</template>
                </template>
            </span>
            <span v-else> {{ column.map(text) }} </span>
        </template>
        <!-- <template #expandedRowRender="{record}">
            <a-table :columns="innerColumns" :data-source="record.songs" :pagination="false">
                <template #bodyCell="{ text, column }">
                    <span> {{ text }} </span>
                </template>
            </a-table>
        </template> -->
    </a-table>
</template>

<script setup lang="ts">
import * as vue from "vue" 
import { Ref, ref } from "vue"
import { SearchOutlined } from '@ant-design/icons-vue'

const columns = [
    {
        title: "Artist",
        dataIndex: "artist",
        key: "artist",
        map: d => d,
        customFilterDropdown: true,
        clickable: true,
        onFilter: (value, record) =>
          record.artist.toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              searchInput.value.focus();
            }, 100);
          }
        }
    },
    {
        title: "# of Songs",
        dataIndex: "songs",
        key: "songs",
        map: d => d,
        clickable: false,
        defaultSortOrder: 'descend',
        sorter: (a: TableDataType, b: TableDataType) => a.songs - b.songs,
    }
]

const props = defineProps({
    data: Object as () => any,
    selected_artist: String,
})
const searchInput = ref(); const searchText: Ref<string> = ref("")
const searchedColumn: Ref<string> = ref("")

const emit = defineEmits(["update:selected_artist"])
const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      searchText.value = selectedKeys[0];
      searchedColumn.value = dataIndex;
    };

const handleReset = clearFilters => {
    clearFilters({ confirm: true });
    searchText.value = '';
};

vue.onMounted(() => {
    addRowClickListener()
})

function addRowClickListener() {
    const rows = document.querySelectorAll(".ant-table-row")
    rows.forEach(row => {
        row.addEventListener("click", (e) => {
            emit("update:selected_artist", e.target.parentNode.children[0].innerText)
        })
    })
}

defineExpose({
    addRowClickListener,
})
</script>
<style scoped lang="scss">
:deep(.ant-table-row) {
    font-size: 0.7rem;
}
:deep(.ant-table-cell) {
    padding: 3px 16px;
}
</style>