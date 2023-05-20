import styles from './AdminUserFormStyles.module.css'
import { Formik, FieldArray, Form, Field } from 'formik'
import {
  XCircleFill,
  PlusCircleFill,
  ToggleOn,
  ToggleOff,
} from 'react-bootstrap-icons'
import { cloneDeep } from 'lodash'
import { useState, useEffect } from 'react'
import {
  _getFetcher,
  createReqObject,
  submitChanges,
} from '../../../../helpers/fetchHelpers'
import { craftUrl } from '../../../../helpers/urlHelper'
import {
  handleResponse,
  replaceWithNull,
  splitFields,
} from '../../../../helpers/submissionHelpers'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

const SocietiesInformationForm = ({ data, user_id, setIsUpdated }) => {
  const [societies, setSocieties] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    _getFetcher({ societies: craftUrl(['studentsocieties']) }).then(
      ({ societies }) => setSocieties(societies.data)
    )
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data)
  }

  let deletedData = []

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.activity_status = datum.activity_status == 1
      datum.society = `${datum.society_id}-${datum.society_name}`
      return datum
    })
    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.societies = newData.societies.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.activity_status = val.activity_status ? 1 : 0
      replaceWithNull(val)
      splitFields(val, ['society'])
      return val
    })
  }

  const args = [['society'], [], ['user_id', 'id'], []]
  const url = craftUrl(['users', user_id, 'societies'])

  const onSubmit = async (values) => {
    setIsUpdated(true)
    setIsLoading(true)
    let newData = cloneDeep(values)
    transformDataForSubmission(newData)

    const send_to_req = { societies: cloneDeep(dataAfterSubmit) }
    transformDataForSubmission(send_to_req)
    const requestObj = createReqObject(
      send_to_req.societies,
      newData.societies,
      deletedData
    )

    const responseObj = await submitChanges(url, requestObj)

    const new_data = handleResponse(
      send_to_req.societies,
      requestObj,
      responseObj,
      values,
      'societies',
      args,
      transformDataForSubmission
    )
    applyNewData(new_data)
    console.log('req,', requestObj, 'res', responseObj)

    deletedData = []

    let errors = []
    for (const [key, value] of Object.entries(responseObj)) {
      if (value.errors?.length > 0) {
        errors = [...errors, ...value.errors.map((error) => error)]
      }
    }

    if (errors.length > 0) {
      errors.forEach((errorInfo) => {
        toast.error(errorInfo.error)
      })
    } else if (
      responseObj.POST.data ||
      responseObj.PUT.data ||
      responseObj.DELETE.data
    ) {
      toast.success('Data successfully saved')
    }
    setIsLoading(false)
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ societies: transformData(data) }}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form style={{ position: 'relative' }}>
          {isLoading && (
            <div
              style={{
                zIndex: 2,
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                background: '#ccc',
                opacity: '0.5',
              }}
            >
              <Spinner />
            </div>
          )}
          <table style={{ width: '100%' }}>
            <tbody>
              <FieldArray
                name='societies'
                render={(arrayHelpers) => {
                  return (
                    <>
                      <tr>
                        <td colSpan={3}>
                          <div
                            className={styles.formPartitionHeading}
                            style={{ marginTop: 0 }}
                          >
                            <span>Societies</span>
                            <button
                              className={styles.addButton}
                              type='button'
                              onClick={() =>
                                arrayHelpers.insert(0, { society: '' })
                              }
                            >
                              <PlusCircleFill size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {props.values.societies &&
                      props.values.societies.length > 0 ? (
                        props.values.societies.map((society, index) => {
                          return (
                            <>
                              <tr key={index} style={{ width: '100%' }}>
                                <td>
                                  <div style={{ display: 'flex' }}>
                                    <div className={styles.removeBtnContainer}>
                                      <button
                                        className={styles.removeBtn}
                                        type='button'
                                        onClick={() => {
                                          arrayHelpers.remove(index)
                                          if (society.hasOwnProperty('id')) {
                                            deletedData.push({
                                              id: society.id,
                                              data: society,
                                            })
                                          }
                                        }}
                                      >
                                        <XCircleFill
                                          size={13}
                                          className={styles.removeIcon}
                                        />
                                      </button>
                                    </div>
                                    <div style={{ flexGrow: '1' }}>
                                      <div className={styles.inputContainer}>
                                        <label className={styles.inputLabel}>
                                          Society Name
                                        </label>
                                        <Field
                                          as='select'
                                          className={styles.inputField}
                                          id={`societies[${index}]society`}
                                          name={`societies[${index}]society`}
                                        >
                                          <option disabled selected value=''>
                                            Please select a student society
                                          </option>
                                          {societies.map((society) => (
                                            <option
                                              value={`${society.id}-${society.society_name}`}
                                            >
                                              {society.society_name}
                                            </option>
                                          ))}
                                        </Field>
                                      </div>
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'flex-end',
                                        }}
                                      >
                                        <div
                                          className={styles.inputContainer}
                                          style={{ width: '49%' }}
                                        >
                                          <Field
                                            name={`societies[${index}]activity_status`}
                                            id={`societies[${index}]activity_status`}
                                          >
                                            {({ field, form, meta }) => {
                                              return (
                                                <label
                                                  className={
                                                    styles.isCurrentCheckbox
                                                  }
                                                >
                                                  {field.value ? (
                                                    <ToggleOn
                                                      size={25}
                                                      className={
                                                        styles.isCurrentTrue
                                                      }
                                                    />
                                                  ) : (
                                                    <ToggleOff size={25} />
                                                  )}
                                                  &nbsp; Are you active?
                                                  <input
                                                    type='checkbox'
                                                    {...field}
                                                    style={{
                                                      display: 'none',
                                                    }}
                                                    disabled={!society.society}
                                                  />
                                                </label>
                                              )
                                            }}
                                          </Field>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {/* shows spaver only between records */}
                              {props.values.societies.length - 1 > index && (
                                <tr className={styles.spacer}>
                                  <td />
                                </tr>
                              )}
                            </>
                          )
                        })
                      ) : (
                        <tr>
                          <td>
                            <button
                              className={styles.bigAddBtn}
                              type='button'
                              onClick={() => arrayHelpers.push({ society: '' })}
                            >
                              Add a Society
                            </button>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                }}
              />
            </tbody>
          </table>
          <div>
            <button type='submit' className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default SocietiesInformationForm
