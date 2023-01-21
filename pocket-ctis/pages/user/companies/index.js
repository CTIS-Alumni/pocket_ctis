import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { fetchCompany } from '../../../helpers/searchHelpers'

const CompaniesDashboard = ({ data }) => {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setCompanies(data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchCompany(searchValue)
      .then((res) => setCompanies(res))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <CompaniesList
        companies={companies}
        onSearch={onSearch}
        isLoading={isLoading}
      />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH + '/companies', {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  })
  const { companies } = await res.json()
  return { props: { data: companies } }
}

export default CompaniesDashboard
