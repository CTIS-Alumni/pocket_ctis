import { _getFetcher } from '../../../helpers/fetchHelpers';
import { craftUrl, buildCondition } from '../../../helpers/urlHelper';
import { useState, useEffect } from 'react';
import { Badge, Spinner } from 'react-bootstrap';
import styles from './PeopleWishingList.module.scss'
import {getProfilePicturePath} from "../../../helpers/formatHelpers";
import PaginationFooter from '../../PaginationFooter/PaginationFooter';

const PeopleWishingList = ({ peopleWishing, sector }) => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState()

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({ name: 'wantsector_id', value: sector.id })
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
      {users?.map((person) => {
        return (
          <div className={styles.people_wishing_item} key={person.id}>
            <a
              className={styles.people_wishing_link}
              href={'/user/' + person.id}
            >
              <div>
                <img src={getProfilePicturePath(person.profile_picture)} style={{width: 75, height: 75, borderRadius: '50%'}} className='me-2'/>
                <div className={styles.people_wishing_item_info}>
                  <span className={styles.people_wishing_item_name}>
                    {person.first_name}{person.nee ? ` ${person.nee} `: ' '}{person.last_name}
                  </span>
                </div>
              </div>
              <div className={styles.people_wishing_item_badge}>
                {person.user_types.split(',').map((type, index) => (
                  <Badge key={index} className='me-2' >{type.toLocaleUpperCase()}</Badge>
                ))}
              </div>
            </a>
          </div>
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
    </>
  )
}

export default PeopleWishingList
