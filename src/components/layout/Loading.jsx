import SyncLoader from "react-spinners/SyncLoader"
import styles from './Loading.module.css'

function Loading() {
  return (
    <section className={styles.containerLoad}>
      <SyncLoader color="#fff" />
    </section>
  )
}

export default Loading