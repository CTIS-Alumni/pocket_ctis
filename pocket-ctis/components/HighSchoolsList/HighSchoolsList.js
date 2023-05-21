import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchBar from '../SearchBar/SearchBar'
import styles from './HighSchoolsList.module.scss'
import common from '../../styles/common.module.scss'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import PaginationFooter from '../PaginationFooter/PaginationFooter'

const HighSchoolList = ({ highSchools, isLoading, onQuery, total }) => {
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
    queryParams.name = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])

  return (
    <section className={styles.highSchools}>
      <h2 className='custom_table_title'>High Schools</h2>
      <div className={styles.highSchools_search_bar}>
        <SearchBar onSubmit={handleSearch} />
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <div className={common.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th>High School Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {highSchools?.map((highSchool, i) => (
              <tr className={common.hoverable} key={i}>
                <td>
                  <Link
                    //className={`${styles.highSchool_link} link`}
                    href={`/user/highSchools/${highSchool.id}`}
                  >
                    {highSchool.high_school_name}
                  </Link>
                </td>
                <td>
                  {highSchool.city_name
                    ? `${highSchool.city_name} - ${highSchool.country_name}`
                    : ``}
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

export default HighSchoolList
