<template>
    <div id="app">
      <NavbarData />
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  import NavbarData from "./components/NavbarData.vue";
  
  export default {
    name: "App",
    components: {
      NavbarData,
    },
  };
  </script>
  
  <style scoped>
  </style>
  