import { createRouter, createWebHistory } from "vue-router";
import Home from "../../views/Home/Home.vue";
import About from "../../views/About/About.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/About",
    name: "About",
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
