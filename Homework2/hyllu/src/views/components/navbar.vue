<template>
     <a-layout-header class="header">
     
      <a-menu
        :selectedKeys="selectedKey"
        theme="dark"
        mode="horizontal"
        class="header_button"
      >
        <a-menu-item key="1" > 
             <router-link to="/" >Home</router-link>
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
    .header{
        height:5%;
        width:100%;
    }
    .header_button{
        height:100%;
        width:10%;
        justify-content: center;
    }
</style>