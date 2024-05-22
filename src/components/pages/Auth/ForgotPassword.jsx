import styles from './ForgotPassword.module.css'
import { Link } from 'react-router-dom'
import Input from '../../form/Input'
import { Context } from '../../../context/UserContext'
import { useState, useContext } from 'react'
import useBackgroundColor from '../../../hooks/useBackgroundColor'

function ForgotPassword() {
  const [user, setUser] = useState({})
  const { forgotpassword } = useContext(Context)
  const { backgroundColor } = useBackgroundColor()

  function handleSubmit(e) {
    e.preventDefault()
    // enviar o usuario para o banco
    forgotpassword(user)
  }

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  return (
    <section className={styles.container}>
      <Link to="/" className={styles.btn_back}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
        <span>Voltar</span>
      </Link>

      <h1 className={styles.disclaimer}>Por favor, insira alguns dados para confirmar quem é você!</h1>

      <form onSubmit={handleSubmit}>
        <div className={`${styles.form_control} ${styles.reedem}`}>
          <Input
            type="text"
            name="name"
            placeholder="NOME COMPLETO"
            handleOnChange={handleChange}
          />

          <Input
            type="text"
            name="cpf"
            placeholder="CPF"
            handleOnChange={handleChange}
          />

          <Input
            type="email"
            name="email"
            placeholder="EMAIL"
            handleOnChange={handleChange}
          />

          <Input
            type="password"
            name="newPassword"
            placeholder="NOVA SENHA"
            handleOnChange={handleChange}
          />
        </div>
        <input className={styles.btn_reedem} type="submit" value="CONTINUAR" />
      </form>
    </section>
  )
}

export default ForgotPassword
