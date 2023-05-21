import { Tab, Tabs } from 'react-bootstrap'
import ErasmusStudentsList from '../../../components/ErasmusPageComponents/ErasmusStudentsList/ErasmusStudentsList'
import ErasmusUnisList from '../../../components/ErasmusPageComponents/ErasmusUnisList/ErasmusUnisList'
import styles from '../../../styles/erasmus.module.scss'
import { _getFetcher } from '../../../helpers/fetchHelpers'
import { craftUrl, buildCondition } from '../../../helpers/urlHelper'
import UserPageContainer from '../../../components/UserPageContainer/UserPageContainer'
import { useState, useEffect } from 'react'

const ErasmusDashboard = ({ erasmus, eduInsts }) => {
  const [erasmusStudents, setErasmusStudents] = useState([])
  const [studentsTotal, setStudentsTotal] = useState()
  const [erasmusUnis, setErasmusUnis] = useState([])
  const [unisTotal, setUnisTotal] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setErasmusStudents(erasmus.data)
    setStudentsTotal(erasmus.length)
    setErasmusUnis(eduInsts.data)
    setUnisTotal(eduInsts.length)
  }, [])

  const onQueryStudents = (queryParams) => {
    const conditions = buildCondition(queryParams)
    setIsLoading(true)
    _getFetcher({ erasmus: craftUrl(['erasmus'], conditions) })
      .then(({ erasmus }) => {
        setStudentsTotal(erasmus.length)
        setErasmusStudents(erasmus.data)
      })
      .finally((_) => setIsLoading(false))
  }

  const onQueryUnis = (queryParams) => {
    const conditions = buildCondition(queryParams)
    conditions.push({ name: 'erasmus', value: 1 })
    setIsLoading(true)
    _getFetcher({
      educationinstitutes: craftUrl(['educationinstitutes'], conditions),
    })
      .then(({ educationinstitutes }) => {
        {
          setErasmusUnis(educationinstitutes.data)
          setUnisTotal(educationinstitutes.length)
        }
      })
      .finally((_) => setIsLoading(false))
  }

  return (
    <UserPageContainer>
      <section className={styles.erasmus_wrapper}>
        <h2 className={styles.erasmus_title}>Erasmus</h2>
        <Tabs defaultActiveKey='students' className='mb-3'>
          <Tab eventKey='students' title='Students'>
            {erasmusStudents.length > 0 && (
              <ErasmusStudentsList
                erasmus={erasmusStudents}
                total={studentsTotal}
                onQuery={onQueryStudents}
                isLoading={isLoading}
              />
            )}
          </Tab>
          <Tab eventKey='university' title='University'>
            {erasmusUnis && (
              <ErasmusUnisList
                universities={erasmusUnis}
                total={unisTotal}
                onQuery={onQueryUnis}
                isLoading={isLoading}
              />
            )}
          </Tab>
        </Tabs>
      </section>
    </UserPageContainer>
  )
}

export async function getServerSideProps(context) {
  const { cookie } = context.req.headers
  const { erasmus, eduInsts } = await _getFetcher(
    {
      erasmus: craftUrl(['erasmus']),
      eduInsts: craftUrl(
        ['educationinstitutes'],
        [{ name: 'erasmus', value: 1 }]
      ),
    },
    cookie
  )

  return { props: { erasmus, eduInsts } }
}
export default ErasmusDashboard
