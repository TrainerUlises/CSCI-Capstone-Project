import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {

    return (
        <div>
             <main className="home">
                 <div className="home__container">
                    <div className="home__row">   
                        <div className="home__left">
                        <div className="home__logo1">Logo 1</div>  
                        </div>  
                         <div className="home__right">
                         <div className="home__card">  
                           <div className="home__logo2">Logo 2</div>

                             <h1 className="home__heading"> Get connected today! </h1>
                                <div className ="home__actions">
                            <Link to="/login" className="home__button"> Log In</Link>
                            <Link to="/signup" className="home__button"> Sign Up</Link>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
