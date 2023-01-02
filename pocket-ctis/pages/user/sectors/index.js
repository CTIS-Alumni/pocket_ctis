import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import SectorsList from '../../../components/SectorsList/SectorsList'

const SectorsDashboard = ({ sectors }) => {
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <SectorsList sectors={sectors} />
    </main>
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
