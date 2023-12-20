import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
    return (
        <nav>
            <ul className='nav'>
                <li>
                    <Link className='menu' to='/'>Home</Link>
                </li>
                <li>
                    <Link className='menu' to='/profile'>{userObj.displayName}'s Profile</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navigation;