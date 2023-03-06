import SectionHeading from '../SectionHeading/SectionHeading'
import { Container } from 'react-bootstrap'

const SkillsSection = ({ skills }) => {
  return (
    <div>
      <SectionHeading title='Skills' />
      <Container>
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
      </Container>
    </div>
  )
}

export default SkillsSection
