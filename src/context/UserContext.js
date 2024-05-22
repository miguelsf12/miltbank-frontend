import { createContext, useContext, useEffect, useState } from "react"

import useAuth from "../hooks/useAuth"
import usePay from "../hooks/usePay"
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const Context = createContext()

function UserProvider({ children }) {
  const { authenticated, register, login, logout, forgotpassword } = useAuth()
  const { registerKey, checkReceiver, confirmPayment, makePayment } = usePay()

  return <Context.Provider value={{ authenticated, register, login, logout, forgotpassword, registerKey, checkReceiver, confirmPayment, makePayment }}>{children}</Context.Provider>

}

export { Context, UserProvider }
