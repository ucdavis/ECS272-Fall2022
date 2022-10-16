<template>
    <a-layout class="main-page">
        <Title />
        <a-layout>
            <a-layout style="padding: 0 24px 24px">
                <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import Title from "./views/components/titleBar.vue"

</script>

<style scoped lang="css">
.main-page{
    height:100%;
}
</style>