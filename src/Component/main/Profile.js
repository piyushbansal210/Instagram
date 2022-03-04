import { Text, View, Image, FlatList, StyleSheet, Dimensions, Button ,TouchableOpacity} from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { fetchUserPosts } from '../../redux/actions'
import { query, where, collection, doc, getDocs, orderBy, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../../../Firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const windowWidth = Dimensions.get('window').width;

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [following, setFollowing] = useState(false);


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

      const pickPosts = query(collection(doc(collection(db, "posts"), props.route.params.id), "userPosts"), orderBy("creation", "desc"));
      const queryPicker = await getDocs(pickPosts);
      const posts = [];
      queryPicker.forEach((snapshot, index) => {
        const data = snapshot.data();
        data.index = snapshot.id
        posts.push(data);
      });
      console.log(posts)
      setUserPosts(posts)
    }

    if (props.following.indexOf(props.route.params.id) > -1) {
      setFollowing(true)
    } else {
      setFollowing(false)
    }
  }, [props.route.params.email, props.following])


  if (user === null) {
    return <View />
  }

  const onFollow = () => {
    console.log('hi')
    const user = auth.currentUser.uid;
    const ref = collection(db, "following");
    const d = doc(ref, user);
    const col = collection(d, "userFollowing");
    const final = doc(col, props.route.params.id);
    setDoc(final, {})
  }

  const onUnfollow = () => {
    const user = auth.currentUser.uid;
    const ref = collection(db, "following");
    const d = doc(ref, user);
    const col = collection(d, "userFollowing");
    const final = doc(col, props.route.params.id);
    deleteDoc(final, {})
  }

  const onLogOut = () => {
    auth.signOut()
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.userName}</Text>
        <Text>{user.userEmail}</Text>
        {
          props.route.params.email !== auth.currentUser.email ? (
            <View>
              {following ? (
                <TouchableOpacity
                  
                  title="Following"
                  onPress={() => onUnfollow()}>
                  <Text>Following</Text>
                </TouchableOpacity>
              )
                :
                (
                  <TouchableOpacity
                    
                    title="Follow"
                    onPress={() => onFollow()}>
                    <Text>Follow</Text>
                  </TouchableOpacity>

                )}
            </View>
          ) : 
          <Button
                  title="Logout"
                  onPress={() => onLogOut()}
          />
        }
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
  posts: state.userState.posts,
  following: state.userState.following
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