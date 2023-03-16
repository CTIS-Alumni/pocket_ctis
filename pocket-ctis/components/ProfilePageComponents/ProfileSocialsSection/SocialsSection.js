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
              title={social.base_link + social.link}
            target='_blank'
            rel='noopener noreferrer external'
            className={`${styles[social.social_media_name.toLowerCase()]} ${
              styles.smGlobalBtn
            }`}
            href={'https://' +social.base_link + social.link}
          >
            {getIcon(social.social_media_name)}
          </a>
        </div>
      ))}
    </div>
  )
}

export default SocialsSection
