import styles from './PeopleWishingList.module.scss'
import {getProfilePicturePath} from "../../../helpers/formatHelpers";

const PeopleWishingList = ({ peopleWishing }) => {
  return (
    <div>
      {peopleWishing.map((person) => {
        return (
          <div className={styles.people_wishing_item} key={person.id}>
            <a
              className={styles.people_wishing_link}
              href={'/user/' + person.id}
            >
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
                <div className={styles.people_wishing_item_info}>
                  <span className={styles.people_wishing_item_name}>
                    {person.first_name} {person.last_name}
                  </span>
                </div>
              </div>
              <div className={styles.people_wishing_item_badge}>
                {person.user_types.split(',').map((type, index) => (
                  <span key={index}>{type.toLocaleUpperCase()}</span>
                ))}
              </div>
            </a>
          </div>
        )
      })}
    </div>
  )
}

export default PeopleWishingList
