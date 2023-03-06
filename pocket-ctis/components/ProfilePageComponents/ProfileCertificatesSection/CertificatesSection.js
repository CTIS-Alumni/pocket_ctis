import SectionHeading from '../SectionHeading/SectionHeading'
import { Container } from 'react-bootstrap'

const CertificatesSection = ({ certs }) => {
  return (
    <div>
      <SectionHeading title={'Certificates'} />
        {certs.length > 0 && <Container>
        {certs.map((cert, i) => (
          <div key={i}>
            {cert.certificate_name}
            <Container style={{ fontSize: 14, color: '#999' }}>
              Issued by: {cert.issuing_authority}
            </Container>
          </div>
        ))}
      </Container>}
        {certs.length == 0 &&
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

export default CertificatesSection
