import { useState, useEffect } from 'react'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { _getFetcher } from '../../../helpers/fetchHelper'
import { fetchAllCompanies } from '../../../helpers/searchHelpers'

const CompaniesDashboard = ({ res }) => {
  const [companies, setCompanies] = useState([])
  const [total, setTotal] = useState(res.length)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setTotal(res.length)
    setCompanies(res.data)
  }, [])

  const onQuery = (queryParams) => {
    let queryString = 'http://localhost:3000/api/companies?'
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === '') {
        continue
      }
      queryString += key + '=' + value + '&'
    }
    queryString = queryString.slice(0, -1)

    setIsLoading(true)
    _getFetcher(queryString)
      .then((res) => {
        setTotal(res.length)
        setCompanies(res.data)
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <CompaniesList
        companies={companies}
        onQuery={onQuery}
        isLoading={isLoading}
        total={total}
      />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetchAllCompanies()
  return { props: { res } }
}

export default CompaniesDashboard
