import { Formik, Form, FieldArray, Field } from 'formik'
import styles from '../UserProfileFormStyles.module.css'
import { cloneDeep } from 'lodash'
import {
  EyeFill,
  EyeSlashFill,
  PlusCircleFill,
  ToggleOff,
  ToggleOn,
  XCircleFill,
} from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import {
  fetchAllDegreeTypes,
  fetchAllEducationInstitutes,
} from '../../../../helpers/searchHelpers'
import DatePickerField from '../../../DatePickers/DatePicker'
import {createReqObject, submitChanges} from "../../../../helpers/fetchHelpers";
import {craftUserUrl} from "../../../../helpers/urlHelper";
import {convertToIso, replaceWithNull, splitFields, handleResponse} from "../../../../helpers/submissionHelpers";

const EducationInformationForm = ({ data , user_id}) => {
  const [eduInsts, setEduInsts] = useState([])
  const [degreeTypes, setDegreeTypes] = useState([])
  const [dataAfterSubmit, setDataAfterSubmit] = useState(data);

  useEffect(() => {
    fetchAllEducationInstitutes().then((res) => setEduInsts(res.data))
    fetchAllDegreeTypes().then((res) => setDegreeTypes(res.data))
  }, [])

  const applyNewData = (data) => {
    setDataAfterSubmit(data);
  }

  let deletedData = [];

  const transformData = (data) => {
    let newData = cloneDeep(data)
    newData = newData.map((datum) => {
      datum.visibility = datum.visibility == 1
      datum.edu_inst = `${datum.edu_inst_id}-${datum.edu_inst_name}`
      datum.start_date = datum.start_date ? new Date(datum.start_date) : null
      datum.end_date = datum.end_date ? new Date(datum.end_date) : null
      datum.degree_type = `${datum.degree_type_id}-${datum.degree_type_name}`
      datum.is_current = datum.is_current == 1

      return datum
    })
    return newData
  }

  const transformDataForSubmission = (newData) => {
    newData.edu_records = newData.edu_records.map((val) => {
      val.visibility = val.visibility ? 1 : 0
      val.is_current = val.is_current ? 1 : 0
      if(val.is_current && val.end_date)
        val.end_date = null;
      val.start_date =
          val.start_date != null ? convertToIso(val.start_date) : null;
      val.end_date =
          val.end_date != null ? convertToIso(val.end_date) : null;
      val.name_of_program = val.name_of_program ? val.name_of_program : null;
      val.education_description = val.education_description ? val.education_description : null;
      replaceWithNull(val);
      splitFields(val, ["edu_inst", "degree_type"])
      return val
    });
  }

  const onSubmit = async (values) => {
    let newData = cloneDeep(values)
    transformDataForSubmission(newData);

    const args = [["edu_inst", "degree_type"], [], ["id", "record_date", "user_id"], ["start_date", "end_date"]];
    const send_to_req = {edu_records : cloneDeep(dataAfterSubmit)};
    transformDataForSubmission(send_to_req);
    const requestObj = createReqObject(send_to_req.edu_records, newData.edu_records, deletedData);
    const url = craftUserUrl(user_id, "educationrecords");
    const responseObj = await submitChanges(url ,requestObj);
    const new_data = handleResponse(requestObj, responseObj, values, "edu_records", args, transformDataForSubmission);
    applyNewData(new_data);
    console.log("req:", requestObj, "res", responseObj);

    deletedData = [];
  }

  return (
    <>
      <Formik
        initialValues={{
          edu_records: transformData(data),
        }}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {(props) => {
          return (
            <Form>
              <table style={{ width: '100%' }}>
                <tbody>
                  <FieldArray
                    name='edu_records'
                    render={(arrayHelpers) => (
                      <>
                        <tr>
                          <td colSpan={3}>
                            <div
                              className={styles.formPartitionHeading}
                              style={{ marginTop: 0 }}
                            >
                              <span>Education Information</span>
                              <button
                                className={styles.addButton}
                                type='button'
                                onClick={() => arrayHelpers.insert(0, '')}
                              >
                                <PlusCircleFill size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {props.values.edu_records &&
                        props.values.edu_records.length > 0 ? (
                          props.values.edu_records.map((edu_record, index) => {
                            return (
                              <>
                                <tr key={index} style={{ width: '100%' }}>
                                  <td>
                                    <div style={{ display: 'flex' }}>
                                      <div
                                        className={styles.removeBtnContainer}
                                      >
                                        <button
                                          className={styles.removeBtn}
                                          type='button'
                                          onClick={() =>{
                                            arrayHelpers.remove(index);
                                            if(edu_record.hasOwnProperty("id"))
                                              deletedData.push({name: edu_record.id, id: edu_record.id});
                                          }}
                                        >
                                          <XCircleFill
                                            size={13}
                                            className={styles.removeIcon}
                                          />{edu_record.id}
                                        </button>
                                      </div>
                                      <div style={{ flexGrow: '1' }}>
                                        <div className={styles.inputContainer}>
                                          <label className={styles.inputLabel}>
                                            Instiute Name
                                          </label>
                                          <Field
                                            as='select'
                                            className={styles.inputField}
                                            id={`edu_records[${index}]edu_inst`}
                                            name={`edu_records[${index}]edu_inst`}
                                          >
                                            <option disabled selected value=''>
                                              Please select Educational
                                              Institute
                                            </option>
                                            {eduInsts.map((inst) => (
                                              <option
                                                value={`${inst.id}-${inst.edu_inst_name}`}
                                              >
                                                {inst.edu_inst_name}
                                              </option>
                                            ))}
                                          </Field>
                                        </div>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                          }}
                                        >
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Degree Name
                                            </label>
                                            <Field
                                              as='select'
                                              className={styles.inputField}
                                              name={`edu_records[${index}]degree_type`}
                                              id={`edu_records[${index}]degree_type`}
                                            >
                                              <option selected value=''>
                                                Please select a Degree
                                              </option>
                                              {degreeTypes.map((degree) => (
                                                <option
                                                  value={`${degree.id}-${degree.degree_type_name}`}
                                                >
                                                  {degree.degree_type_name}
                                                </option>
                                              ))}
                                            </Field>
                                          </div>
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Name of Program
                                            </label>
                                            <Field
                                              className={styles.inputField}
                                              name={`edu_records[${index}]name_of_program`}
                                              id={`edu_records[${index}]name_of_program`}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                          }}
                                        >
                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              Start Date
                                            </label>
                                            <DatePickerField
                                              format='MMM/y'
                                              maxDetail='year'
                                              className={styles.dateInputField}
                                              name={`edu_records[${index}]start_date`}
                                              id={`edu_records[${index}]start_date`}
                                            />
                                          </div>

                                          <div
                                            className={styles.inputContainer}
                                            style={{ width: '49%' }}
                                          >
                                            <label
                                              className={styles.inputLabel}
                                            >
                                              End Date
                                            </label>
                                            <DatePickerField
                                              disabled={edu_record.is_current}
                                              format='MMM/y'
                                              maxDetail='year'
                                              className={styles.dateInputField}
                                              name={`edu_records[${index}]end_date`}
                                              id={`edu_records[${index}]end_date`}
                                            />
                                          </div>
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
                                              name={`edu_records[${index}]is_current`}
                                              id={`edu_records[${index}]is_current`}
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
                                                    &nbsp; Currently Studying?
                                                    <input
                                                      type='checkbox'
                                                      {...field}
                                                      style={{
                                                        display: 'none',
                                                      }}
                                                    />
                                                  </label>
                                                )
                                              }}
                                            </Field>
                                          </div>
                                        </div>
                                        <div
                                            className={styles.inputContainer}
                                        >
                                          <label
                                              className={styles.inputLabel}
                                          >
                                            Education description
                                          </label>
                                          <Field
                                              as='textarea'
                                              rows={5}
                                              className={styles.inputField}
                                              name={`edu_records[${index}]education_description`}
                                              id={`edu_records[${index}]education_description`}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td
                                    className={
                                      styles.visibilityCheckboxContainer
                                    }
                                  >
                                    <Field
                                      name={`edu_records[${index}]visibility`}
                                    >
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
                                {/* shows spaver only between records */}
                                {props.values.edu_records.length - 1 >
                                  index && (
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
                                onClick={() => arrayHelpers.push('')}
                              >
                                Add an Education Record
                              </button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  />
                </tbody>
              </table>
              <div>
                <button type='submit' className={styles.submitBtn}>
                  Submit
                </button>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default EducationInformationForm
