import styles from '../UserProfileFormStyles.module.css'
import { useState, useEffect } from 'react'
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons'
import { Formik, Field, Form } from 'formik'
import { cloneDeep } from 'lodash'
import { fetchAllHighSchool } from '../../../../helpers/searchHelpers'
import {splitFields} from "../../../../helpers/formatHelpers";
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";

const HighSchoolInformationForm = ({ data }) => {
  const [highSchools, setHighSchools] = useState([])

    let deletedData = [];

  useEffect(() => {
    fetchAllHighSchool().then((res) => setHighSchools(res.data))
  }, [])

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
        datum.visibility = datum.visibility == 1
        datum.high_school = `${datum.high_school_id}-${datum.high_school_name}`

      return datum
    })
    return newData
  }

  const onSubmit = async (values) => {
      let newData = cloneDeep(values);
      if(newData.high_school.length > 0){
          if(newData.high_school[0].high_school =="")
              newData.high_school = [];
          else{
              newData.high_school[0].visibility = newData.high_school[0].visibility ? 1 : 0;
              splitFields(newData.high_school[0], ["high_school"]);
          }
      }
      if(data.length > newData.high_school.length)
          deletedData.push({name: data[0].id, id: data[0].id});

      const requestObj = createReqObject(data, newData.high_school, deletedData);
      const url = craftUserUrl(1, "highschool");
      const responseObj = await submitChanges(url ,requestObj);
      deletedData = [];
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          high_school: transformData(data),
        }}
        onSubmit={onSubmit}
      >
        {(props) => {
          return (
            <>
              <Form>
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td>
                        <div className={styles.inputContainer}>
                          <label className={styles.inputLabel}>
                            High School
                          </label>
                          <Field
                            as='select'
                            name='high_school[0].high_school'
                            id='high_school[0].high_school'
                            className={styles.inputField}
                          >
                            <option selected value=''>
                              Please select High School
                            </option>
                            {highSchools.map((highSchool, index) => (
                              <option
                                key={index}
                                value={`${highSchool.id}-${highSchool.high_school_name}`}
                              >
                                {highSchool.high_school_name}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </td>
                      <td className={styles.visibilityCheckboxContainer}>
                        <Field name={`high_school[0].visibility`}>
                          {({ field, form, meta }) => {
                            return (
                              <label>
                                {field.value ? (
                                  <EyeFill
                                    size={20}
                                    className={`${styles.visibilityCheckbox} ${styles.visibilityUnchecked}`}
                                  />
                                ) : (
                                  <EyeSlashFill
                                    size={20}
                                    className={`${styles.visibilityCheckbox}`}
                                  />
                                )}
                                <input
                                  type='checkbox'
                                  {...field}
                                  style={{ display: 'none' }}
                                />
                              </label>
                            )
                          }}
                        </Field>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <button type='submit' className={styles.submitBtn}>
                    Submit
                  </button>
                </div>
              </Form>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export default HighSchoolInformationForm
