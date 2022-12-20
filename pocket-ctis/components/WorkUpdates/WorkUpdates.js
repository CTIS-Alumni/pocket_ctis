import React from 'react'
import { Container } from 'react-bootstrap'
import styles from './WorkUpdates.module.scss'

const WorkUpdates = ({work}) => {
  return (
    <div className={styles.work_updates}>
      <h3 className={styles.work_updates_title}>
        Work Updates
      </h3>
      <table className={styles.work_updates_table}>
        <thead>
          <tr>
            <th className={styles.header_avatar}></th>
            <th className={styles.header_name}>Name</th>
            <th className={styles.header_surname}>Surname</th>
            <th className={styles.header_position}>Position</th>
            <th className={styles.header_department}>Department</th>
            <th className={styles.header_company}>Company</th>
            <th className={styles.header_date}>Record Date</th>
          </tr>
        </thead>
        <tbody>
          {work ? work.map((record)=>(
              <tr className={record.record_visibility ? (record.is_current ? styles.current : ""):styles.invisible}>
                <td className={styles.data_avatar}>
                  <div className={styles.user_avatar_48}>
                    <img alt={record.first_name} className={styles.user_avatar_48} src={'/profilepictures/'+(record.record_visibility ? (record.pic_visibility ? record.profile_picture : "defaultuser") : "defaultuser") +'.png'}/>
                  </div>
                </td>
                <td className={styles.data_name}>{record.record_visibility ? record.first_name : "Anonymous"}</td>
                <td className={styles.data_surname}>{record.record_visibility ? record.last_name : ""}</td>
                <td className={styles.data_position}>{record.record_visibility ? record.position : ""}</td>
                <td className={styles.data_department}>{record.record_visibility ? record.department: ""}</td>
                <td className={styles.data_company}>{record.record_visibility ? record.company_name : ""}</td>
                <td className={styles.data_date}>{record.record_date.slice(0, -14)}</td>
              </tr>
          )) : ""}
        </tbody>
      </table>
    </div>
  )
}

export default WorkUpdates
