import React from 'react';
import {View,Text,Button} from 'react-native';

export default function LandingPage({navigation}){
    return(
        <View style={{flex:1, backgroundColor:'white',justifyContent: 'center',margin:10}}>
            <Button title="Register" onPress={()=>{navigation.navigate('Register')}}/>
            <Button title="Login" onPress={()=>{navigation.navigate('Login')}}/>
        </View>
    )
}