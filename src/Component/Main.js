import React, { Component } from 'react';
import { View, Text } from 'react-native';

import {auth } from '../../Firebase'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser, fetchUserPosts } from '../redux/actions';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

import Feed from '../Component/main/Feed';
import Profile from '../Component/main/Profile';
import Search from '../Component/main/Search';
import Add from '../Component/main/Add';

import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const Empty = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }
    render() {
        // console.log(this.props)
        //if we try to console log current user's name here it will show error because the current user is not yet fetched yet.
        //So we need to wait for the current user to be fetched before we can console log the name.
        //So we need to use the following code snippet to wait for the current user to be fetched before we can console log the name.        // const {currentUser} = this.props;
        // if(currentUser){
        //     console.log(currentUser.name)
        // }
        return (
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    tabBarShowLabel: false,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Feed}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (<MaterialIcons name="home" size={24} color={color} />),
                        title: 'Home'
                    }}
                />
                <Tab.Screen
                    name="Search"
                    navigation={this.props.navigation}
                    component={Search}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (<AntDesign name="search1" size={24} color={color} />),
                    }}
                />

                {/* Listener is shifted to a new screen rather than showing bottom tab like in instagram*/}
                <Tab.Screen
                    name="Empty"
                    component={Empty}
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            event.preventDefault();
                            navigation.navigate('Add');
                        }
                    })}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (<MaterialIcons name="add-box" size={24} color={color} />),
                        title: 'Add'
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            event.preventDefault();
                            navigation.navigate('Profile',{email:auth.currentUser.email});
                        }
                    })}
                    options={{
                        headerShown: true,
                        tabBarIcon: ({ color, size }) => (<AntDesign name="profile" size={24} color={color} />),
                        title: 'Profile'
                    }}
                />
            </Tab.Navigator>
        )

    }
}


//updates the state of the user
const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
})

//loads the function
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
