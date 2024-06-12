import { useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Context } from '../context/UserContext'

const BACKGROUND_COLORS = {
  '/login': '#F28907',
  '/forgotpassword': '#F28907',
  '/register': '#F28907',
  '/': '#F28907',
  '/user/home': '#FFF',
  // Add more color mappings for future routes
}

function useBackgroundColor() {
  const location = useLocation()
  const { user } = useContext(Context)
  let backgroundColor = 'white' // Define uma cor padrão

  useEffect(() => {
    const pathname = location.pathname
    const color = BACKGROUND_COLORS[pathname]

    if (color) {
      document.body.style.backgroundColor = color
      backgroundColor = color // Atualiza a cor de fundo
    } else {
      document.body.style.backgroundColor = backgroundColor // Mantém a cor padrão
    }
  }, [location])

  return { backgroundColor, user }
}

export default useBackgroundColor
