import React from 'react'
import DineInImage from '../../../assets/images/dine-in.png'
import styles from './dine-take.module.css'
import { useNavigate } from 'react-router-dom'

function DineIn() {
  const navigate = useNavigate();
  return (
    <div className={styles.optionsContainer}>
      <div className={styles.optionCard} onClick={() => navigate('/coffee-shop', { state: { orderType: 'dine-in' } })}>
        <div className={styles.cardHeader}>
          <h2 className={styles.optionTitle}>Dine-In</h2>
        </div>
        <div className={styles.imageContainer}>
          <img src={DineInImage} alt="Dine-in restaurant interior" className={styles.optionImage} />
        </div>
        <div className={styles.cardFooter}>
          <p className={styles.description}>Order to go and enjoy anywhere</p>
        </div>
      </div>
    </div>
  )
}

export default DineIn
