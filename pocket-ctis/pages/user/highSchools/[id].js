import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import React from 'react'
import styles from '../../../styles/highSchools.module.scss'
import { BuildingFill } from 'react-bootstrap-icons'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";
import {getProfilePicturePath} from "../../../helpers/formatHelpers";

const HighSchool = ({ high_school, users }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
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
            {users.data.length > 0
              ? `People who have studied at ${high_school.data.high_school_name}:`
              : `No one from your department have studied at ${high_school.data.high_school_name}.`}
          </span>
        </div>

        {users.data.map((user) => {
          return (
            <div className={styles.highschool_students_item} key={user.id}>
              <div>
                <div
                  className='user_avatar_48'
                  style={{
                    backgroundImage:
                      'url(' +
                        getProfilePicturePath(user.profile_pcture) +
                      ')',
                  }}
                />
                <div className={styles.highschool_students_item_info}>
                  <span className={styles.highschool_students_name}>
                      {user.first_name} {user.last_name}

                  </span>
                </div>
              </div>

              <div className={styles.highschool_students_item_badge}>
                {user.user_types
                    .split(',')
                    .map((type, i) => (
                      <span key={i}>{type.toLocaleUpperCase()}</span>
                    ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const {cookie} = context.req.headers
  const {high_school, users} = await _getFetcher({
    high_school: craftUrl(["highschools", context.params.id]),
    users: craftUrl(["users"], [{name: "highschool_id", value: context.params.id}])
  }, cookie);

  return { props: { high_school, users } }
}

export default HighSchool
