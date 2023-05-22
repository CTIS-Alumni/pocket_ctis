import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import { Badge, Spinner } from 'react-bootstrap'
import {
  getProfilePicturePath,
  getTimePeriod,
} from '../../../helpers/formatHelpers'
import React from 'react'
import { MortarboardFill } from 'react-bootstrap-icons'
import styles from '../../../styles/universities.module.scss'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import { useState, useEffect } from 'react'
import PaginationFooter from '../../../components/PaginationFooter/PaginationFooter'
import Link from 'next/link'

const EducationInstitute = ({ edu_inst }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({name: 'edu_inst_id', value: edu_inst.data.id})
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['educationrecords'], conditions) })
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
      <div className={styles.university}>
        <div className={styles.top_part}>
          <div className={styles.university_info}>
            <div>
              <div className={styles.university_info_icon}>
                <MortarboardFill />
              </div>

              <div>
                <h5 className={styles.university_info_title}>
                  {edu_inst.data.edu_inst_name}
                </h5>
                <span className={styles.university_info_location}>
                  {edu_inst.data.city_name}{' '}
                  {edu_inst.data.city_name && edu_inst.data.country_name && `-`}{' '}
                  {edu_inst.data.country_name}
                </span>
              </div>
            </div>

            <span className={styles.university_info_people}>
              {users?.length > 0
                ? `
              People who have studied at ${edu_inst.data.edu_inst_name}:`
                : `No one from your department have studied at ${edu_inst.data.edu_inst_name}.`}
            </span>
          </div>
          {edu_inst.data.is_erasmus == 1 && (
            <div className={styles.university_erasmus_badge}>
              <span>ERASMUS</span>
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
            const studyPeriod = getTimePeriod(
              user.start_date,
              user.end_date,
              user.is_current
            )
            console.log(user)
            return (
              <Link href={`/user/${user.user_id}`} className={styles.university_people_item} key={user.id}>
                <div>
                  <div className='d-flex align-items-center'>
                    <img src={getProfilePicturePath(user.profile_picture)} style={{width: 75, height: 75, borderRadius: '50%'}} className='me-2'/>
                  </div>
                  <div className={styles.university_people_item_info}>
                    <span className={styles.university_people_item_name}>
                      {user.first_name} {user.last_name}
                    </span>
                    <span className={styles.university_people_item_degree}>
                      {user.degree_type_name}
                    </span>
                    <span className={styles.university_people_item_program}>
                      {user.name_of_program && `${user.name_of_program}`}
                    </span>
                    <span className={styles.university_people_item_study_period}>
                      {studyPeriod}
                    </span>
                    <div className={styles.university_people_item_location}>
                      <span className={styles.university_people_item_city}>
                        {user.city_name && `${user.city_name}, `}
                      </span>
                      <span className={styles.university_people_item_country}>
                        {user.country_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.university_people_item_badge}>
                  {user.user_types.split(',').map((type, i) => (
                    <Badge key={i} className='me-2'>{type.toLocaleUpperCase()}</Badge>
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
  const { edu_inst } = await _getFetcher(
    {
      edu_inst: craftUrl(['educationinstitutes', context.params.id]),
      // users: craftUrl(
      //   ['educationrecords'],
      //   [{ name: 'edu_inst_id', value: context.params.id }]
      // ),
    },
    cookie
  )

  return { props: { edu_inst } }
}

export default EducationInstitute
