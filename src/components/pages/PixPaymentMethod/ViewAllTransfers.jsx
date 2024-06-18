import { useContext, useEffect, useState } from "react"
import { Context } from "../../../context/UserContext"
import { Link, useNavigate } from "react-router-dom"
import api from "../../../utils/api"
import styles from './ViewAllTransfers.module.css'
import Back from "../../utilities/Back"

function ViewAllTransfers() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [transferences, setTransferences] = useState({
    transferMade: [],
    transferReceived: []
  })

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

    api.get('/payments/gettransferences', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setTransferences(response.data)
    })

  }, [navigate])

  // Organize transfers by date
  const organizeTransfersByDate = (transfers) => {
    // Ordena todas as transferências em ordem decrescente com base na data de criação
    const sortedTransfers = transfers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Inicializa o objeto que armazenará as transferências organizadas por data
    const organizedTransfers = {};

    // Itera sobre as transferências ordenadas
    sortedTransfers.forEach((transfer) => {
      // Obtém a data no formato "DD/MM/YYYY"
      const date = new Date(transfer.createdAt).toLocaleDateString();

      // Se a data ainda não existir no objeto organizedTransfers, cria uma nova entrada
      if (!organizedTransfers[date]) {
        organizedTransfers[date] = [];
      }

      // Adiciona a transferência à lista correspondente à sua data
      organizedTransfers[date].push(transfer);
    });

    return organizedTransfers;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }

    api.get('/payments/gettransferences', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      const { transferMade, transferReceived } = response.data;

      // Combine as transferências feitas e recebidas em uma única lista
      const combinedTransfers = [...transferMade, ...transferReceived];

      // Organize as transferências combinadas por data
      const organizedCombinedTransfers = organizeTransfersByDate(combinedTransfers);

      setTransferences(organizedCombinedTransfers);
    });
  }, [navigate]);

  return (
    <section className={styles.container}>
      <div className={`row align-items-center ${styles.header}`}>
        <div className="col-4 d-flex justify-content-start">
          <Back toWhere={'/user/home'} />
        </div>
        <div className="col-4 d-flex justify-content-center">
          <p className={styles.text_header}>Extrato</p>
        </div>
        <div className="col-4"></div>
      </div>

      <div className={styles.transactionItems}>
        {Object.keys(transferences).map((date) => (
          <div key={date} className={styles.dateGroup}>
            <p className={styles.dateHeader}>{date}</p>
            {transferences[date].map((transfer, index) => (
              <Link key={index} to={`/user/transference/${transfer._id}`} className={styles.transactionItem}>
                {transfer.payer.id === userData._id ? (
                  <>
                    <p className={styles.transactionBeneficed}>Pix enviado para {transfer.receiver.name}</p>
                    <p className={`${styles.transactionAmount} ${styles.transactionAmountMade}`}>-R$ <span className={styles.transactionAmountMade}>{transfer.amount}</span></p>
                  </>
                ) : (
                  <>
                    <p className={styles.transactionBeneficed}>Pix recebido de {transfer.payer.name}</p>
                    <p className={`${styles.transactionAmount} ${styles.transactionAmountReceived}`}>R$ <span className={styles.transactionAmountReceived}>{transfer.amount}</span></p>
                  </>
                )}
              </Link>
            ))}

          </div>
        ))}
      </div>
    </section>
  )
}

export default ViewAllTransfers
