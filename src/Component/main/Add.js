import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Image, ScrollView, Platform } from 'react-native'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'

export default function Add({navigation}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, [])
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to the camera or gallery</Text>;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library

    var result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    if(!result.cancelled){
      setImage(result.uri);
    }

  }

  //ref gives that this function or component is available to work
  return (
    <ScrollView style={styles.container}>
       <View style={styles.fixedRatio}>
        <Camera style={styles.camera} type={type}  ref={ref => setCamera(ref)} />
      </View>
      
      <Button
        title="Flip Camera"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          )
        }}
      >
      </Button>
      <Button
        title="Take Picture"
        onPress={async () => {
          //checking if the camera exists or not
          if (camera) {
            const data = await camera.takePictureAsync(null);
            setImage(data.uri);
          }
        }}
      />
      <Button title="Pick from gallery" onPress={() => pickImage()} />
      
      {image && <Image source={{ uri: image }} style={{ height: 200, width: 200 }} />}
      
      <Button title="Save" onPress={() => navigation.navigate('Save',{image}) } />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    aspectRatio: 1/1,
  },
  fixedRatio: {
    flex: 1,
    flexDirection: 'row'
  },
});