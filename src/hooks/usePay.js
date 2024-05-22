import api from '../utils/api'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'

export default function usePay() {
  const [authenticated, setAuthenticated] = useState(false)
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true)
    }
  })

  async function registerKey(user) {
    let msgText = 'Você alterou sua chave Pix!'
    let msgType = 'success'

    try {
      const data = await api.post('/payments/pixcreatekey', user).then((response) => {
        return response.data
      })

    } catch (error) {
      msgText = error.response.data.message
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)
  }

  async function checkReceiver(key) {
    try {
      const data = await api.post('/payments/checkreceiver', { key }).then((response) => {
        return response.data
      })

      const dataReceiver = await api.get(`/payments/getreceiver?key=${key}`).then((response) => {
        return response.data
      })

      navigate(`/confirmpayment?key=${key}`)
    } catch (error) {
      const msgText = error.response.data.message
      const msgType = 'error'
      setFlashMessage(msgText, msgType)
    }
  }

  async function confirmPayment(amount, receiverData, key) {
    try {
      const data = await api.post('/payments/confirmpayment', { amount, receiverData }).then((response) => {
        return response.data
      })

      navigate(`/review?key=${key}&amount=${amount}`)
      // navigate('/review')
    } catch (error) {
      const msgText = error.response.data.message
      const msgType = 'error'

      setFlashMessage(msgText, msgType)
    }
  }

  async function makePayment(amount, receiverData) {
    let msgText = 'Pagamento efetuado!'
    let msgType = 'success'

    try {
      const data = await api.post('/payments/makepayment', { amount, receiverData }).then((response) => {
        return response.data
      })

      navigate(`/paymentconcluded/${data.transferenceId}`);
    } catch (error) {
      msgText = error.response.data.message
      msgType = 'error'

      setFlashMessage(msgText, msgType)
    }
  }

  return { authenticated, registerKey, checkReceiver, confirmPayment, makePayment }
}
