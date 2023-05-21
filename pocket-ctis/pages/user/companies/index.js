import { useState, useEffect } from 'react'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

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
      <UserPageContainer>
        <CompaniesList
          companies={companies}
          onQuery={onQuery}
          isLoading={isLoading}
          total={total}
        />
      </UserPageContainer>
    </main>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { companies } = await _getFetcher(
    {
      companies: craftUrl(
        ['companies'],
        [
          { name: 'limit', value: 15 },
          { name: 'offset', value: 0 },
        ]
      ),
    },
    cookie
  )
  return { props: { res: companies } }
}

export default CompaniesDashboard
