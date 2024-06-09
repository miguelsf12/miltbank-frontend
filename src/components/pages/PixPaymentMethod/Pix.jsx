import styles from './Pix.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../../utils/api'
import PulseLoader from "react-spinners/PulseLoader"
import Back from '../../Details/Back'

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

  // Renderizar o componente somente se as transações estiverem disponíveis
  if (!userLoaded || !transferences.transferMade || !transferences.transferReceived) {
    // Renderize algum indicador de carregamento
    return <div>Carregando...</div>
  }

  // Combina as transferências e ordena por data
  const combinedTransfers = [...transferences.transferMade, ...transferences.transferReceived]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const latestTransfers = combinedTransfers.slice(0, 4);

  return (
    <section className={styles.container}>
      <div className="row">
        <div className="col-4">
          <Back toWhere={'/home'} />
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
          <Link to={""} className={styles.registerKeyLink}>
            <div className={styles.registerKey}>
              <i className="bi bi-key"></i>
              <p className={styles.textFinanceType}>Extrato completo</p>
            </div>
          </Link>
        </div>
        <div className="col-4">
          <Link to={""} className={styles.registerKeyLink}>
            <div className={styles.registerKey}>
              <i className="bi bi-key"></i>
              <p className={styles.textFinanceType}>Configurações</p>
            </div>
          </Link>
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
        {latestTransfers.length === 0 ? (
          <p className={styles.NotTransference}>Não há transferências</p>
        ) : (
          <>
            <p className={styles.latestActions}>Últimas ações</p>
            <div className={styles.transactionItems}>
              {latestTransfers.map((transfer, index) => {
                const isMade = transferences.transferMade.includes(transfer);
                const amountClass = isMade ? styles.transactionAmountMade : styles.transactionAmountReceived;
                const amountPrefix = isMade ? '-R$' : 'R$';

                return (
                  <Link key={index} to={`/transference/${transfer._id}`} className={styles.transactionItem}>
                    <p className={styles.transactionBeneficed}>
                      {isMade ? `Pix enviado para ${transfer.receiver.name}` : `Pix recebido de ${transfer.payer.name}`}
                    </p>
                    <p className={`${styles.transactionAmount} ${amountClass}`}>
                      {amountPrefix} <span className={amountClass}>{transfer.amount}</span>
                    </p>
                  </Link>
                )
              })}
              <Link to={'/all-transfers'} className={styles.moreTransactions}>VER TUDO</Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Pix
