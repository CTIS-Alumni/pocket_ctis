import SectionHeading from '../SectionHeading/SectionHeading'
import { Container } from 'react-bootstrap'

const SkillsSection = ({ skills }) => {
  return (
    <div>
      <SectionHeading title='Skills' />
        {skills.length > 0 && <Container>
        {skills.map((skill, i) => {
          return (
            <div className='my-1' key={i}>
              {skill.skill_name}
              <Container style={{ fontSize: 14, color: '#999' }}>
                Skill level: {skill.skill_level}
              </Container>
            </div>
          )
        })}
      </Container>}
        {skills.length == 0 &&
            <Container
                className='px-0'
                style={{ height: 50, width: 350, color: '#999' }}
            >
                No data available
            </Container>
        }
    </div>
  )
}

export default SkillsSection
