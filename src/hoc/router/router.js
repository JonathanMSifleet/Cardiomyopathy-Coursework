import { createRouter, createWebHistory } from "vue-router";
import Home from "../../views/Home/Home.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/About",
    name: "About",
    component: () => import("../../views/About/About.vue"),
  },
  // no route, route:
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
