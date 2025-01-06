// 1. atomWithStorage之所以不需要显示的import， 是因为它在vite.config.ts中包含在了unimport.vite中，因此导入到了imports.app.d.ts中,
//    这个文件变成了declare global
// 2. atomWithStorage<T>， 这里<>里面应该是类型(这里应该是value的类型， 而不是key的类型， key固定为string),只不过，这里类型的定义与使用是一起的
// 3. atom是useState()的代替品，通常可以无脑使用
const userAtom = atomWithStorage<{
  name?: string
  avatar?: string
}>("user", {})

const jwtAtom = atomWithStorage("jwt", "")

const enableLoginAtom = atomWithStorage<{
  enable: boolean
  url?: string
}>("login", {
  enable: true,
})

// 第一个订阅了该atom的组件被挂载时触发onMount，通常用于初始化
enableLoginAtom.onMount = (set) => {
  myFetch("/enable-login").then((r) => {
    set(r)
  }).catch((e) => {
    if (e.statusCode === 506) {
      set({ enable: false })
      localStorage.removeItem("jwt")
    }
  })
}

export function useLogin() {
  const userInfo = useAtomValue(userAtom)
  const jwt = useAtomValue(jwtAtom)
  const enableLogin = useAtomValue(enableLoginAtom)

  const login = useCallback(() => {
    window.location.href = enableLogin.url || "/api/login"
  }, [enableLogin])

  const logout = useCallback(() => {
    window.localStorage.clear()
    window.location.reload()
  }, [])

  return {
    loggedIn: !!jwt,
    userInfo,
    enableLogin: !!enableLogin.enable,
    logout,
    login,
  }
}
