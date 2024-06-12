import { useContext, useEffect, useState } from 'react';
import { Context } from '../../../context/UserContext';
import Input from '../../form/Input';
import styles from './PixPay.module.css'
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../utils/api';
import Back from '../../Details/Back'

function PixPay() {
  const [key, setKey] = useState({})
  const { checkReceiver } = useContext(Context)
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setKey({ ...key, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()

    checkReceiver(key.key)
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
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

  }, [navigate]);

  if (!userLoaded) {
    // Renderize algum indicador de carregamento
    return <div>Carregando...</div>;
  }

  return (
    <section className={styles.container}>
      <div className="row">
        <div className="col-4">
          <Back toWhere={'/user/pix'} />
        </div>
        <div className="col-4">
          <p className={styles.text_header_pix_pay}>Pagar Com Pix</p>

        </div>
      </div>

      <div>
        <p className={styles.payPixChave}>Chave</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_control}>
            <Input type="text" name="key" placeholder="Insira a chave CPF ou Email" handleOnChange={handleChange} />
            <input className={styles.btn_payPix} type="submit" value="CONTINUAR" />
          </div>
        </form>
      </div>
    </section>
  )
}

export default PixPay