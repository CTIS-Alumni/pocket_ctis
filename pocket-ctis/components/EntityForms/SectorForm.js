import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

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
    onSubmit: async (values) => {
      await onSubmitHandler(values)
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

  const onSubmitHandler = async (values) => {
    const res = await _submitFetcher('POST', craftUrl(['sectors']), {sectors: [values]})
    if (!res.data?.length || res.errors.length) {
      toast.error(res.errors[0].error)
    } else toast.success("Sector successfully added")
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
