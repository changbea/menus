import { useState, useEffect } from 'react';
import dbservice from 'dbbase';
import storage from 'storage';
import { collection, addDoc, getDocs, doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';

const Nweet = ({ nweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [msg, setMsg] = useState(nweetObj.text);
    
    const onEditClick = () => {
        // const ok = window.confirm('Edit?')
        const ok = true;
        if (ok) {
            setEditing((prev) => !prev)
        }
    }
    const onDeleteClick = async () => {
        // const ok = window.confirm('Delete?')
        const ok = true;
        if (ok) {
            const data = await doc(dbservice, `nweets/${nweetObj.id}`);
            deleteDoc(data)
            if (nweetObj.attachmentUrl !== '') {
                const deleteRef = ref(storage, nweetObj.attachmentUrl) 
                await deleteObject(deleteRef).then(() => {
                    // File deleted successfully
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                });
            }
              
        }
    }
    const onChange = (e) => {
        const {
            target: {value}
        } = e;
        setMsg(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const data = await doc(dbservice, `nweets/${nweetObj.id}`)
        updateDoc(data, {text: msg});
        setEditing(false);
    }

    return (
        <div>
        <div className='nweetMargin'></div>
            <div className='nweet'>
                {editing ? 
                    <div> 
                        <form className='container nweetEdit' onSubmit={onSubmit}>
                            <input className='formInput' placeholder='Edit' onChange={onChange} value={msg} />
                            <input className='formBtn' type='submit' value='done' />
                            <button className='formBtn cancelBtn' onClick={onEditClick}>cancel</button>
                        </form>
                    </div>
                    :
                    <div>   
                        <div>{nweetObj.text}</div>
                        {nweetObj.attachmentUrl && (
                            <img src={nweetObj.attachmentUrl} width='50px' height='50px' />
                            )
                        }
                        {isOwner &&
                            <div className='nweetActions'>
                            <button onClick={onEditClick}>Edit Nweet</button>
                            {editing && 
                                <form></form>
                            }
                            <button onClick={onDeleteClick}>Delete Nweet</button>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Nweet;