import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

const ExamForm = ({ activeItem, updateData }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      exam_name: null,
    },
    validationSchema: Yup.object({
      exam_name: Yup.string().required('Exam name is required'),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
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

  const onSubmitHandler = async (values) => {
    if (activeItem) {
      values.id = activeItem.id
      const res = await _submitFetcher('PUT', craftUrl(['exams']), {
        exams: [values],
      })
      if (!res.data[activeItem.id] || res.errors.length) {
        toast.error(res.errors[0].error)
      } else {
        toast.success('Exam successfully saved')
        updateData()
        formik.resetForm()
        setRefreshKey(Math.random().toString(36))
      }
    } else {
      const res = await _submitFetcher('POST', craftUrl(['exams']), {
        exams: [values],
      })
      if (!res.data?.length || res.errors.length) {
        toast.error(res.errors[0].error)
      } else {
        toast.success('Exam successfully added')
        updateData()
        formik.resetForm()
        setRefreshKey(Math.random().toString(36))
      }
    }
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
