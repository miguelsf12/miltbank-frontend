import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import InputMask from 'react-input-mask'
import styles from './FormConfig.module.css'
import api from '../../utils/api'

export default function FormConfig({ image, userData }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isCep, setIsCep] = useState(true)
  const [formData, setFormData] = useState({
    telefone: '',
    email: '',
    address: {
      cep: '',
      logradouro: '',
      complemento: '',
      bairro: '',
      localidade: '',
      uf: '',
    },
    newPassword: '',
    confirmNewPassword: '',
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (name === 'cep' && value.length === 9) { // Verifique o comprimento do valor com o hífen
      const cepFormated = value.split('-').join('')

      fetch(`https://viacep.com.br/ws/${cepFormated}/json/`)
        .then((response) => response.json())
        .then((address) => {
          if (!address.erro) {
            setIsCep(true)
            setFormData((prevData) => ({
              ...prevData,
              address: {
                ...prevData.address,
                logradouro: address.logradouro,
                complemento: address.complemento,
                bairro: address.bairro,
                localidade: address.localidade,
                uf: address.uf,
              },
            }));

          } else {
            console.error('CEP NÃO ENCONTRADO');
            setIsCep(false);
          }
        })
        .catch((err) => {
          console.error('Erro ao buscar o CEP:', err);
          setIsCep(false);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    const formDataToSend = new FormData()

    // Adicionar dados do formulário não vazios
    Object.keys(formData).forEach((key) => {
      if (key === 'address') {
        Object.keys(formData.address).forEach((addressKey) => {
          const addressValue = formData.address[addressKey]
          if (addressValue.trim() !== '') {
            formDataToSend.append(`address.${addressKey}`, addressValue)
          }
        })
      } else {
        const value = formData[key]
        if (value.trim() !== '') {
          formDataToSend.append(key, value)
        }
      }
    })

    // Adicionar imagem, se existir
    if (image) {
      formDataToSend.append('image', image)
    }

    try {
      const response = await api.patch('/users/edit', formDataToSend, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          'Content-Type': 'multipart/form-data',
        },
      })
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
    }
  }

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '45%' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className={styles.container}>
          <InputMask
            mask="(99) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
          >
            {() => (
              <TextField
                id="telefone"
                label="Telefone"
                name="telefone"
                variant="outlined"
                fullWidth
                InputProps={{ style: { borderRadius: '50px' } }}
              />
            )}
          </InputMask>

          <TextField
            id="email"
            label="Email"
            name='email'
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{ style: { borderRadius: '50px' } }}
          />

          <InputMask
            mask="99999-999"
            value={formData.address.cep}
            onChange={handleChange}
          >
            {() => (
              <TextField
                id="cep"
                label="CEP"
                name='cep'
                error={!isCep} // Exemplo de condicional para aplicar um estilo de erro
                helperText={!isCep ? 'CEP inválido.' : ''} // Mensagem de ajuda condicional
                variant="outlined"
                fullWidth
                InputProps={{ style: { borderRadius: '50px' } }}
              />
            )}
          </InputMask>


          <TextField
            id="logradouro"
            label="Logradouro"
            name='logradouro'
            value={formData.address.logradouro}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{ style: { borderRadius: '50px' } }}
          />

          <TextField
            id="complemento"
            label="Complemento"
            name='complemento'
            value={formData.address.complemento}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{ style: { borderRadius: '50px' } }}
          />

          <TextField
            id="bairro"
            label="Bairro"
            name='bairro'
            value={formData.address.bairro}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{ style: { borderRadius: '50px' } }}
          />

          <TextField
            id="localidade"
            label="Localidade"
            name='localidade'
            value={formData.address.localidade}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{ style: { borderRadius: '50px' } }}
          />

          <TextField
            id="uf"
            label="UF"
            name='uf'
            value={formData.address.uf}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{ style: { borderRadius: '50px' } }}
          />
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title">
            {"Gostaria de alterar sua senha?"}
          </DialogTitle>
          <DialogContent>
            <FormControl sx={{ m: 1, width: '20ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Nova senha</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name='newPassword'
                value={formData.newPassword}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Nova senha"
              />
            </FormControl>

            <FormControl sx={{ m: 1, width: '20ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-confirm-password">Confirmar senha</InputLabel>
              <OutlinedInput
                id="outlined-adornment-confirm-password"
                type={showPassword ? 'text' : 'password'}
                name='confirmNewPassword'
                value={formData.confirmNewPassword}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirmar senha"
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary" sx={{
              backgroundColor: '#f28907',
              color: 'white',
              '&:hover': {
                backgroundColor: '#2e3661',
              },
              borderRadius: '50px',
            }}>
              Fechar
            </Button>
          </DialogActions>
        </Dialog>

        <Button type="submit" variant="contained" color="primary" sx={{
          backgroundColor: '#f28907',
          color: 'white',
          '&:hover': {
            backgroundColor: '#2e3661',
          },
          borderRadius: '50px',
          marginTop: '20px',
          marginLeft: '8px',
        }}>
          Salvar
        </Button>
        <Button onClick={handleClickOpen} variant="contained" sx={{
          backgroundColor: '#1F2440',
          marginTop: '20px',
          marginLeft: '20px',
          color: 'white',
          '&:hover': {
            backgroundColor: '#2e3661',
          },
          borderRadius: '50px'
        }}>
          Alterar senha
        </Button>
      </Box >
    </>
  )
}
