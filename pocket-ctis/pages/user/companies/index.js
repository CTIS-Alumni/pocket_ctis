import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { _getFetcher } from '../../../helpers/fetchHelper'
import { fetchAllCompanies, fetchCompany } from '../../../helpers/searchHelpers'

const CompaniesDashboard = ({ res }) => {
  const [companies, setCompanies] = useState([])
  const [total, setTotal] = useState(res.length)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setTotal(res.length)
    setCompanies(res.data)
  }, [])

  // const onSearch = ({ searchValue }) => {
  //   setIsLoading(true)
  //   fetchCompany(searchValue)
  //     .then((res) => setCompanies(res.data))
  //     .catch((err) => console.log(err))
  //     .finally((_) => setIsLoading(false))
  // }

  const onQuery = (queryParams) => {
    let queryString = 'http://localhost:3000/api/companies?'
    for (const [key, value] of Object.entries(queryParams)) {
      if (value == '' || value == null) continue
      queryString += key + '=' + value + '&'
    }
    // console.log(queryString.slice(0, -1))
    setIsLoading(true)
    _getFetcher(queryString.slice(0, -1))
      .then((res) => {
        console.log(res.length)
        setTotal(res.length)
        setCompanies(res.data)
      })
      .finally((_) => setIsLoading(false))
    // _getFetcher(
    //   `http://localhost:3000/api/companies?offset=0&limit=15&order=desc&column=company_category&search_column=company_name,company_sector&search=Amazon`
    // ).then((res) => console.log('here', res))
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
