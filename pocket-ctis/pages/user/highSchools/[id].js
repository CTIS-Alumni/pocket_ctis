import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { Container, Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import styles from "../../../components/WorkUpdates/WorkUpdates.module.scss";
import React from "react";

const HighSchool = ({ high_school, users }) => {
  console.log(users)
  return (
      <div style={{ height: '100vh' }}>
        <NavigationBar />
        <div className='d-flex' style={{ height: '100%' }}>
          <UserInfoSidebar />
          <Container className='py-3'>
            <div
                className='d-flex justify-content-between align-items-start'
                style={{ width: '100%' }}
            >
              <div>
                <h5>{high_school.high_school_name}</h5>
                <p>{high_school.city_name} - {high_school.country_name}</p>
              </div>
            </div>
            <hr className='mx-auto' style={{ width: '80%' }} />
            <div className='my-2'>{users.length>0 ? `People who have studied at ${high_school.high_school_name}:`:`No one from your department have studied at ${high_school.high_school_name}.`}</div>
            <ListGroup variant='flush'>
              {users.map((user) => {
                return (
                    <ListGroupItem key={user.id}>
                      <div>
                        <img alt={user.first_name} className={styles.user_avatar_48} src={'/profilepictures/'+(user.record_visibility ? (user.pic_visibility ? user.profile_picture : "defaultuser") : "defaultuser") +'.png'}/>
                      </div>
                      <div className='d-flex justify-content-between align-items'>
                        <h5>
                          {user.highschool_visibility ? (`${user.first_name} ${user.last_name}`) : "Anonymous"}
                        </h5>
                      </div>
                      <div>
                      {user.highschool_visibility == 1 && user.user_types.split(',').map((type) => (
                          <Badge className='mx-1' bg='info' pill>
                            {type.toLocaleUpperCase()}
                          </Badge>
                      ))}
                    </div>
                    </ListGroupItem>
                )
              })}
            </ListGroup>
          </Container>
        </div>
      </div>
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
