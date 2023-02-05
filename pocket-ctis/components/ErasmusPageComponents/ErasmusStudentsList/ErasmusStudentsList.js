import Link from 'next/link'
import { getTimePeriod, getSemester } from '../../../helpers/formatHelpers'
import styles from './ErasmusStudentsList.module.scss'

const ErasmusStudentsList = ({ erasmus }) => {
  return (
    <div className={styles.erasmus_students}>
      {erasmus.map((record) => {
        const timePeriod = getTimePeriod(record.start_date, record.end_date)
        const semester = getSemester(record.semester, record.start_date)

        return (
          <div className={styles.erasmus_students_item} key={record.id}>
            <Link
              className={styles.student_link}
              href={'/erasmus/' + record.id}
            >
              <div className={styles.erasmus_students_item_info}>
                <div
                  className='user_avatar_48'
                  style={{
                    backgroundImage:
                      'url(' +
                      '/profilepictures/' +
                      (record.record_visibility
                        ? record.pic_visibility
                          ? record.profile_picture
                          : 'defaultuser'
                        : 'defaultuser') +
                      '.png' +
                      ')',
                  }}
                />
                <div>
                  <span className={styles.erasmus_students_item_name}>
                    {`${record.first_name} ${record.last_name}`}
                  </span>
                  <span className={styles.erasmus_students_item_university}>
                    {record.inst_name}
                  </span>
                  <span className={styles.erasmus_students_item_semester}>
                    Semester: {semester}
                  </span>
                  <span className={styles.erasmus_students_item_time_period}>
                    {timePeriod}
                  </span>
                </div>
              </div>
              <div className={styles.erasmus_students_item_badge}>
                {record.user_types.split(',').map((type, i) => (
                  <span key={i}>{type.toLocaleUpperCase()}</span>
                ))}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default ErasmusStudentsList
