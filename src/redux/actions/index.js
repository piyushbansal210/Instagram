import {auth,db} from '../../../Firebase';
import {collection, getDocs,query,where,doc,orderBy} from 'firebase/firestore';

import {USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE} from '../constants'

export function fetchUser (){
    return (
        async (dispatch) => {
            const q = query(collection(db, "user"), where("userEmail", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                if(doc.exists){
                    dispatch({
                        type: "USER_STATE_CHANGE",
                        currentUser: doc.data(), 
                    })
                }
                else{
                    console.log('error')
                }
            })
        }
    )
}


export function fetchUserPosts(){
    return (
        async (dispatch) => {
            const user=auth.currentUser.email;
            const col = collection(db,"posts");
            const d = doc(col,user);
            const c = collection(d,"userPosts");
            const q = query(c, orderBy("creation","desc"));
            const querySnapshot = await getDocs(q);
            const posts = [];
            querySnapshot.forEach((snapshot,index) => {
                const data = snapshot.data();
                data.index = snapshot.id
                posts.push(data);
            });
            dispatch({
                type:'USER_POSTS_STATE_CHANGE',
                posts:posts,
            })
        }
    )
}