import { useEffect, useState } from 'react'
import styles from './TransferDetailPage.module.css'
import api from '../../../utils/api'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PulseLoader from "react-spinners/PulseLoader"
import InputCurrency from '../../form/InputCurrency'
import moment from 'moment'
import 'moment/locale/pt-br' // Importa o local PT-BR para formatar as datas em português

function TransferDetailPage() {
  const { id } = useParams()
  const [transfer, setTransfer] = useState(null)
  const [transferLoad, setTransferLoad] = useState(false)
  const navigate = useNavigate()
  // Configura o moment para usar o local PT-BR
  moment.locale('pt-br')

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
    }).catch(error => {
      console.error('Erro ao buscar transferência:', error);
      setTransferLoad(true);
    })
  }, [id])

  // Formata a data e o horário
  const formattedDate = transfer ? moment(transfer.createdAt).format('dddd, DD/MM/YYYY') : ''
  const formattedTime = transfer ? moment(transfer.createdAt).format('HH:mm') : ''

  return (
    <section className={styles.container}>
      <p className={styles.text_header_pix_pay}>Transferência concluída</p>
      <div className={styles.containerConcluded}>
        {!transferLoad ? (
          <PulseLoader color="#F28907" />
        ) : (
          transfer ? (
            <>
              <p className={styles.sendPix}><i class="bi bi-check-circle"></i></p>

              <InputCurrency className={styles.inputDisable} value={transfer.amount} disabled={true} />

              <div className={styles.aboutTransfer}>
                <p className={styles.aboutTitle}>Sobre a transação</p>
                <div className={styles.aboutDate}>
                  <p>Data do pagamento</p><span>{formattedDate}</span>
                </div>
                <div className={styles.aboutTime}>
                  <p>Horário</p><span>{formattedTime}</span>
                </div>
                <div className={styles.aboutId}>
                  <p>ID da transação</p><span>{transfer._id}</span>
                </div>
              </div>

              <div className={styles.receiver}>
                <p className={styles.receiverTitle}>Quem recebeu</p>
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
                  <p>Chave</p><span>{transfer.receiver.pix.chave}</span>
                </div>
              </div>

              <div className={styles.payer}>
                <p className={styles.payerTitle}>Quem pagou</p>
                <div className={styles.payerName}>
                  <p>Nome</p><span>{transfer.payer.name}</span>
                </div>
                <div className={styles.payerCpf}>
                  <p>CPF</p><span>{transfer.payer.cpf}</span>
                </div>
                <div className={styles.payerInstitution}>
                  <p>Instituição</p><span>Milt Bank S.A</span>
                </div>
              </div>

              {/* Adicionar essa funcionalidade GERAR PDF*/}
              <input className={styles.btn_generate} type="submit" value="GERAR PDF" />

              <Link className={styles.btn_paymentconcluded} to={'/user/home'}>VOLTAR</Link>
            </>
          ) : (
            <p>Nenhuma transferência encontrada.</p>
          )
        )}
      </div>
    </section>
  )
}

export default TransferDetailPage
