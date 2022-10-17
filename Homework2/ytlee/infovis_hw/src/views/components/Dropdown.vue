<!-- <template>
  <a-dropdown>
    <a class="ant-dropdown-link" @click.prevent>
      {{ title_attribute }}
      <DownOutlined />
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item v-for="attribute in attribute_list">
          <span @click="handleClick($event, attribute)">{{attribute}}</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template> -->

<template>
  <div class="dropdown-container">
    <a-dropdown>
      <template #overlay>
        <a-menu @click="handleClick">
          <a-menu-item v-for="attribute in attribute_list" :key="attribute">
            <UserOutlined />
            {{ attribute }}
          </a-menu-item>
        </a-menu>
      </template>
      <a-button>
        {{ title_attribute }}
        <DownOutlined />
      </a-button>
    </a-dropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    DownOutlined,
  },
});
</script>

<script setup lang="ts">
import {Ref, ref} from "vue"
import * as vue from "vue"
const emit = defineEmits(["update:selected_attribute"])
const props = defineProps({
    attribute_list: Object as () => string[],
    selected_attribute: String,
})

const title_attribute: Ref<string> = ref("")
vue.onMounted(() => {
    title_attribute.value = props.selected_attribute || ""
})

function handleClick(e) {
    title_attribute.value = e.key
    emit('update:selected_attribute', e.key)
}

</script>
<style scoped lang="scss">
.dropdown-container{
    position:absolute;
}
</style>

