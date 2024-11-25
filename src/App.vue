<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>タイムトラッカー</q-toolbar-title>
        <q-tabs>
          <q-route-tab to="/timer" label="時間記録" />
          <q-route-tab to="/analysis" label="分析" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <RouterView />
    </q-page-container>
  </q-layout>
</template>