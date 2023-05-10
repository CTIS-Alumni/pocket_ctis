import { useState, useEffect } from 'react'
import Papa from "papaparse"
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { Card } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'
import {_submitFetcher} from "../../helpers/fetchHelpers";
import {craftUrl} from "../../helpers/urlHelper";
import styles from "../../components/AdminPanelComponents/AdminSidebar/AdminSidebar.module.scss";
import Link from "next/link";

const csvDataTypes = [
    {name: 'Users', api: "users"},
    {name: 'Sectors', api: "sectors"},
    {name: 'Companies', api: "companies"},
    {name: "Internships", api: "internships"},
    {name: "Erasmus", api: "erasmus"},
    {name: 'Educational Institutes', api: "educationinstitutes"},
    {name: 'Graduation Projects', api: "graduationprojects"},
    {name: 'High Schools', api: "highschools"},
    {name: 'Skills', api: "skills"}, //done
]

const sendMail = async (data, type) => {
   /* const completed_users = new Set();
    let results = [];
    await Promise.all(data.map(async (user) => {
        if(!completed_users.has(user.inserted.user_id)){
            const res = await _submitFetcher("POST",craftUrl(["mail"], [{name: "updateProfile", value: 1}]), {user_id: user.inserted.user_id, type: type})
            if(res.data){
                completed_users.add(user.inserted.user_id);
                results.push({id: user.inserted.id, index: user.index});
            }
        }else results.push({id: user.inserted.id, index: user.index});
        return {data: results}
    }));*/
}

const DataInsertion = () => {
  const [file, setFile] = useState(null)

    let mail_results = [];

  const onSubmitHandler = async (values) => {
    console.log('submission', values)
    console.log('file', file)

      if(file){
          console.log("values.dat", values.dataType);
          Papa.parse(file, {
              header: true,
              encoding: 'utf-8',
              skipEmptyLines: true,
              complete: async function(results){
                  mail_results = [];
                  const res = await _submitFetcher("POST", craftUrl([values.dataType]), {[values.dataType]: results.data})
                  console.log(res);

                  const completed_users = [];

                  if(res.data?.length && (values.dataType === "internships" || values.dataType === "erasmus")){
                      //mail_results = await sendMail(res.data);
                      for(const [i, user] of res.data.entries()) {
                          if(!completed_users.includes(user.inserted.user_id)){
                              const results = await _submitFetcher("POST",craftUrl(["mail"], [{name: "updateProfile", value: 1}]), {user_id: user.inserted.user_id, type: values.dataType})
                              mail_results.push({id: user.inserted.id, index: user.index, data: results.data, errors: results.errors});
                              completed_users.push(user.inserted.user_id);
                              console.log("heres completed users:", completed_users);
                          }
                      }

                      console.log(mail_results);
                  }
                  if(res.data?.length && (values.dataType === "users")){
                      for(const [i, user] of res.data.entries()) {
                          console.log("hers user", user);
                              const results = await _submitFetcher("POST",craftUrl(["mail"], [{name: "activateAccount", value: 1}]), {user_id: user.data.id})
                              mail_results.push({id: user.data.id, index: user.index, data: results.data, errors: results.errors});
                      }
                      console.log(mail_results);
                  }
              }
          })
      }

    //access selected file from 'file' variable, not from values.
  }

  return (
    <AdminPageContainer>
      <LoadingSpinner isLoading={false} />
      <Card border='light' style={{ padding: 20, marginBottom: 20 }}>
        <h5>Data Insertion via CSV</h5>
        <Formik
          enableReinitialize
          onSubmit={onSubmitHandler}
          initialValues={{ dataType: 'users', file: null}}
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
                  <div>Step 2: Please choose the file (Make sure your .csv file is encoded with utf-8 format)</div>

                  <Field name='file' id='file'>
                    {({ field, form: { touched, errors } }) => (
                      <div>
                        <input
                          {...field}
                          type='file'
                          placeholder='Select File'
                          onChange={(event) => {
                            setFile(event.currentTarget.files[0])
                          }}
                          accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
                        />
                      </div>
                    )}
                  </Field>
                </div>
                  <button type='submit'>Preview</button>
              </Form>
            )
          }}
        </Formik>
      </Card>
      <Card border='light' style={{ padding: 20 }}>
        Preview Data
      </Card>
    </AdminPageContainer>
  )
}

export default DataInsertion
