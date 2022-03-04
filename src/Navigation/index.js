import React, { Component } from 'react';
import { View,Text } from 'react-native';


import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LandingPage from '../Component/auth/LandingPage';
import Login from '../Component/auth/Login';
import Register from '../Component/auth/Register';
import Add from '../Component/main/Add';
import Save from '../Component/main/Save';
import Comment from '../Component/main/Comment';

import {auth} from '../../Firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();

import { Provider } from 'react-redux';
import { createStore ,applyMiddleware} from 'redux';
import rootReducer from '../redux/reducers';
import thunk from 'redux-thunk';

import Main from '../Component/Main';


//Links the store to the reducer
//thunk acts as a middleware for the store
const store = createStore(rootReducer,applyMiddleware(thunk));


export class Navigation extends Component {

    // loads the user if its available
    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            loggedIn:false,
        }
    }

    //runs before the return statement runs
    componentDidMount(){

        //checks if the user is logged in
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

        //displays a loading screen while the user is beign checked if its available or not
        if(!loaded){
            return(
                <View style={{flex:1,backgroundColor:'white',justifyContent: 'center',alignItems: 'center'}}>
                    <Text>Loading...</Text>
                </View>
            )
        }

        //if not logged in the 3 login screens are shown
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

        //return the main screen with the user logged in
        //provider gives the store to whole application
        return(
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Main">
                        <Stack.Screen name="Main" component={Main} options={{headerShown:false}} />
                        <Stack.Screen name="Add" component={Add} options={{headerShown:true}} navigation ={this.props.navigation} />
                        <Stack.Screen name="Save" component={Save} options={{headerShown:true}} navigation ={this.props.navigation}/>
                        <Stack.Screen name="comment" component={Comment} options={{headerShown:true}} navigation ={this.props.navigation}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        )
    }
}

export default Navigation;