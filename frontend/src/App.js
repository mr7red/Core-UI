import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GoogleOAuthProvider } from "@react-oauth/google"

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import './scss/examples.scss'

// ROUTE GUARDS
import PrivateRoute from "./routes/PrivateRoute"
import PublicRoute from "./routes/PublicRoute"

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const SetPassword = React.lazy(() => import('./views/pages/Password/password'))
const GithubSuccess = React.lazy(() => import("./views/pages/login/GithubSuccess"))

const App = () => {

  const { isColorModeSet, setColorMode } =
    useColorModes('coreui-free-react-admin-template-theme')

  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {

    const urlParams = new URLSearchParams(
      window.location.href.split('?')[1]
    )

    const theme =
      urlParams.get('theme') &&
      urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]

    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) return

    setColorMode(storedTheme)

  }, []) // eslint-disable-line

  return (
    <GoogleOAuthProvider clientId="670741828526-fofbmv3b1senoqpgk1e2b6carl65bsjb.apps.googleusercontent.com">

      <HashRouter>

        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >

          <Routes>

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path="/set-password"
              element={
                <PublicRoute>
                  <SetPassword />
                </PublicRoute>
              }
            />

            <Route path="/github-success" element={<GithubSuccess />} />

            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />

            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <DefaultLayout />
                </PrivateRoute>
              }
            />

          </Routes>

        </Suspense>

      </HashRouter>

    </GoogleOAuthProvider>
  )
}

export default App