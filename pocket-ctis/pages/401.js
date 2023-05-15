import {Container} from "react-bootstrap";
import Link from "next/link";

const Unauthorized = () => {
    return (
        <div style={{backgroundColor: '#1F272B', height: '100vh'}}
             className='d-flex justify-content-center align-items-center'>
            <Container style={{
                height: '40%',
                width: '50%',
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }} className='d-flex justify-content-center align-items-center'>
                <h1 style={{color: '#ffffff'}}>401</h1>
                <h2 style={{color: '#f5a425'}}>Oops! It seems you can't access this page! Make sure the links in your
                email are not expired.</h2>
                <div>
                    <Link
                        href={`/login`}
                        className='d-flex justify-content-between align-items-start'
                        style={{color: '#f5a425'}}
                    >
                        <h1 style={{color: '#ffffff'}}>Click here to return to main page</h1>
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default Unauthorized
