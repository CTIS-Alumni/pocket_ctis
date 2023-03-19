import Link from 'next/link'
import { MortarboardFill } from 'react-bootstrap-icons'
import styles from './ErasmusUnisList.module.scss'

const ErasmusUnisList = ({ universities }) => {
  return (
    <table className='custom_table'>
      <thead>
        <tr>
          <th>Name</th>
          <th>City</th>
          <th>Country</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
      {universities.map((university) => (
        <>
        <tr>
          <Link
            className={styles.university_link}
            href={'/user/universities/' + university.id}
          >
            <td>
            <span className={styles.erasmus_universities_item_name}>
                  {university.inst_name}
                </span>
            </td>
          </Link>
          <td>
          <span className={styles.erasmus_universities_item_location}>
                  {university.city_name}
                </span>
          </td>
          <td>
          <span className={styles.erasmus_universities_item_location}>
                  {university.country_name && `${university.country_name}`}
                </span>
          </td>
          <td>
          <div className={styles.erasmus_universities_item_badge}>
              <span>ERASMUS</span>
            </div>
          </td>
        </tr></>
        
      ))}
      </tbody>
    </table>
  )
}

export default ErasmusUnisList
