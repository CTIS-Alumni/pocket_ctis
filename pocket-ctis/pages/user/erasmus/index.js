import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'

const ErasmusList = ({ erasmus }) => {
  console.log('Erasmus:', erasmus)
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/erasmus')
  const erasmus = await res.json()
  return { props: { erasmus } }
}
export default ErasmusList
