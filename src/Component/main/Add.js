import React,{useState,useEffect} from 'react';
import { View,Text,StyleSheet,TouchableOpacity ,Button,Image, ScrollView} from 'react-native'
import { Camera } from 'expo-camera';

export default function Add(){
    const [hasPermission,setHasPermission] = useState(null);
    const [type,setType] = useState(Camera.Constants.Type.back);
    const [camera,setCamera] = useState(null);
    const [image,setImage] = useState(null);

    useEffect(()=>{
      (async ()=>{
        const {status} = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    },[])
    if (hasPermission === null) {
      return <View />;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }

    //ref gives that this function or component is available to work
    return(
      <ScrollView style={styles.container}>
          <View style={styles.fixedRatio}>
            
            <Camera style={styles.camera} type={type} ratio={'1:1'} ref={ref=>setCamera(ref)}/>
          </View>
            <Button
              title="Flip Camera"
              onPress={()=>{
                setType(
                  type === Camera.Constants.Type.back
                  ?Camera.Constants.Type.front
                  :Camera.Constants.Type.back
                )
              }}
            >
            </Button>
            <Button
              title="Take Picture"
              onPress={async ()=>{
                //checking if the camera exists or not
                if(camera){
                  const data = await camera.takePictureAsync(null);  
                  setImage(data.uri);
                }
              }}
            />
            {image && <Image source={{uri:image}} style={{height:200,width:200}}/>}
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex:1,
    aspectRatio:1,
  },
  fixedRatio: {
    flex: 1,
    flexDirection:'row'
  },
});