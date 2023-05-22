import { useState } from 'react'
import UserInfoSidebar from '../UserInfoSidebar/UserInfoSidebar'
import NavigationBar from '../Navbar/NavigationBar'

const UserPageContainer = ({ children }) => {
  const [toggleSidebar, setToggleSidebar] = useState(false)

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
      }}
    >
      <NavigationBar setToggleSidebar={setToggleSidebar} />
      <div
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <UserInfoSidebar
          toggleSidebar={toggleSidebar}
          setToggleSidebar={setToggleSidebar}
        />
        <div
          style={{
            background: '#f5f5f5',
            overflow: 'scroll',
            height: '100%',
            width: '100%',
            paddingTop: '60px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default UserPageContainer
