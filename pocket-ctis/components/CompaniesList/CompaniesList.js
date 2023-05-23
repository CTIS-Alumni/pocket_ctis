import {
  Check,
  CaretDownFill,
  CaretUpFill,
} from 'react-bootstrap-icons'
import SearchBar from '../SearchBar/SearchBar'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import styles from './CompaniesList.module.scss'
import common from '../../styles/common.module.scss'
import { useEffect, useState } from 'react'
import PaginationFooter from '../PaginationFooter/PaginationFooter'

const CompaniesList = ({ companies, onQuery, isLoading, total }) => {
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
  const handleSearch = (search) => {
    search.searchValue = search.searchValue.trim()
    setSearchString(search.searchValue.trim())
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

  return (
    <section className={styles.companies}>
      <h2 className='custom_table_title'>Companies</h2>
      <div className={styles.companies_search_bar}>
        <SearchBar onSubmit={handleSearch} />
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <div className={common.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSorting('company_name')}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>Company Name</span>
                  <span style={{ width: 20 }}>
                    {sorting.name == 'company_name' ?
                      (sorting.direction == 'asc' ? (
                        <CaretDownFill />
                      ) : (
                        <CaretUpFill />
                      )): <div className='d-flex flex-column' ><CaretUpFill/><CaretDownFill/></div>}
                  </span>
                </div>
              </th>
              <th
                onClick={() => handleSorting('sector_name')}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}
                >
                  <span>Sector</span>
                  <span style={{ width: 20 }}>
                    {sorting.name == 'sector_name' ?
                      (sorting.direction == 'asc' ? (
                        <CaretDownFill />
                      ) : (
                        <CaretUpFill />
                      )):<div className='d-flex flex-column' ><CaretUpFill/><CaretDownFill/></div>}
                  </span>
                </div>
              </th>
              <th
                  onClick={() => handleSorting('is_internship')}
                  style={{ cursor: 'pointer' }}
              >
                <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>Accepts Internships</span>
                  <span style={{ width: 20 }}>
                    {sorting.name == 'is_internship' ?
                        (sorting.direction == 'asc' ? (
                            <CaretDownFill />
                        ) : (
                            <CaretUpFill />
                        )): <div className='d-flex flex-column' ><CaretUpFill/><CaretDownFill/></div>}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, i) => (
              <tr className={common.hoverable} key={i}>
                <td>
                  <a
                    // className={`${styles.company_link} link`}
                    href={`/user/companies/${company.id}`}
                  >
                    {company.company_name}
                  </a>
                </td>
                <td>
                  <a
                    // className={`${styles.company_link} link`}
                    href={`/user/sectors/${company.sector_id}`}
                  >
                    {company.sector_name}
                  </a>
                </td>
                <td>
                  <span>
                    {company.is_internship == 1 && (
                      <div className={styles.internship_badge}>
                        <Check size={25} fill='#f5a425' />
                      </div>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        total={total}
        limit={limit}
        changeLimit={handleLimitChange}
        currentPage={currentPage}
        pageChange={handlePageChange}
      />
    </section>
  )
}

export default CompaniesList
