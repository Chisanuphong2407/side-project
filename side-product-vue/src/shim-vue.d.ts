declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  // กำหนด Type ทั่วไปสำหรับ Vue SFCs
  const component: DefineComponent<{}, {}, any>
  export default component
}
