import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import React from 'react'
import styles from '../../../styles/highSchools.module.scss'
import { BuildingFill } from 'react-bootstrap-icons'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import { getProfilePicturePath } from '../../../helpers/formatHelpers'
import { Badge, Spinner } from 'react-bootstrap'
import PaginationFooter from '../../../components/PaginationFooter/PaginationFooter'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const HighSchool = ({ high_school }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({name: 'highschool_id', value: high_school.data.id})
    setIsLoading(true)
    _getFetcher({ users: craftUrl(['users'], conditions) })
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
      <div className={styles.highschool}>
        <div className={styles.highschool_info}>
          <div>
            <div className={styles.highschool_info_icon}>
              <BuildingFill />
            </div>
            <div>
              <h5 className={styles.highschool_info_title}>
                {high_school.data.high_school_name}
              </h5>
              <span className={styles.highschool_info_location}>
                {high_school.data.city_name} - {high_school.data.country_name}
              </span>
            </div>
          </div>

          <span className={styles.highschool_info_people}>
            {users?.length > 0
              ? `People who have studied at ${high_school.data.high_school_name}:`
              : `No one from your department have studied at ${high_school.data.high_school_name}.`}
          </span>
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
            return (
              <Link href={`/user/${user.id}`} className={styles.highschool_students_item} key={user.id}>
                <div>
                  <img src={getProfilePicturePath(user.profile_picture)} style={{width: 75, height: 75, borderRadius: '50%'}} className='me-2'/>
                  <div className={styles.highschool_students_item_info}>
                    <span className={styles.highschool_students_name}>
                      {user.first_name}{user.nee ? ` ${user.nee} `: ' '}{user.last_name}
                    </span>
                  </div>
                </div>

                <div className={styles.highschool_students_item_badge}>
                  {user.user_types.split(',').map((type, i) => (
                    <Badge key={i} className='me-2' >{type.toLocaleUpperCase()}</Badge>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
        {users.length > 0 && <PaginationFooter
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
  const { high_school, users } = await _getFetcher(
    {
      high_school: craftUrl(['highschools', context.params.id])
    },
    cookie
  )

  return { props: { high_school } }
}

export default HighSchool
