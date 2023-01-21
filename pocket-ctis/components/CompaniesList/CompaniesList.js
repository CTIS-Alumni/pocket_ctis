import { FilterSquareFill, Check } from 'react-bootstrap-icons'
import SearchBar from '../SearchBar/SearchBar'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import styles from './CompaniesList.module.scss'

const CompaniesList = ({ companies, onSearch, isLoading }) => {
  return (
    <div className={styles.companies}>
      <h2 className='custom_table_title'>Companies</h2>
      <div className={styles.companies_search_bar}>
        <FilterSquareFill />
        <SearchBar onSubmit={onSearch} />
      </div>
      <div className={styles.companies_filters}>
        <span className={styles.companies_filters_title}>Filters:</span>
        <form className={styles.companies_filters_form}>
          <input
            type='checkbox'
            className={styles.companies_filters_form_check}
            id='chk_accepts_internships'
          />
          <label
            className={styles.companies_filters_form_label}
            htmlFor='chk_accepts_internships'
          >
            Accepts Internships
          </label>
        </form>
      </div>
      <LoadingSpinner isLoading={isLoading} />
      <table className='custom_table'>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Sector</th>
            <th>Accepts Internships</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, i) => (
            <tr className='hoverable' key={i}>
              <td>
                <a
                  className={`${styles.company_link} link`}
                  href={`/user/companies/${company.id}`}
                >
                  {company.company_name}
                </a>
              </td>
              <td>
                <a
                  className={`${styles.company_link} link`}
                  href={`/user/sectors/${company.sector_id}`}
                >
                  {company.sector_name}
                </a>
              </td>
              <td>
                <span>
                  {company.is_internship == 1 && (
                    <div className={styles.internship_badge}>
                      <Check />
                    </div>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CompaniesList

{
  /* <Container>
        <h1>Companies</h1>
        <Row>
          <Col>
            <h5>Filters</h5>
            <Row>
              <Col>
                <Form.Check
                  type='checkbox'
                  id={`is_internship`}
                  label={`Accepts CTIS Interns?`}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <SearchBar />
            <Row>
              <Col>
                <ListGroup>
                  {companies.map((company) => (
                    <ListGroupItem className={styles.listItem}>
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
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>  */
}
