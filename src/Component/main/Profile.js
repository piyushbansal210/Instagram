import { Text, View, Image, FlatList, StyleSheet, Dimensions } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { fetchUserPosts } from '../../redux/actions'
import {query,where,collection,doc,getDocs,orderBy, } from 'firebase/firestore'
import { auth, db } from '../../../Firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const windowWidth = Dimensions.get('window').width;

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(async () => {
    const { posts, currentUser } = props

    if (props.route.params.email === auth.currentUser.email) {
      setUser(currentUser)
      setUserPosts(posts)
    }
    else {
      const q = query(collection(db, "user"), where("userEmail", "==", props.route.params.email));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        if (doc.exists) {
          setUser(doc.data())
        }
        else {
          console.log('error')
        }
      })

      const pickPosts = query(collection(doc(collection(db, "posts"), props.route.params.email), "userPosts"), orderBy("creation", "desc"));
      const queryPicker = await getDocs(pickPosts);
      const posts = [];
      queryPicker.forEach((snapshot, index) => {
        const data = snapshot.data();
        data.index = snapshot.id
        posts.push(data);
      });
      setUserPosts(posts)
    }
  },[props.route.params.email])


  if (user === null) {
    return <View />
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.userName}</Text>
        <Text>{user.userEmail}</Text>
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          data={userPosts}
          numColumns={3}
          renderItem={({ item }) => (
            <View >
              <Image source={{ uri: item.downloadURL }} style={styles.image} />
            </View>
          )}
          keyExtractor={item => item.index}
        />

      </View>
    </View>
  )
}

const mapStateToProps = (state) => ({
  currentUser: state.userState.currentUser,
  posts: state.userState.posts
})

const mapDispatchToProps = dispatch => bindActionCreators({ fetchUserPosts }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    width: windowWidth / 3,
    margin: 1
  }
})