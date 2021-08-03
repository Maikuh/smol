import * as VueRouter from "vue-router";
import Home from "./views/Home.vue";
import NotFound from "./views/NotFound.vue";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
    },
  ],
});

export default router;
