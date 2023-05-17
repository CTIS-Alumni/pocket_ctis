import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const SectorForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      sector_name: null,
    },
    validationSchema: Yup.object({
      sector_name: Yup.string().required('Sector name is required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  const onSubmitHandler = (vals) => {
    console.log(vals)
  }

  return (
    <div>
      <h5>Sector</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Sector Name</label>
            <input
              className={styles.inputField}
              id='sector_name'
              name='sector_name'
              value={formik.values.sector_name}
              onChange={formik.handleChange}
            />
            {formik.touched.sector_name && formik.errors.sector_name ? (
              <div className={styles.error}>{formik.errors.sector_name}</div>
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

export default SectorForm
