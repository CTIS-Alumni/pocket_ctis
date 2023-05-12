import { useContext, useState, useEffect } from 'react'
import { Tables_Data } from '../../context/tablesContext'
import Select from 'react-select'

const transformData = (data) => {
  /*model: [
        {
            label: TABLE_NAME,
            options: [
                {
                    label: COLUMN_NAME,
                    value: TABLE_NAME.COLUMN_NAME
                }
            ]
        }
        ...
    ] */

  const optionsModel = []
  for (const [key, value] of Object.entries(data)) {
    const datum = { label: key, options: [] }
    datum.options = value.map((column) => {
      return {
        label: column.COLUMN_NAME,
        value: `${key}.${column.COLUMN_NAME}`,
      }
    })
    optionsModel.push(datum)
  }
  return optionsModel
}

const SelectClauseCreator = ({
  selectQuery,
  setSelectQuery,
  setFromTables,
}) => {
  const [options, setOptions] = useState([])
  //   const [selectQuery, setSelectQuery] = useState('')
  const { tablesData } = useContext(Tables_Data)

  useEffect(() => {
    setOptions(transformData(tablesData))
  }, [tablesData])

  const makeSelectStatement = (values) => {
    var select = 'SELECT '
    var from = 'FROM '
    const tables = []

    select += values
      .map((v) => {
        const tableName = v.value.split('.')[0]
        if (!tables.includes(tableName)) tables.push(tableName)
        return v.value
      })
      .join(', ')

    from += tables.join(', ')

    setFromTables(tables)
    setSelectQuery(select + '\n' + from)
  }

  return (
    <div>
      SelectClauseCreator
      <textarea
        style={{
          margin: '10px 0',
          width: '100%',
          padding: 10,
          resize: 'none',
        }}
        rows='3'
        name='selectQuery'
        value={selectQuery}
        disabled
      />
      <Select
        isMulti
        closeMenuOnSelect={false}
        isClearable={true}
        isSearchable={true}
        options={options}
        onChange={(values) => {
          makeSelectStatement(values)
        }}
      />
    </div>
  )
}

export default SelectClauseCreator
