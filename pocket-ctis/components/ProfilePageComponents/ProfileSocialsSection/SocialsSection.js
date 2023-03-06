import { Linkedin, Facebook, Link45deg } from 'react-bootstrap-icons'
import styles from './SocialsSection.module.css'

const SocialsSection = ({ socials }) => {
  const getIcon = (name) => {
    if (name.toLowerCase() === 'facebook') {
      return <Facebook size={50} />
    } else if (name.toLowerCase() === 'linkedin') {
      return <Linkedin size={50} />
    } else {
      return <Link45deg size={50} />
    }
  }

  return (
    <div style={{ display: 'inline' }}>
      {socials.map((social, i) => (
        <div key={i} className='mx-1' style={{ display: 'inline-block' }}>
          <a
            target='_blank'
            rel='noreferrer'
            className={`${styles[social.social_media_name.toLowerCase()]} ${
              styles.smGlobalBtn
            }`}
            href={social.link}
          >
            {getIcon(social.social_media_name)}
          </a>
        </div>
      ))}
    </div>
  )
}

export default SocialsSection
