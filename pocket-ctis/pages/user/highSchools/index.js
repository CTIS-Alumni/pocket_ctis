import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import HighSchoolList from '../../../components/HighSchoolsList/HighSchoolsList'
import { useEffect, useState } from 'react'
import {
  fetchAllHighSchool,
  fetchHighSchools,
} from '../../../helpers/searchHelpers'

const HighSchoolDashboard = ({ data }) => {
  const [highschools, setHighschools] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setHighschools(data.data)
    setIsLoading(false)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchHighSchools(searchValue)
      .then((res) => setHighschools(res.data))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <HighSchoolList
        highSchools={highschools}
        onSearch={onSearch}
        isLoading={isLoading}
      />
    </main>
  )
}

export async function getServerSideProps() {
  const res = await fetchAllHighSchool()
  return { props: { data: res } }
}

export default HighSchoolDashboard
