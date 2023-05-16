import { Container } from 'react-bootstrap'
import {
  PersonFill,
  PeopleFill,
  BuildingFill,
  MortarboardFill,
  Easel2Fill,
  ClipboardFill,
  StarFill,
  PersonWorkspace,
} from 'react-bootstrap-icons'
import Link from 'next/link'
import Image from 'next/image'

import styles from './UserInfoSidebar.module.scss'
import common from '../../styles/common.module.scss'

const Button = ({ text, icon, href }) => {
  return (
    <Link href={`${href ? href : ''}`} className={styles.sidebar_button}>
      {icon}
      <span className='button-text'>{text}</span>
    </Link>
  )
}

const UserImage = () => {
  return (
    <div 
      className={`${styles.sidebar_user_avatar} ${common.user_avatar_128}`}
      style={{backgroundImage : `URL('https://i.pinimg.com/564x/86/6c/1e/866c1e4c27cc640e24838b0a0769dfa2.jpg')`}}
    />
  )
}

const UserInfo = () => {
  return (
    <div className={styles.sidebar_user_info}>
      <span className={styles.user_name_surname}>Name Surname</span>
      <span className={styles.user_role}>Undergraduate</span>
    </div>
  )
}

const UserInfoSidebar = () => {
  return (
    <div className={`${styles.sidebar_wrapper}`}>
      <div className={`${styles.modal_bg} ${styles.visible2}`} />
      <aside className={`${styles.sidebar} ${styles.visible2}`}>
        <div className={styles.sidebar_user_wrapper}>
          <UserImage />
          <UserInfo />
        </div>
        <div className={styles.sidebar_buttons}>
          <div className={styles.sidebar_button_group_personal}>
            <Button text='Profile' href='/user/1' icon={<PersonFill />} />
            {/* <hr className={styles.sidebar_divider} /> */}
            <Button text='Users' icon={<PeopleFill />} />
          </div>
          {/* <hr className={styles.sidebar_divider} /> */}
          <div className={styles.sidebar_button_group_career}>
          <span className={styles.sidebar_button_group_title}>Career</span>
            <Button
              text='Companies'
              icon={<BuildingFill />}
              href='/user/companies'
            />
            <Button text='Sectors' icon={<Easel2Fill />} href='/user/sectors' />
            <Button
              text='Internships'
              icon={<ClipboardFill />}
              href='/user/internships'
            />
          </div>
          {/* <hr className={styles.sidebar_divider} /> */}
          <div className={styles.sidebar_button_group_education}>
          <span className={styles.sidebar_button_group_title}>Education</span>
            <Button
              text='Universities'
              icon={<MortarboardFill />}
              href='/user/universities'
            />
            <Button
              text='High-schools'
              icon={<BuildingFill />}
              href='/user/highSchools'
            />
            <Button text='Erasmus' icon={<StarFill />} href='/user/erasmus' />
            <Button
              text='Senior Projects'
              icon={<PersonWorkspace />}
              href='/user/graduationProjects'
            />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default UserInfoSidebar
