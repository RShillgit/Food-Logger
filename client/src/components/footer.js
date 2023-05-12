import '../styles/footer.css';
import badge from '../images/badge.svg';
import GitHub from '../images/GitHub.png';

const Footer = () => {

    return (
        <div className="footer">
            <a className='edamam' href='https://www.edamam.com/' target="_blank" rel="noreferrer">
                <img src={badge} alt='Powered By Edamam'/>
            </a>

            <a href='https://github.com/RShillgit' target="_blank" rel="noreferrer">
                <img id='githubImg' src={GitHub} alt='GitHub'/>
            </a>

            <p className='flaticon'>Icons from <a href='https://www.flaticon.com/' target="_blank" rel='noreferrer'>Flaticon</a></p>
        </div>
    )

}
export default Footer;