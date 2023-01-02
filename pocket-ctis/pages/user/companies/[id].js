import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { Container, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { getTimePeriod } from '../../../helpers/formatHelpers'
import styles from '../../../styles/companies.module.scss'
import React from 'react'
import { BuildingFill } from 'react-bootstrap-icons'

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
                  <h5 className={styles.company_info_title}>{company.company_name}</h5>
                  <span className={styles.company_info_sector}>{company.sector_name}</span>
                </div>
              </div>

              <span className={styles.company_info_people}>
                {users.length > 0
                  ? `People who have worked at ${company.company_name}:`
                  : `No one from your department have worked at ${company.company_name}.`}
              </span>
            </div>

            {company.is_internship == 1 && (
              <div className={styles.company_internship_badge}>
                <span>Accepts CTIS Internships</span>
              </div>
            )}
          </div>

          {users.map((user) => {
            console.log(user)

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
                    style={{backgroundImage: "url(" + '/profilepictures/' + (user.record_visibility ? (user.pic_visibility ? user.profile_picture : "defaultuser") : "defaultuser") + '.png' + ")"}}
                  />

                  <div className={styles.company_people_item_info}>
                    <span className={styles.company_people_item_name}>{user.first_name} {user.last_name}</span>
                    <span className={styles.company_people_item_position}>{user.position}</span>
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
                  {user.user_types.split(',').map((type) => (
                    <span>{type.toLocaleUpperCase()}</span>
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
  const res = await fetch(
    'http://localhost:3000/api/companies/' + context.params.id
  )
  const { data } = await res.json()

  const res2 = await fetch(
    'http://localhost:3000/api/workrecords?company_id=' + context.params.id
  )
  const users = await res2.json()
  return { props: { company: data[0], users: users.work } }
}

export default Company
