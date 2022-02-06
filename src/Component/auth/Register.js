import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { Component } from 'react';
import { View,Text,Button,TextInput } from 'react-native';

import {auth,db} from '../../../Firebase';
import { collection, addDoc } from "firebase/firestore";

export class Register extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            name:'',
        }

        this.SignUp = this.SignUp.bind(this);
    }

     async SignUp(){
        const {email,password,name}=this.state;
        createUserWithEmailAndPassword(auth,email,password)
        .then(()=>{
            addDoc(collection(db,"user"),{
                name,
                email,
            }) 
        })
        .catch((error)=>{
            console.log('Error is: ',error)
        })

        
    }

    render() {
        return(
            <View style={{justifyContent:'center',flex:1,backgroundColor: 'white'}}>
                <Text>Register Page</Text>
                <TextInput
                    placeholder="Enter your name"
                    onChangeText={(name)=>this.setState({name})}
                    value={this.state.name}
                />
                <TextInput
                    placeholder="Enter your email"
                    onChangeText={(email)=>this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter your password"
                    onChangeText={(password)=>this.setState({password})}
                    secureTextEntry={true}
                    value={this.state.password}
                />
                <Button title="SignUp" onPress={()=>this.SignUp()}/>
            </View>
        );
    }
}

export default Register;
