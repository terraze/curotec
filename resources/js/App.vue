<script lang="ts">
import { defineComponent } from 'vue'
import NavBar from './components/NavBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    NavBar
  }
})
</script>

<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template> 