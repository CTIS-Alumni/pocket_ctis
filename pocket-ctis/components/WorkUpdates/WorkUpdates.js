import React from 'react'
import { Container } from 'react-bootstrap'
import styles from './WorkUpdates.module.scss'

8
const WorkUpdates = ({work}) => {
  return (
    <div className={styles.work_updates}>
      <h3 className='custom_table_title'>
        Work Updates
      </h3>
      <table className='custom_table'>
        <thead>
          <tr>
            <th className={styles.header_avatar}></th>
            <th className={styles.header_name}>Name</th>
            <th className={styles.header_surname}>Surname</th>
            <th className={styles.header_surname}>Work Type</th>
            <th className={styles.header_position}>Position</th>
            <th className={styles.header_department}>Department</th>
            <th className={styles.header_company}>Company</th>
            <th className={styles.header_date}>Record Date</th>
          </tr>
        </thead>
        <tbody>
          {work ? work.map((record, i)=>(
              <tr key={i} className={record.is_current ? 'current' : ""}>
                <td className={styles.data_avatar}>
                  <div
                    className='user_avatar_36'
                    style={{backgroundImage: "url(" + '/profilepictures/' + (record.pic_visibility ? record.profile_picture :  "defaultuser") + '.png' + ")"}}
                  />
                </td>
                <td className={styles.data_name}>{ record.first_name }</td>
                <td className={styles.data_surname}>{record.last_name}</td>
                <td className={styles.data_work_type}>{record.work_type_name }</td>
                <td className={styles.data_position}>{ record.position }</td>
                <td className={styles.data_department}>{record.department }</td>
                <td className={styles.data_company}>{ record.company_name }</td>
                <td className={styles.data_date}>{record.record_date.slice(0, -14)}</td>
              </tr>
          )) : ""}
        </tbody>
      </table>
    </div>
  )
}

export default WorkUpdates
