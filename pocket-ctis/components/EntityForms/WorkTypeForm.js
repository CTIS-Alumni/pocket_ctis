import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const WorkTypeForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      work_type_name: null,
    },
    validationSchema: Yup.object({
      work_type_name: Yup.string().required('Work Type name is required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        work_type_name: activeItem.work_type_name,
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
      <h5>Work Type</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Work Type Name</label>
            <input
              className={styles.inputField}
              id='work_type_name'
              name='work_type_name'
              value={formik.values.work_type_name}
              onChange={formik.handleChange}
            />
            {formik.touched.work_type_name && formik.errors.work_type_name ? (
              <div className={styles.error}>{formik.errors.work_type_name}</div>
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

export default WorkTypeForm
