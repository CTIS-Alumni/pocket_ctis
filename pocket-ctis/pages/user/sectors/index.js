import SectorsList from '../../../components/SectorsList/SectorsList'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

const SectorsDashboard = ({ res }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sectors, setSectors] = useState([])
  const [total, setTotal] = useState()

  useEffect(() => {
    setSectors(res.data)
    setTotal(res.length)
  }, [])

  const onQuery = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ sectors: craftUrl(['sectors'], conditions) })
      .then(({ sectors }) => {
        setTotal(sectors.length)
        setSectors(sectors.data)
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <SectorsList
        sectors={sectors}
        onQuery={onQuery}
        isLoading={isLoading}
        total={total}
      />
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { sectors } = await _getFetcher(
    { sectors: craftUrl(['sectors']) },
    cookie
  )
  return { props: { res: sectors } }
}

export default SectorsDashboard
