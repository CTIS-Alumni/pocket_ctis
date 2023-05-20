import { useState } from 'react'
import Papa from 'papaparse'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { Card, Spinner } from 'react-bootstrap'
import {
  ClockFill,
  ArrowRepeat,
  Check,
  Exclamation,
} from 'react-bootstrap-icons'
import { Formik, Field, Form } from 'formik'
import { _submitFetcher } from '../../helpers/fetchHelpers'
import { craftUrl } from '../../helpers/urlHelper'
import { toast, ToastContainer } from 'react-toastify'
import styles from '../../styles/dataInsertion.module.css'

const csvDataTypes = [
  { name: 'Users', api: 'users' },
  { name: 'Sectors', api: 'sectors' },
  { name: 'Companies', api: 'companies' },
  { name: 'Internships', api: 'internships' },
  { name: 'Erasmus', api: 'erasmus' },
  { name: 'Educational Institutes', api: 'educationinstitutes' },
  { name: 'Graduation Projects', api: 'graduationprojects' },
  { name: 'High Schools', api: 'highschools' },
  { name: 'Skills', api: 'skills' }, //done
]

const DataInsertion = () => {
  const [file, setFile] = useState(null)
  const [rows, setRows] = useState(null)
  const [errors, setErrors] = useState(null)
  const [success, setSuccess] = useState(null)
  const [mailResults, setMailResults] = useState(null)
  const [columns, setColumns] = useState(null)
  const [type, setType] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const updateMailResults = () => {
    setMailResults((prevMailResults) => {
      const updatedMailResults = { ...prevMailResults, ...mail_results }
      return updatedMailResults
    })
  }

  let mail_results = {}
  let completed_users = {}

  const sendMail = async (user, index = null, type) => {
    const res = await _submitFetcher(
      'POST',
      craftUrl(['mail'], [{ name: 'updateProfile', value: 1 }]),
      { user_id: user?.inserted?.user_id || success[index], type: type }
    )
    console.log(res)
    mail_results[user?.index || index] = {
      id: user?.inserted?.id || success[index],
      index: user?.index || index,
      data: res.data,
      errors: res.errors,
    }
    updateMailResults()
    completed_users[user?.inserted?.user_id || success[index]] = {
      data: res.data,
      errors: res.errors,
    }
  }

  const sendUserMail = async (user, index = null) => {
    const res = await _submitFetcher(
      'POST',
      craftUrl(['mail'], [{ name: 'activateAccount', value: 1 }]),
      { user_id: user?.data?.id || success[index] }
    )
    mail_results[user.index || index] = {
      id: user?.data?.id || success[index],
      index: user?.index || index,
      data: res.data,
      errors: res.errors,
    }
    updateMailResults()
  }

  const previewFile = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors(null)
    setSuccess(null)
    setMailResults(null)
    if (file) {
      Papa.parse(file, {
        header: true,
        encoding: 'utf-8',
        skipEmptyLines: true,
        complete: function (data) {
          if (data?.data?.length) {
            setRows(data.data)
            setColumns(Object.keys(data.data[0]))
          }
        },
        error: function (err) {
          toast.error('An error occured while parsing file')
        },
      })
    } else toast.error('Please select a file!')
    setIsLoading(false)
  }

  const onSubmitHandler = async (values) => {
    if (!file || !rows?.length) {
      toast.error('Please select a file and preview it before submitting!')
      return
    }
    setType(values.dataType)
    setErrors(null)
    setMailResults(null)
    mail_results = {}

    const res = await _submitFetcher(
      'POST',
      craftUrl([values.dataType], [{ name: 'csv', value: 1 }]),
      { [values.dataType]: rows }
    )

    const success_map = {}
    if(res?.data?.length){
      res.data.forEach((d) => {
        success_map[d.index] = d.inserted?.user_id || d.inserted?.id
      })
    }

    setSuccess(success_map)
    if (Object.keys(success_map).length === 0)
      toast.error('An error occured while uploading file')

    const errors_map = {}
    if(res?.errors?.length){
      res.errors.forEach((err) => {
        errors_map[err.index || 0] = err.error
      })
    }

    setErrors(errors_map)
    if (
      Object.keys(errors_map).length === 0 &&
      Object.keys(success_map).length === rows.length
    )
      toast.success('All records uploaded successfully')
    else if (
      Object.keys(errors_map).length === 0 &&
      Object.keys(errors_map).length !== rows.length &&
      Object.keys(success_map).length !== rows.length
    )
      toast.warning('Some records failed to upload')

    completed_users = {}

    if (
      res.data?.length &&
      (values.dataType === 'internships' || values.dataType === 'erasmus')
    ) {
      setMailResults(true)
      for (const [i, user] of res.data.entries()) {
        if (!Object.keys(completed_users).includes(user.inserted.user_id)) {
          await sendMail(user, i, values.dataType)
        } else {
          mail_results[user.index] = {
            id: user.inserted.id,
            index: user.index,
            data: completed_users[user.inserted.id].data,
            errors: completed_users[user.inserted.id].errors,
          }
          updateMailResults()
        }
      }
    }
    if (res.data?.length && values.dataType === 'users') {
      setMailResults(true)
      for (const [i, user] of res.data.entries()) {
        await sendUserMail(user, i)
      }
      if (Object.keys(mail_results).length === rows.length)
        toast.success('All emails were sent successfully')
    }

    console.log('success:', success)
    console.log('errors:', errors)
    console.log('mail_results:', mail_results)
  }

  return (
    <AdminPageContainer>
      <Card border='light' style={{ padding: 20, marginBottom: 20 }}>
        <h5>Data Insertion via CSV</h5>
        <Formik
          enableReinitialize
          onSubmit={(values) => {
            setIsLoading(true)
            onSubmitHandler(values).then(() => setIsLoading(false))
          }}
          initialValues={{ dataType: 'users', file: null }}
        >
          {(props) => {
            return (
              <Form>
                <div className='pb-2'>
                  <div>
                    Step 1: Please choose the specification of the data being
                    added
                  </div>
                  <Field
                    className={styles.inputField}
                    as='select'
                    name='dataType'
                    id='dataType'
                    defaultValue='users'
                  >
                    {csvDataTypes.map((type, index) => (
                      <option
                        value={type.api}
                        key={index}
                        selected={index == 0}
                      >
                        {type.name}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className='pb-2'>
                  <div>
                    Step 2: Please choose the file (Make sure your .csv file is
                    encoded with utf-8 format)
                  </div>

                  <Field name='file' id='file'>
                    {({ field, form: { touched, errors } }) => (
                      <div>
                        <input
                          {...field}
                          className={styles.fileInput}
                          type='file'
                          placeholder='Select File'
                          onChange={(event) => {
                            setFile(event.currentTarget.files[0])
                          }}
                          accept='.csv'
                        />
                      </div>
                    )}
                  </Field>
                </div>
                <button type='submit' className={styles.submitButton}>
                  Submit
                </button>
                <button onClick={previewFile} className={styles.previewButton}>
                  Preview
                </button>
              </Form>
            )
          }}
        </Formik>
      </Card>
      {rows && (
        <Card
          border='light'
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          {isLoading && (
            <div className={styles.loading}>
              <Spinner />
            </div>
          )}
          <div style={{ padding: 20 }}>
            <h4>Preview Data</h4>
            <div className={styles.tableContainer}>
              <table className={styles.previewTable}>
                <thead>
                  <tr>
                    <th>Index</th>
                    {columns.map((column) => {
                      return <th key={column}>{column}</th>
                    })}
                    {errors && <th>Status</th>}
                    {mailResults && <th>Mail</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    return (
                      <tr key={index}>
                        <td>{Number(index) + 1}</td>
                        {columns.map((col) => {
                          return <td key={col}>{rows[index][col]}</td>
                        })}
                        {errors && (
                          <td>
                            {errors[index] && !success[index] ? (
                              errors[index]
                            ) : success === {} &&
                              Object.keys(errors).length === 1 ? (
                              <Exclamation size={30} color='red' />
                            ) : (
                              <Check size={30} color='lightgreen' />
                            )}
                          </td>
                        )}
                        {mailResults && (
                          <td>
                            {mailResults[index] &&
                            mailResults[index]?.errors == undefined ? (
                              <Check size={30} color='lightgreen' />
                            ) : !mailResults[index] && success[index] ? (
                              <ClockFill size={20} color='lightblue' />
                            ) : errors[index] ? (
                              <Exclamation size={30} color='red' />
                            ) : (
                              <ArrowRepeat
                                style={{ cursor: 'pointer' }}
                                onClick={async () => {
                                  mail_results[index] = false
                                  updateMailResults()
                                  if (type !== 'users')
                                    await sendMail(null, index, type)
                                  else await sendUserMail(null, index)
                                }}
                                size={27}
                                color='red'
                              />
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
    </AdminPageContainer>
  )
}

export default DataInsertion
