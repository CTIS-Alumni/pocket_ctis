import styles from './PeopleList.module.scss'
import {
  getProfilePicturePath,
  getTimePeriod,
} from '../../../helpers/formatHelpers'
import Link from 'next/link'

const PeopleList = ({ people }) => {
  return (
    <div>
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
                <div
                  className='user_avatar_48'
                  style={{
                    backgroundImage:
                      'url(' +
                      getProfilePicturePath(person.profile_pcture) +
                      ')',
                  }}
                />
                <div className={styles.people_item_info}>
                  <span className={styles.people_item_name}>
                    {person.first_name} {person.last_name}
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
                  <span key={i}>{type.toLocaleUpperCase()}</span>
                ))}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default PeopleList
