<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Меню" @click="toggleLeftDrawer" />
        <q-toolbar-title> OTUS PWA — ДЗ 1 </q-toolbar-title>
        <q-badge color="white" text-color="primary" class="text-body2">
          v{{ version }}
        </q-badge>
      </q-toolbar>
    </q-header>

    <!--
      q-drawer — боковая панель навигации.
      v-model управляет видимостью через ref().
      show-if-above — показывать на широких экранах (десктоп) автоматически.
    -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header class="text-weight-bold text-grey-8">
          Навигация
        </q-item-label>

        <!--
          v-for пробегает по массиву navLinks.
          :to используется вместо @click + $router.push —
          это декларативный способ навигации через vue-router.
          v-ripple — материальный эффект нажатия (Quasar директива).
        -->
        <q-item
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ link.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// ref(false) — создаёт реактивную переменную.
// Когда leftDrawerOpen.value меняется, шаблон перерисовывается автоматически.
// .value нужно только в <script>, в шаблоне Vue автоматически «разворачивает» ref.
const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  // .value — способ чтения/записи реактивного значения внутри script setup
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// Обычный массив (не реактивный). Он не оборачивается в ref(),
// потому что его содержимое никогда не меняется после создания.
// Vue не будет отслеживать изменения этого массива — и это нормально,
// потому что изменений не будет.
const navLinks = [
  { to: '/', label: 'Главная', icon: 'home' },
  { to: '/about', label: 'О проекте', icon: 'info' },
  { to: '/vapor', label: 'Vapor Mode', icon: 'speed' },
];

// process.env.APP_VERSION подставляется на этапе сборки Vite.
// Значение берётся из quasar.config.ts → build.env.
// В итоговый бандл попадёт строка '0.0.1', а не обращение к process.env.
const version = process.env.APP_VERSION;
</script>
