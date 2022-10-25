<template>
    <a-layout class="main-page">
        <a-layout>
            <Navigation />
            <a-layout style="padding: 0 27px 27px">
                <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
import Navigation from "./views/components/navbar.vue"
// import SideBar from "./views/components/sidebar.vue"

</script>

<style scoped lang="css">
.main-page{
    height:100%;
}
</style>