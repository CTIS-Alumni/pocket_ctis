import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

const DegreeTypeForm = ({ activeItem }) => {
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      degree_type_name: null,
    },
    validationSchema: Yup.object({
      degree_type_name: Yup.string().required('Degree Type name is required'),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
    },
  })

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        degree_type_name: activeItem.degree_type_name,
      })
    } else {
      setRefreshKey(Math.random().toString(36))
      formik.resetForm()
    }
  }, [activeItem])


  const onSubmitHandler = async (values) => {
    const res = await _submitFetcher('POST', craftUrl(['degreetypes']), {degreetypes: [values]})
    if(!res.data?.length || res.errors.length){
      toast.error(res.errors[0].error)
    }
    else toast.success("Exam successfully added")
  }
  return (
    <div>
      <h5>Degree Type</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
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
