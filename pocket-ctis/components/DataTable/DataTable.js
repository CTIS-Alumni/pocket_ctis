import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import PaginationFooter from '../PaginationFooter/PaginationFooter'
import {
  CaretDown,
  CaretDownFill,
  CaretUp,
  CaretUpFill,
  Search,
} from 'react-bootstrap-icons'
import { useFormik } from 'formik'
import styles from './DataTable.module.css'

const DataTable = ({ data, columns, total, onQuery, isLoading = false }) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState({ name: '', direction: '' })

  const handleSorting = (columnName) => {
    if (sorting.name == columnName) {
      if (sorting.direction == 'asc') {
        setSorting({ name: columnName, direction: 'desc' })
      } else {
        setSorting({ name: '', direction: '' })
      }
    } else {
      setSorting({ name: columnName, direction: 'asc' })
    }
    setCurrentPage(1)
  }

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)
  const handleSearch = ({ searchString }) => {
    setSearchString(searchString.trim())
    setCurrentPage(1)
  }

  useEffect(() => {
    let queryParams = {}

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.searchcol = 'sector_name,company_name'
    queryParams.search = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { searchString: '' },
    onSubmit: handleSearch,
  })

  return (
    <div className={styles.tableContainer}>
      {isLoading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.searchField}>
          <input
            onReset={() => console.log('reset')}
            type='search'
            name='searchString'
            id='searchString'
            value={formik.values.searchString}
            onChange={formik.handleChange}
          />
          <button type='submit'>
            <Search />
          </button>
        </div>
      </form>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th onClick={() => handleSorting(c)}>
                <div className={styles.tableHeader}>
                  {c}
                  <div className={styles.sortContainer}>
                    {sorting.name == c ? (
                      sorting.direction == 'asc' ? (
                        <CaretDownFill size={15} />
                      ) : (
                        <CaretUpFill size={15} />
                      )
                    ) : (
                      <>
                        <CaretUp size={15} /> <CaretDown size={15} />
                      </>
                    )}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr className={styles.tableRow}>
              {columns.map((c) => (
                <td className={styles.tableCell}>{d[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationFooter
        total={total}
        limit={limit}
        changeLimit={handleLimitChange}
        currentPage={currentPage}
        pageChange={handlePageChange}
      />
    </div>
  )
}

export default DataTable
