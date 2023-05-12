import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { Container, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { getTimePeriod } from '../../../helpers/formatHelpers'
import React from 'react'
import { MortarboardFill } from 'react-bootstrap-icons'
import styles from '../../../styles/universities.module.scss'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const EducationInstitute = ({ edu_inst, users }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <div className={styles.university}>

        <div className={styles.university_info}>
          <div>
            <div className={styles.university_info_icon}>
              <MortarboardFill/>
            </div>

            <div>
              <h5 className={styles.university_info_title}>{edu_inst.data.edu_inst_name}</h5>
              <span className={styles.university_info_location}>
                {edu_inst.data.city_name}{' '}
                {edu_inst.data.city_name && edu_inst.data.country_name && `-`}{' '}
                {edu_inst.data.country_name}
              </span>
            </div>
          </div>
          
          <span className={styles.university_info_people}>
            {users.data.length > 0
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

{users.data.map((user) => {
        
        const studyPeriod = getTimePeriod(
          user.start_date,
          user.end_date,
          user.is_current
        )

        return (
          <div className={styles.university_people_item} key={user.id}>

            <div>
              <div
                className='user_avatar_48'
                style={{backgroundImage: "url(" + '/profilepictures/' + (user.pic_visibility ? user.profile_picture : "defaultuser") + '.png' + ")"}}
              />

              <div className={styles.university_people_item_info}>
                <span className={styles.university_people_item_name}>{user.first_name} {user.last_name}</span>
                <span className={styles.university_people_item_degree}>{user.degree_type_name}</span>
                <span className={styles.university_people_item_program}>{user.name_of_program && `${user.name_of_program}`}</span>
                <span className={styles.university_people_item_study_period}>{studyPeriod}</span>
                <div className={styles.university_people_item_location}>
                  <span className={styles.university_people_item_city}>{user.city_name && `${user.city_name}, `}</span>
                  <span className={styles.university_people_item_country}>{user.country_name}</span>
                </div>
              </div>
            </div>


            <div className={styles.university_people_item_badge}>
              {user.user_types.split(',').map((type, i) => (
                <span key={i}>
                  {type.toLocaleUpperCase()}
                </span>
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
  const {edu_inst, users} = await _getFetcher({
    edu_inst: craftUrl(["educationinstitutes", context.params.id]),
    users: craftUrl(["educationrecords"], [{name: "edu_inst_id", value: context.params.id}])
  }, cookie);

  return { props: { edu_inst, users } }
}

export default EducationInstitute
