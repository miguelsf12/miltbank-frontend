import styles from './Home.module.css'
import useBackgroundColor from '../../../hooks/useBackgroundColor'
import { useState, useContext, useEffect } from 'react'
import { Context } from '../../../context/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader";
import Options from '../../Details/Options'

import Logo from '../../../assets/img/logo.png'
import api from '../../../utils/api'

function Home() {
  const { logout } = useContext(Context)
  const [visibility, setVisibility] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [transferences, setTransferences] = useState({
    transferMade: [],
    transferReceived: []
  });

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

    api.get('/payments/gettransferences', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setTransferences(response.data)
    })

  }, [navigate])

  const expandFuncs = () => {
    setShowMore(true)
  }

  const closeFuncs = () => {
    setShowMore(false)
  }

  const { backgroundColor } = useBackgroundColor()

  const toggleAmountVisibility = () => {
    setVisibility(!visibility); // Inverte o estado de visibilidade
  }

  // Combina as transferências e ordena por data
  const combinedTransfers = [...transferences.transferMade, ...transferences.transferReceived]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const latestTransfers = combinedTransfers.slice(0, 4)

  return (
    <section className={styles.containerHome}>
      <nav>
        <div className={styles.logoImage}>
          <img src={Logo} alt="Logo Milt Bank" />
        </div>
        <i onClick={toggleAmountVisibility} className={`bi ${visibility ? 'bi-eye-slash' : 'bi-eye'} ${styles.hideAmount}`}></i>
        <Options />
      </nav>

      <div className={styles.content}>
        {!userLoaded ? (
          <>
            <p className={styles.username}>Olá, <PulseLoader color="#F28907" /></p>
            <p className={styles.amountField}>R$ <PulseLoader color="#F28907" /></p>
          </>
        ) : (
          <>
            <p className={styles.username}>Olá, {userData.name}!</p>
            <p className={styles.amountField}>R$ <span className={styles.amount} id="amount"> {visibility ? '-----' : userData.amount}</span></p>
          </>
        )}

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

        <div className={styles.functionalities}>
          <p className={styles.text_finances}>Finanças</p>

          {!showMore && (
            <div className={styles.finances}>
              <Link to={'/pix'} className={styles.financeLink}>
                <div className={`${styles.pix} ${styles.functionality}`}>
                  <i className="bi bi-asterisk"></i>
                  <p className={styles.textFinanceType}>Pix</p>
                </div>
              </Link>
              <a href="" className={styles.financeLink}>
                <div className={`${styles.pay} ${styles.functionality}`}>
                  <i className="bi bi-upc"></i>
                  <p className={styles.textFinanceType}>Pagar</p>
                </div>
              </a>
              <a href="" className={styles.financeLink}>
                <div className={`${styles.card} ${styles.functionality}`}>
                  <i className="bi bi-credit-card"></i>
                  <p className={styles.textFinanceType}>Cartões</p>
                </div>
              </a>
              <div className={`${styles.show_more} ${styles.functionality}`} onClick={expandFuncs}>
                <i className="bi bi-caret-left-fill"></i>
                <p className={styles.textFinanceType}>Mais</p>
              </div>
            </div>
          )}

          {showMore && (
            <div className={`${styles.container} ${styles.text_center}`}>

              <i className={`bi bi-caret-right-fill ${styles.btn_close}`} onClick={closeFuncs}></i>

              <div className="row">
                <div className="col-3">
                  <a href="" className={styles.financeLink}>
                    <div className={`${styles.pay} ${styles.functionality}`}>
                      <i className="bi bi-upc"></i>
                      <p className={styles.textFinanceType}>Pagar</p>
                    </div>
                  </a>
                </div>
                <div className="col-3">
                  <a href="" className={styles.financeLink}>
                    <div className={`${styles.card} ${styles.functionality}`}>
                      <i className="bi bi-credit-card"></i>
                      <p className={styles.textFinanceType}>Cartões</p>
                    </div>
                  </a>
                </div>
                <div className="col-3">
                  <a href="" className={styles.financeLink}>
                    <div className={`${styles.card} ${styles.functionality}`}>
                      <i className="bi bi-credit-card"></i>
                      <p className={styles.textFinanceType}>Transferir</p>
                    </div>
                  </a>
                </div>
                <div className="col-3">
                  <a href="" className={styles.financeLink}>
                    <div className={`${styles.card} ${styles.functionality}`}>
                      <i className="bi bi-credit-card"></i>
                      <p className={styles.textFinanceType}>Câmbio</p>
                    </div>
                  </a>
                </div>
                <div className="col-3">
                  <a href="" className={styles.financeLink}>
                    <div className={`${styles.card} ${styles.functionality}`}>
                      <i className="bi bi-credit-card"></i>
                      <p className={styles.textFinanceType}>Cartões</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section >
  )
}

export default Home