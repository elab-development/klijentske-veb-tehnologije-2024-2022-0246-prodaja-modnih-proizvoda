import { IconContext } from 'react-icons'
import './Footer.css'
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'

function Footer() {
    return (
        <div id="footer">
            <div>
                <h2>Legal Notice</h2>
                <p>Terms and conditions</p>
                <p>Instructions for cancellation</p>
                <p>Company details</p>
                <p>Data protection</p>
                <p>Money back guarantee</p>
            </div>
            <div>
                <h2>Service</h2>
                <p>Help &amp; service</p>
                <p>Info Center</p>
            </div>
            <div>
                <h2>Help</h2>
                <p>Payment methods</p>
                <p>Delivery costs</p>
            </div>
            <div>
                <IconContext.Provider value={{ size: "2.7em"}}>
                    <h1>Follow us</h1>
                    <p style={{verticalAlign: "middle"}}><FaInstagram /> <FaFacebook /> <FaTiktok /> </p>
                </IconContext.Provider>
            </div>
        </div>
    )
}

export default Footer