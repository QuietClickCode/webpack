<template>
    <div id="app">
        <router-view></router-view>
        <UpdateToast></UpdateToast>
    </div>
</template>

<script>
import UpdateToast from '@/components/UpdateToast';

export default {
    name: 'App',
    components: {
        UpdateToast
    }
}
</script>

<style scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
img {
  margin-top: 60px;
}
</style>
