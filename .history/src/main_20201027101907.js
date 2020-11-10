import Vue from 'vue';
import App from './App.vue';
import Gantt from './components/Gantt.vue';
import Info from './components/Info.vue';
import Router from 'vue-router';
Vue.use(Router);

const router = new Router({
    routes: [{
            path: '/',
            component: Gantt
        },
        {
            path: '/info',
            component: Info
        },
        {
            path: '/gojs',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/Gojs.vue')
        },
        {
            path: '/gojs1',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/Gojs1.vue')
        },
        {
            path: '/gojsGroup',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsGroup.vue')
        },
        {
            path: '/gojsTwo',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsTwo.vue')
        },
        {
            path: '/gojsThree',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsThree.vue')
        }, {
            path: '/gojsFour',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsFour.vue')
        },
        {
            path: '/gojsFive',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsFive.vue')
        },
        {
            path: '/gojsSix',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsSix.vue')
        },
        {
            path: '/gojsNine',
            component: () =>
                import ( /* webpackChunkName: "about" */ './components/GojsNine.vue')
        }, {
            path: '/cloud',
            component: () =>
                import ( /* webpackChunkName: "cloud" */ './components/cloud.vue')
        }
    ]
});

import './styles/quasar.styl';
import iconSet from 'quasar/icon-set/mdi-v3.js';
import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/mdi-v3/mdi-v3.css';
import {
    Quasar,
    QLayout,
    QHeader,
    QDrawer,
    QPageContainer,
    QPage,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel
} from 'quasar';

Vue.use(Quasar, {
    config: {},
    components: {
        QLayout,
        QHeader,
        QDrawer,
        QPageContainer,
        QPage,
        QToolbar,
        QToolbarTitle,
        QBtn,
        QIcon,
        QList,
        QItem,
        QItemSection,
        QItemLabel
    },
    directives: {},
    plugins: {},
    iconSet: iconSet
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');