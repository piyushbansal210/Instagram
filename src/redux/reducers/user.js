const initialUser = {
    currentUser: null,

}

export const user =(state = initialUser, action) => {
    return {
        ...state,
        currentUser: action.currentUser, 
    }
}