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
    // console.log(values)
    const data = clone(values)
    data.roles = data.roles.map((role) => role.value)
    data.gender = data.gender.value == 'Male' ? 1 : 0
    console.log(data)

    //API here

    formik.resetForm({
      values: {
        roles: null,
        gender: null,
        firstName: null,
        lastName: null,
        bilkentId: null,
        emailAddress: null,
      },
    })
    setRefreshKey(Math.random().toString(36))
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      roles: null,
      gender: null,
      firstName: null,
      lastName: null,
      bilkentId: null,
      emailAddress: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      emailAddress: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      bilkentId: Yup.number()
        .positive('Invalid BILKENT ID')
        .integer('Invalid BILKENT ID')
        .required('Required'),
      gender: Yup.object().required('Required'),
      roles: Yup.array().required('Required'),
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
        firstName: null,
        lastName: null,
        bilkentId: null,
        emailAddress: null,
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
                  <label htmlFor='firstName' className={styles.inputLabel}>
                    First Name
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    type='text'
                    name='firstName'
                    className={styles.inputField}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className={styles.error}>
                      {formik.errors.firstName}
                    </div>
                  ) : null}
                </div>
              </div>
              {/* ------ */}
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='lastName' className={styles.inputLabel}>
                    Last Name
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    type='text'
                    name='lastName'
                    className={styles.inputField}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className={styles.error}>{formik.errors.lastName}</div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div style={{ display: 'flex', gap: 10 }} className='my-2'>
              <div style={{ width: '50%' }}>
                <div>
                  <label htmlFor='bilkentId' className={styles.inputLabel}>
                    BILKENT ID
                  </label>
                </div>
                <div>
                  <input
                    value={formik.values.bilkentId}
                    onChange={formik.handleChange}
                    type='text'
                    name='bilkentId'
                    className={styles.inputField}
                  />
                  {formik.touched.bilkentId && formik.errors.bilkentId ? (
                    <div className={styles.error}>
                      {formik.errors.bilkentId}
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
                    value={formik.values.gender}
                    onChange={(val) => formik.setFieldValue('gender', val)}
                    name='gender'
                    styles={customStyles}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                    ]}
                  />
                  {formik.touched.gender && formik.errors.gender ? (
                    <div className={styles.error}>{formik.errors.gender}</div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* ------ */}
            <div className='my-2'>
              <div>
                <label htmlFor='emailAddress' className={styles.inputLabel}>
                  Email Address
                </label>
              </div>
              <div>
                <input
                  value={formik.values.emailAddress}
                  onChange={formik.handleChange}
                  type='email'
                  name='emailAddress'
                  className={styles.inputField}
                />
                {formik.touched.emailAddress && formik.errors.emailAddress ? (
                  <div className={styles.error}>
                    {formik.errors.emailAddress}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor='roles'>Roles</label>
              <Select
                value={formik.values.roles}
                onChange={(val) => formik.setFieldValue('roles', val)}
                isMulti
                closeMenuOnSelect={false}
                name='roles'
                styles={customStyles}
                options={accountTypes}
              />
              {formik.touched.roles && formik.errors.roles ? (
                <div className={styles.error}>{formik.errors.roles}</div>
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

{
  /* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <Input name='firstName' label='First Name' type='text' />
              <Input name='lastName' label='Last Name' type='text' />
            </div>
            <Input
              name='emailAddress'
              label='Email Address'
              type='email'
              className={styles.emailAddressInput}
            /> */
}
