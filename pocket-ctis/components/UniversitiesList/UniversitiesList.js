import Link from 'next/link'
import SearchBar from '../SearchBar/SearchBar'
import { CaretDownFill, CaretUpFill, Check, Check2, Check2All, CheckLg, Facebook } from 'react-bootstrap-icons'
import styles from './UniversitiesList.module.scss'
import common from '../../styles/common.module.scss'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import PaginationFooter from '../PaginationFooter/PaginationFooter'
import { useState, useEffect } from 'react'

const UniversitiesList = ({ universities, isLoading, total, onQuery }) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState({ name: '', direction: '' })

  const handleSorting = (columnName) => {
    console.log(columnName)
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
    console.log('idahr', sorting)

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.name = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])
  return (
    <section className={styles.universities}>
      <h2 className='custom_table_title'>Universities</h2>
      <div className={styles.universities_search_bar}>
        <SearchBar onSubmit={handleSearch} />
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <div className={common.table_wrapper}>
        <table>
          <thead>
            <tr>
              <th  
                onClick={() => handleSorting('edu_inst_name')}
                style={{ cursor: 'pointer' }}
              >
                <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span>University Name</span>
                  <span style={{ width: 20 }}>
                  {sorting.name == 'edu_inst_name' ?
                      (sorting.direction == 'asc' ? (
                        <CaretDownFill />
                      ) : (
                        <CaretUpFill />
                      )): <div className='d-flex flex-column' ><CaretUpFill/><CaretDownFill/></div>}
                  </span>
                </div>
              </th>
              <th>Offers Erasmus</th>
            </tr>
          </thead>
          <tbody>
            {universities?.map((university, i) => (
              <tr className={common.hoverable} key={i}>
                <td>
                  <Link
                    href={`/user/universities/${university.id}`}
                    // className={`${styles.university_link} link`}
                  >
                    {university.edu_inst_name}
                  </Link>
                </td>
                <td>
                  <span>
                    {university.is_erasmus == 1 && (
                      <div className={styles.internship_badge}>
                        <Check size={25} fill='#f5a425'/>
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

export default UniversitiesList
