import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from "./app.routes.jsx"
import { AuthProvider } from './Features/auth/auth.context.jsx'
import { ThemeProvider } from './context/theme.context.jsx'

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App