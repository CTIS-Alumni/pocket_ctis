import { useState, useEffect } from 'react'
import AdminPageContainer from '../../components/AdminPanelComponents/AdminPageContainer/AdminPageContainer'
import { Card } from 'react-bootstrap'
import styles from '../../styles/moduleCustomization.module.css'

const CollapsibleMenu = ({ itemKey, activeKey, setActiveKey }) => {
  return (
    <div>
      <div
        className={styles.collapsibleHeading}
        onClick={() => setActiveKey(activeKey == itemKey ? '' : itemKey)}
      >
        {itemKey}
      </div>
      <div
        className={`${styles.collapsible} ${
          activeKey == itemKey && styles.active
        }`}
      >
        <div>
          <input type='checkbox' name={itemKey} />
          <label htmlFor={itemKey}>Allow User Addition</label>
        </div>
      </div>
      <hr className={styles.break} />
    </div>
  )
}

const ModuleCustomization = () => {
  const [activeKey, setActiveKey] = useState('')

  return (
    <AdminPageContainer>
      <h4>Module Customization</h4>
      <Card style={{ padding: 20 }} className='mb-2' border='light'>
        <CollapsibleMenu
          itemKey='Company'
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <CollapsibleMenu
          itemKey='Sector'
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <CollapsibleMenu
          itemKey='Educational Institutes'
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <CollapsibleMenu
          itemKey='High Schools'
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <CollapsibleMenu
          itemKey='Skills'
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
        <CollapsibleMenu
          itemKey='Exams'
          activeKey={activeKey}
          setActiveKey={setActiveKey}
        />
      </Card>
    </AdminPageContainer>
  )
}

export default ModuleCustomization
