import { createContext, useEffect, useState } from 'react'
import { _getFetcher } from '../helpers/fetchHelpers'
import {craftUrl} from "../helpers/urlHelper";

export const Tables_Data = createContext({
  tablesColumnTypeData: [],
  tableColumns: [],
})

function TablesContext({ children }) {
  const [tablesColumnTypeData, setTablesColumnTypeData] = useState([])
  const [tableColumns, setTableColumns] = useState([])

  useEffect(() => {
    _getFetcher({ data: craftUrl(['tablecolumns']) })
      .then(({ data }) => {
        const tablesColumnTypeData = {}
        const tableColumns = {}
        data.data.forEach((datum) => {
          const { TABLE_NAME, COLUMN_NAME, DATA_TYPE } = datum
          if (TABLE_NAME in tablesColumnTypeData) {
            tablesColumnTypeData[TABLE_NAME].push({ COLUMN_NAME, DATA_TYPE })
            tableColumns[TABLE_NAME].push(COLUMN_NAME)
          } else {
            tablesColumnTypeData[TABLE_NAME] = [{ COLUMN_NAME, DATA_TYPE }]
            tableColumns[TABLE_NAME] = [COLUMN_NAME]
          }
        })
        setTablesColumnTypeData(tablesColumnTypeData)
        setTableColumns(tableColumns)
      })
      .catch((err) => console.log(err))
  }, [])

  const value = {
    tablesColumnTypeData: tablesColumnTypeData,
    tableColumns: tableColumns,
  }

  return <Tables_Data.Provider value={value}>{children}</Tables_Data.Provider>
}

export default TablesContext
