import { useEffect, useState } from 'react'
import styles from './PaymentConcluded.module.css'
import api from '../../../utils/api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"
import InputCurrency from '../../form/InputCurrency'

function PaymentConcluded() {
  const { id } = useParams()
  const [transfer, setTransfer] = useState(null)
  const [transferLoad, setTransferLoad] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      return navigate('/login')
    }

    api.get(`/payments/gettransference/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setTransfer(response.data)
      setTransferLoad(true)
    })
  }, [id])

  return (
    <section className={styles.container}>
      <div className="row">
        <div className="col-4">
          <Link to={'/pix'} className={styles.btn_back}><i className="bi bi-caret-left-fill"></i>Voltar</Link>
        </div>
        <div className="col-4">
          <p className={styles.text_header_pix_pay}>Comprovante</p>
        </div>
      </div>

      <div className={styles.containerConcluded}>
        {!transferLoad ? (
          <PulseLoader color="#F28907" />
        ) : (
          <>
            <p className={styles.sendPix}>Pix enviado</p>
            {/* <p className={styles.transferAmount}>{transfer.amount}</p> */}
            <InputCurrency className={styles.inputDisable} value={transfer.amount} disabled={true} />
            <div className={styles.receiver}>
              <p className={styles.receiverTitle}>Recebedor</p>
              <div className={styles.receiverName}>
                <p>Nome</p><span>{transfer.receiver.name}</span>
              </div>
              <div className={styles.receiverCpf}>
                <p>CPF</p><span>{transfer.receiver.cpf}</span>
              </div>
              <div className={styles.receiverInstitution}>
                <p>Instituição</p><span>Milt Bank S.A</span>
              </div>
              <div className={styles.receiverKey}>
                {/* <p>Chave</p><span>{transfer.pix.chave}</span> */}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default PaymentConcluded
