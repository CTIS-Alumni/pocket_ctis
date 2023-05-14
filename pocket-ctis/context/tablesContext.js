import { createContext, useEffect, useState } from 'react'
import { _getFetcher } from '../helpers/fetchHelpers'
import {craftUrl} from "../helpers/urlHelper";

export const Tables_Data = createContext({
  tablesData: [],
})

function TablesContext({ children }) {
  const [tablesData, setTablesData] = useState([])

  useEffect(() => {
    _getFetcher({ data: craftUrl(['tablecolumns']) })
      .then(({ data }) => {
        const tableData = {}
        data.data.forEach((datum) => {
          const { TABLE_NAME, COLUMN_NAME, DATA_TYPE } = datum
          if (TABLE_NAME in tableData) {
            tableData[TABLE_NAME].push({ COLUMN_NAME, DATA_TYPE })
          } else {
            tableData[TABLE_NAME] = [{ COLUMN_NAME, DATA_TYPE }]
          }
        })
        setTablesData(tableData)
      })
      .catch((err) => console.log(err))
  }, [])

  const value = { tablesData: tablesData }

  return <Tables_Data.Provider value={value}>{children}</Tables_Data.Provider>
}

export default TablesContext
