import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'

const CompaniesDashboard = ({ companies }) => {
  console.log(companies)
  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <CompaniesList companies={companies} />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH+"/companies",{
      headers:{
          'x-api-key':process.env.API_KEY
      }
  });
  const data = await res.json()
  return { props: { companies: data.companies } }
}

export default CompaniesDashboard
