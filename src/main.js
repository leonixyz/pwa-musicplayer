import "./assets/latinize.js"

import { createApp } from "vue"
import App from "./App.vue"

import "./assets/main.css"

createApp(App).mount("#app")

// register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load",
        () => {
            navigator.serviceWorker.register("./sw.js")
                .catch((err) => console.error(`Service Worker: Error: ${err}`))
        }
    )
}