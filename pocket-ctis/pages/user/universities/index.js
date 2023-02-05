import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import UniversitiesList from '../../../components/UniversitiesList/UniversitiesList'
import { useState, useEffect } from 'react'
import { fetchAllEducationInstitutes, fetchEducationInstitutes } from '../../../helpers/searchHelpers'

const UniversitiesDashboard = ({ educationinstitutes }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [universities, setUniversities] = useState([])

  useEffect(() => {
    setUniversities(educationinstitutes.data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchEducationInstitutes(searchValue)
      .then((res) => setUniversities(res.data))
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
  const educationinstitutes = await fetchAllEducationInstitutes()
  return { props: { educationinstitutes } }
}
export default UniversitiesDashboard
