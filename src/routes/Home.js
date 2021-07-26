import React, { useEffect, useState } from 'react';
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
            creator: userObj.uid,
        });
        setNweet('');
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setNweet(value);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type='text' placeholder='What`s on your mind?' maxLength={120} value={nweet} onChange={onChange} />
                <input type='submit' value='Nweet' />
            </form>
            <div>
                {nweets.map(nweet => <div key={nweet.id}>
                    <h4>{nweet.text}</h4>
                </div>)}
            </div>
        </div>
    );
}
export default Home;