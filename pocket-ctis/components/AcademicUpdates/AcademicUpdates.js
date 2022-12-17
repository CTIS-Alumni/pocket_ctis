import React from 'react'
import { Container } from 'react-bootstrap'

import styles from './AcademicUpdates.module.scss'

const AcademicUpdates = () => {
  return (
    <div className={styles.academic_updates}>
      <h3 className={styles.academic_updates_title}>
        Academic Updates
      </h3>
      <table className={styles.academic_updates_table}>
        <thead>
          <tr>
            <th className={styles.header_number}></th>
            <th className={styles.header_avatar}></th>
            <th className={styles.header_name}>Name</th>
            <th className={styles.header_surname}>Surname</th>
            <th className={styles.header_degree}>Degree</th>
            <th className={styles.header_field}>Field</th>
            <th className={styles.header_institute}>Institute</th>
            <th className={styles.header_date}>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.data_number}>1</td>
            <td className={styles.data_avatar}>
              <div className={styles.user_avatar_48} />
            </td>
            <td className={styles.data_name}>Name</td>
            <td className={styles.data_surname}>Surname</td>
            <td className={styles.data_degree}>MSc.</td>
            <td className={styles.data_field}>Computer Science</td>
            <td className={styles.data_institute}>Random University</td>
            <td className={styles.data_date}>12/12/2012</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default AcademicUpdates
