import Navbar from '../components/Navbar.jsx';
import "./Login.css";

export default function Login() {
    return (
        <div>
            <Navbar />
            <main className="login">
                <div className="login__container">
                <h1 className="login__heading">Log In</h1>
        
                <section className="login__card">
                    <form className="form">
                    <div className="form__group">
                        {/*<label>Email</label>*/}
                        <input className="form__input" placeholder="Email" />
                    </div>
        
                    <div className="form__group">
                        {/*<label>Password</label>*/}
                        <input className="form__input" type="password" placeholder="Password" />
                    </div>
        
                    <div className="form__row">
                        <label className="form__remember">
                        <input type="checkbox" />
                        Remember Me
                        </label>
        
                        <a className="form__link" href="#">
                        Forgot Password?
                        </a>
                    </div>
        
                    <div className="form__actions">
                        <button type="button" className="form__button">
                        Log In
                        </button>
                    </div>
                    </form>
                </section>

                </div>
            </main>
        </div>
    );
}