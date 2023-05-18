import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

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
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
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


  const onSubmitHandler = async (values) => {
    console.log(activeItem);
    if(activeItem){
      values.id = activeItem.id;
      const res = await _submitFetcher('PUT', craftUrl(['studentsocieties']), {societies: [values]})
      if (!res.data[activeItem.id] || res.errors.length) {
        toast.error(res.errors[0].error)
      } else toast.success("Student society successfully saved")
    }else{
      const res = await _submitFetcher('POST', craftUrl(['studentsocieties']), {societies: [values]})
      if (!res.data?.length || res.errors.length) {
        toast.error(res.errors[0].error)
      } else toast.success("Student society successfully added")
    }
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
