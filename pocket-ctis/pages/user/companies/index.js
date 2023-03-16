import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import {fetchCompany } from '../../../helpers/searchHelpers'
import {_getFetcherMulti} from "../../../helpers/fetchHelpers";

const CompaniesDashboard = ( res ) => {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setCompanies(res.data)
  }, [])
  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
    fetchCompany(searchValue)
      .then((res) => setCompanies(res.data))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <CompaniesList
        companies={companies}
        onSearch={onSearch}
        isLoading={isLoading}
      />
    </main>
  )
}

export async function getServerSideProps() {
  const results = await _getFetcherMulti(["companies"]);
  return { props:  results.companies  }
}

export default CompaniesDashboard
