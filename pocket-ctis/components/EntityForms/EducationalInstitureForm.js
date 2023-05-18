import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import { useContext, useEffect, useState } from 'react'
import Select from 'react-select'
import * as Yup from 'yup'
import { Check2Square, Square } from 'react-bootstrap-icons'
import { Location_data } from '../../context/locationContext'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import {toast} from "react-toastify";

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

const EducationalInstitureForm = ({ activeItem }) => {
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const { locationData } = useContext(Location_data)
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  useEffect(() => {
    setCountries(
      Object.keys(locationData).map((l) => ({
        value: l,
        label: l.split('-')[1],
      }))
    )
  }, [locationData])

  useEffect(() => {
    if (activeItem) {
      formik.setValues({
        edu_inst_name: activeItem.edu_inst_name,
        city_id: {
          value: `${activeItem.city_id}-${activeItem.city_name}`,
          label: activeItem.city_name,
        },
        country: {
          value: `${activeItem.country_id}-${activeItem.country_name}`,
          label: activeItem.country_name,
        },
        is_erasmus: activeItem.is_erasmus,
      })
    } else {
      setRefreshKey(Math.random().toString(36))
      formik.resetForm()
    }
  }, [activeItem])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      edu_inst_name: null,
      city_id: null,
      country: null,
      is_erasmus: true,
    },
    validationSchema: Yup.object({
      edu_inst_name: Yup.string().required('Institute name is required'),
      country: Yup.object().required('Country is required'),
      city_id: Yup.object().required('City is required'),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    values.city_id = values.city_id.value;
    values.is_erasmus = values.is_erasmus ? 1 : 0;

    const res = await _submitFetcher('POST', craftUrl(['educationinstitutes']), {educationinstitutes: [values]})
    if(!res.data?.length || res.errors.length){
      toast.error(res.errors[0].error)
    }
    else toast.success("Education institute successfully added")
  }

  return (
    <div>
      <h5>Educational Institure Form</h5>
      <Container>
        <form onSubmit={formik.handleSubmit} key={refreshKey}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>
              Educational Institute Name
            </label>
            <input
              className={styles.inputField}
              id='edu_inst_name'
              name='edu_inst_name'
              value={formik.values.edu_inst_name}
              onChange={formik.handleChange}
            />
            {formik.touched.edu_inst_name && formik.errors.edu_inst_name ? (
              <div className={styles.error}>{formik.errors.edu_inst_name}</div>
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
                formik.setFieldValue('city_id', null)
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
          <div className={styles.inputContainer}>
            <span
              name='is_erasmus'
              id='is_erasmus'
              onClick={() => {
                console.log('click')
                formik.setFieldValue('is_erasmus', !formik.values.is_erasmus)
              }}
            >
              {formik.values.is_erasmus ? (
                <Check2Square className={styles.checkBox} />
              ) : (
                <Square className={styles.checkBox} />
              )}
            </span>
            <label htmlFor='is_erasmus' className={styles.checkBoxLabel}>
              Is Erasmus
            </label>
          </div>
          <button type='submit' className={styles.confirmButton}>
            Confirm
          </button>
        </form>
      </Container>
    </div>
  )
}

export default EducationalInstitureForm
