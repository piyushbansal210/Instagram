import { auth, db } from '../../../Firebase';
import { collection, getDocs, query, where, doc, orderBy, onSnapshot } from 'firebase/firestore';

import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE ,USERS_LIKES_COUNT_CHANGE} from '../constants'

export function clearData() {
    return (
        (dispatch) => {
            dispatch({ type: CLEAR_DATA });
        }
    )
}

export function fetchUser() {
    return (
        async (dispatch) => {
            const q = query(collection(db, "user"), where("userId", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                if (doc.exists) {
                    dispatch({
                        type: "USER_STATE_CHANGE",
                        currentUser: doc.data(),
                    })
                }
                else {
                    console.log('error')
                }
            })
        }
    )
}


export function fetchUserPosts() {
    return (
        async (dispatch) => {
            const user = auth.currentUser.uid;
            const col = collection(db, "posts");
            const d = doc(col, user);
            const c = collection(d, "userPosts");
            const q = query(c, orderBy("creation", "desc"));
            const querySnapshot = await getDocs(q);
            const posts = [];
            querySnapshot.forEach((snapshot, index) => {
                const data = snapshot.data();
                data.index = snapshot.id
                posts.push(data);
            });
            dispatch({
                type: 'USER_POSTS_STATE_CHANGE',
                posts: posts,
            })
        }
    )
}

export function fetchUserFollowing() {
    return (
        async (dispatch) => {
            const user = auth.currentUser.uid;
            const col = collection(db, "following");
            const d = doc(col, user);
            const c = collection(d, "userFollowing");

            onSnapshot(c, snapshot => {
                let following = snapshot.docs.map((doc) => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: 'USER_FOLLOWING_STATE_CHANGE', following, })

                for (let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i], true))
                }
            })
        }
    )
}

export function fetchUsersData(uid, getPosts) {
    return (async (dispatch, getState) => {

        //getState gets the state of the redux store and returns it as an object
        //If found it does nothing return
        //If not found already then the users is added to the state 
        const found = getState().usersState.users.some(el => el.uid === uid)

        if (!found && uid) {
            const q = query(collection(db, "user"), where("userId", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                if (doc.exists) {
                    let user = doc.data();
                    user.uid = doc.id;
                    //console.log(user)

                    dispatch({
                        type: USERS_DATA_STATE_CHANGE,
                        user
                    });
                    if (getPosts) {
                        dispatch(fetchUsersFollowingPosts(uid))
                    }
                }
                else {
                    console.log('error')
                }

            })

        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return (
        async (dispatch, getState) => {
            if (uid) {
                const col = collection(db, "posts");
                const d = doc(col, uid);
                const c = collection(d, "userPosts");
                const q = query(c, orderBy("creation", "desc"));

                const user = getState().usersState.users.find(el => el.uid === uid);

                onSnapshot(q, (querySnapshot) => {
                    let posts = querySnapshot.docs.map((doc) => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data, user }
                    })

                    for (let i = 0; i < posts.length; i++) {
                        dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                        dispatch(fetchUsersLikesCount(uid, posts[i].id))
                    }

                    dispatch({ type: USERS_POSTS_STATE_CHANGE, posts, uid })
                })
            }
        }
    )
}


export function fetchUsersFollowingLikes(uid, postId) {
    return (
        async (dispatch, getState) => {
            if (uid) {
                const col = collection(db, "posts");
                const a = doc(col, uid);
                const c = collection(a, "userPosts");
                const d = doc(c, postId);
                const e = collection(d, "likes");
                const f = doc(e, auth.currentUser.uid);
                onSnapshot(f, (querySnapshot) => {
                    console.log(querySnapshot.data(), postId)

                    let currentUserLike = false;
                    if (querySnapshot.data()) {
                        currentUserLike = true;
                    }
                    dispatch({ type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike })
                })
            }
        }
    )
}

export function fetchUsersLikesCount(uid, postId) {
    return (async (dispatch, getState) => {
        if (uid && postId) {
            const col = collection(db, "posts");
            const a = doc(col, uid);
            const c = collection(a, "userPosts");
            const d = doc(c, postId);
            const e = collection(d, "likes");
            const f = query(e);
            onSnapshot(f, (querySnapshot) => {
                let likesCount = querySnapshot.size;
                dispatch({ type: USERS_LIKES_COUNT_CHANGE, likesCount, postId })
            })
        }
    })
}