import auth from 'serverbase';
import dbservice from 'dbbase';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, orderBy, addDoc, getDocs, doc, onSnapshot } from 'firebase/firestore';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Nweet from 'components/Nweet';

const Profile = ({ userObj }) => {
    const [myNweets, setMyNweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState([]);
    const onLogOutClick = () => auth.signOut();
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateProfile(userObj, {
            displayName: newDisplayName
        }).then(() => {
            window.location.reload(true);
            // Profile updated!
            // ...
        }).catch((error) => {
            // An error occurred
            // ...
        });
    }
    const getMyNweets = async () => {
        const nweets = query(collection(dbservice, 'nweets'), where('creatorId', '==', userObj.uid), orderBy('creatorClock', 'asc'));
        const querySnapshot = await getDocs(nweets);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
        });
        
        onSnapshot(nweets, (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setMyNweets(newArray);
        })
    }

    
    useEffect(() => {
        getMyNweets();
        // onSnapshot(collection(dbservice, 'nweets'), (snapshot) => {
        //     const newArray = snapshot.docs.map((document) => ({
        //         id: document.id,
        //         ...document.data(),
        //     }));
        //     setMyNweets(newArray);
        // })
    })

    return (
        <div className='container'>
            <form className='profileForm' onSubmit={onSubmit} >
                <input className='formInput' type='text' placeholder='Profile: display name' onChange={onChange} value={newDisplayName} />
                <div className='formMargin'></div>
                <input className='formBtn' type='submit' value='update profile' />
            </form>
            <div className='logout'></div>
            <div className='formBtn cancelBtn'>
                <Link to='/' onClick={onLogOutClick}>Delete</Link>
            </div>
            <div className='formMargin'>My Messages</div>
            <div>
                {myNweets.map((nweet) => {
                    return(
                        <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                    )
                })}
            </div>
        </div>
    )

}

export default Profile;