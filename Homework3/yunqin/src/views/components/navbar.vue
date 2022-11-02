<template>
     <a-layout-header class="header">
      <div class="logo">CO2 Emission Around The World</div> 
      <a-menu
        :selectedKeys="selectedKey"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1"> 
             <router-link to="/">Home</router-link>
        </a-menu-item>
        <!-- <a-menu-item key="2">
             <router-link to="/about">About</router-link>
        </a-menu-item> -->
      </a-menu>
    </a-layout-header>
</template>

<script setup lang="ts">
    import {ref} from 'vue';
    const selectedKey = ref(['1'])
</script>

<style>
.logo {
  float: left;
  margin-right: 20px;
  font-size: large;
  color: white;
}
</style>