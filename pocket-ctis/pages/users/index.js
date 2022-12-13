import React from 'react'
import { Container } from 'react-bootstrap'
import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'
import UsersInfoPanel from '../../components/UsersInfoPanel/UsersInfoPanel'

const UsersRoute = () => {
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

export default UsersRoute
