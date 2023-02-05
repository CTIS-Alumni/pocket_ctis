import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { fetchAllCompanies, fetchCompany } from '../../../helpers/searchHelpers'

const CompaniesDashboard = ({ res }) => {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setCompanies(res.data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchCompany(searchValue)
      .then((res) => setCompanies(res.data))
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
  const res = await fetchAllCompanies()
  return { props: { res } }
}

export default CompaniesDashboard
