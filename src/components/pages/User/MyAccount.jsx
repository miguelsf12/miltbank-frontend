import { useState, useEffect } from "react"
import Back from "../../utilities/Back"
import styles from './MyAccount.module.css'
import { useNavigate, Link } from "react-router-dom"
import api from "../../../utils/api"
import { Badge } from "@mui/material"
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PulseLoader from "react-spinners/PulseLoader"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import Divider from '@mui/material/Divider'

export default function MyAccount() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [visibility, setVisibility] = useState(false)

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

  const toggleAmountVisibility = () => {
    setVisibility(!visibility)
  }

  return (
    <section>
      <div className={styles.container}>
        <header className={styles.headerContainer}>
          <Back toWhere={'/user/home'} />
          <p style={{ fontSize: '1.5em', fontWeight: '700', margin: '0px' }}>Perfil</p>
        </header>
        <div className={styles.contentProfile}>
          {!userLoaded ? (
            <>
              <p className={styles.usernameMyAccount}>Olá, <PulseLoader color="#F28907" /></p>
            </>
          ) : (
            <>
              {userData && userData.image ? (
                <>
                  <Link></Link>
                  <Badge overlap="circular" style={{ marginBottom: '10px' }}>
                    <img src={`${process.env.REACT_APP_API}/images/user/${userData.image}`} alt="Uploaded" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
                  </Badge>
                </>
              ) : (
                <Badge overlap="circular" style={{ marginBottom: '10px' }}>
                  <AccountCircleIcon fontSize="large" style={{ borderRadius: '50%', color: '#ccc', width: 60, height: 60 }} />
                </Badge>
              )}
              <p className={styles.usernameMyAccount}>Olá, {userData.name}!</p>
            </>
          )}
        </div>
        <div className={styles.userField}>
          <p style={{ marginTop: '20px', fontSize: '1.3em', fontWeight: '700' }}>Meus dados</p>
          {!userLoaded ? (<>
            <p className={styles.dataUser}><PulseLoader color="#F28907" /></p>
            <p className={styles.dataUser}><PulseLoader color="#F28907" /></p>
            <p className={styles.dataUser}><PulseLoader color="#F28907" /></p>
          </>
          ) : (
            <>
              {/* <p className={styles.dataUser}>CPF: {userData.cpf}</p> */}
              <p className={styles.dataUser}>
                CPF: <span className={`${visibility ? styles.spanDatasHidden : styles.spanDatas}`}> {visibility ? '' : userData.cpf}</span>
                <i onClick={toggleAmountVisibility} className={`bi ${visibility ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </p>

              <p className={styles.dataUser}>Email: <span className={styles.spanDatas}>{userData.email}</span></p>
              <p className={styles.dataUser}>Telefone: <span className={styles.spanDatas}>{userData.telefone}</span></p>
            </>
          )}

        </div>

        <Divider sx={{ color: '#F28907', fontSize: '1.2em' }} flexItem>Mais opções</Divider>

        <div className={styles.funcionalities}>
          <div className={styles.funcionalitiesOptions}>
            <Link style={{ textDecoration: 'none', color: '#1F2440', fontSize: '1.3em', fontWeight: '700' }} to={'/user/configurations'}>Configurações</Link>
            <p style={{ fontSize: '1.1em' }}>Caso queria alterar seus dados</p>
          </div>
          <ArrowForwardIosIcon style={{ display: '' }} />
        </div>
        <div className={styles.funcionalities}>
          <div className={styles.funcionalitiesOptions}>
            <Link style={{ textDecoration: 'none', color: '#1F2440', fontSize: '1.3em', fontWeight: '700' }} to={'/user/cards'}>Meus cartões</Link>
            <p style={{ fontSize: '1.1em' }}>Acesse a página dos seus cartões</p>
          </div>
          <ArrowForwardIosIcon style={{ display: '' }} />
        </div>
        <div className={styles.funcionalities}>
          <div className={styles.funcionalitiesOptions}>
            <Link style={{ textDecoration: 'none', color: '#1F2440', fontSize: '1.3em', fontWeight: '700' }} to={'/user/home'}>Ajuda</Link>
            <p style={{ fontSize: '1.1em' }}>Fale com um atendente</p>
          </div>
          <ArrowForwardIosIcon style={{ display: '' }} />
        </div>
      </div>
    </section >
  )
}