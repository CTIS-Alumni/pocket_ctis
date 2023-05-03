import { useState, useEffect } from 'react'

import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { Card } from 'react-bootstrap'
import { Formik, Field, Form } from 'formik'

const csvDataTypes = [
  'Users',
  'Users + Educational Records',
  'Sectors',
  'Companies',
  'Educational Institutes',
  'High Schools',
  'Skills',
]

const DataInsertion = () => {
  const [file, setFile] = useState(null)

  const onSubmitHandler = (values) => {
    console.log('submission', values)
    console.log('file', file)

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
          initialValues={{ dataType: 'Users', file: null }}
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
                    defaultValue='Users'
                  >
                    {csvDataTypes.map((dataType, index) => (
                      <option
                        value={dataType}
                        key={index}
                        selected={index == 0}
                      >
                        {dataType}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className='pb-2'>
                  <div>Step 2: Please choose the file</div>

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
                          // accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
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
