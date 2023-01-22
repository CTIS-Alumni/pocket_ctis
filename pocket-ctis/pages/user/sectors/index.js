import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import SectorsList from '../../../components/SectorsList/SectorsList'
import { useEffect, useState } from 'react'
import { fetchSectors } from '../../../helpers/searchHelpers'

const SectorsDashboard = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    setSectors(data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchSectors(searchValue)
      .then((res) => setSectors(res))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <SectorsList
        sectors={sectors}
        onSearch={onSearch}
        isLoading={isLoading}
      />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH + '/sectors', {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  })
  const { sectors } = await res.json()
  return { props: { data: sectors } }
}

export default SectorsDashboard
