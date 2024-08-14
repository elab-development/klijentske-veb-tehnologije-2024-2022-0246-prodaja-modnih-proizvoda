import './Login.css'
import { useFormInput } from '../hooks/useFormInput';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    loginUser: (email: string, password: string) => void;
}

const Login = ({loginUser}:LoginProps) => {
    const navigate = useNavigate();
    const emailProps = useFormInput('');
    const passwordProps = useFormInput('');
    const onSubmit = (ev: React.MouseEvent) => {
        // prevent default page reload
        ev.preventDefault();
        //alert(`email=${emailProps.value} password=${passwordProps.value}`);
        loginUser(emailProps.value, passwordProps.value);
        navigate('/');
    };

    return (
        <div id="login">
            <div id="login-image"></div>
            <div id="login-area">
                <form id="login-form">
                    <h1>Log in</h1>
                    <label htmlFor="email">
                        <p>Email</p>
                        <input id="email" name="email" type="text" placeholder="Enter e-mail address" className="form-element" {...emailProps} />
                    </label>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input id="password" name="password" type="password" placeholder="Enter password" className="form-element" {...passwordProps} />
                    </label>
                    <br />
                    <input type="submit" value="Submit" name="button" onClick={onSubmit} />
                </form>
            </div>
        </div>
    )
}

export default Login