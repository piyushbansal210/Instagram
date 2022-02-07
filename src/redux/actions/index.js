import {auth,db} from '../../../Firebase';
import {collection, getDocs,query,where} from 'firebase/firestore';

import {USER_STATE_CHANGE} from '../constants'

export function fetchUser (){
    return (
        async (dispatch) => {
            const q = query(collection(db, "user"), where("userEmail", "==", auth.currentUser.email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                if(doc.exists){
                    console.log(doc)
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