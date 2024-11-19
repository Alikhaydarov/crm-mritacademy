// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axiosClient from 'src/configs/axios'

import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem('accessToken')
      const storedData = window.localStorage.getItem('userData')

      if (storedToken) {
        axiosClient.defaults.headers['Authorization'] = storedToken
        setLoading(true)

        if (storedData) {
          setLoading(false)
          setUser(JSON.parse(storedData))
        } else {
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('tokin')
          localStorage.removeItem('accessToken')
          setUser(null)
          setLoading(false)
          router.replace('/login')
        }
      } else {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('tokin')
        localStorage.removeItem('accessToken')
        setUser(null)
        setLoading(false)
        router.replace('/login')
      }
    }

    initAuth()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axiosClient
      .post('/token/', params)
      .then(async response => {
        console.log('response user', response)
        localStorage.setItem('accessToken', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)
        localStorage.setItem('userData', JSON.stringify(response.data))

        setUser({ ...response.data })
        router.push('/dashboards/analytics')

        // const returnUrl = router.query.returnUrl

        // setUser({ ...response.data.userData })

        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        // router.replace(redirectURL as string)
        const returnUrl = router.query.returnUrl

        setUser({ ...response.data })

        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data)) : null

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

        router.replace(redirectURL)
      })

      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
