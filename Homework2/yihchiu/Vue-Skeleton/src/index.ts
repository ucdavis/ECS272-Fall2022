import { createApp } from "vue";
import axios from "axios";
import VueAxios from "vue-axios";


import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import "./styles/main.scss";
import Area from "./views/components/areachart.vue";
import Stream from "./views/components/streamchart.vue";
import Line from "./views/components/linechart.vue"
import router from "./router"

/* add icons to the library */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleInfo, faInfo } from "@fortawesome/free-solid-svg-icons";
library.add(faCircleInfo, faInfo);

const app = createApp(Area);
app.use(router);
app.use(VueAxios, axios);
app.use(Antd);
app.use(createPinia());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#area");

const app2 = createApp(Stream)
app2.mount("#stream")

const app3 = createApp(Line)
app3.mount("#line")
