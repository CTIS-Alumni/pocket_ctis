import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { Container, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import React from "react";
import styles from '../../../styles/highSchools.module.scss'
import { BuildingFill } from 'react-bootstrap-icons'

const HighSchool = ({ high_school, users }) => {
  console.log(users)
  
  return (
      <main>
        <NavigationBar />
        <UserInfoSidebar />
        <div className={styles.highschool}>
          <div className={styles.highschool_info}>
            <div>
              <div className={styles.highschool_info_icon}>
                <BuildingFill/>
              </div>
              <div>
                <h5 className={styles.highschool_info_title}>{high_school.high_school_name}</h5>
                <span className={styles.highschool_info_location}>{high_school.city_name} - {high_school.country_name}</span>
              </div>
            </div>

            <span className={styles.highschool_info_people}>
              {users.length > 0
                ? `People who have studied at ${high_school.high_school_name}:`
                : `No one from your department have studied at ${high_school.high_school_name}.`}
            </span>
          </div>

          {users.map((user) => {
            return (
                <div className={styles.highschool_students_item} key={user.id}>

                  <div>
                    <div
                      className='user_avatar_48'
                      style={{backgroundImage: "url(" + '/profilepictures/' + (user.highschool_visibility ? (user.pic_visibility ? user.profile_picture : "defaultuser") : "defaultuser") + '.png' + ")"}}
                    />
                    <div className={styles.highschool_students_item_info}>
                      <span className={styles.highschool_students_name}>{user.highschool_visibility ? (`${user.first_name} ${user.last_name}`) : "Anonymous"}</span>
                    </div>
                  </div>

                  <div className={styles.highschool_students_item_badge}>
                    {user.highschool_visibility == 1 && user.user_types.split(',').map((type, i) => (
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
  const res = await fetch(
      process.env.BACKEND_PATH+"/highschools/" + context.params.id, {
          headers:{
              'x-api-key': process.env.API_KEY
          }
      });
  const  {data}  = await res.json()

  const res2 = await fetch(
      process.env.BACKEND_PATH+"/users?highschool_id=" + context.params.id,{
            headers: {
              'x-api-key':process.env.API_KEY
            }
        });
  const { users } = await res2.json()
  return { props: { high_school: data[0], users: users } }
}

export default HighSchool
