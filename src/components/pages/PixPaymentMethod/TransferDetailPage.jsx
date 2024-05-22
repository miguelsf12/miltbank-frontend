import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"
import api from '../../../utils/api'
import styles from './TransferDetailPage.module.css'

function TransferDetailPage() {
  const { id } = useParams()
  const [transfer, setTransfer] = useState(null)
  const [transferLoaded, setTransferLoaded] = useState(false)
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
      setTransferLoaded(true)
    })
  }, [id])

  return (
    <section>
      <div className="col-4">
        <Link to={'/home'} className={styles.btn_back}><i className="bi bi-caret-left-fill"></i>Voltar</Link>
      </div>
      {!transferLoaded ? (
        <>
          <PulseLoader color="#F28907" />
        </>
      ) : (
        <>
          <h2>Detalhes da Transferência</h2>
          <p>Valor: {transfer.amount}</p>
          <p>Remetente: {transfer.payer.name}</p>
          <p>Destinatário: {transfer.receiver.name}</p>
        </>
      )}
    </section>
  )
}

export default TransferDetailPage
