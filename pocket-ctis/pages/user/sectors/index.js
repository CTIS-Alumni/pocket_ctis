import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import SectorsList from '../../../components/SectorsList/SectorsList'

const SectorsDashboard = ({ sectors }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <SectorsList sectors={sectors} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH+"/sectors" ,{
          headers:{
              'x-api-key': process.env.API_KEY
          }
      });
  const { sectors } = await res.json()
  return { props: { sectors } }
}

export default SectorsDashboard
