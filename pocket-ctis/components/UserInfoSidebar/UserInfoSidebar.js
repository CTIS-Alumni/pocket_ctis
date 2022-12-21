import { Container } from 'react-bootstrap'
import {
  PersonFill,
  PersonLinesFill,
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
    <div className={styles.sidebar_user_avatar}>
      <img src='https://i.pinimg.com/564x/86/6c/1e/866c1e4c27cc640e24838b0a0769dfa2.jpg' />
    </div>
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
    <aside className={styles.sidebar}>
      <UserImage />
      <UserInfo />
      <div className={styles.sidebar_buttons}>
        <Button text='Profile' icon={<PersonFill />} />
        <hr className={styles.sidebar_divider} />
        <Button text='Users' icon={<PersonLinesFill />} />
        <hr className={styles.sidebar_divider} />
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
        <hr className={styles.sidebar_divider} />
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
        <Button
            text='Erasmus'
            icon={<StarFill />}
            href='/user/erasmus'
        />
        <Button
          text='Graduation Projects'
          icon={<PersonWorkspace />}
          href='/user/graduationProjects'
        />
      </div>
    </aside>
  )
}

export default UserInfoSidebar
