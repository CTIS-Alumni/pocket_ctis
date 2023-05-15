import { Container } from 'react-bootstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import styles from './ChangeEmailForm.module.css'

const ChangeEmailForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: null,
      confirmEmail: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Imvalid Email').required('Required'),
      confirmEmail: Yup.string().email('Imvalid Email').required('Required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  const onSubmitHandler = (vals) => {
    console.log(vals)
    if (vals.email != vals.confirmEmail) {
      toast.error('New email and Cofirm email do not match!')
      return
    }

    //change password code
  }

  return (
    <div>
      <h5>Change Email</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>New Email</label>
            <input
              value={formik.values.email}
              onChange={formik.handleChange}
              id='email'
              name='email'
              type='email'
              className={styles.inputField}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className={styles.error}>{formik.errors.email}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Confirm Email</label>
            <input
              value={formik.values.confirmEmail}
              onChange={formik.handleChange}
              id='confirmEmail'
              name='confirmEmail'
              type='email'
              className={styles.inputField}
            />
            {formik.touched.confirmEmail && formik.errors.confirmEmail ? (
              <div className={styles.error}>{formik.errors.confirmEmail}</div>
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

export default ChangeEmailForm
