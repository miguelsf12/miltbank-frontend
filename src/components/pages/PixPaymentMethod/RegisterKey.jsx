import styles from './RegisterKey.module.css'
import Input from '../../form/Input'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../../../context/UserContext'
import api from '../../../utils/api'

function RegisterKey() {
  const [user, setUser] = useState({})
  const { registerKey } = useContext(Context)
  const [selectedOption, setSelectedOption] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login')
    }
  }, []);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    // enviar o usuario para o banco
    registerKey(user)
  }

  function handleOptionClick(option) {
    if (selectedOption === option) {
      setSelectedOption(null)
    } else {
      setSelectedOption(option)
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-4">
          <Link to={'/pix'} className={styles.btn_back}><i className="bi bi-caret-left-fill"></i>Voltar</Link>
        </div>
      </div>
      <div className={styles.containerPixPay}>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.form_control} ${styles.register_Key}`}>
            {/* <Input type="text" name="pix" placeholder="Insira sua chave cpf ou email" /> */}
            <div>
              <div className={styles.pixType}>
                <div className={styles.pixCpf} onClick={() => handleOptionClick('cpf')}>
                  <i className="bi bi-person"></i>
                  <p>Use seu CPF como chave Pix.</p>
                </div>
                {selectedOption === 'cpf' && (
                  <div>
                    <Input type="text" name="pixCpf" placeholder="Insira seu CPF" handleOnChange={handleChange} />
                  </div>
                )}
              </div>

              <div className={styles.pixType}>
                <div className={styles.pixTelefone} onClick={() => handleOptionClick('telefone')}>
                  <i className="bi bi-telephone"></i>
                  <p>Use seu Telefone como chave Pix.</p>
                </div>
                {selectedOption === 'telefone' && (
                  <div>
                    <Input type="text" name="pixTelefone" placeholder="Insira seu Telefone" handleOnChange={handleChange} />
                  </div>
                )}
              </div>

              <div className={styles.pixEmail} onClick={() => handleOptionClick('email')}>
                <i className="bi bi-envelope"></i>
                <p>Use seu email como chave Pix.</p>
              </div>

              {selectedOption === 'email' && (
                <div>
                  <Input type="text" name="pixEmail" placeholder="Insira seu email" handleOnChange={handleChange} />
                </div>
              )}
            </div>
            <input className={styles.btn_registerKey} type="submit" value="CADASTRAR" />
          </div>
        </form>
      </div>


    </>
  )
}

export default RegisterKey
