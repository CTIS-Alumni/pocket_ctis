import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import InternshipsList from '../../../components/InternshipsList/InternshipsList'

const InternshipsDashboard = ({ internships }) => {
  console.log('Internships:', internships)
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <InternshipsList internships={internships} />
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/internships')
  const { data } = await res.json()
  return { props: { internships: data } }
}
export default InternshipsDashboard
