import PaginationFooter from '../../PaginationFooter/PaginationFooter'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MortarboardFill } from 'react-bootstrap-icons'
import styles from './ErasmusUnisList.module.scss'
import { Spinner } from 'react-bootstrap'

const ErasmusUnisList = ({ universities, total, onQuery, isLoading }) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
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

  useEffect(() => {
    let queryParams = {}

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit

    onQuery(queryParams)
  }, [sorting, currentPage, limit])

  return (
    <div
      className={styles.erasmus_universities}
      style={{ position: 'relative' }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            zIndex: 9,
            height: '100%',
            width: '100%',
          }}
        >
          <Spinner />
        </div>
      )}
      {universities?.map((university) => (
        <div className={styles.erasmus_universities_item} key={university.id}>
          <Link
            className={styles.university_link}
            href={'/user/universities/' + university.id}
          >
            <div className={styles.erasmus_universities_item_info}>
              <div>
                <MortarboardFill />
              </div>
              <div>
                <span className={styles.erasmus_universities_item_name}>
                  {university.edu_inst_name}
                </span>
                <span className={styles.erasmus_universities_item_location}>
                  {university.country_name && `${university.country_name} - `}
                  {university.city_name}
                </span>
              </div>
            </div>
            <div className={styles.erasmus_universities_item_badge}>
              <span>ERASMUS</span>
            </div>
          </Link>
        </div>
      ))}
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

export default ErasmusUnisList
