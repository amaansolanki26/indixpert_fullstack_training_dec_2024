import { Container, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export const AuthLayout = () => {
  return (
    <Container>
            <Row>
                <Outlet/>
            </Row>
        </Container>
  )
}

export default AuthLayout