import { useEffect } from 'react'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import styles from '../../../styles/graduationproject.module.scss'
import { Card } from 'react-bootstrap'
import { getGraduationProjectPicturePath } from '../../../helpers/formatHelpers'

const GraduationProject = ({ graduationproject }) => {
  console.log(graduationproject.data[0])
  return (
    <UserPageContainer>
      <div
        style={{ margin: 20, display: 'flex', flexWrap: 'wrap', gap: '20px' }}
      >
        <Card border='light' style={{ padding: 20, width: '60%', flexGrow: 1 }}>
          <h5>{graduationproject.data[0].graduation_project_name}</h5>
          <div
            style={{
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <img
              src={getGraduationProjectPicturePath(graduationproject.data[0].poster_pic, 'poster')}
              style={{  background: '#ccc' , width: 800}}
              className={styles.posterImage}
            />
          </div>
          <div>
            <div style={{ margin: '20px 15px', fontSize: '20px' }}>
              {graduationproject.data[0].graduation_project_name}
              {graduationproject.data[0].product_name &&
                ` : ${graduationproject.data[0].product_name}`}
            </div>
            <div>{graduationproject.data[0].project_description}</div>
          </div>
        </Card>
        <div style={{ flexGrow: 1 }}>
          <Card border='light' style={{ height: 'fit-content', padding: 20 }}>
            <h5
              style={{
                borderBottom: '1px solid #ccc',
                paddingBottom: 10,
                marginBottom: 20,
              }}
            >
              Project Information
            </h5>
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <div style={{ color: '#aaa' }}>Team Number</div>
              <div style={{ textAlign: 'right', flexGrow: '1' }}>
                {graduationproject.data[0].team_number}
              </div>
            </div>
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <div style={{ color: '#aaa' }}>Project Type</div>
              <div style={{ textAlign: 'right', flexGrow: '1' }}>
                {graduationproject.data[0].project_type}
              </div>
            </div>
            {graduationproject.data[0].project_type === "company" &&
                <div style={{ display: 'flex', marginBottom: 20 }}>
              <div style={{ color: '#aaa' }}>Sponsor</div>
              <div style={{ textAlign: 'right', flexGrow: '1' }}>
                {graduationproject.data[0].company_name}
              </div>
            </div>}
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <div style={{ color: '#aaa' }}>Advisor</div>
              <div style={{ textAlign: 'right', flexGrow: '1' }}>
                {graduationproject.data[0].advisor}
              </div>
            </div>
          </Card>
          <Card
            border='light'
            style={{
              height: 'fit-content',
              padding: 20,
              flexGrow: 1,
              marginTop: 20,
            }}
          >
            <h5
              style={{
                borderBottom: '1px solid #ccc',
                paddingBottom: 10,
                marginBottom: 20,
              }}
            >
              Team Members
            </h5>
            <div className='d-flex justify-content-center'>
              <img
                src={getGraduationProjectPicturePath(
                  graduationproject.data[0].team_pic,
                  'team'
                )}
                style={{
                  width: '300px',
                  objectFit: 'contain',
                  marginBottom: 20,
                }}
              />
            </div>
            <div>
              {graduationproject.data[0]?.team_members?.split(',').map((stu) => {
                const [num, name, bilkentID] = stu.split('-')
                return (
                  <div
                    style={{ marginBottom: 10, borderBottom: '1px solid #bbb' }}
                  >
                    {name}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { graduationproject } = await _getFetcher(
    { graduationproject: craftUrl(['graduationprojects', context.params.id]) },
    cookie
  )
  return { props: { graduationproject } }
}
export default GraduationProject
