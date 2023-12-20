import { useState, useEffect } from 'react';
import dbservice from 'dbbase';
import storage from 'storage';
import { collection, addDoc, getDocs, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { type } from '@testing-library/user-event/dist/type';
import Nweet from 'components/Nweet';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState('');

    // const count = [];

    // const getNweets = async () => {
    //     const dbNweets = await getDocs(collection(dbservice, 'nweets'))
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(), id: document.id
    //         }
    //         if (count.indexOf(nweetObject.id) === -1) {
    //             count.push(nweetObject.id);
    //             setNweets((prev) => [nweetObject, ...prev]);
    //         }
    //     });
    // }
    // useEffect(() => {
    //     getNweets();
    // }, [])
    // useEffect(() => {
    //     dbservice.collection(dbservice, 'nweets').onSnapshot((snapshot) => {
    //         const newArray = snapshot.docs.map((document) => ({
    //             id: document.id,
    //             ...document.data(),
    //         }));
    //         setNweets(newArray);
    //     });
    // }, []);
    useEffect(() => {
        onSnapshot(query(collection(dbservice, 'nweets'), orderBy('creatorClock', 'desc')), (snapshot) => {
            const newArray = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        })
    })
    const onSubmit = async (event) => {
        event.preventDefault();
        if (nweet !== '') {
            let attachmentUrl = '';
            if (attachment !== '') {
                const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`)
                uploadBytes(attachmentRef, attachment).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
            });
            attachmentUrl = await getDownloadURL(attachmentRef)    
        }
        await addDoc(collection(dbservice, 'nweets'), {
            text: nweet,
            creatorClock: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        })
        setNweet('');
        setAttachment('');
        
        // const attachmentRef = storage.ref().child(`${userObj.uid}/${uuidv4()}`)
        // const response = await attachmentRef.putString(attachment, 'data_url')
        // await dbservice.collection('nweets').add({
            //     text: nweet,
            //     createAt: Date.now()
            // });
            console.log(attachmentUrl)
        }
    };
    const onChange = (event) => {
        event.preventDefault();
        const {
            target: {value},
        } = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        // console.log(event.target.files);
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            console.log(finishedEvent);
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        console.log(theFile)
        reader.readAsDataURL(theFile)
    }

    const onClearAttachment = () => setAttachment('')
    
    return (
        <div className='router'>
            <form className='factoryForm' onSubmit={onSubmit}>
                <div className='factoryContainer'>
                    <input className='factoryInput' type='text' placeholder="What's on your mind" value={nweet} onChange={onChange} maxLength={120} />
                    <input className='factoryArrow' type='submit' value='Nweet' />
                </div>
                <input className='factoryLabel' type='file' onChange={onFileChange}/>
                {attachment && (
                    <div>
                        <img src={attachment} width='50px' height='50px' alt='alt' />
                        <button className='factoryClear' onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {nweets.map((nweet) => {
                    return(
                        <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                    )
                })}
            </div>
        </div>
    )
}

export default Home;