import { createApp } from 'vue'
import App from './App.vue'
import './tailwind.css'
function ensureAppMount() {
  let el = document.getElementById('app')
  if (!el) {
    document.body.innerHTML = ''
    el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)
  }
  return el
}

createApp(App).mount(ensureAppMount())
