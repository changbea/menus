import auth from 'serverbase';
import onSocialClick from 'socialserverbase';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(false);
    const [error, setError] = useState('');
    
    const onChange = (event) => {
        const {
            target: { name, value }
        } = event;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await createUserWithEmailAndPassword(auth, email, password);
            } else {
                data = await signInWithEmailAndPassword(auth, email, password);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    }
    
    const toggleAccount = () => setNewAccount((prev) => !prev);
    
    return (
        <div>
            <form className='container' onSubmit={onSubmit}>
                <input className='authInput' name='email' type='email' placeholder='Email' required value={email} onChange={onChange} />
                <input className='authInput' name='password' type='password' placeholder='Password' required value={password} onChange={onChange} />
                <input className='authInput authSubmit' type='submit' value={newAccount ? 'Create Account' : 'Login'}/>
                {error && <span className='authError'>{error}</span>}
            </form>
            <span onClick={toggleAccount} className='authSwitch'>
                {newAccount ? 'Sign In' : 'Create Account'}
            </span>
            <div className='authBtns'>
                <button className='authBtn' onClick={onSocialClick} name='goo'>Continue with Google</button>
                <button className='authBtn'>Continue with Google</button>
            </div>
        </div>
    )
}

export default Auth;