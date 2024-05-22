import styles from './Register.module.css'
import { useContext, useState } from 'react'
import Input from '../../form/Input'
import useBackgroundColor from '../../../hooks/useBackgroundColor'

import { Link } from 'react-router-dom'
import { Context } from '../../../context/UserContext'

function Register() {
  const [user, setUser] = useState({})
  const { register } = useContext(Context)

  const { backgroundColor } = useBackgroundColor()
  
  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // enviar o usuario para o banco
    register(user)
  }

  return (
    <section className={styles.container}>
      <Link to="/" className={styles.btn_back}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
        <span>Voltar</span>
      </Link>

      <div id="carouselExample" className={`carousel slide ${styles.carouselSlide}`}>
        <form onSubmit={handleSubmit} className="carousel-inner">
          <div className="carousel-item active">
            <div className={styles.form_control}>
              <Input
                type="text"
                name="name"
                placeholder="NOME COMPLETO"
                handleOnChange={handleChange}
              />

              <Input
                type="date"
                name="birth_date"
                placeholder="DATA DE NASCIMENTO"
                handleOnChange={handleChange}
              />

              <button className={styles.carousel_btn_next} type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                CONTINUAR
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          <div className="carousel-item">
            <div className={`${styles.form_control} ${styles.stage2}`}>
              <Input
                type="text"
                name="cpf"
                id="cpf"
                placeholder="CPF"
                maxLength="14"
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
                name="password"
                placeholder="SENHA"
                handleOnChange={handleChange}
              />

              <Input
                type="password"
                name="confirmPassword"
                placeholder="CONFIRMAR SENHA"
                handleOnChange={handleChange}
              />

            </div>

            <button className={styles.carousel_btn_prev} type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              VOLTAR
              <span className="visually-hidden">Previous</span>
            </button>
            <input className={styles.btn_register} type="submit" value="ENVIAR" />
          </div>
        </form>
      </div>

      <Link to="/login" className={styles.other_options}>
        Entrar na minha conta
      </Link>
    </section >
  )
}

export default Register
