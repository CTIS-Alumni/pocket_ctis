import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import Select from 'react-select'
import * as Yup from 'yup'
import { Check2Square, Square } from 'react-bootstrap-icons'
import { Location_data } from '../../context/locationContext'

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: 'rgb(245, 164, 37)',
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 2,
  }),
}
const HighSchoolForm = () => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const { locationData } = useContext(Location_data)

  useEffect(() => {
    setCountries(
      Object.keys(locationData).map((l) => ({
        value: l,
        label: l.split('-')[1],
      }))
    )
  }, [locationData])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      high_school_name: null,
      city_id: null,
      country: null,
    },
    validationSchema: Yup.object({
      high_school_name: Yup.string().required('High School name is required'),
      country: Yup.object().required('Country is required'),
      city_id: Yup.object().required('City is required'),
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
      <h5>High School</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>High School Name</label>
            <input
              className={styles.inputField}
              id='high_school_name'
              name='high_school_name'
              value={formik.values.high_school_name}
              onChange={formik.handleChange}
            />
            {formik.touched.high_school_name &&
            formik.errors.high_school_name ? (
              <div className={styles.error}>
                {formik.errors.high_school_name}
              </div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Country</label>
            <Select
              styles={selectStyles}
              options={countries}
              id='country'
              name='country'
              value={formik.values.country}
              onChange={(val) => {
                formik.setFieldValue('country', val)
                const temp = locationData[val.value].map((l) => {
                  const [city_id, city_name] = l.split('-')
                  return { value: city_id, label: city_name }
                })
                setCities(temp)
              }}
            />
            {formik.touched.country && formik.errors.country ? (
              <div className={styles.error}>{formik.errors.country}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>City</label>
            <Select
              styles={selectStyles}
              options={cities}
              isDisabled={!!!formik.values.country}
              id='city_id'
              name='city_id'
              value={formik.values.city_id}
              onChange={(val) => formik.setFieldValue('city_id', val)}
            />
            {formik.touched.city_id && formik.errors.city_id ? (
              <div className={styles.error}>{formik.errors.city_id}</div>
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

export default HighSchoolForm
