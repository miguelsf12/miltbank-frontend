import { useContext, useState } from 'react'
import styles from './Login.module.css'
import { Context } from '../../../context/UserContext'
import Input from '../../form/Input'
import useBackgroundColor from '../../../hooks/useBackgroundColor'
import { Link } from 'react-router-dom'
import Loading from '../../layout/Loading'

function Login() {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useContext(Context)

  const { backgroundColor } = useBackgroundColor()

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // Aqui definimos loading como true quando o formulário é submetido

    setTimeout(() => {
      login(user)
        .then(() => {
          setLoading(false); // Aqui definimos loading como false após o login ser concluído
        })
        .catch(() => {
          setLoading(false);
        });
    }, 2000);
  }
  
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  return (
    <section className={styles.container}>
      {loading && (
        <Loading />
      )}
      <Link to="/" className={styles.btn_back}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
        <span>Voltar</span>
      </Link>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={`${styles.form_control} ${styles.login}`}>
          <Input
            type="text"
            name="cpf"
            id="cpf"
            placeholder="CPF"
            maxLength="14"
            handleOnChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="SENHA"
            handleOnChange={handleChange}
          />
          
          <input className={styles.btn_login} type="submit" value="ENTRAR" />
        </div>
      </form>
      <div className={`${styles.other} ${styles.login}`}>
        <Link className={styles.other_options} to={'/forgotpassword'}>Esqueci minha senha</Link>
        <Link className={styles.other_options} to={'/register'}>Registrar nova conta</Link>
      </div>
    </section >
  )
}

export default Login
