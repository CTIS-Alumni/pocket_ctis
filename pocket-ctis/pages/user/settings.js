import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import UserPageContainer from '../../components/UserPageContainer/UserPageContainer'
import styles from '../../styles/userSettings.module.css'
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm'
import ChangeEmailForm from '../../components/ChangeEmailForm/ChangeEmailForm'

const Settings = () => {
  const [activeKey, setActiveKey] = useState('password')

  return (
    <UserPageContainer>
      <div className={styles.pageContainer}>
        <div className={styles.sidebar}>
          <h5>Settings</h5>
          <div
            className={
              activeKey == 'password' ? styles.active : styles.inActive
            }
            onClick={() => setActiveKey('password')}
          >
            Password
          </div>
          <div
            className={activeKey == 'email' ? styles.active : styles.inActive}
            onClick={() => setActiveKey('email')}
          >
            Contact Email Address
          </div>
        </div>

        <div className={styles.formBody}>
          {activeKey == 'password' && <ChangePasswordForm type={"changePassword"} />}
          {activeKey == 'email' && <ChangeEmailForm />}
        </div>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
    </UserPageContainer>
  )
}

export default Settings
