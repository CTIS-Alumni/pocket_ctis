import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { Container, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import {getProfilePicturePath, getTimePeriod} from '../../../helpers/formatHelpers'
import styles from '../../../styles/companies.module.scss'
import React from 'react'
import { BuildingFill } from 'react-bootstrap-icons'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const Company = ({ company, users }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
        <div className={styles.company}>

          <div className={styles.top_part}>
            <div className={styles.company_info}>
              <div>
                <div className={styles.company_info_icon}>
                  <BuildingFill/>
                </div>
                <div>
                  <h5 className={styles.company_info_title}>{company.data.company_name}</h5>
                  <span className={styles.company_info_sector}>{company.data.sector_name}</span>
                </div>
              </div>

              <span className={styles.company_info_people}>
                {users.data.length > 0
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

          {users.data.map((user) => {
            const workPeriod = getTimePeriod(
              user.start_date,
              user.end_date,
              user.is_current
            )

            return (
              <div className={styles.company_people_item} key={user.id}>
                <div>
                  <div
                    className='user_avatar_48'
                    style={{backgroundImage: "url(" + getProfilePicturePath(user.profile_pcture) + ")"}}
                  />

                  <div className={styles.company_people_item_info}>
                    <span className={styles.company_people_item_name}>{user.first_name} {user.last_name}</span>
                    <span className={styles.company_people_item_position}>{user.position}</span>
                      <span className={styles.company_people_item_department}>{user.work_type_name}</span>
                    <span className={styles.company_people_item_department}>{user.department && `${user.department}`}</span>
                    <span className={styles.company_people_item_type}>{user.type_name}</span>
                    <span className={styles.company_people_item_work_period}>{workPeriod}</span>
                    <div className={styles.company_people_item_location}>
                      <span className={styles.company_people_item_city}>{user.city_name && `${user.city_name}, `}</span>
                      <span className={styles.company_people_item_country}>{user.country_name}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.company_people_item_badge}>
                  {user.user_types.split(',').map((type, i) => (
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
    const {company, users} = await _getFetcher({
        company: craftUrl(["companies", context.params.id]),
        users: craftUrl(["workrecords"], [{name: "company_id", value: context.params.id}])
    }, cookie);

    return {props: {company, users}}
}

export default Company
