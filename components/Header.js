import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import { unhideArticles } from '../reducers/hiddenArticles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';
import Link from 'next/link';
import Moment from 'react-moment';
import styles from '../styles/Header.module.css';
import fetch from '../next.config';

function Header() {
  const dispatch = useDispatch();
  //get the value from user reducer
  const user = useSelector((state) => state.user.value);

  const [date, setDate] = useState('2050-11-22T23:59:59');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  //set the date when opening the component
  useEffect(() => {
    setDate(new Date());
  }, []);

  //SignUp
  const handleRegister = () => {
    fetch(`${fetch}users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ username: signUpUsername, token: data.token }));
          setSignUpUsername('');
          setSignUpPassword('');
          setIsModalVisible(false)
        }
      });
  };

  //SignIn
  const handleConnection = () => {
    fetch(`${fetch}users/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: signInUsername, password: signInPassword }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          dispatch(login({ username: signInUsername, token: data.token }));
          setSignInUsername('');
          setSignInPassword('');
          setIsModalVisible(false)
        }
      });
  };

  //Logout and remove bookmraks
  const handleLogout = () => {
    dispatch(logout());
    dispatch(removeAllBookmark());
  };

  //set the visibility of modal
  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  //content of the connection modal
  let modalContent;
  //if no token, display SignUp and SignIn to connect
  if (!user.token) {
    modalContent = (
      <div className={styles.registerContainer}>
        <div className={styles.registerSection}>
          <p>Sign-up</p>
          <input type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
          <input type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
          <button id="register" onClick={() => handleRegister()}>Register</button>
        </div>
        <div className={styles.registerSection}>
          <p>Sign-in</p>
          <input type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
          <input type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
          <button id="connection" onClick={() => handleConnection()}>Connect</button>
        </div>
      </div>
    );
  }

  //display user section
  let userSection;
  //if connected, display Logout and unhide articles button
  if (user.token) {
    userSection = (
      <div className={styles.logoutSection}>
        <p>Welcome {user.username} / </p>
        <button onClick={() => handleLogout()}>Logout</button>
        <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
      </div>
    );
    //if not connected
  } else {
    //and modal is visible
    if (isModalVisible) {
      //display hide modal button and unhide articles button
      userSection =
        <div className={styles.headerIcons}>
          <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faXmark} />
          <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
        </div>
        //if modal is not visible
    } else {
      //display show modal button and unhide articles button
      userSection =
        <div className={styles.headerIcons}>
          <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faUser} />
          <FontAwesomeIcon icon={faEye} onClick={() => dispatch(unhideArticles())} className={styles.unhideIcon} />
        </div>
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Moment className={styles.date} date={date} format="MMM Do YYYY" />
        <h1 className={styles.title}>Morning News</h1>
        {userSection}
      </div>

      <div className={styles.linkContainer}>
        <Link href="/"><span className={styles.link}>Articles</span></Link>
        <Link href="/bookmarks"><span className={styles.link}>Bookmarks</span></Link>
      </div>

      {isModalVisible && <div id="react-modals">
        <Modal getContainer="#react-modals" className={styles.modal} visible={isModalVisible} closable={false} footer={null}>
          {modalContent}
        </Modal>
      </div>}
    </header >
  );
}

export default Header;
