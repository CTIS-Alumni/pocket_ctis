import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const ExamForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      exam_name: null,
    },
    validationSchema: Yup.object({
      exam_name: Yup.string().required('Exam name is required'),
    }),
    onSubmit: (vals) => {
      onSubmitHandler(vals)
    },
  })

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        exam_name: activeItem.exam_name,
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
      <h5>Exams</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Exam Name</label>
            <input
              className={styles.inputField}
              id='exam_name'
              name='exam_name'
              value={formik.values.exam_name}
              onChange={formik.handleChange}
            />
            {formik.touched.exam_name && formik.errors.exam_name ? (
              <div className={styles.error}>{formik.errors.exam_name}</div>
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

export default ExamForm
