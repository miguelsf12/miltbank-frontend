import SyncLoader from "react-spinners/SyncLoader"
import styles from './Loading.module.css'
import logo from '../../assets/img/logo.png'

function Loading() {
  return (
    <section className={styles.containerLoad}>
      {/* <SyncLoader color="#fff" /> */}
      <img className={styles.loadImg} src={logo} alt="" />
    </section>
  )
}

export default Loading