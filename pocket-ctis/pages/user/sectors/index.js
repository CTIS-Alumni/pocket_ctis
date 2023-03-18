import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import SectorsList from '../../../components/SectorsList/SectorsList'
import { useEffect, useState } from 'react'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const SectorsDashboard = ({ res }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [sectors, setSectors] = useState([])

  useEffect(() => {
    setSectors(res.data)
  }, [])

  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    _getFetcher(craftUrl("sectors", [{name: "name", value: searchValue}]))
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

export async function getServerSideProps(context) {
    const {cookies} = context.req;
    const token = cookies.AccessJWT;
  const res = await _getFetcher(craftUrl("sectors"), token);
  return { props: { res: res } }
}

export default SectorsDashboard
