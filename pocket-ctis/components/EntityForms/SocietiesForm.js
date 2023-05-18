import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const SocietiesForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      society_name: null,
      description: null,
    },
    validationSchema: Yup.object({
      society_name: Yup.string().required('Society name is required'),
      description: Yup.string().required('Society description is required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        society_name: activeItem.society_name,
        description: activeItem.description,
      })
    } else {
      setRefreshKey(Math.random().toString(36))
      formik.resetForm()
    }
  }, [activeItem])

  const onSubmitHandler = (vals) => {
    console.log(vals)
  }

  return (
    <div>
      <h5>Society</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Society Name</label>
            <input
              className={styles.inputField}
              id='society_name'
              name='society_name'
              value={formik.values.society_name}
              onChange={formik.handleChange}
            />
            {formik.touched.society_name && formik.errors.society_name ? (
              <div className={styles.error}>{formik.errors.society_name}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Society Description</label>
            <input
              className={styles.inputField}
              id='description'
              name='description'
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className={styles.error}>{formik.errors.description}</div>
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

export default SocietiesForm
