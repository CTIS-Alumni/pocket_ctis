import { useState, useEffect } from 'react'
import CompaniesList from '../../../components/CompaniesList/CompaniesList'
import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const CompaniesDashboard = ( {res} ) => {
  const [companies, setCompanies] = useState([])
  const [total, setTotal] = useState(res.length)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setTotal(res.length)
    setCompanies(res.data)
  }, [])
  const onSearch = ({ searchValue }) => {
    setIsLoading(true)
      _getFetcher({companies: craftUrl("companies", [{name: "name", value: searchValue}])})
      .then(({companies}) => setCompanies(companies.data))
      .catch((err) => console.log(err))
      .finally((_) => setIsLoading(false))
  }

    const onQuery = (queryParams) => {
        let queryString = 'http://localhost:3000/api/companies?'
        for (const [key, value] of Object.entries(queryParams)) {
            if (value === '') {
                continue
            }
            queryString += key + '=' + value + '&'
        }
        queryString = queryString.slice(0, -1)

        setIsLoading(true)
        _getFetcher(queryString)
            .then((res) => {
                setTotal(res.length)
                setCompanies(res.data)
            })
            .finally((_) => setIsLoading(false))
    }

  return (
    <main>
      <NavigationBar />
      <UserInfoSidebar />
      <CompaniesList
        companies={companies}
        onQuery={onQuery}
        isLoading={isLoading}
        total={total}
      />
    </main>
  )
}

export async function getServerSideProps(context) {
    const {cookies} = context.req;
    const token = cookies.AccessJWT;
    const {companies} = await _getFetcher({companies: craftUrl("companies")}, token);
    return { props: { res: companies } }
}

export default CompaniesDashboard
