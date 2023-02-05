import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import SectorsList from '../../../components/SectorsList/SectorsList'
import { useEffect, useState } from 'react'
import { fetchAllSectors, fetchSectors } from '../../../helpers/searchHelpers'

const SectorsDashboard = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    setSectors(data.data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchSectors(searchValue)
      .then((res) => setSectors(res.data))
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
  const res = await fetchAllSectors()
  return { props: { data: res } }
}

export default SectorsDashboard
