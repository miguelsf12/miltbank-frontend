import api from '../utils/api'

import useFlashMessage from './useFlashMessage'

export default function useUser() {
  const { setFlashMessage } = useFlashMessage()

  async function editUser(userModified, newPassword) {
    let msgText = 'Dados alterados com sucesso!'
    let msgType = 'success'

    try {
      const data = await api.patch('/users/edit', userModified, newPassword).then((response) => {
        return response.data
      })

    } catch (error) {
      msgText = error.response.data.message
      msgType = 'error'
    }

    setFlashMessage(msgText, msgType)
  }

  return { editUser }
}
