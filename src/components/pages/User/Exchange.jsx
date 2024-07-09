import { useEffect, useState } from "react"
import api from "../../../utils/api"
import { Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import styles from './Exchange.module.css'
import Back from '../../utilities/Back'
import InputCurrency from "../../form/InputCurrency"
import { Link, useNavigate } from "react-router-dom"
import useFlashMessage from "../../../hooks/useFlashMessage"
import WalletIcon from '@mui/icons-material/Wallet'

export default function Exchange() {
  const { setFlashMessage } = useFlashMessage()
  const [moedas, setMoedas] = useState([])
  const [moedaSelecionada, setMoedaSelecionada] = useState('')
  const [amountInForeignCurrency, setAmountInForeignCurrency] = useState('0,00')
  const [amountPaidInReais, setAmountPaidInReais] = useState('0,00')
  const [cotacao, setCotacao] = useState(null)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const formData = {
    amountInForeignCurrency,
    amountPaidInReais,
    moedaSelecionada,
    cotacao
  }

  useEffect(() => {
    const fetchMoedas = async () => {
      try {
        const response = await fetch('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado')
        const data = await response.json()
        setMoedas(data.value)
      } catch (error) {
        console.error('Erro ao buscar moedas:', error)
      }
    }

    const fetchQuotation = async () => {
      const today = new Date()
      const formattedToday = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-')

      const lastMonth = new Date()
      lastMonth.setMonth(today.getMonth() - 1)
      const formattedLastMonth = lastMonth.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-')

      try {
        const response = await fetch(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${moedaSelecionada}'&@dataInicial='${formattedLastMonth}'&@dataFinalCotacao='${formattedToday}'&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,dataHoraCotacao`)
        const data = await response.json()
        setCotacao(data.value[0])
      } catch (error) {
        console.error('Erro ao buscar cotação:', error)
      }
    }

    if (moedaSelecionada !== '') {
      fetchQuotation()
    }

    fetchMoedas()
  }, [moedaSelecionada])

  useEffect(() => {
    handleChangeValueExchanged(amountInForeignCurrency)
  }, [moedaSelecionada, cotacao])

  const handleChangeMoeda = async (event) => {
    const moeda = event.target.value
    setMoedaSelecionada(moeda)
  }

  // Função para adicionar pontos de milhar
  const addThousandSeparator = (numberString) => {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleChangeAmount = (event) => {
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

    // Atualizar valor do campo
    setAmountInForeignCurrency(formattedValue)

    handleChangeValueExchanged(formattedValue)
  }

  const handleChangeValueExchanged = async (formattedValue) => {
    if (cotacao && formattedValue) {
      // Remover pontos de milhar e substituir vírgula por ponto
      const amount = parseFloat(formattedValue.replace(/\./g, '').replace(',', '.'))
      if (!isNaN(amount)) {
        const exchangedValue = amount * cotacao.cotacaoCompra

        const formattedValue = exchangedValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

        setAmountPaidInReais(formattedValue)
      }
    }
  }

  // enviar a solicitação para o backend
  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      return navigate('/login')
    }

    try {
      const response = await api.post('/exchanges/exchange', formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`
        }
      })

      setFlashMessage(response.data.message, 'sucess')
    } catch (error) {
      console.log('Erro ao efetuar a operação:', error)
      const msgType = 'error'
      setFlashMessage(error.response.data.message, msgType)
    }
    setOpen(false)
  }

  // Função para abrir o Dialog
  const handleClickOpen = () => {
    setOpen(true)
  }

  // Função para fechar o Dialog
  const handleClose = () => {
    setOpen(false)
  }

  const getCurrencySymbol = (currencyCode) => {
    return (0).toLocaleString('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/\d/g, '').trim()
  }
  console.log(amountInForeignCurrency)
  console.log(amountPaidInReais)

  return (
    <section className={styles.container}>
      <Back toWhere={'/user/home'} />
      <header className={styles.headerExchange}>
        <img className={styles.imageExchange} src="https://img.freepik.com/vetores-gratis/pessoas-trocando-bitcoin-por-dolares_53876-43042.jpg?t=st=1719856302~exp=1719859902~hmac=81e871fc5b1ad38a22201bd622d01f3c75e60143daa41774219b8a77f0a655c1&w=740" alt="exchange" />

      </header>

      <div className={styles.contentExchange}>
        <FormControl fullWidth>
          <InputLabel id="moeda-label">Selecione a Moeda</InputLabel>
          <Select
            labelId="moeda-label"
            value={moedaSelecionada}
            onChange={handleChangeMoeda}
            input={<OutlinedInput label="Selecione a Moeda" />}
          >
            {moedas.map((moeda) => (
              <MenuItem key={moeda.simbolo} value={moeda.simbolo}>
                {moeda.nomeFormatado}
              </MenuItem>
            ))}
          </Select>

          <p style={{ fontSize: '1.2em', fontWeight: '400', textAlign: 'center', marginTop: '30px' }}>Selecione a quantia</p>

          {moedaSelecionada && cotacao ? (
            <>
              <InputCurrency className={styles.inputAmount} handleOnChange={handleChangeAmount} value={amountInForeignCurrency} currencySymbol={getCurrencySymbol(moedaSelecionada)} />
              <p style={{ fontSize: '1.2em', fontWeight: '400', textAlign: 'center', marginTop: '30px' }}>
                Valor em R$ é igual a {amountPaidInReais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p style={{ fontSize: '1.2em', fontWeight: '400', textAlign: 'center' }}>Cotação: {cotacao.cotacaoCompra}</p>
            </>
          ) : (
            <>
              <InputCurrency disabled={true} className={styles.inputAmount} handleOnChange={handleChangeAmount} value={amountInForeignCurrency} currencySymbol="R$" />
              <p style={{ fontSize: '1.2em', fontWeight: '400', textAlign: 'center', marginTop: '30px' }}>Valor na cotação atual: </p>
            </>
          )}
          <Button onClick={handleClickOpen} type="submit" variant="contained" color="primary" sx={{
            backgroundColor: '#f28907',
            color: 'white',
            '&:hover': {
              backgroundColor: '#2e3661',
            },
            borderRadius: '50px',
            marginTop: '20px',
            marginLeft: '8px',
          }}>
            CONCLUIR
          </Button>
        </FormControl>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmação</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Você realmente deseja concluir a troca?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" sx={{
              backgroundColor: '#2e3661',
              color: 'white',
              '&:hover': {
                backgroundColor: '#f28907',
              },
              borderRadius: '50px',
              marginTop: '20px',
              marginLeft: '8px',
            }}>
              Cancelar
            </Button>

            <Button onClick={handleSubmit} color="primary" autoFocus sx={{
              backgroundColor: '#2e3661',
              color: 'white',
              '&:hover': {
                backgroundColor: '#f28907',
              },
              borderRadius: '50px',
              marginTop: '20px',
              marginLeft: '8px',
            }}>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        <div className={styles.financesOptions}>
          <Link to={'/user/wallet'} className={styles.financeLink}>
            <WalletIcon fontSize="large" style={{ color: '#f28907' }} />
          </Link>
          <p className={styles.textFinanceType}>
            <span style={{ display: 'block' }}>Carteira</span>
            <span style={{ display: 'block' }}>Internacional</span>
          </p>
        </div>
        {/* Acessar carteira internacional */}
      </div>
    </section>
  )
}
