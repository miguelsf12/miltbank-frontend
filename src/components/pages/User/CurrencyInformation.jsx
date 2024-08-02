import { useNavigate, useParams } from "react-router-dom"
import Back from "../../utilities/Back"
import { useEffect, useState } from "react"
import api from "../../../utils/api"

import styles from './CurrencyInformation.module.css'

export default function CurrencyInformation() {
  const { simboloDamoeda } = useParams()
  const [userCoinInfo, setUserCoinInfo] = useState(null)
  const [userCoinLoaded, setUserCoinLoaded] = useState(null)
  const [symbol, setSymbol] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return navigate('/login')
    }

    api.get(`/exchanges/${simboloDamoeda}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setUserCoinInfo(response.data)
      setUserCoinLoaded(true)
    })

    const symbols = {
      "AUD": "A$",
      "CAD": "C$",
      "CHF": "CHF",
      "EUR": "€",
      "GBP": "£",
      "JPY": "¥",
      "NOK": "Nkr",
      "SEK": "Skr",
      "USD": "$"
    }

    Object.keys(symbols).map((symbol) => {
      if (symbol === simboloDamoeda) {
        setSymbol(symbols[symbol])
      }
    })

  }, [])

  if (!userCoinLoaded) {
    return <div>Carregando...</div>
  }

  return (
    <section className={styles.container}>
      <Back toWhere={'/user/wallet'} />
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.headerTittle}>Veja as informações sobre o {simboloDamoeda}</p>
        </header>
        <hr />
        <div className={styles.amountContainer}>
          <p className={styles.amountField}>{symbol}<span className={styles.amount} id="amount"> {userCoinInfo.amount}</span></p>
        </div>
      </div>
    </section>
  )
}