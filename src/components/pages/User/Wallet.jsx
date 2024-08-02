import { Link, useNavigate } from 'react-router-dom';
import Back from '../../utilities/Back'
import styles from './Wallet.module.css'
import PaidIcon from '@mui/icons-material/Paid';
import { useEffect, useState } from 'react';
import api from '../../../utils/api';

export default function Wallet() {
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(null)
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

  }, [navigate])

  return (
    <section className={styles.container}>
      {!userLoaded ? (
        <Back toWhere={'/user/home'} />
      ) : (
        <>
          <Back toWhere={'/user/home'} />
          <header className={styles.header}>
            <p className={styles.headerTittle}>Carteira De Moedas Internacionais</p>
            <PaidIcon fontSize="large" style={{ color: '#f28907' }} />
          </header>
          <hr />
          <div className={styles.coinsContainer}>
            {userData.wallet.coins.map((coin, index) => (
              Object.keys(coin).length !== 0 && (
                <div className={styles.coin} key={index}>
                  <Link to={`/user/wallet/coin/${coin.symbol}`} style={{ textDecoration: 'none' }}>
                    <div className={styles.coinInfo}>Informações da Moeda</div>
                  </Link>
                  <p className={styles.coinSymbol}>{coin.symbol}</p>
                </div>
              )
            ))}
            <hr />
            <p>Gráfico de Moedas</p>
            <div className={styles.image}>
              <img src="https://www.criptofacil.com/wp-content/uploads/2020/10/b3-bate-recorde-captacoes-pode-superar-maxima-historica.jpg" alt="" />
            </div>
          </div>
        </>
      )}

    </section>
  )
}