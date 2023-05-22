import Link from 'next/link'
import {
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
} from 'react-bootstrap'
import SearchBar from '../SearchBar/SearchBar'
import styles from './GraduationProjectsList.module.scss'
import {getGraduationProjectPicturePath} from "../../helpers/formatHelpers";

const GraduationProjectsList = ({ graduationProjects }) => {
  console.log(getGraduationProjectPicturePath(graduationProjects[0].team_pic, "team"))
  return (
    <section className={styles.graduation_projects}>
      <h2 className='custom-table-title'>Senior Projects</h2>
      <div>
        {graduationProjects.map((graduationProject, i) => (
          <a key={i} className={styles.graduation_project_link} href={`/user/graduationProjects/${graduationProject.id}`}>
            <div className={styles.graduation_projects_item}>
              <span className={styles.graduation_projects_item_team}>Team {graduationProject.team_number}</span>
                <img
                     src={getGraduationProjectPicturePath(graduationProject.team_pic, "team")}
                />
              <span className={styles.graduation_projects_item_name}>{graduationProject.project_name}</span>
              <span className={styles.graduation_projects_item_advisor}>Advisor: {graduationProject.advisor}</span>
              <span className={styles.graduation_projects_item_type}>{graduationProject.project_type} project</span>
              <span className={styles.graduation_projects_item_semester}>{`${graduationProject.semester} ${graduationProject.project_year}`}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default GraduationProjectsList
