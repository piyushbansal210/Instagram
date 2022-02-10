import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser } from '../redux/actions';

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        const { currentUser } = this.props;
        console.log(currentUser)

        //if we try to console log current user's name here it will show error because the current user is not yet fetched yet.
        //So we need to wait for the current user to be fetched before we can console log the name.
        //So we need to use the following code snippet to wait for the current user to be fetched before we can console log the name.        // const {currentUser} = this.props;
        // if(currentUser){
        //     console.log(currentUser.name)
        // }
        if (currentUser === undefined) {
            return (
                <View>
                    <Text>User Undefined</Text>
                </View>
            )
        }
        return (
            <View>
                <Text>{currentUser.userName}Main</Text>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.userState.currentUser,
})
const mapDispatchToProps = dispatch => bindActionCreators({ fetchUser }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Main);
