<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import HomeView from "./pages/HomeView.vue";
</script>
<template>
  <header>
    <NavBar />
  </header>
  <section>
    <HomeView />
    <!-- <RouterView /> -->
  </section>
</template>
<style></style>
