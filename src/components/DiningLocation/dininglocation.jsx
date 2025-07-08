import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './dininglocation.module.css'
import cardStyles from '../ui/cards/dine-take.module.css'
import Logo from '../../assets/images/logo.png'
import DineIn from "../ui/cards/dine-in";
import TakeOut from "../ui/cards/take-out";
import { TbLogout } from 'react-icons/tb';
import { UserContext } from '../../context/UserContext';
import { toast } from 'react-toastify';

function DiningLocation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={Logo} alt="AJH Logo" className={styles.logo} />
        <h1 className={styles.title}>Dining Location</h1>
      </div>
      <div className={cardStyles.optionsContainer}>
        <DineIn />
        <TakeOut />
      </div>
    </div>
  )
}

export default DiningLocation