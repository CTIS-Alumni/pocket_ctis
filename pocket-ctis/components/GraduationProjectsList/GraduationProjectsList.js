import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ListGroup,
  ListGroupItem,
  Badge,
  Spinner,
} from 'react-bootstrap'
import PaginationFooter from '../PaginationFooter/PaginationFooter'
import styles from './GraduationProjectsList.module.scss'
import {getGraduationProjectPicturePath} from "../../helpers/formatHelpers";
import { buildCondition, craftUrl } from '../../helpers/urlHelper'
import SearchBar from '../SearchBar/SearchBar'

const GraduationProjectsList = ({ graduationProjects, onQuery, isLoading, total }) => {
  const [limit, setLimit] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchString, setSearchString] = useState('')
  const [sorting, setSorting] = useState({ name: '', direction: '' })

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }
  const handlePageChange = (newPage) => setCurrentPage(newPage)

  const handleSearch = (search) => {
    search.searchValue = search.searchValue.trim()
    setSearchString(search.searchValue.trim())
    setCurrentPage(1)
  }
  useEffect(() => {
    let queryParams = {}

    queryParams.column = sorting.name
    queryParams.order = sorting.direction
    queryParams.offset = (currentPage - 1) * limit
    queryParams.limit = limit
    queryParams.searchcol = 'graduation_project_name,company_name,advisor,project_year,project_type,semester'
    queryParams.search = searchString

    onQuery(queryParams)
  }, [sorting, currentPage, limit, searchString])
  
  return (
    <section className={styles.graduation_projects}>
      <h2 className='custom-table-title'>Senior Projects</h2>
      
      <SearchBar onSubmit={handleSearch} />

      <div style={{position: 'relative', marginTop: 10}}>
        {isLoading && <div style={{
          position: 'absolute',
          zIndex: 2,
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.5)'
        }} ><Spinner /></div>}
        {
          graduationProjects?.length > 0 &&
          <>
            <ListGroup variant='flush' style={{width: '100%', rowGap: 20}}>
            {graduationProjects.map((graduationProject, i) => (
              <ListGroupItem key={i} style={{marginBottom: '20'}}>
              <Link className={styles.graduation_project_link} href={`/user/graduationProjects/${graduationProject.id}`}>
                <div style={{width:'30%'}} className={styles.graduation_projects_item}>
                    <img
                        src={getGraduationProjectPicturePath(graduationProject.team_pic, "team")}
                    />
                </div>
                <div style={{width:'70%'}} className='d-flex justify-content-between'>
                  <div>
                    <div style={{fontSize: 20, color: 'black'}} className={styles.graduation_projects_item_team}>{graduationProject.graduation_project_name}</div>
                    <div className={styles.graduation_projects_item_team}>{graduationProject.product_name}</div>
                    <div className={styles.graduation_projects_item_team}>Team {graduationProject.team_number}</div>
                    <div className={styles.graduation_projects_item_team}>Advisor: {graduationProject.advisor}</div>
                    {graduationProject.company_name && <div className={styles.graduation_projects_item_team}>Sponsor: {graduationProject.company_name}</div>}
                    <div style={{marginTop: 10}} className={styles.graduation_projects_item_team}>{graduationProject.project_description.slice(0, 150)} ...</div>
                    </div>
                  <div>
                    <Badge style={{color: 'white'}} className={styles.graduation_projects_item_team}>{graduationProject.semester} - {graduationProject.project_year}</Badge>
                  </div>
                </div>
              </Link>
          </ListGroupItem>
        ))}
            </ListGroup>
          </>
        }
      </div>
              <PaginationFooter
                total={total}
                limit={limit}
                changeLimit={handleLimitChange}
                currentPage={currentPage}
                pageChange={handlePageChange}
                />
    </section>
  )
}

export default GraduationProjectsList
