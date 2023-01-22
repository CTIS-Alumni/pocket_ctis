import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import UniversitiesList from '../../../components/UniversitiesList/UniversitiesList'
import { useState, useEffect } from 'react'
import { fetchEduinst } from '../../../helpers/searchHelpers'

const UniversitiesDashboard = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    setUniversities(data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchEduinst(searchValue)
      .then((res) => setUniversities(res))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <UniversitiesList
        universities={universities}
        isLoading={isLoading}
        onSearch={onSearch}
      />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BACKEND_PATH + '/educationinstitutes', {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  })
  const { educationinstitutes } = await res.json()
  return { props: { data: educationinstitutes } }
}
export default UniversitiesDashboard
