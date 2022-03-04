import { Text, View, FlatList, Image, StyleSheet, Button } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { fetchUserPosts } from '../../redux/actions'
import { auth, db } from '../../../Firebase'
import { connect } from 'react-redux'
import {collection,setDoc,deleteDoc,doc} from 'firebase/firestore'
import { bindActionCreators } from 'redux'

function Feed(props) {
  const [posts, setPosts] = useState([]);
  
  console.log(props.feed)
  useEffect(() => {

    if (props.userFollowingLoaded === props.following.length && props.following.length !== 0) {

      props.feed.sort(function (x, y) {
        return y.creation - x.creation
      })

      setPosts(props.feed);
    }

    
    

  }, [props.userFollowingLoaded, props.feed ]);

  const unLikeButton = (uid,postId) => {
    const col = collection(db, "posts");
    const a = doc(col, uid);
    const c = collection(a, "userPosts");
    const d = doc(c, postId);
    const e = collection(d, "likes");
    const f = doc(e, auth.currentUser.uid);
    deleteDoc(f, {})
  }

  const LikeButton = (uid,postId) => {
    const col = collection(db, "posts");
    const a = doc(col, uid);
    const c = collection(a, "userPosts");
    const d = doc(c, postId);
    const e = collection(d, "likes");
    const f = doc(e, auth.currentUser.uid);
    setDoc(f, {})
  }


  return (
    <View>
      <FlatList
        data={posts}
        numColumns={1}
        horizontal={false}
        ListFooterComponent={() => <View style={{ height: 30 }} />}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.userName}>{item.user.userName}</Text>
            <Image
              source={{ uri: item.downloadURL }}
              style={styles.image}
            />
            <View style={styles.captionContainer}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, }}>{item.user.userName}   </Text>
              <Text>{item.caption}</Text>
            </View>
            <Text>{item.likesCount}</Text>
            {
              item.currentUserLike ? <Button
                title="Unlike"
                onPress={() => unLikeButton(item.user.uid,item.id)}
              /> : <Button
                title="Like"
                onPress={() => LikeButton(item.user.uid,item.id)}
              />
            }
            <Text
              onPress={() => props.navigation.navigate('comment', {
                postId: item.id,
                uid: item.user.uid
              })}
            >View comments...</Text>

          </View>
        )}
      />
      <View style={{ height: 100 }} />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    aspectRatio: 1 / 1
  },
  captionContainer: {
    flexDirection: 'row',
    margin: 10
  },
  userName: {
    margin: 10,
    fontSize: 15,
    fontWeight: 'bold'
  }
})

const mapStateToProps = (state) => ({
  currentUser: state.userState.currentUser,
  posts: state.userState.posts,
  following: state.userState.following,
  feed: state.usersState.feed,
  userFollowingLoaded: state.usersState.userFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);