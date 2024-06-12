import React from 'react';
import styles from './Welcome.module.css'
import useBackgroundColor from '../../hooks/useBackgroundColor'

import { Link } from 'react-router-dom';

function Welcome() {
  const { backgroundColor } = useBackgroundColor()

  return (
    <div className={styles.container}>
      {/* Título */}
      <div className={styles.copy_container}>
        <h1 className={styles.copy_title}>Te ajudamos ir onde quiser!</h1>
        <h2 className={styles.copy_subtitle}>Pronto para começar a realizar seus sonhos?</h2>
      </div>
      <div className={styles.carousel_item}>
        <img
          src="https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-viagem_114360-5843.jpg?w=826&t=st=1703254348~exp=1703254948~hmac=4805ab8466643cf99cd9bbcae9e10feecd506106caca4dcb3dc32b85f5779e82"
          className="d-block w-100" alt="..." />
      </div>
      {/* Carrossel Imagens */}
      {/* <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner home">
          <div className={`carousel-item home active ${styles.carousel_item}`}>
            <img
              src="https://img.freepik.com/vetores-gratis/ilustracao-do-conceito-de-viagem_114360-5843.jpg?w=826&t=st=1703254348~exp=1703254948~hmac=4805ab8466643cf99cd9bbcae9e10feecd506106caca4dcb3dc32b85f5779e82"
              className="d-block w-100" alt="..." />
          </div>
          <div className={`carousel-item home ${styles.carousel_item}`}>
            <img
              src="https://img.freepik.com/vetores-gratis/pessoas-as-compras-com-sacolas_24908-56765.jpg?w=826&t=st=1703253879~exp=1703254479~hmac=940e6d04e978158a9740cba61dacf9eedaaf73a0015218969ecc22fa97be5ca5"
              className="d-block w-100" alt="..." />
          </div>
          <div className={`carousel-item home ${styles.carousel_item}`}>
            <img
              src="https://img.freepik.com/vetores-gratis/user/homem-de-negocios-com-moedas-e-folhas_24877-54740.jpg?w=826&t=st=1703254490~exp=1703255090~hmac=f5cc54cd1b1338cd37a27635466de70e147c7630fdb2937b1b04c808f284c7ad"
              className="d-block w-100" alt="..." />
          </div>
        </div>
      </div> */}
      {/* Login & Register */}
      <div className={styles.login_register}>
        <Link to={'/login'}>ENTRAR</Link>
        <Link to={'/register'}>REGISTRAR</Link>
      </div>
      <p className={styles.miss_account}>Não possui uma <Link className={styles.miss_account} to={'/register'}>conta?</Link> Abra a sua agora
        mesmo!</p>
    </div>
  );
}

export default Welcome;
