import '../styles/footer.css';

const Footer = () => {

    // <script src="https://developer.edamam.com/attribution/badge.js"></script>
    // Add this script to header in index.html 
    // OR
    // https://developer.edamam.com/attribution download an svg file

    return (
        <div className="footer">
            <div id="edamam-badge" data-color="white"></div>
            <p>Icons from <a href='https://www.flaticon.com/' target="_blank">Flaticon</a></p>
        </div>
    )

}
export default Footer;