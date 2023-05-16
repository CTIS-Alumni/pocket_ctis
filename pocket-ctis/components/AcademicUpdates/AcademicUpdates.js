import React from 'react'

import styles from './AcademicUpdates.module.scss'
import common from '../../styles/common.module.scss'

const AcademicUpdates = ({edu}) => {
  return (
    <div className={styles.academic_updates}>
      <h3 className='custom_table_title'>
        Academic Updates
      </h3>
      <div className={common.table_wrapper}>
      <table>
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
        {edu ? edu.map((record, i)=>(
            <tr key={i} className={record.is_current ? 'current' : ""}>
            <td className={styles.data_avatar}>
              <div
                  className={common.user_avatar_36}
                  style={{backgroundImage: "url(" + '/profilepictures/' + (record.pic_visibility ? record.profile_picture  : "defaultuser") + '.png' + ")"}}
                />
            </td>

              <td className={styles.data_name}>{record.first_name}</td>
              <td className={styles.data_surname}>{record.last_name}</td>
              <td className={styles.data_degree}>{record.degree_type_name}</td>
              <td className={styles.data_field}>{record.name_of_program}</td>
              <td className={styles.data_institute}>{record.edu_inst_name}</td>
              <td className={styles.data_date}>{record.record_date.slice(0, -14)}</td>
          </tr>
        )) : ""}
        </tbody>
      </table>
      </div>
    </div>
  )
}

export default AcademicUpdates
