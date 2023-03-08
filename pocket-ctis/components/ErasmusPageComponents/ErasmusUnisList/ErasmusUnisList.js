import Link from 'next/link'
import { MortarboardFill } from 'react-bootstrap-icons'
import styles from './ErasmusUnisList.module.scss'

const ErasmusUnisList = ({ universities }) => {
  return (
    <div className={styles.erasmus_universities}>
      {universities.map((university) => (
        <div className={styles.erasmus_universities_item} key={university.id}>
          <Link
            className={styles.university_link}
            href={'/user/universities/' + university.id}
          >
            <div className={styles.erasmus_universities_item_info}>
              <div>
                <MortarboardFill />
              </div>
              <div>
                <span className={styles.erasmus_universities_item_name}>
                  {university.edu_inst_name}
                </span>
                <span className={styles.erasmus_universities_item_location}>
                  {university.country_name && `${university.country_name} - `}
                  {university.city_name}
                </span>
              </div>
            </div>
            <div className={styles.erasmus_universities_item_badge}>
              <span>ERASMUS</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default ErasmusUnisList
