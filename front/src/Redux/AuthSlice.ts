import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState, UserStatus } from '../Types/User-Types';
import { LoginPayload } from '../Types/User-Types';
import { UserInterface } from '../Types/User-Types';

const defaultState: AuthState = {
    currentUser: undefined,
    friendList: [],
    isAuthenticated: false,
    error: undefined,
    loading: false,
    loadingIsConnected: true,
    token:'',
    setUsersame: false,
}

const defaultLogout: AuthState = {...defaultState, loadingIsConnected: false};

export const authSlice = createSlice({
    name: 'auth',
    initialState: defaultState,
    reducers: {
        loginPending: (state) => {
            state.loading = true;
        },
        loginSuccess: (state, {payload}: PayloadAction<LoginPayload>) => {
			console.log("payload", payload);
            state.currentUser = payload.user;
            state.token = payload.token;
            state.isAuthenticated = true;
            state.loading = false;
            state.loadingIsConnected = false,
            console.log("state", state);
        },
        loginError: (state, {payload}: PayloadAction<string>) => {
            state.error = payload;
            state.isAuthenticated = false;
            state.loading = false;
            state.loadingIsConnected = false;
        },
        setUsername: (state) => {
            state.setUsersame = true,
            state.loading = false;
            state.loadingIsConnected = false;
        },
        stopIsConnectedLoading: (state) => {
            state.loadingIsConnected = false;
        },
        logoutPending: (state) => {
            state.loading = true;
        },
        logoutSuccess: () => defaultLogout,
        replaceUserObject: (state, {payload}: PayloadAction<UserInterface>) => {
            state.currentUser = {...payload};
        },
        addAvatar: (state, {payload}: PayloadAction<string>) => {
            if (state.currentUser)
                state.currentUser = {...state.currentUser, avatar: payload};
        },
        copyFriendListArray: (state, {payload}: PayloadAction<UserInterface[]>) => {
            state.friendList = [...payload];
        },
        changeFriendListUserStatus: (state, {payload}: PayloadAction<{id: number, status: UserStatus}>) => {
            if (state.friendList.length > 0) {
                state.friendList = [...state.friendList.map(elem => {
                    if (elem.id === payload.id)
                        return {...elem, status: payload.status};
                    return elem;
                })]
            }
        },
    }
});

export const {
    loginPending,
    loginSuccess,
    loginError,
    setUsername,
    stopIsConnectedLoading,
    logoutPending,
    logoutSuccess,
    replaceUserObject,
    addAvatar,
    copyFriendListArray,
    changeFriendListUserStatus
} = authSlice.actions;