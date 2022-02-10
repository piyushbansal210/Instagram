import React, { Component } from 'react';
import { View,Text } from 'react-native';


import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LandingPage from '../Component/auth/LandingPage';
import Login from '../Component/auth/Login';
import Register from '../Component/auth/Register';

import {auth} from '../../Firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();

import { Provider } from 'react-redux';
import { createStore ,applyMiddleware} from 'redux';
import rootReducer from '../redux/reducers';
import thunk from 'redux-thunk';

import Main from '../Component/Main';

const store = createStore(rootReducer,applyMiddleware(thunk));


export class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            loggedIn:false,
        }
    }
    componentDidMount(){
        onAuthStateChanged(auth,user=>{
            if(!user){
                this.setState({
                    loaded:true,
                    loggedIn:false,
                })
            }
            else{
                this.setState({
                    loaded:true,
                    loggedIn:true,
                })
                console.log(user)
            }
        })
    }
    
    render() {
        const {loaded,loggedIn}=this.state;
        if(!loaded){
            return(
                <View style={{flex:1,backgroundColor:'white',justifyContent: 'center',alignItems: 'center'}}>
                    <Text>Loading...</Text>
                </View>
            )
        }
        if(!loggedIn) {
            return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LandingPage">
                <Stack.Screen name="LandingPage" component={LandingPage} options={{headerShown:false}} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                </Stack.Navigator>
            </NavigationContainer>
            );
        }
        return(
            <Provider store={store}>
                <Main/>
            </Provider>
        )
    }
}

export default Navigation;