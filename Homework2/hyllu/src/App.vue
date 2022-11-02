<template>
    <a-layout class="main-page">
        <Navigation />
        <a-layout id="main-layout">
            <a-layout style="padding: 0 10px 10px">
                <a-layout-content :style="{ background: '#eee', padding: '10px'}">
                    <router-view></router-view>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script setup lang="ts">
    import Navigation from "./views/components/navbar.vue"
    import SideBar from "./views/components/sidebar.vue"

</script>

<style>
    .main-page{
        height:100%;
        width:100%;

        border-style: solid;
        border-width: thin;
        border-color: #474141;
    }
    .main-layout{
        height:100%;
        width:100%;
    }
</style>