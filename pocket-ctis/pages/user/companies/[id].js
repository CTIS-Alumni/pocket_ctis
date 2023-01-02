import NavigationBar from '../../../components/navbar/NavigationBar'
import UserInfoSidebar from '../../../components/UserInfoSidebar/UserInfoSidebar'
import {Container, Badge, ListGroup, ListGroupItem} from 'react-bootstrap'
import {getTimePeriod} from '../../../helpers/formatHelpers'
import styles from '../../../components/WorkUpdates/WorkUpdates.module.scss'
import React from 'react'

const Company = ({company, users}) => {
    return (
        <div style={{height: '100vh'}}>
            <NavigationBar/>
            <div className='d-flex' style={{height: '100%'}}>
                <UserInfoSidebar/>
                <Container className='py-3'>
                    <div
                        className='d-flex justify-content-between align-items-start'
                        style={{width: '100%'}}
                    >
                        <div>
                            <h5>{company.company_name}</h5>
                            <p>{company.sector_name}</p>
                        </div>
                        {company.is_internship == 1 && (
                            <Badge bg='primary' pill>
                                Accepts CTIS Interns
                            </Badge>
                        )}
                    </div>
                    <hr className='mx-auto' style={{width: '80%'}}/>
                    <div className='my-2'>
                        {users.length > 0
                            ? `People who have worked at ${company.company_name}:`
                            : `No one from your department have worked at ${company.company_name}.`}
                    </div>
                    <ListGroup variant='flush'>
                        {users.map((user) => {
                            console.log(user)
                            const workPeriod = getTimePeriod(
                                user.start_date,
                                user.end_date,
                                user.is_current
                            )
                            return (
                                <ListGroupItem key={user.id}>
                                    <div>
                                        <img
                                            alt={user.first_name}
                                            className={styles.user_avatar_48}
                                            src={
                                                '/profilepictures/' +
                                                (user.record_visibility
                                                    ? user.pic_visibility
                                                        ? user.profile_picture
                                                        : 'defaultuser'
                                                    : 'defaultuser') +
                                                '.png'
                                            }
                                        />
                                    </div>
                                    <div className='d-flex justify-content-between align-items'>
                                        <h5>
                                            {user.first_name} {user.last_name}
                                        </h5>
                                        <div>
                                            {user.user_types.split(',').map((type, i) => (
                                                <Badge className='mx-1' bg='info' pill key={i}>
                                                    {type.toLocaleUpperCase()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <Container style={{fontSize: 14}}>
                                        <p
                                            className='my-0'
                                            style={{fontSize: 16, fontWeight: 'bold'}}
                                        >
                                            {user.position}
                                            {user.department && ` - ${user.department}`}
                                        </p>
                                        <p className='my-0'>{user.type_name}</p>
                                        <p style={{color: '#999'}} className='my-0'>
                                            {workPeriod}
                                        </p>
                                        <p style={{color: '#999'}}>
                                            {user.city_name && `${user.city_name} - `}
                                            {user.country_name}
                                        </p>
                                    </Container>
                                </ListGroupItem>
                            )
                        })}
                    </ListGroup>
                </Container>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const res = await fetch(
        process.env.BACKEND_PATH + "/companies/" + context.params.id, {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        });
    const {data} = await res.json()

    const res2 = await fetch(
        process.env.BACKEND_PATH + "/workrecords?company_id=" + context.params.id, {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        });
    const users = await res2.json()
    return {props: {company: data[0], users: users.work}}
}

export default Company
