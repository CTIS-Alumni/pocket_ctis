import Link from 'next/link'
import {
  getTimePeriod,
  getSemester,
  getProfilePicturePath,
} from '../../../helpers/formatHelpers'
import styles from './ErasmusStudentsList.module.scss'
import ReactStars from 'react-stars'
import { Spinner } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import PaginationFooter from '../../PaginationFooter/PaginationFooter'

const ErasmusStudentsList = ({ erasmus, onQuery, isLoading, total }) => {
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
    <div className={styles.erasmus_students} style={{ position: 'relative' }}>
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
      {erasmus?.map((record) => {
        const timePeriod = getTimePeriod(record.start_date, record.end_date)
        const semester = getSemester(record.semester, record.start_date)

        return (
          <div className={styles.erasmus_students_item} key={record.id}>
            <Link
              className={styles.student_link}
              href={'/erasmus/' + record.id}
            >
              <div className={styles.erasmus_students_item_info}>
                <div
                  className='user_avatar_48'
                  style={{
                    backgroundImage:
                      'url(' +
                      getProfilePicturePath(record.profile_picture) +
                      ')',
                  }}
                />
                <div>
                  <span className={styles.erasmus_students_item_name}>
                    {`${record.first_name} ${record.last_name}`}
                  </span>
                  <span className={styles.erasmus_students_item_university}>
                    {record.edu_inst_name}
                  </span>
                  <span className={styles.erasmus_students_item_semester}>
                    Semester: {semester}
                  </span>
                  <span className={styles.erasmus_students_item_time_period}>
                    {timePeriod}
                  </span>
                  {record.rating && (
                    <ReactStars
                      count={5}
                      value={record.rating}
                      size={20}
                      color2={'#c79d34'}
                      edit={false}
                    />
                  )}
                </div>
              </div>
              <div className={styles.erasmus_students_item_badge}>
                {record.user_types.split(',').map((type, i) => (
                  <span key={i}>{type.toLocaleUpperCase()}</span>
                ))}
              </div>
            </Link>
          </div>
        )
      })}
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

export default ErasmusStudentsList
