import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const SectorForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

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

  useEffect(() => {
    if (activeItem) {
      formik.setValues(activeItem)
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
      <h5>Sector</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
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
