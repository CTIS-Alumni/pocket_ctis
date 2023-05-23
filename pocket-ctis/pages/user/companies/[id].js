import { useState, useEffect } from 'react'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import {
  getProfilePicturePath,
  getTimePeriod,
} from '../../../helpers/formatHelpers'
import styles from '../../../styles/companies.module.scss'
import React from 'react'
import { BuildingFill } from 'react-bootstrap-icons'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import { Badge, Spinner } from 'react-bootstrap'
import PaginationFooter from '../../../components/PaginationFooter/PaginationFooter'
import Link from 'next/link'

const Company = ({ company }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({name: 'company_id', value: company.data.id})
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['workrecords'], conditions) })
      .then(({ users }) => {
        setTotal(users.length)
        setUsers(users.data)
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
    <UserPageContainer>
      <div className={styles.company}>
        <div className={styles.top_part}>
          <div className={styles.company_info}>
            <div>
              <div className={styles.company_info_icon}>
                <BuildingFill />
              </div>
              <div>
                <h5 className={styles.company_info_title}>
                  {company.data.company_name}
                </h5>
                <span className={styles.company_info_sector}>
                  {company.data.sector_name}
                </span>
              </div>
            </div>

            <span className={styles.company_info_people}>
              {users?.length > 0
                ? `People who have worked at ${company.data.company_name}:`
                : `No one from your department have worked at ${company.data.company_name}.`}
            </span>
          </div>

          {company.data.is_internship == 1 && (
            <div className={styles.company_internship_badge}>
              <span>Accepts CTIS Internships</span>
            </div>
          )}
        </div>

        <div style={{position: 'relative'}}>
        {isLoading && <div style={{display: 'flex',
            backgroundColor: 'rgba(255,255,255,0.5)',
            justifyContent: 'center',
            zIndex: 9,
            height: '100%',
            width: '100%',
            position: 'absolute',
            }}>
            <Spinner /></div>}
        {users?.map((user) => {
          const workPeriod = getTimePeriod(
            user.start_date,
            user.end_date,
            user.is_current
          )

          return (
            <Link href={`/user/${user.user_id}`} className={styles.company_people_item} key={user.id}>
              <div>
                <div className='d-flex align-items-center'>
                  <img src={getProfilePicturePath(user.profile_picture)} style={{width: 75, height: 75, borderRadius: '50%'}} className='me-2'/>
                </div>
                <div className={styles.company_people_item_info}>
                  <span className={styles.company_people_item_name}>
                    {user.first_name} {user.last_name}
                  </span>
                  <span className={styles.company_people_item_position}>
                    {user.position}
                  </span>
                  <span className={styles.company_people_item_department}>
                    {user.work_type_name}
                  </span>
                  {user.department && <span className={styles.company_people_item_department}>
                    {user.department}
                  </span>}
                  <span className={styles.company_people_item_work_period}>
                    {workPeriod}
                  </span>
                  <div className={styles.company_people_item_location}>
                    <span className={styles.company_people_item_city}>
                      {user.city_name && `${user.city_name}, `}
                    </span>
                    <span className={styles.company_people_item_country}>
                      {user.country_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.company_people_item_badge}>
                {user.user_types.split(',').map((type, i) => (
                  <Badge className='me-2' key={i}>{type.toLocaleUpperCase()}</Badge>
                ))}
              </div>
            </Link>
          )
        })}
        </div>
        {users?.length > 0 && <PaginationFooter
          total={total}
          limit={limit}
          changeLimit={handleLimitChange}
          currentPage={currentPage}
          pageChange={handlePageChange}
        />}   
      </div>
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { company, users } = await _getFetcher(
    {
      company: craftUrl(['companies', context.params.id])
    },
    cookie
  )

  return { props: { company } }
}

export default Company
