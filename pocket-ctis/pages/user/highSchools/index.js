import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import HighSchoolList from '../../../components/HighSchoolsList/HighSchoolsList'
import { useEffect, useState } from 'react'
import { fetchHighSchools } from '../../../helpers/searchHelpers'

const HighSchoolDashboard = ({ data }) => {
  const [highschools, setHighschools] = useState(data)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setHighschools(data)
    setIsLoading(false)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchHighSchools(searchValue)
      .then((res) => setHighschools(res))
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
  const res = await fetch(process.env.BACKEND_PATH + '/highschools', {
    headers: {
      'x-api-key': process.env.API_KEY,
    },
  })
  const { highschools } = await res.json()
  console.log(highschools)
  return { props: { data: highschools } }
}

export default HighSchoolDashboard
