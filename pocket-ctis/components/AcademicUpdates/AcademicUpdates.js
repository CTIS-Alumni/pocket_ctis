import React from 'react'

import styles from './AcademicUpdates.module.scss'

const AcademicUpdates = ({edu}) => {
  return (
    <div className={styles.academic_updates}>
      <h3 className='custom_table_title'>
        Academic Updates
      </h3>
      <table className='custom_table'>
        <thead>
          <tr>
            <th className={styles.header_avatar}></th>
            <th className={styles.header_name}>Name</th>
            <th className={styles.header_surname}>Surname</th>
            <th className={styles.header_degree}>Degree</th>
            <th className={styles.header_field}>Program</th>
            <th className={styles.header_institute}>Institute</th>
            <th className={styles.header_date}>Record Date</th>
          </tr>
        </thead>
        <tbody>
        {edu ? edu.map((record)=>(
            <tr className={record.record_visibility ? (record.is_current ? 'current' : ""):'anonymous'}>
            <td className={styles.data_avatar}>
              <div
                  className='user_avatar_36'
                  style={{backgroundImage: "url(" + '/profilepictures/' + (record.record_visibility ? (record.pic_visibility ? record.profile_picture : "defaultuser") : "defaultuser") + '.png' + ")"}}
                />
            </td>

              <td className={styles.data_name}>{record.record_visibility ? record.first_name : "Anonymous"}</td>
              <td className={styles.data_surname}>{record.record_visibility ? record.last_name : ""}</td>
              <td className={styles.data_degree}>{record.record_visibility ? record.degree_name : ""}</td>
              <td className={styles.data_field}>{record.record_visibility ? record.name_of_program : ""}</td>
              <td className={styles.data_institute}>{record.record_visibility ? record.inst_name : ""}</td>
              <td className={styles.data_date}>{record.record_date.slice(0, -14)}</td>
          </tr>
        )) : ""}
        </tbody>
      </table>
    </div>
  )
}

export default AcademicUpdates
