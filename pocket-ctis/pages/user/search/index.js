import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import { useState, useEffect } from 'react'
import SearchBar from '../../../components/SearchBar/SearchBar'
import { Container, ListGroup, ListGroupItem, Badge } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  fetchUsers,
  fetchHighSchools,
  fetchCompany,
  fetchEduinst,
  fetchGraduationproject,
} from '../../../helpers/searchHelpers'

const getData = async (search) => {
  const [companies, eduInsts, gradProjects, users, highSchools] =
    await Promise.all([
      fetchCompany(search),
      fetchEduinst(search),
      fetchGraduationproject(search),
      fetchUsers(search),
      fetchHighSchools(search),
    ])
  return { companies, eduInsts, gradProjects, users, highSchools }
}

const SearchDataList = ({ searchData }) => {
  const { users, companies, eduInsts, gradProjects, highSchools } = searchData
  return (
    <div className='mt-2'>
      {users.length > 0 && (
        <div>
          <h5>Users</h5>
          <ListGroup>
            {users.map((user) => (
              <ListGroupItem>
                <Link
                  href={`/user`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>
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
      {companies.length > 0 && (
        <div>
          <h5>Companies</h5>
          <ListGroup>
            {companies.map((company) => (
              <ListGroupItem>
                <Link
                  href={`/user/universities/${company.id}`}
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
      {highSchools.length > 0 && (
        <div>
          <h5>High Schools</h5>
          <ListGroup>
            {highSchools.map((highSchool) => (
              <ListGroupItem>
                <Link
                  href={`/user/universities/${highSchool.id}`}
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
      {eduInsts.length > 0 && (
        <div>
          <h5>Universities</h5>
          <ListGroup>
            {eduInsts.map((eduInst) => (
              <ListGroupItem>
                <Link
                  href={`/user/universities/${eduInst.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div>
                    <h5>{eduInst.inst_name}</h5>
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
      {gradProjects.length > 0 && (
        <div>
          <h5>Graduation Projects</h5>
          <ListGroup>
            {gradProjects.map((graduationProject) => (
              <ListGroupItem>
                <Link
                  href={`/user/graduationProjects/${graduationProject.id}`}
                  className='d-flex justify-content-between align-items-start'
                >
                  <div style={{ width: '100%' }}>
                    <div className='d-flex justify-content-between '>
                      <h5>{graduationProject.project_name}</h5>
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

const SearchPage = (props) => {
  const router = useRouter()
  const { query } = router

  const [searchData, setSearchData] = useState(null)

  useEffect(() => {
    if (query.searchValue.length > 0) {
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
          <SearchBar onSubmit={onSearch} />
          {searchData && <SearchDataList searchData={searchData} />}
        </Container>
      </div>
    </div>
  )
}

export default SearchPage
