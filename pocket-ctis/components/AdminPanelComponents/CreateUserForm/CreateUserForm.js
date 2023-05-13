import { ChevronLeft } from 'react-bootstrap-icons'
import styles from './CreateUserForm.module.css'
import { Card } from 'react-bootstrap'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { ToastContainer, toast } from 'react-toastify'
import { craftUrl } from '../../../helpers/urlHelper'
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner'
import Select from 'react-select'
import * as Yup from 'yup'
import { clone } from 'lodash'

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: 'none',
    minHeight: '30px',
    height: '30px',
    borderRadius: '3px',
    backgroundColor: '#fff1c9',
    boxShadow: state.isFocused ? null : null,
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: '30px',
    padding: '0 6px',
  }),

  input: (provided, state) => ({
    ...provided,
    margin: '0px',
  }),
  indicatorSeparator: (state) => ({
    display: 'none',
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: '30px',
  }),
}

const CreateUserForm = ({ goBack }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [accountTypes, setAccountTypes] = useState([])
  const [refreshKey, setRefreshKey] = useState(Math.random().toString(36))

  useEffect(() => {
    _getFetcher({ roles: craftUrl('accounttypes') })
      .then(({ roles }) => {
        if (roles?.data) {
          const data = roles.data.map((role) => ({
            value: `${role.id}-${role.type_name}`,
            label: role.type_name,
          }))
          setAccountTypes(data)
        } else {
          roles.errors.map((error) => {
            toast.error(error)
          })
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error('Error:', err)
      })
  }, [])

  const onSubmitHandler = (values) => {
    const data = clone(values)
    data.user[0].roles = data.user[0].roles.map((role) => role.value)
    data.user[0].gender = data.user[0].gender.value == 'Male' ? 1 : 0
    console.log(data)

    //API here

    formik.resetForm({
      values: {
        user: [
          {
            roles: null,
            gender: null,
            first_name: null,
            last_name: null,
            bilkent_id: null,
            contact_email: null,
          },
        ],
      },
    })

    setRefreshKey(Math.random().toString(36))
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: [
        {
          roles: null,
          gender: null,
          first_name: null,
          last_name: null,
          bilkent_id: null,
          contact_email: null,
        },
      ],
    },
    validationSchema: Yup.object({
      user: Yup.array().of(
        Yup.object({
          first_name: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          last_name: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          contact_email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          bilkent_id: Yup.number()
            .positive('Invalid BILKENT ID')
            .integer('Invalid BILKENT ID')
            .required('Required'),
          gender: Yup.object().required('Required'),
          roles: Yup.array().required('Required'),
        })
      ),
    }),
    onSubmit: (values) => {
      onSubmitHandler(values)
    },
  })

  const goBackHandler = () => {
    formik.resetForm({
      values: {
        roles: null,
        gender: null,
        first_name: null,
        last_name: null,
        bilkent_id: null,
        contact_email: null,
      },
    })
    setRefreshKey(Math.random().toString(36))
    goBack()
  }

  return (
    <>
      <LoadingSpinner isLoading={isLoading} />
      <div className={styles.headerContainer}>
        <span className={styles.backButton}>
          <ChevronLeft onClick={goBackHandler} />
        </span>
        <h4 className='m-0'>Create User</h4>
      </div>
      <Card className={styles.defaultCard} border='light' key={refreshKey}>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formContainer}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: '50%' }}>
                <div>
                  <label
                    htmlFor='user[0].first_name'
                    className={styles.inputLabel}
                  >
                    First Name
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.user?.[0].first_name}
                    onChange={formik.handleChange}
                    type='text'
                    id='first_name'
                    name='user[0].first_name'
                    className={styles.inputField}
                  />
                  {formik.touched.user?.[0].first_name &&
                  formik.errors.user?.[0].first_name ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].first_name}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='last_name' className={styles.inputLabel}>
                    Last Name
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.user?.[0].last_name}
                    onChange={formik.handleChange}
                    type='text'
                    id='last_name'
                    name='user[0].last_name'
                    className={styles.inputField}
                  />
                  {formik.touched.user?.[0].last_name &&
                  formik.errors.user?.[0].last_name ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].last_name}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div style={{ display: 'flex', gap: 10 }} className='my-2'>
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='bilkent_id' className={styles.inputLabel}>
                    BILKENT ID
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.user?.[0].bilkent_id}
                    onChange={formik.handleChange}
                    type='number'
                    name='user[0].bilkent_id'
                    id='bilkent_id'
                    className={styles.inputField}
                  />
                  {formik.touched.user?.[0].bilkent_id &&
                  formik.errors.user?.[0].bilkent_id ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].bilkent_id}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='gender' className={styles.inputLabel}>
                    Gender
                  </label>
                </div>
                <div>
                  <Select
                    value={formik.values.user?.[0].gender}
                    onChange={(val) =>
                      formik.setFieldValue('user[0].gender', val)
                    }
                    id='gender'
                    name='user[0].gender'
                    styles={customStyles}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                  />
                  {formik.touched.user?.[0].gender &&
                  formik.errors.user?.[0].gender ? (
                    <div className={styles.error}>
                      {formik.errors.user?.[0].gender}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div className='my-2'>
              <div>
                <label htmlFor='contact_email' className={styles.inputLabel}>
                  Email Address
                </label>
              </div>
              <div>
                <input
                  value={formik.values.user?.[0].contact_email}
                  onChange={formik.handleChange}
                  type='email'
                  id='contact_email'
                  name='user[0].contact_email'
                  className={styles.inputField}
                />
                {formik.touched.user?.[0].contact_email &&
                formik.errors.user?.[0].contact_email ? (
                  <div className={styles.error}>
                    {formik.errors.user?.[0].contact_email}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor='roles'>Roles</label>
              <Select
                value={formik.values.user?.[0].roles}
                onChange={(val) => formik.setFieldValue('user[0].roles', val)}
                isMulti
                closeMenuOnSelect={false}
                id='roles'
                name='user[0].roles'
                styles={customStyles}
                options={accountTypes}
              />
              {formik.touched.user?.[0].roles &&
              formik.errors.user?.[0].roles ? (
                <div className={styles.error}>
                  {formik.errors.user?.[0].roles}
                </div>
              ) : null}
            </div>
            {/* ----- */}

            <div style={{ textAlign: 'center' }}>
              <button type='submit' className={styles.submitButton}>
                Create User
              </button>
            </div>
          </div>
        </form>
      </Card>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  )
}

export default CreateUserForm
