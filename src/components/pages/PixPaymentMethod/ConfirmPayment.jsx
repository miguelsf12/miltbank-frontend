import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../context/UserContext'
import styles from './ConfirmPayment.module.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"
import api from '../../../utils/api'
import InputCurrency from '../../form/InputCurrency'
import Back from '../../Details/Back'

function ConfirmPayment() {
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  const [userLoaded, setUserLoaded] = useState(false)
  const [receiverData, setReceiverData] = useState({})
  const [receiverLoaded, setReceiverLoaded] = useState(false)
  const [visibility, setVisibility] = useState(false)
  const { confirmPayment } = useContext(Context)
  const location = useLocation()

  const toggleAmountVisibility = () => {
    setVisibility(!visibility) // Inverte o estado de visibilidade
  }

  const [amount, setAmount] = useState("0,00")

  const handleChange = (event) => {
    const inputValue = event.target.value

    // Remover caracteres não numéricos
    const numericValue = inputValue.replace(/[^0-9]/g, '')

    // Remover zeros à esquerda
    const trimmedValue = numericValue.replace(/^0+/, '')

    // Adicionar vírgula e ponto decimal
    let formattedValue = '0,00' // valor padrão
    if (trimmedValue) {
      if (trimmedValue.length <= 2) {
        formattedValue = `0,${trimmedValue.padStart(2, '0')}`
      } else {
        const integerPart = trimmedValue.slice(0, -2)
        const decimalPart = trimmedValue.slice(-2)
        formattedValue = `${addThousandSeparator(integerPart)},${decimalPart}`
      }
    }

    // Atualizar valor do campo
    setAmount(formattedValue)
  }

  // Função para adicionar pontos de milhar
  const addThousandSeparator = (numberString) => {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const chavePIX = new URLSearchParams(location.search).get('key')

  function handleSubmit(e) {
    e.preventDefault()

    confirmPayment(amount, receiverData, chavePIX)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return navigate('/login')
    }

    api.get('/users/checkuser', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setUserData(response.data);
      setUserLoaded(true);
    })

    api.get(`/payments/getreceiver?key=${chavePIX}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setReceiverData(response.data)
      setReceiverLoaded(true)
    }).catch((error) => {
      // Trate os erros, se necessário
      console.error('Erro ao buscar receptor:', error)
    })
  }, [location.search])

  return (
    <section className={styles.container}>
      <div className="row">
        <div className="col-4">
          <Back toWhere={'/pix'} />
        </div>
        <div className="col-4">
          <p className={styles.text_header_pix_pay}>Pagar Com Pix</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.rowAmount}>
          <p className={styles.amountPay}>Saldo</p>
          {!userLoaded ? (
            <>
              <p className={styles.amountField}>R$ <PulseLoader color="#F28907" /></p>
            </>
          ) : (
            <>
              <div className={styles.amountContainer}>

                <p className={styles.amountField}>R$ <span className={styles.amount}> {visibility ? '-----' : userData.amount}</span></p>
                <i onClick={toggleAmountVisibility} className={`bi ${visibility ? 'bi-eye-slash' : 'bi-eye'} ${styles.hideAmount}`}></i>
              </div>

            </>
          )}
        </div>

        <div className={styles.containerPixPayConfirm}>
          <form onSubmit={handleSubmit}>
            <p className={styles.receiverName}>Pagar {receiverData.name}</p>
            {/* <Input type="text" name="amount" handleOnChange={handleChange} /> */}
            <InputCurrency handleOnChange={handleChange} value={amount} />
            <input className={styles.btn_payPix} type="submit" value="CONTINUAR" />
          </form>
        </div>
      </div>
    </section>
  )
}

export default ConfirmPayment
