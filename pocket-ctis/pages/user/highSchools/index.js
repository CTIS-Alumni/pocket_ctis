import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import HighSchoolList from '../../../components/HighSchoolsList/HighSchoolsList'
import { useEffect, useState } from 'react'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const HighSchoolDashboard = ({ res }) => {
  const [highschools, setHighschools] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    setHighschools(res.data)
    setIsLoading(false)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    _getFetcher({highschools: craftUrl(["highschools"], [{name: "name", value: searchValue}])})
      .then(({highschools}) => setHighschools(highschools.data))
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

export async function getServerSideProps(context) {
  const {cookie} = context.req.headers
  const {highschools} = await _getFetcher({highschools: craftUrl(["highschools"])}, cookie);
  return { props: { res: highschools } }
}

export default HighSchoolDashboard
