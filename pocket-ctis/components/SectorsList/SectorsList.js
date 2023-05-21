import { useState, useEffect } from 'react'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import SearchBar from '../SearchBar/SearchBar'
import styles from './SectorsList.module.scss'
import common from '../../styles/common.module.scss'
import PaginationFooter from '../PaginationFooter/PaginationFooter'

const SectorsList = ({ sectors, isLoading, onSearch, onQuery, total }) => {
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
    <section className={styles.sectors}>
      <h2 className='custom_table_title'>Sectors</h2>
      <div className={styles.sectors_search_bar}>
        <SearchBar onSubmit={handleSearch} />
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <div className={common.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector, i) => (
              <tr className={common.hoverable} key={i}>
                <td>
                  <a
                    //className={`${styles.sector_link} link`}
                    href={`/user/sectors/${sector.id}`}
                  >
                    {sector.sector_name}
                  </a>
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

export default SectorsList
