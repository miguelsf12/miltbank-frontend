import { Link, useLocation, useNavigate } from 'react-router-dom'
import styles from './Review.module.css'
import { useContext, useEffect, useState } from 'react'
import api from '../../../utils/api'
import InputCurrency from '../../form/InputCurrency'
import { Context } from '../../../context/UserContext'
import PulseLoader from "react-spinners/PulseLoader";
import logo from '../../../assets/img/logo.png'

function Review() {
  const [receiverData, setReceiverData] = useState({})
  const [receiverLoaded, setReceiverLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const chavePIX = new URLSearchParams(location.search).get('key')
  const amountPay = new URLSearchParams(location.search).get('amount')
  const { makePayment } = useContext(Context)
  const [amount, setAmount] = useState(amountPay)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const inputValue = event.target.value

    // Remover caracteres não numéricos
    const numericValue = inputValue.replace(/[^0-9]/g, '')

    // Remover zeros à esquerda
    const trimmedValue = numericValue.replace(/^0+/, '')

    // Adicionar vírgula e ponto decimal
    let formattedValue = '0,00' // valor padrão
    if (trimmedValue) {
      if (trimmedValue.length <= 2) {
        formattedValue = `0,${trimmedValue.padStart(2, '0')}`
      } else {
        const integerPart = trimmedValue.slice(0, -2)
        const decimalPart = trimmedValue.slice(-2)
        formattedValue = `${addThousandSeparator(integerPart)},${decimalPart}`
      }
    }
    console.log(formattedValue)
    // Atualizar valor do campo
    setAmount(formattedValue)
  }

  // Função para adicionar pontos de milhar
  const addThousandSeparator = (numberString) => {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); // Aqui definimos loading como true quando o formulário é submetido

    setTimeout(() => {
      makePayment(amount, receiverData)
        .then(() => {
          setLoading(false); // Aqui definimos loading como false após o login ser concluído
        })
        .catch(() => {
          setLoading(false);
        });
    }, 2000);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token && !chavePIX) {
      return navigate('/login')
    }

    api.get(`/payments/getreceiver?key=${chavePIX}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setReceiverData(response.data);
      setReceiverLoaded(true);
    }).catch((error) => {
      // Trate os erros, se necessário
      console.error('Erro ao buscar receptor:', error);
    });

  }, [location.search])

  return (
    <section className={styles.container}>
      {loading && (
        <div className={styles.load}>

          <img className={styles.loadImg} src={logo} alt="" />

        </div>
      )}


      <div className="row">
        <div className="col-4">
          <Link to={'/pix'} className={styles.btn_back}><i className="bi bi-caret-left-fill"></i>Voltar</Link>
        </div>
        <div className="col-4">
          <p className={styles.text_header_pix_pay}>Pagar Com Pix</p>
        </div>
      </div>
      <div className={styles.containerReview}>
        <form onSubmit={handleSubmit}>
          <InputCurrency handleOnChange={handleChange} value={amount} />
          {!receiverLoaded ? (
            <PulseLoader color="#F28907" />
          ) : (
            <div className={styles.receiver}>
              <p className={styles.receiverTitle}>Recebedor</p>
              <div className={styles.receiverName}>
                <p>Nome</p><span>{receiverData.name}</span>
              </div>
              <div className={styles.receiverCpf}>
                <p>CPF</p><span>{receiverData.cpf}</span>
              </div>
              <div className={styles.receiverInstitution}>
                <p>Instituição</p><span>Milt Bank S.A</span>
              </div>
              <div className={styles.receiverKey}>
                <p>Chave</p><span>{receiverData.pix.chave}</span>
              </div>
            </div>
          )}
          <input className={styles.btn_payPix} type="submit" value="CONFIRMAR" />
        </form>
      </div>
    </section>
  )
}

export default Review