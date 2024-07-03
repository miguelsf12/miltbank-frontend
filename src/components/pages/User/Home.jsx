import styles from './Home.module.css'
import useBackgroundColor from '../../../hooks/useBackgroundColor'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PulseLoader from 'react-spinners/PulseLoader'
import Options from '../../utilities/Options'

import Logo from '../../../assets/img/logo.png'
import api from '../../../utils/api'

import PixIcon from '@mui/icons-material/Pix'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

function Home() {
  const [visibility, setVisibility] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [transferences, setTransferences] = useState({
    transferMade: [],
    transferReceived: []
  })

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

  const expandFuncs = () => {
    setShowMore(true)
  }

  const closeFuncs = () => {
    setShowMore(false)
  }

  useBackgroundColor()

  const toggleAmountVisibility = () => {
    setVisibility(!visibility) // Inverte o estado de visibilidade
  }

  // Combina as transferências e ordena por data
  const combinedTransfers = [...transferences.transferMade, ...transferences.transferReceived]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const latestTransfers = combinedTransfers.slice(0, 4)

  return (
    <section className={styles.containerHome}>
      <nav className={styles.headerHome}>
        <Options />
        <div className={styles.logoImage}>
          <img src={Logo} alt="Logo Milt Bank" />
        </div>
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
            <div className={styles.amountContainer}>
              <p className={styles.amountField}>R$ <span className={styles.amount} id="amount"> {visibility ? '-----' : userData.amount}</span></p><i onClick={toggleAmountVisibility} className={`bi ${visibility ? 'bi-eye-slash' : 'bi-eye'} ${styles.hideAmount}`}></i>
            </div>
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
                  const isMade = transferences.transferMade.includes(transfer)
                  const amountClass = isMade ? styles.transactionAmountMade : styles.transactionAmountReceived
                  const amountPrefix = isMade ? '-R$' : 'R$'

                  return (
                    <Link key={index} to={`/user/transference/${transfer._id}`} className={styles.transactionItem}>
                      <p className={styles.transactionBeneficed}>
                        {isMade ? `Pix enviado para ${transfer.receiver.name}` : `Pix recebido de ${transfer.payer.name}`}
                      </p>
                      <p className={`${styles.transactionAmount} ${amountClass}`}>
                        {amountPrefix} <span className={amountClass}>{transfer.amount}</span>
                      </p>
                    </Link>
                  )
                })}
                <Link to={'/user/all-transfers'} className={styles.moreTransactions}>VER TUDO</Link>
              </div>
            </>
          )}
        </div>

        <div className={styles.functionalities}>
          {!showMore && (
            <div className={styles.finances}>
              <Link to={'/user/pix'} className={styles.financeLink}>
                <PixIcon style={{ color: '#fff' }} />
              </Link>
              <Link to={'/cards'} className={styles.financeLink}>
                <CreditCardIcon style={{ color: '#fff' }} />
              </Link>
              <div className={`${styles.show_more}`} onClick={expandFuncs}>
                <MoreHorizIcon style={{ color: '#fff' }} />
              </div>
            </div>
          )}
        </div>

        {showMore && (
          <div className={`${styles.financesExpandedContainer}`}>
            <ExpandLessIcon fontSize='large' className={styles.btn_close} onClick={closeFuncs} />

            <div className={styles.financesExpanded}>
              <div className={styles.financesOptions}>
                <Link to={'/user/pix'} className={styles.financeLink}>
                  <PixIcon style={{ color: '#fff' }} />
                </Link>
                <p className={styles.textFinanceType}>Pix</p>
              </div>
              <div className={styles.financesOptions}>
                <Link to={'/user/cards'} className={styles.financeLink}>
                  <CreditCardIcon style={{ color: '#fff' }} />
                </Link>
                <p className={styles.textFinanceType}>Cartões</p>
              </div>
              <div className={styles.financesOptions}>
                <Link to={'/user/exchange'} className={styles.financeLink}>
                  <CurrencyExchangeIcon style={{ color: '#fff' }} />
                </Link>
                <p className={styles.textFinanceType}>Câmbio</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Home
