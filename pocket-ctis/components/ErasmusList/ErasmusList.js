import Link from 'next/link'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Row,
    Col,
    Form, Badge,
} from 'react-bootstrap'
import SearchBar from '../SearchBar/SearchBar'
import styles from './ErasmusList.module.scss'
import React from "react";

const ErasmusList = ({ erasmus }) => {
  return (
    <Container fluid style={{ backgroundColor: '#f9f9f9', paddingTop: 20 }}>
      <h1>Erasmus</h1>
      <Row>
        <Col
          style={{
            backgroundColor: 'white',
            border: '1px solid #eee',
            marginLeft: 10,
            paddingTop: 10,
            boxShadow: '5px 5px 10px 0px rgba(0,0,0,0.3)',
          }}
        >
        </Col>
        <Col lg='10'>
          <SearchBar />
          <Row>
            <Col>
              <ListGroup
                variant='flush'
                style={{ boxShadow: '5px 5px 10px 0px rgba(0,0,0,0.3)' }}
              >
                {erasmus.map((erasmus, i) => (
                  <ListGroupItem className={styles.listItem} key={i}>
                    <Link
                      href={`/erasmus/companies/${erasmus.id}`}
                      className='d-flex justify-content-between align-items-start'
                    >
                      <div style={{ width: '100%' }}>
                          <div>
                              <img alt={erasmus.first_name} className={styles.user_avatar_48} src={'/profilepictures/'+(erasmus.record_visibility ? (erasmus.pic_visibility ? erasmus.profile_picture : "defaultuser") : "defaultuser") +'.png'}/>
                          </div>
                        <div className='d-flex justify-content-between '>
                          <h5>{`${erasmus.first_name} ${erasmus.last_name} - ${erasmus.edu_inst_name}`}</h5>
                            <p>{ `${erasmus.semester} - ${erasmus.end_date.substring(0,4)}`}</p>
                        </div>
                          <div>
                              {erasmus.user_types.split(',').map((type, i) => (
                                  <Badge className='mx-1' bg='info' pill key={i}>
                                      {type.toLocaleUpperCase()}
                                  </Badge>
                              ))}
                          </div>
                      </div>
                    </Link>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}

export default ErasmusList
