import { createBrowserRouter, Navigate } from "react-router"
import Login from "./Features/auth/pages/Login"
import Register from "./Features/auth/pages/Register"
import Protected from "./Features/auth/components/Protected"
import Home from "./Features/interview/pages/Home"
import Interview from "./Features/interview/pages/interview"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <Protected><Home /></Protected>
  },
  {
    path: "/interview/:interviewId",
    element: <Protected><Interview /></Protected>
  },
  {
    path: "/interview",
    element: <Navigate to="/" replace />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
])