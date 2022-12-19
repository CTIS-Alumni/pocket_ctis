import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import ErasmusList from "../../../components/ErasmusList/ErasmusList";

const ErasmusDashboard = ({ erasmus }) => {
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
          <UserInfoSidebar />
          <ErasmusList erasmus={erasmus} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/erasmus')
  const erasmus = await res.json()
  return { props:  {erasmus: erasmus.data  }}
}
export default ErasmusDashboard
