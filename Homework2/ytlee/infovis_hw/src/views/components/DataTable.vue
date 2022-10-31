<template>
    <a-table
        :dataSource="data" 
        :columns="columns"
        :pagination="{pageSize:100}"
        :expandRowByClick="true"
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
        </template>
        <!-- <template #expandedRowRender>
            <a-table :columns="innerColumns" :data-source="innerData" :pagination="false">
                <template #bodyCell="{ column }">
                    <template v-if="column.key === 'state'">
                        <span>
                        <a-badge status="success" />
                        Finished
                        </span>
                    </template>
                    <template v-else-if="column.key === 'operation'">
                        <span class="table-operation">
                        <a>Pause</a>
                        <a>Stop</a>
                        <a-dropdown>
                            <template #overlay>
                            <a-menu>
                                <a-menu-item>Action 1</a-menu-item>
                                <a-menu-item>Action 2</a-menu-item>
                            </a-menu>
                            </template>
                            <a>
                            More
                            <down-outlined />
                            </a>
                        </a-dropdown>
                        </span>
                    </template>
                </template>
            </a-table>
        </template> -->
    </a-table>
</template>
<script setup lang="ts">
import * as vue from "vue" 
import { Ref, ref } from "vue"

const props = defineProps({
    data: Object as () => any,
    columns: Object as () => any,
    selected_artist: String,
})
const searchInput = ref();
const searchText: Ref<string> = ref("")
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
    const rows = document.querySelectorAll(".ant-table-row")
    rows.forEach(row => {
        row.addEventListener("click", (e) => {
            emit("update:selected_artist", e.target.parentNode.firstElementChild.innerText)
        })
    })
})
</script>