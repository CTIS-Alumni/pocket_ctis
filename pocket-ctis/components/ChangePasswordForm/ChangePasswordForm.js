import { Container } from 'react-bootstrap'
import { useFormik } from 'formik'
import styles from './ChangePasswordForm.module.css'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {useState} from "react";

const changePassword = async (current, newPass) => {
  const res = await _submitFetcher("POST", craftUrl(["accounts"], [{name: "changeAdminPassword", value: 1}]), {current, newPass})
  return res;
}

const ChangePasswordForm = () => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string()
        .required('Required'),
      newPassword: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
      confirmPassword: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
    }),
    onSubmit: async (values) => {
     await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    if(values.newPassword !== values.confirmPassword){
      toast.error("New password and confirm password don't match!")
      return;
    }

    const res = await changePassword(values.currentPassword, values.newPassword, values.confirmPassword)
    if (res.data && !res.errors) {
      toast.success('Admin password has been reset successfully.')
      formik.resetForm({
        values: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
      })
      setRefreshKey(Math.random().toString(36))
    }else{
      toast.error(res.errors[0].error)
    }
  }

  return (
    <div>
      <h5>Change Password</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Current Password</label>
            <input
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              id='currentPassword'
              name='currentPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword ? (
              <div className={styles.error}>{formik.errors.currentPassword}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>New Password</label>
            <input
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              id='newPassword'
              name='newPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className={styles.error}>{formik.errors.newPassword}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Confirm New Password</label>
            <input
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.confirmPassword &&
            formik.errors.confirmPassword ? (
              <div className={styles.error}>
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
          <button type='submit' className={styles.confirmButton}>
            Confirm
          </button>
        </form>
      </Container>
    </div>
  )
}

export default ChangePasswordForm
