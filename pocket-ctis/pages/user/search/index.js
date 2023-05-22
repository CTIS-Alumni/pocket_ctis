import { useState, useEffect } from 'react'
import SearchBar from '../../../components/SearchBar/SearchBar'
import { Container } from 'react-bootstrap'
import { useRouter } from 'next/router'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import SearchPageUsersList from '../../../components/GeneralSearchLists/UsersList'
import { ToastContainer } from 'react-toastify'
import SearchPageCompaniesList from '../../../components/GeneralSearchLists/CompaniesList'
import SearchPageEduInstsList from '../../../components/GeneralSearchLists/EduInsts'
import SearchPageHighSchools from '../../../components/GeneralSearchLists/HighSchools'
import SearchPageGradProjList from '../../../components/GeneralSearchLists/GradProjList'

const SearchPage = () => {
  const router = useRouter()
  const { query } = router

  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    if (query.searchValue?.length > 0) {
      setSearchString(query.searchValue.trim())
    }
  }, [])

  const onSearch = ({ searchValue }) => {
    if (searchValue.length > 0) {
      setSearchString(searchValue)
    } else {
      setSearchString(null)
    }
  }
  return (
    <UserPageContainer>
      <Container style={{ paddingTop: 30 }}>
        <SearchBar onSubmit={onSearch} searchValue={searchString} />
        {searchString == null && <div className='mt-2'>No results</div>}

        {searchString && (
          <div className='mt-2'>
            <SearchPageUsersList search={searchString} />
            <SearchPageCompaniesList search={searchString} />
            <SearchPageHighSchools search={searchString} />
            <SearchPageEduInstsList search={searchString} />
            <SearchPageGradProjList search={searchString} />
          </div>
        )}
      </Container>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
        theme='light'
      />
    </UserPageContainer>
  )
}

export default SearchPage
