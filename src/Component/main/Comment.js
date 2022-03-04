import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import { collection, doc, getDocs, orderBy, onSnapshot,addDoc,query ,where} from 'firebase/firestore'

import {bindActionCreators} from 'redux'
import { auth, db } from '../.././../Firebase'
import {fetchUsersData} from '../../redux/actions'
import { connect } from 'react-redux'

const Comment = (props) => {
    console.log(props)
    const [text, setText] = useState('')
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState('')
console.log(props)
    useEffect(() => {

        const matchUserToComments = async(comments) =>{
            for(let i=0;i<comments.length;i++){
            const q = query(collection(db, "user"), where("userId", "==", comments[i].creator));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                if (doc.exists) {
                    let user = doc.data();
                    user.uid = doc.id;
                    comments[i].user = user;
                }
                else {
                    console.log('error')
                } 
            })
                
            }
            setComments(comments)
        }

        if(props.route.params.postId !== postId){
            const a = collection(db, "posts");
            const b = doc(a, props.route.params.uid);
            const c = collection(b, "userPosts");
            const d = doc(c, props.route.params.postId);
            const e = collection(d, "comments");
            onSnapshot(e, (snapshot) => {
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data };
                })
                matchUserToComments(comments)
            });
            setPostId(props.route.params.postId)
        }else{
            matchUserToComments(comments)
        }

    }, [props.route.params.postId,props.users])


    console.log(comments)

    const addComment = () => {
        const a = collection(db, "posts");
        const b = doc(a, props.route.params.uid);
        const c = collection(b, "userPosts");
        const d = doc(c, props.route.params.postId);
        const e = collection(d, "comments");
        addDoc(e, {
            creator:auth.currentUser.uid,
            text:text,
          });
        console.log('added')
    }
    console.log(comments)
    return (
        <View style={{flex:1}}>
            <Text>Comment</Text>

            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return (
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{item.user.userName}</Text>
                            <Text>{item.text}</Text>
                        </View>
                    )
                }}
            />

            <View style={{position: 'absolute',width:'100%',bottom:0}}>
                <TextInput
                    onChangeText={(text) => setText(text)}
                    value={text}
                    placeholder="Comment"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                />
                <Button
                    title="Add Comment"
                    onPress={() => addComment()}
                />
            </View>
        </View>
    )
}


const mapStateToProps = (state)=>({
    users:state.usersState.users,
})

const mapDispatchToProps = (dispatch)=>bindActionCreators({fetchUsersData},dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Comment); 