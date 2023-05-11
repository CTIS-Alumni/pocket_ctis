import { useEffect, useState } from 'react'
import table_references from '../../config/table_references'
import Select from 'react-select'
import { Formik, Form, useFormikContext, useFormik } from 'formik'
import { XCircleFill, XLg } from 'react-bootstrap-icons'
import { clone } from 'lodash'

const relationTables = () => {
  const options = Object.keys(table_references).map((key) => {
    return { label: key, value: key }
  })

  //   console.log(options)
  return options
}

const JoinCreator = ({ fromTables, joinQueries, setJoinQueries }) => {
  const [isTable1Selected, setIsTable1Selected] = useState(false)
  const [isTable2Selected, setIsTable2Selected] = useState(false)
  const [compatibleTables, setCompatibleTables] = useState([])
  const [table1Options, setTable1Options] = useState([])
  const [table2Options, setTable2Options] = useState([])
  const [tables, setTables] = useState([])

  //   const { setFieldValue } = useFormikContext()

  useEffect(() => {
    // console.log(table_references)
    setTables(relationTables())
  }, [])

  useEffect(() => {
    const temp = fromTables.map((table) => {
      return {
        value: table,
        label: table,
      }
    })
    setTable1Options(temp)
  }, [fromTables])

  const onTable1Select = (val) => {
    const options = table_references[val.value].references.map((ref) => {
      return {
        value: `${ref.table}.${ref.column}`,
        label: ref.table,
      }
    })
    setTable2Options(options)
    formik.setFieldValue('table2', null)
    setIsTable2Selected(false)
    setIsTable1Selected(true)
  }

  const onTable2Select = (val) => {
    setIsTable2Selected(true)
  }

  const addJoin = (values) => {
    console.log(values)
    var tempJoinQuery = ''
    tempJoinQuery += values.joinType.value
    tempJoinQuery += `  ${values.table2.label} ON ${values.table2.label}.id = ${
      values.table1.label
    }.${values.table2.value.split('.')[1]}`

    formik.resetForm()
    setIsTable1Selected(false)
    setIsTable2Selected(false)

    setJoinQueries([...joinQueries, tempJoinQuery])
    console.log(tempJoinQuery)
  }

  const removeQuery = (idx) => {
    // console.log(joinQueries.splice(idx, 1))
    const newData = clone(joinQueries)
    newData.splice(idx, 1)
    setJoinQueries(newData)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      joinType: {
        label: 'Left Outer Join',
        value: 'LEFT OUTER JOIN',
      },
      table1: null,
      table2: null,
    },
    onSubmit: (values) => {
      addJoin(values)
    },
  })

  return (
    <div>
      JoinCreator
      <div style={{ position: 'relative' }}>
        {/* <label
          htmlFor='whereClause'
          style={{
            position: 'absolute',
            top: -10,
            left: 10,
            background: 'white',
          }}
        >
          Join Clause
        </label> */}
        <div
          style={{
            border: '1px solid rgba(118, 118, 118, 0.3)',
            height: '100px',
            background: 'rgba(239, 239, 239, 0.3)',
            margin: '10px 0',
            padding: '5',
          }}
        >
          {/* {joinQueries.join('  ')} */}
          {joinQueries.map((query, idx) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>{query}</div>
                <div style={{ width: 20 }} onClick={() => removeQuery(idx)}>
                  <XLg />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Select
          className='mb-2'
          value={formik.values.joinType}
          options={[
            { label: 'Left Outer Join', value: 'LEFT OUTER JOIN' },
            { label: 'Right Outer Join', value: 'RIGHT OUTER JOIN' },
          ]}
          onChange={(val) => formik.setFieldValue('joinType', val)}
        />
        <div className='d-flex justify-content-between'>
          <div style={{ width: '49%' }}>
            <Select
              className='mb-2'
              value={formik.values.table1}
              options={table1Options}
              onChange={(value) => {
                formik.setFieldValue('table1', value)
                onTable1Select(value)
              }}
            />
          </div>
          <div style={{ width: '49%' }}>
            <Select
              isDisabled={!isTable1Selected}
              className='mb-2'
              value={formik.values.table2}
              options={table2Options}
              onChange={(val) => {
                formik.setFieldValue('table2', val)
                onTable2Select(val)
              }}
            />
          </div>
        </div>
        <button type='submit' disabled={!isTable2Selected}>
          Add Join
        </button>
      </form>
    </div>
  )
}

export default JoinCreator
