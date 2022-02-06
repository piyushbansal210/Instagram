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
            <View style={{flex:1,backgroundColor:'white',justifyContent: 'center',alignItems: 'center'}}>
                <Text>You are logged in</Text>
            </View>
        )
    }
}

export default Navigation;