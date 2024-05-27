import styles from './Pix.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../../utils/api'
import PulseLoader from "react-spinners/PulseLoader"

function Pix() {
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [transferences, setTransferences] = useState([])
  const navigate = useNavigate()

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
      setUserData(response.data)
      setUserLoaded(true)
    })

    api.get('/payments/gettransferences', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setTransferences(response.data)
    })

  }, [navigate])

  if (!userLoaded) {
    // Renderize algum indicador de carregamento
    return <div>Carregando...</div>
  }

  return (
    <section className={styles.container}>
      <div className="row">
        <div className="col-4">
          <a href="/home" className={styles.btn_back}><i className="bi bi-caret-left-fill"></i>Voltar</a>
        </div>
        <div className="col-4">
          <p className={styles.text_header_pix}>Pix</p>
        </div>
      </div>
      <div className={`row pix ${styles.row} ${styles.pix}`}>
        <div className="col-4">
          <Link to={'/registerkey'} className={styles.registerKeyLink}>
            <div className={styles.registerKey}>
              <i className="bi bi-key"></i>
              <p className={styles.textFinanceType}>Cadastrar pix</p>
            </div>
          </Link>
        </div>
        <div className="col-4">
          <a href="" className={styles.registerKeyLink}>
            <div className={styles.registerKey}>
              <i className="bi bi-key"></i>
              <p className={styles.textFinanceType}>Extrato completo</p>
            </div>
          </a>
        </div>
        <div className="col-4">
          <a href="" className={styles.registerKeyLink}>
            <div className={styles.registerKey}>
              <i className="bi bi-key"></i>
              <p className={styles.textFinanceType}>Configurações</p>
            </div>
          </a>
        </div>
      </div>
      <div className={styles.containerPix}>
        <div className={`row pay ${styles.row} ${styles.pay}`}>
          <Link to={'/pixpay'} className={styles.payPix}>
            <p>Pagar</p>
            <i className="bi bi-cash-coin"></i>
          </Link>
        </div>
        <div className={`row receive ${styles.row} ${styles.receive}`}>
          <a className={styles.receivePix} href="">
            <p>Receber</p>
            <i className="bi bi-cash-coin"></i>
          </a>
        </div>
      </div>
      <div className={styles.myKeys}>
        <p>Minhas chaves</p>
        {!userLoaded ? (
          <PulseLoader color="#F28907" />
        ) : (
          <div className={styles.keyField}>
            {!userData.pix ? (
              <p className={styles.keyType}>Adicione uma chave Pix</p>
            ) : (
              <>
                <p className={styles.keyType}>Chave: {userData.pix.tipo}</p>
                <p className={styles.key}>{userData.pix.chave}</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.transactions}>
        {(!transferences || transferences.length === 0) ? (
          <p className={styles.NotTransference}>Não há transferências</p>
        ) : (
          <>
            <p className={styles.latestActions}>Últimas ações</p>
            <div className={styles.transactionItems}>
              {transferences.transferMade.map((transfer, index) => (
                <Link key={index} to={`/transference/${transfer._id}`} className={styles.transactionItem}>
                  <p className={styles.transactionBeneficed}>Pix enviado para {transfer.receiver.name}</p>
                  <p className={`${styles.transactionAmount} ${styles.transactionAmountMade}`}>-R$ <span className={styles.transactionAmountMade}>{transfer.amount}</span></p>
                </Link>
              ))}
              {transferences.transferReceived.map((transfer, index) => (
                <Link key={index} to={`/transference/${transfer._id}`} className={styles.transactionItem}>
                  <p className={styles.transactionBeneficed}>Pix recebido de {transfer.payer.name}</p>
                  <p className={`${styles.transactionAmount} ${styles.transactionAmountReceived}`}>R$ <span className={styles.transactionAmountReceived}>{transfer.amount}</span></p>
                </Link>
              ))}
              <a className={styles.moreTransactions} href="#">VER TUDO</a>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Pix
