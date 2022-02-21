import { View, Text, TextInput, Image, Button } from 'react-native'
import React, { useEffect, useState } from 'react'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser } from '../../redux/actions';

import { auth, db, storage } from '../../../Firebase'
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, getDocs, query, where, doc, addDoc ,serverTimestamp} from 'firebase/firestore';

function Save(props) {
    const [caption, setCaption] = useState("");
    const [user, setUser] = useState(null);

    const postImage = async () => {

        const uri = props.route.params.image;
        const response = await fetch(uri);
        const blob = await response.blob();
        const child = `post/${user}/${Math.random().toString(36)}`;

        const storageRef = ref(storage, child);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    savePostData(downloadURL);
                    
                });
            }
        );

    }

    const savePostData = (downloadURL) => {
        const user = auth.currentUser.email;
        const ref = doc(collection(db, "posts"), user);
        const getPost = collection(ref, "userPosts");
        addDoc(getPost, {
            downloadURL,
            caption,
            creation: serverTimestamp()
        }).then(()=>{
            props.navigation.popToTop() 
        })
    }


    useEffect(async () => {
        const imp = await props.currentUser.userEmail
        setUser(imp)
    }, [])


    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} style={{ width: 300, height: 300 }} />
            <TextInput
                placeholder='Caption'
                onChangeText={caption => setCaption(caption)}
                value={caption}
            />
            <Button title="Post Picture" onPress={() => postImage()} />
        </View>
    )
}

//updates the state of the user
const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
})

//loads the function
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Save);