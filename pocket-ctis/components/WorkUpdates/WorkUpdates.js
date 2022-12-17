import React from 'react'
import { Container } from 'react-bootstrap'

import styles from './WorkUpdates.module.scss'

const WorkUpdates = () => {
  return (
    <div className={styles.work_updates}>
      <h3 className={styles.work_updates_title}>
        Work Updates
      </h3>
      <table className={styles.work_updates_table}>
        <thead>
          <tr>
            <th className={styles.header_number}></th>
            <th className={styles.header_avatar}></th>
            <th className={styles.header_name}>Name</th>
            <th className={styles.header_surname}>Surname</th>
            <th className={styles.header_position}>Position</th>
            <th className={styles.header_department}>Department</th>
            <th className={styles.header_company}>Company</th>
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
            <td className={styles.data_position}>Senior Developer</td>
            <td className={styles.data_department}>Human Resources</td>
            <td className={styles.data_company}>Amazon TR</td>
            <td className={styles.data_date}>12/12/2012</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default WorkUpdates
