import NavigationBar from '../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../components/UserInfoSidebar/UserInfoSidebar'

const Profile = ({ user }) => {
  console.log(user)
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_PATH + '/users/' + context.params.id
  )
  const { data } = await res.json()

  return { props: { user: data[0] } }
}

export default Profile
