import { useState, useEffect } from 'react'
import PaginationFooter from '../../PaginationFooter/PaginationFooter'
import { Badge, Spinner } from 'react-bootstrap'
import styles from './PeopleList.module.scss'
import {
  getProfilePicturePath,
  getTimePeriod,
} from '../../../helpers/formatHelpers'
import Link from 'next/link'
import { buildCondition, craftUrl } from '../../../helpers/urlHelper'
import { _getFetcher } from '../../../helpers/fetchHelpers'

const PeopleList = ({ sector }) => {
  const [people, setPeople] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({ name: 'sector_id', value: sector.id })
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['workrecords'], conditions) })
      .then(({ users }) => {
        setTotal(users.length)
        setPeople(users.data)
      })
      .finally((_) => setIsLoading(false))
  }

  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)

  useEffect(() => {
    let queryParams = {}

    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit

    onQuery(queryParams)
  }, [currentPage, limit])

  return (
    <>
      <div style={{position: 'relative'}}>
        {isLoading && 
          <div style={{display: 'flex',
              backgroundColor: 'rgba(255,255,255,0.5)',
              justifyContent: 'center',
              zIndex: 9,
              height: '100%',
              width: '100%',
              position: 'absolute',
              }}>
            <Spinner />
          </div>
        }
        {people?.map((person) => {
          const workPeriod = getTimePeriod(
            person.start_date,
            person.end_date,
            person.is_current
          )

          return (
            <div className={styles.people_item} key={person.id}>
              <Link className={styles.people_link} href={'/user/' + person.id}>
                <div>
                  <div className='d-flex align-items-center'>
                    <img src={getProfilePicturePath(person.profile_picture)} style={{width: 75, height: 75, borderRadius: '50%'}} className='me-2'/>
                  </div>
                  <div className={styles.people_item_info}>
                    <span className={styles.people_item_name}>
                      {person.first_name}{person.nee ? ` ${person.nee} `: ' '}{person.last_name}
                    </span>
                    <span className={styles.people_item_position}>
                      {person.company_name}
                    </span>
                    <span className={styles.people_item_position}>
                      {person.position}
                    </span>
                    <span className={styles.people_item_work_period}>
                      {person.work_type_name}
                    </span>
                    <span className={styles.people_item_department}>
                      {person.department}
                    </span>
                    <span className={styles.people_item_work_period}>
                      {workPeriod}
                    </span>
                    <div className={styles.people_item_location}>
                      <span className={styles.people_item_city}>
                        {person.city_name && `${person.city_name}, `}
                      </span>
                      <span className={styles.people_item_country}>
                        {person.country_name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.people_item_badge}>
                  {person.user_types.split(',').map((type, i) => (
                    <Badge className='me-2' key={i}>{type.toLocaleUpperCase()}</Badge>
                  ))}
                </div>
              </Link>
            </div>
          )
        })}
      </div>
      {people?.length > 0 && <PaginationFooter
        total={total}
        limit={limit}
        changeLimit={handleLimitChange}
        currentPage={currentPage}
        pageChange={handlePageChange}
      />}   
    </>
  )
}

export default PeopleList
