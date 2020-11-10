<template>
    <q-layout>
        <q-header class="bg-grey-2 text-black">
            <q-toolbar>
                <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" icon="mdi-menu" />

                <q-toolbar-title>
                    gojs & gantt
                    <router-link to="/">gantt</router-link>
                    |
                    <router-link to="gojs">demo1</router-link>
                    |
                    <router-link to="gojs1">demo2</router-link>
                    |
                    <router-link to="gojsGroup">demo3</router-link>
                    |
                    <router-link to="gojsTwo">demo4</router-link>
                    |
                    <router-link to="gojsFour">原型二</router-link>
                    |
                    <router-link to="gojsThree">demo6</router-link>
                    |
                    <router-link to="gojsFive">原型1</router-link>
                    |
                    <router-link to="gojsSix">原型三</router-link>
                    |
                    <router-link to="gojsNine">9xx</router-link>
                    |
                    <router-link to="colud">云边</router-link>
                    |
                    <router-link to="requestMonitor">单次请求监控</router-link>
                </q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container class="mainGo">
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script>
import Gantt from "./components/Gantt.vue";

export default {
    name: "LayoutDefault",
    data() {
        return {
            leftDrawerOpen: false
        };
    }
};
</script>

<style>
.gojs-main {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.mainGo {
    position: absolute;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>
