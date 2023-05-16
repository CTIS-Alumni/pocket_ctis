import { Container } from 'react-bootstrap'
import { useFormik } from 'formik'
import styles from './ChangePasswordForm.module.css'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

const ChangePasswordForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      currentPass: null,
      newPassword: null,
      retypeNewPassword: null,
    },
    validationSchema: Yup.object({
      currentPass: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
      newPassword: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
      retypeNewPassword: Yup.string()
        .min(8, 'Password must be longer than 8 characters')
        .required('Required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  const onSubmitHandler = (vals) => {
    console.log(vals)
    if (vals.newPassword != vals.retypeNewPassword) {
      toast.error('New password and Cofirm New password do not match!')
      return
    }

    //change password code
  }

  return (
    <div>
      <h5>Change Password</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Current Password</label>
            <input
              value={formik.values.currentPass}
              onChange={formik.handleChange}
              id='currentPass'
              name='currentPass'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.currentPass && formik.errors.currentPass ? (
              <div className={styles.error}>{formik.errors.currentPass}</div>
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
              value={formik.values.retypeNewPassword}
              onChange={formik.handleChange}
              id='retypeNewPassword'
              name='retypeNewPassword'
              type='password'
              className={styles.inputField}
            />
            {formik.touched.retypeNewPassword &&
            formik.errors.retypeNewPassword ? (
              <div className={styles.error}>
                {formik.errors.retypeNewPassword}
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
