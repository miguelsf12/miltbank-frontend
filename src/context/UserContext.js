import { createContext } from "react"

import useAuth from "../hooks/useAuth"
import usePay from "../hooks/usePay"

const Context = createContext()

function UserProvider({ children }) {
  const { authenticated, register, login, logout, forgotpassword } = useAuth()
  const { registerKey, checkReceiver, confirmPayment, makePayment } = usePay()

  return <Context.Provider value={{ authenticated, register, login, logout, forgotpassword, registerKey, checkReceiver, confirmPayment, makePayment }}>{children}</Context.Provider>

}

export { Context, UserProvider }
