import { useState, useEffect, useContext } from 'react'
import { Tabs, Tab, Container, Spinner } from 'react-bootstrap'
import CompanyForm from '../EntityForms/CompanyForm'
import { _getFetcher } from '../../helpers/fetchHelpers'
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import { Tables_Data } from '../../context/tablesContext'
import styles from './CompanyDashboard.module.css'
import PaginationFooter from '../PaginationFooter/PaginationFooter'
import {
  CaretDown,
  CaretDownFill,
  CaretUp,
  CaretUpFill,
  Search,
} from 'react-bootstrap-icons'
import { useFormik } from 'formik'

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

const CompanyDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [columns, setColumns] = useState([])
  const { tableColumns } = useContext(Tables_Data)

  const getData = (
    conditions = [
      { name: 'limit', value: 15 },
      { name: 'offset', value: 0 },
    ]
  ) => {
    setIsLoading(true)
    _getFetcher({ companies: craftUrl(['companies'], conditions) })
      .then(({ companies }) => {
        setTotal(companies.length)
        setData(companies.data)
      })
      .finally((_) => setIsLoading(false))
  }

  useEffect(() => {
    getData()
    setColumns(tableColumns.company)
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    getData(conditions)
  }

  return (
    <div>
      <Tabs defaultActiveKey='browse'>
        <Tab title='Browse' eventKey='browse'>
          <Container>
            <div>
              {columns.length > 0 && (
                <DataTable
                  data={data}
                  columns={columns}
                  onQuery={onQuery}
                  total={total}
                  isLoading={isLoading}
                />
              )}
            </div>
          </Container>
        </Tab>
        <Tab title='Insert' eventKey='insert'>
          <Container style={{ marginTop: 10 }}>
            <CompanyForm />
          </Container>
        </Tab>
      </Tabs>
    </div>
  )
}

export default CompanyDashboard
