import React ,{useState} from 'react';
import {View,Text, TextInput,FlatList,StyleSheet,TouchableOpacity} from 'react-native';

import {collection,query,where,onSnapshot} from 'firebase/firestore'
import {auth,db} from '../../../Firebase'; 
const Search=(props)=>{
    const [users,setUsers]=useState([]);
    const [search,setSearch]=useState('');

    const fetchUsers=(search)=>{
        const q = query(collection(db,"user"),where("userName",">=",search));
        onSnapshot(q, (querySnapshot) => {
            const people = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                people.push(data);  
            })
            setUsers(people);
        })
    }
    return(
        <View>
            <TextInput
                style={styles.input}
                onChangeText={search=>fetchUsers(search)}
                placeholder="Search"
            />
            <FlatList 
                numColumns={1}
                data={users}
                renderItem={({item})=>(
                    <TouchableOpacity
                        onPress={()=>props.navigation.navigate('Profile',{email:item.userEmail})}
                    >
                        <Text>{item.userName}</Text>
                    </TouchableOpacity>
                )}
                horizontal={false}
            />
        </View>
    )
}

export default Search;

const styles= StyleSheet.create({
    input:{
        borderWidth:1,
        borderColor:'grey',
        padding:10,
        margin:10,
        borderRadius:5,
        backgroundColor:'white'
    }
})