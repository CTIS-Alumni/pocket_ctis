import React from 'react'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'

const UsersRoute = ({ users }) => {
  console.log('users: ', users)
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <UsersInfoPanel />
      </div>
    </div>
  )
}

//call API, using getStaticProps. This will be called before the page is served to the frontend
//the result will be added to props object, which will be added to the corresponding component.
export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/users')
  const users = await res.json()
  return { props: { users } }
}

export default UsersRoute
