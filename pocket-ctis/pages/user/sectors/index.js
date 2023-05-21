import SectorsList from '../../../components/SectorsList/SectorsList'
import { useEffect, useState } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'

const SectorsDashboard = ({ res }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    setSectors(res.data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    _getFetcher({
      sectors: craftUrl(['sectors'], [{ name: 'name', value: searchValue }]),
    })
      .then(({ sectors }) => setSectors(sectors.data))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <SectorsList
        sectors={sectors}
        onSearch={onSearch}
        isLoading={isLoading}
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
