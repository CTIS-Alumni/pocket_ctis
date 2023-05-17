import { Container } from 'react-bootstrap'
import styles from './Forms.module.css'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import {_getFetcher, _submitFetcher} from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import Select from 'react-select'
import * as Yup from 'yup'
import { Check2Square, Square } from 'react-bootstrap-icons'
import {replaceWithNull} from "../../helpers/submissionHelpers";
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

const CompanyForm = () => {
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    _getFetcher({ sectors: craftUrl(['sectors']) })
      .then((res) => {
        const options = res.sectors.data.map((d) => ({
          value: d.id,
          label: d.sector_name,
        }))
        setSectors(options)
      })
      .catch((err) => console.log(err))
  }, [])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company_name: null,
      sector_id: null,
      is_internship: false,
    },
    validationSchema: Yup.object({
      company_name: Yup.string().required(),
      sector_id: Yup.object().required(),
    }),
    onSubmit: async (values) => {
      await onSubmitHandler(values)
    },
  })

  const onSubmitHandler = async (values) => {
    values.sector_id = values.sector_id.value;
    values.is_internship = values.is_internship ? 1 : 0;
    const res = await _submitFetcher('POST', craftUrl(['companies']), {companies: [values]})
    if(!res.data?.length || res.errors.length){
      toast.error(res.errors[0].error)
    }
    else toast.success("Company successfully added")
  }

  return (
    <div>
      <h5>Company</h5>
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Company Name</label>
            <input
              className={styles.inputField}
              id='company_name'
              name='company_name'
              value={formik.values.company_name}
              onChange={formik.handleChange}
            />
            {formik.touched.company_name && formik.errors.company_name ? (
              <div className={styles.error}>{formik.errors.company_name}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <label className={styles.inputLabel}>Sector</label>
            <Select
              styles={selectStyles}
              options={sectors}
              id='sector_id'
              name='sector_id'
              value={formik.values.sector_id}
              onChange={(val) => formik.setFieldValue('sector_id', val)}
            />
            {formik.touched.sector_id && formik.errors.sector_id ? (
              <div className={styles.error}>{formik.errors.sector_id}</div>
            ) : null}
          </div>
          <div className={styles.inputContainer}>
            <span
              name='is_internship'
              id='is_internship'
              onClick={() => {
                console.log('click')
                formik.setFieldValue(
                  'is_internship',
                  !formik.values.is_internship
                )
              }}
            >
              {formik.values.is_internship ? (
                <Check2Square className={styles.checkBox} />
              ) : (
                <Square className={styles.checkBox} />
              )}
            </span>
            <label htmlFor='is_internship' className={styles.checkBoxLabel}>
              Is Internship
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

export default CompanyForm
