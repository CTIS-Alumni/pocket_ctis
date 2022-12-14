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
import styles from '../../styles/UserInfoSidebar.module.css'
import Link from 'next/link'

const Button = ({ text, icon, href }) => {
  return (
    <Link href={`${href ? href : '#'}`} className={styles.buttonContainer}>
      {icon}
      <span className='ps-3'>{text}</span>
    </Link>
  )
}

const UserImage = () => {
  return (
    <div className='pb-4'>
      <div
        className='m-auto d-flex justify-content-center'
        style={{
          backgroundColor: 'lightcyan',
          height: 150,
          width: 150,
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <img
          src='test.jpeg'
          style={{ objectFit: 'cover', height: 150, width: 150 }}
        />
      </div>
      <div>
        <p className='text-center my-0 pt-4'>Name Surname</p>
        <p className='text-center my-0'>UNDERGRADUATE</p>
      </div>
    </div>
  )
}

const UserInfoSidebar = () => {
  return (
    <div
      className='d-flex align-items-center'
      style={{ backgroundColor: '#D9D9D9', width: '20%', height: '100%' }}
    >
      <Container>
        <UserImage />
        <Button text='PROFILE' icon={<PersonFill size='25px' />} />
        <hr
          className='border border-dark my-0 mx-auto'
          style={{ width: '80%' }}
        />
        <Button text='USERS' icon={<PersonLinesFill size='25px' />} />
        <hr
          className='border border-dark my-0 mx-auto'
          style={{ width: '80%' }}
        />
        <Button
          text='COMPANIES'
          icon={<BuildingFill size='25px' />}
          href='/user/companies'
        />
        <Button
          text='SECTORS'
          icon={<Easel2Fill size='25px' />}
          href='/user/sectors'
        />
        <Button
          text='INTERNSHIPS'
          icon={<ClipboardFill size='25px' />}
          href='/user/internships'
        />
        <hr
          className='border border-dark my-0 mx-auto'
          style={{ width: '80%' }}
        />
        <Button
          text='UNIVERSITIES'
          icon={<MortarboardFill size='25px' />}
          href='/user/universities'
        />
        <Button
          text='ERASMUS'
          icon={<StarFill size='25px' />}
          href='/user/erasmus'
        />
        <Button
          text='GRADUATION PROJECTS'
          icon={<PersonWorkspace size='25px' />}
          href='/user/graduationProjects'
        />
      </Container>
    </div>
  )
}

export default UserInfoSidebar
