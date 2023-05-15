import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { useState, useEffect } from 'react'
import SearchBar from '../../../components/SearchBar/SearchBar'
import { Container, ListGroup, ListGroupItem, Badge } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from "../../../components/UserInfoSidebar/UserInfoSidebar.module.scss";
import {_getFetcher} from "../../../helpers/fetchHelpers";
import {craftUrl} from "../../../helpers/urlHelper";

const getData = async (search) => {
  const {companies, eduInsts, gradProjects, users, highSchools} = await _getFetcher({
    companies: craftUrl(["companies"], [{name: "name", value: encodeURIComponent(search)}]),
    eduInsts: craftUrl(["educationinstitutes"], [{name: "name", value:  encodeURIComponent(search)}]),
    gradProjects: craftUrl(["graduationprojects"], [{name: "name", value:  encodeURIComponent(search)}]),
    users: craftUrl(["users"], [{name: "name", value:  encodeURIComponent(search)}]),
    highSchools: craftUrl(["highschools"], [{name: "name", value:  encodeURIComponent(search)}]),
  });

  return { companies, eduInsts, gradProjects, users, highSchools }
}


const SearchDataList = ({ searchData }) => {
  const { users, companies, eduInsts, gradProjects, highSchools } = searchData
  return (
    <div className='mt-2'>
      {users?.data?.length > 0 && (
        <div>
          <h5>Users</h5>
          <ListGroup>
            {users.data.map((user) => (
              <ListGroupItem key={user.id}>
                <Link
                  href={`/user`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>
                      <img alt={user.first_name} className={styles.user_avatar_48}
                           src={'/profilepictures/'+(user.pic_visibility ? user.profile_picture : "defaultuser") +'.png'}/>
                      {user.first_name} {user.last_name}
                    </h5>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {user.user_types}
                    </span>
                  </div>
                </Link>
              </ListGroupItem>
            ))}
          </ListGroup>
          <hr style={{ width: '80%' }} className='mx-auto' />
        </div>
      )}
      {companies?.data?.length > 0 && (
        <div>
          <h5>Companies</h5>
          <ListGroup>
            {companies.data.map((company) => (
              <ListGroupItem key={company.id}>
                <Link
                  href={`/user/companies/${company.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>{company.company_name}</h5>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {company.sector_name}
                    </span>
                  </div>
                  {company.is_internship == 1 && (
                    <Badge bg='primary' pill>
                      Accepts CTIS Interns
                    </Badge>
                  )}
                </Link>
              </ListGroupItem>
            ))}
          </ListGroup>
          <hr style={{ width: '80%' }} className='mx-auto' />
        </div>
      )}
      {highSchools?.data?.length > 0 && (
        <div>
          <h5>High Schools</h5>
          <ListGroup>
            {highSchools.data.map((highSchool) => (
              <ListGroupItem key={highSchool.id}>
                <Link
                  href={`/user/hishSchools/${highSchool.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>{highSchool.high_school_name}</h5>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {`${highSchool.country_name || ''} - ${
                        highSchool.city_name || ''
                      }`}
                    </span>
                  </div>
                </Link>
              </ListGroupItem>
            ))}
          </ListGroup>
          <hr style={{ width: '80%' }} className='mx-auto' />
        </div>
      )}
      {eduInsts?.data?.length > 0 && (
        <div>
          <h5>Universities</h5>
          <ListGroup>
            {eduInsts.data.map((eduInst) => (
              <ListGroupItem key={eduInst.id}>
                <Link
                  href={`/user/universities/${eduInst.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>{eduInst.edu_inst_name}</h5>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      {`${eduInst.country_name || ''} ${
                        eduInst.city_name || ''
                      }`}
                    </span>
                  </div>
                  {eduInst.is_erasmus == 1 && (
                    <Badge bg='primary' pill>
                      Erasmus
                    </Badge>
                  )}
                </Link>
              </ListGroupItem>
            ))}
          </ListGroup>
          <hr style={{ width: '80%' }} className='mx-auto' />
        </div>
      )}
      {gradProjects?.data?.length > 0 && (
        <div>
          <h5>Graduation Projects</h5>
          <ListGroup>
            {gradProjects.data.map((graduationProject) => (
              <ListGroupItem key={graduationProject.id}>
                <Link
                  href={`/user/graduationProjects/${graduationProject.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div style={{ width: '100%' }}>
                    <div className='d-flex justify-content-between '>
                      <h5>{graduationProject.graduation_project_name}</h5>
                      <p>{`${graduationProject.project_year} - ${graduationProject.semester}`}</p>
                    </div>
                    <span style={{ fontSize: 12, color: '#999' }}>
                      Team {graduationProject.team_number} -{' '}
                      {graduationProject.advisor} -{' '}
                      {graduationProject.project_type}
                    </span>
                  </div>
                </Link>
              </ListGroupItem>
            ))}
          </ListGroup>
          <hr style={{ width: '80%' }} className='mx-auto' />
        </div>
      )}
    </div>
  )
}

const SearchPage = () => {
  const router = useRouter()
  const { query } = router

  const [searchData, setSearchData] = useState(null)
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    if (query.searchValue?.length > 0) {
      setSearchString(query.searchValue.trim())
      getData(query.searchValue).then((res) => setSearchData(res))
    }
  }, [])

  const onSearch = ({ searchValue }) => {
    if (searchValue.length > 0) {
      getData(searchValue).then((res) => setSearchData(res))
    } else {
      setSearchData(null)
    }
  }
  return (
    <div style={{ height: '100vh' }}>
      <NavigationBar />
      <div className='d-flex' style={{ height: '100%' }}>
        <UserInfoSidebar />
        <Container>
          <SearchBar onSubmit={onSearch} searchValue={searchString} />
          {searchData && <SearchDataList searchData={searchData} />}
        </Container>
      </div>
    </div>
  )
}

export default SearchPage
