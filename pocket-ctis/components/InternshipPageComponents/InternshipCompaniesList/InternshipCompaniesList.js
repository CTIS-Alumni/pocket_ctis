import Link from 'next/link'
import { BuildingFill } from 'react-bootstrap-icons'
import styles from './InternshipCompaniesList.module.scss'
import PaginationFooter from '../../PaginationFooter/PaginationFooter'
import { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'

const InternshipCompaniesList = ({ companies, onQuery, isLoading, total }) => {
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
    <>
    <div className={styles.internship_companies} style={{position: 'relative'}}>
      {isLoading && 
        <div 
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            zIndex: 9,
            height: '100%',
            width: '100%',
            position: 'absolute',
          }}
        >
          <Spinner />
        </div>
      } 
      {companies.map((company) => (
        <div className={styles.internship_companies_item} key={company.id}>
          <Link
            className={styles.company_link}
            href={`companies/${company.id}`}
          >
            <div className={styles.internship_companies_item_info}>
              <div>
                <BuildingFill />
              </div>
              <div>
                <span className={styles.internship_companies_item_name}>
                  {company.company_name}
                </span>
                <span className={styles.internship_companies_item_sector}>
                  {company.sector_name}
                </span>
              </div>
            </div>
            <div className={styles.internship_companies_item_badge}>
              <span>Accepts CTIS Interns</span>
            </div>
          </Link>
        </div>
      ))}
        </div>
      <PaginationFooter
        total={total}
        limit={limit}
        changeLimit={handleLimitChange}
        currentPage={currentPage}
        pageChange={handlePageChange}
      />
    </>
  )
}

export default InternshipCompaniesList
