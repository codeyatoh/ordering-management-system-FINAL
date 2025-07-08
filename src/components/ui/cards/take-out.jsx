import React from 'react'
import TakeOutImage from '../../../assets/images/take-out.png'
import styles from './dine-take.module.css'
import { useNavigate } from 'react-router-dom'

function TakeOut() {
  const navigate = useNavigate();
  return (
    <div className={styles.optionCard} onClick={() => navigate('/coffee-shop', { state: { orderType: 'take-out' } })}>
      <div className={styles.cardHeader}>
        <h2 className={styles.optionTitle}>Take-Out</h2>
      </div>
      <div className={styles.imageContainer}>
        <img src={TakeOutImage} alt="Take-out coffee and pastries" className={styles.optionImage} />
      </div>
      <div className={styles.cardFooter}>
        <p className={styles.description}>Enjoy your coffee and pastries in our cozy cafe</p>
      </div>
    </div>
  )
}

export default TakeOut
