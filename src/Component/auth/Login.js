import React, { Component } from 'react';
import { View,Text,TextInput,Button } from 'react-native';

import {auth} from '../../../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.OnLogin=this.OnLogin.bind(this);
    }

    OnLogin(){
        const {email,password}=this.state;
        signInWithEmailAndPassword(auth,email,password)
        .then(()=>{
            console.log('logged in firebase')
        })
    }

    render() {
        return(
            <View style={{flex:1,backgroundColor:'white',justifyContent: 'center'}}>
                <TextInput
                    placeholder="Enter your email"
                    onChangeText={email=>this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter your Password"
                    onChangeText={password=>this.setState({password})}
                    secureTextEntry={true}
                    value={this.state.password}
                />
                <Button title="Login" onPress={()=>this.OnLogin()}/>
            </View>
        );
    }
}

export default Login;
