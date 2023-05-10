import { useState, useEffect } from 'react'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'

const CompaniesDashboard = ({ res }) => {
  const [companies, setCompanies] = useState([])
  const [total, setTotal] = useState(res.length)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setTotal(res.length)
    setCompanies(res.data)
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ companies: craftUrl(['companies'], conditions) })
      .then(({ companies }) => {
        setTotal(companies.length)
        setCompanies(companies.data)
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

export async function getServerSideProps(context) {
  const { cookies } = context.req
  const token = cookies.AccessJWT
  const { companies } = await _getFetcher(
    {
      companies: craftUrl(['companies'], [
        { name: 'limit', value: 15 },
        { name: 'offset', value: 0 },
      ]),
    },
    token
  )
  return { props: { res: companies } }
}

export default CompaniesDashboard
