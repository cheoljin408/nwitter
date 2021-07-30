import React, { useEffect, useState } from 'react';
import Nweet from '../components/Nweet';
import { dbService } from '../fbase';

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState([]);
    // const getNeets = async () => {
    //     const dbNweets = await dbService.collection('nweets').get();
    //     dbNweets.forEach((document) => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         };
    //         setNweets((prev) => [nweetObject, ...prev]);
    //     });
    // }
    useEffect(() => {
        // getNeets();
        dbService.collection('nweets').orderBy('createAt', 'desc').onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
        });
        setNweet('');
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    };
    const onFileChange = (event) => {
        const {target: {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishEvent) => {
            console.log(finishEvent);
        }
        reader.readAsDataURL(theFile);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type='text' placeholder='What`s on your mind?' maxLength={120} value={nweet} onChange={onChange} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type='submit' value='Nweet' />
            </form>
            <div>
                {nweets.map(nweet => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
}
export default Home;