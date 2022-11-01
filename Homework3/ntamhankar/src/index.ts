import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";


import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import "./styles/main.scss";
import App from "./App.vue";
import router from "./router"

/* add icons to the library */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleInfo, faInfo } from "@fortawesome/free-solid-svg-icons";
library.add(faCircleInfo, faInfo);

const app = createApp(App);
app.use(router);
app.use(VueAxios, axios);
app.use(Antd);
app.use(createPinia());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
