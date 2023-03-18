import { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const CompaniesDashboard = ( {res} ) => {
  const [companies, setCompanies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setCompanies(res.data)
  }, [])
  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
      _getFetcher(craftUrl("companies", [{name: "name", value: searchValue}]))
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

export async function getServerSideProps(context) {
    const {cookies} = context.req;
    const token = cookies.AccessJWT;
    const res = await _getFetcher(craftUrl("companies"), token);
    return { props: { res: res } }
}

export default CompaniesDashboard
