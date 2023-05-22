import UserPageContainer from '../../components/UserPageContainer/UserPageContainer'
import { useFormik } from 'formik'
import styles from '../../styles/requests.module.css'
import * as Yup from 'yup'

const Requests = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: 'report',
      subject: null,
      description: '',
    },
    validationSchema: Yup.object({
      subject: Yup.string().required(),
      description: Yup.string().required(),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  const onSubmitHandler = (vals) => {
    console.log(vals)
  }

  return (
    <UserPageContainer>
      <div className={styles.container}>
        <div style={{ width: '70%', margin: '30px auto' }}>
          <h5>Requests</h5>
          <p>
            These requests will be sent to the CTIS Admins. You can provide
            information about any bugs, suggestions, or information changes that
            you would like to ask for.
          </p>
          <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Type</label>
              <select
                className={styles.inputField}
                id='type'
                name='type'
                onChange={formik.handleChange}
                value={formik.values.type}
                defaultValue={'report'}
              >
                <option value='report' selected>
                  Report
                </option>
                <option value='request'>Request</option>
                <option value='other'>Other</option>
              </select>
              {formik.touched.type && formik.errors.type ? (
                <div className={styles.error}>{formik.errors.type}</div>
              ) : null}
            </div>

            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Subject</label>
              <input
                name='subject'
                id='subject'
                onChange={formik.handleChange}
                value={formik.values.subject}
                className={styles.inputField}
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className={styles.error}>{formik.errors.subject}</div>
              ) : null}
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.inputLabel}>Description</label>
              <textarea
                rows={5}
                name='description'
                id='description'
                onChange={formik.handleChange}
                value={formik.values.description}
                className={styles.inputField}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className={styles.error}>{formik.errors.description}</div>
              ) : null}
            </div>
            <button className={styles.submitBtn} type='submit'>
              Submit
            </button>
          </form>
        </div>
      </div>
    </UserPageContainer>
  )
}

export default Requests
