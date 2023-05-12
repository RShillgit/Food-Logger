import { useNavigate } from 'react-router-dom';
import '../styles/notFound.css';
import Footer from './footer';

const NotFound = (props) => {

    const navigate = useNavigate();

    return (
        <>
            <div className='notFoundPage'>
                <div className='notFoundContainer'>
                    <h1>Page Not Found</h1>
                    <button onClick={() => navigate('/')}>Return Home</button>
                </div>
                
            </div>
        </>
    )
}
export default NotFound;