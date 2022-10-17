<template>
    <a-layout class="main-page">
        <router-view></router-view>
    </a-layout>
</template>

<script setup lang="ts">

</script>

<style>
.main-page {
  background: unset;
}
.main-page{
    height:100vh;
}
.component-header {
  margin: 1% 1% 1% 0%;
  border-bottom: solid 1px #b7b7b7;
  font-family: 'Lato';
  font-weight: bold;
  background: #f7f7f7;
}
.tooltip .tooltiptext {
  visibility: hidden;
  background-color: white;
  /* text-align: center; */
  padding: 5px 5px;
  border-radius: 6px;
  border: solid 1px black;
  /* Position the tooltip text */
  position: absolute;
  z-index: 3;
  /* Fade in tooltip */
  opacity: 0;
  transition: opacity 0.3s;
  font-family: Georgia;
}

.tooltip .top-tooltiptext {
  width: 120px;
  margin-left: -60px;
  bottom: 100%;
  left: 50%;
}

.tooltip .right-tooltiptext {
  /* left: 125%; */
  /* width: max-content; */
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>