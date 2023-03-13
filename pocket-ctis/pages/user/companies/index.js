import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { _getFetcher } from '../../../helpers/fetchHelper'
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

  const onQuery = (queryParams) => {
    let queryString = 'http://localhost:3000/api/companies?'
    for (const [key, value] of Object.entries(queryParams)) {
      queryString += key + '=' + value + '&'
    }
    console.log(queryString.slice(0, -1))
    _getFetcher(
      `http://localhost:3000/api/companies?offset=0&limit=15&order=&column=&search_column=company_name&search=Amazon`
    ).then((res) => console.log('here', res))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <CompaniesList
        companies={companies}
        onQuery={onQuery}
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
