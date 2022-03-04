import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE,USERS_LIKES_COUNT_CHANGE } from '../constants';
const initialUser = {
    users: [],
    feed: [],
    userFollowingLoaded: 0,
}
USERS_LIKES_COUNT_CHANGE
export const users = (state = initialUser, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                userFollowingLoaded: state.userFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts],
            }
        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ?
                    { ...post, currentUserLike: action.currentUserLike } :
                    post)
            }
        case USERS_LIKES_COUNT_CHANGE:
            return {
                ...state,
                feed: state.feed.map(post => post.id == action.postId ?
                    { ...post, likesCount: action.likesCount } :
                    post)
            }
        case CLEAR_DATA:
            return initialUser;
        default:
            return state;
    }
}

