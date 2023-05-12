import { useContext, useState, useEffect } from 'react'
import { QueryBuilder, formatQuery } from 'react-querybuilder'
import { QueryBuilderBootstrap } from '@react-querybuilder/bootstrap'
import 'react-querybuilder/dist/query-builder.css'
import Select from 'react-select'
import { Tables_Data } from '../../context/tablesContext'
import { useFormik } from 'formik'

const createTableOptions = (tables) => {
  return Object.keys(tables).map((table) => {
    return {
      label: table,
      value: table,
    }
  })
}

const getTableFields = (selectedTable, tables) => {
  console.log(tables[selectedTable.value])
  const columns = tables[selectedTable.value]
  /*model: {
    name: field,
    label: field,
    inputType: fieldType
  }
  */

  const getColumnType = (dataType) => {
    switch (dataType) {
      case 'varchar':
        return { inputType: 'text' }
        break
      case 'int':
        return { inputType: 'number' }
        break
      case 'float':
        return { inputType: 'number' }
        break
      case 'tinyint':
        return { inputType: 'number' }
        break
      case 'date':
        return { inputType: 'date' }
        break
      case 'datetime':
        return { inputType: 'datetime-local' }
        break
      case 'mediumtext':
        return { valueEditorType: 'textarea' }
        break
      default:
        return 'text'
        break
    }
  }

  return columns.map((column) => {
    const inputType = getColumnType(column.DATA_TYPE)
    return {
      name: `${selectedTable.label}.${column.COLUMN_NAME}`,
      label: column.COLUMN_NAME,
      ...inputType,
    }
  })
}

const initialQuery = {
  combinator: 'and',
  rules: [],
}

const WhereClauseCreator = ({ addWhereClauses }) => {
  const [whereClause, setWhereClause] = useState(initialQuery)
  const [displayClause, setDisplayClause] = useState('')
  const [isTableSelected, setIsTableSelected] = useState(false)
  const [tableOptions, setTableOptions] = useState([])
  const [fields, setFields] = useState([])

  const { tablesData } = useContext(Tables_Data)

  useEffect(() => {
    setTableOptions(createTableOptions(tablesData))
  }, [tablesData])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      table: null,
    },
    onSubmit: (values) => {
      formik.setFieldValue('table', null)
      addWhereClauses(displayClause)
      setWhereClause(initialQuery)
      setDisplayClause('')
      setIsTableSelected(false)
    },
  })

  return (
    <>
      <div
        className='mb-2'
        style={{
          position: 'relative',
        }}
      >
        <label
          htmlFor='whereClause'
          style={{
            position: 'absolute',
            top: -10,
            left: 10,
            background: 'white',
          }}
        >
          Where Clause
        </label>
        <textarea
          style={{
            width: '100%',
            padding: 10,
            resize: 'none',
          }}
          rows='3'
          name='whereClause'
          value={displayClause}
          disabled
        />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Select
          options={tableOptions}
          className='mb-2'
          isClearable
          value={formik.values.table}
          onChange={(value) => {
            if (value) {
              formik.setFieldValue('table', value)
              setFields(getTableFields(value, tablesData))
              setIsTableSelected(true)
            } else {
              setIsTableSelected(false)
              formik.setFieldValue('table', null)
            }
          }}
        />
        <QueryBuilderBootstrap>
          <QueryBuilder
            disabled={!!!formik.values.table}
            query={whereClause}
            fields={fields}
            onQueryChange={(q) => {
              setWhereClause(q)
              setDisplayClause(formatQuery(q, 'sql'))
            }}
            controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
          />
        </QueryBuilderBootstrap>
        <button type='submit' className='mt-2' disabled={!isTableSelected}>
          Add Where Clause
        </button>
      </form>
    </>
  )
}

export default WhereClauseCreator
