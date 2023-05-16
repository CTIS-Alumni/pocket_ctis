import { ToastContainer } from 'react-toastify'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm'
import styles from '../../styles/settings.module.css'
import { useState } from 'react'
import ChangeEmailForm from '../../components/ChangeEmailForm/ChangeEmailForm'

const SettingsDashboard = () => {
  const [activeKey, setActiveKey] = useState('password')

  return (
    <AdminPageContainer>
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
          {activeKey == 'password' && <ChangePasswordForm />}
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
    </AdminPageContainer>
  )
}

export default SettingsDashboard
