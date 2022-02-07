import React, { Component } from 'react';
import { View,Text } from 'react-native';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchUser } from '../redux/actions';


export class Main extends Component {
    componentDidMount(){
        this.props.fetchUser(); 
    }
  render() {
      const {currentUser} = this.props;
      console.log(currentUser)
    return(
        <View>
            <Text>Main</Text>
        </View>
    );
  }
}

const mapStateToProps = (state)=>({ 
    currentUser: state.userState.currentUser,
})


const mapDispatchToProps = dispatch => bindActionCreators({fetchUser},dispatch);

export default connect(mapStateToProps,mapDispatchToProps)(Main);
