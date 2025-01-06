import { useBeforeUnload, useMount } from "react-use"

const KEY = "unload-time"
export function isPageReload(): boolean {
  const _ = localStorage.getItem(KEY)
  if (!_) return false
  const unloadTime = Number(_)
  if (!Number.isNaN(unloadTime) && Date.now() - unloadTime < 1000) {
    return true
  }

  localStorage.removeItem(KEY)
  return false
}

type ReloadFn = () => Promise<void> | void
export function useOnReload(reloadFn?: ReloadFn, newPageFn?: ReloadFn): void {
  // 相应beforeunload事件，在页面关闭或刷新时触发
  useBeforeUnload(() => {
    const now = Date.now() // ms时间戳
    localStorage.setItem(KEY, now.toString())
    return false
  })

  // 组件首次加载时触发，用于初始化数据
  useMount(() => {
    const isReload = isPageReload()
    const handler = isReload ? reloadFn : newPageFn
    handler?.()
  })
}
