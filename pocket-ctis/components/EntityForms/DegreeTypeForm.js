import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const DegreeTypeForm = () => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      degree_type_name: null,
    },
    validationSchema: Yup.object({
      degree_type_name: Yup.string().required('Degree Type name is required'),
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
      <h5>Degree Type</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Degree Type Name</label>
            <input
              className={styles.inputField}
              id='degree_type_name'
              name='degree_type_name'
              value={formik.values.degree_type_name}
              onChange={formik.handleChange}
            />
            {formik.touched.degree_type_name &&
            formik.errors.degree_type_name ? (
              <div className={styles.error}>
                {formik.errors.degree_type_name}
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

export default DegreeTypeForm
