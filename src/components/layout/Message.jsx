import { useState, useEffect } from 'react'
import bus from '../../utils/bus';

import styles from './Message.module.css'

function Message() {
  const [visibility, setVisibility] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')

  function hideButton() {
    setVisibility(false)
  }

  useEffect(() => {
    bus.addListener('flash', ({ message, type }) => {
      setVisibility(true)
      setMessage(message)
      setType(type)
    })
  }, [])


  return (
    visibility && (
      <div className={styles.containerMessage}>
        <div className={`${styles.messageErro} ${styles[type]}`} id="errorDiv">
          {message}
          <button className={styles.btn_hide} onClick={hideButton} id="hideButton">FECHAR</button>
        </div>
      </div>)
  )
}

export default Message
