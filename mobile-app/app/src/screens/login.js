import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { firebase } from '../firebase/config'




export default function Login({route}) {
    const navigation = useNavigation();
    
    const {type} = route.params;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // uses firebase authentication to login
    // and navigate to the correct home
    const Login = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const usersRef = firebase.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data()
			if(user.isBuyer){
			    navigation.navigate('BuyerHome',{email:email, userId:uid});
			} else {
			    navigation.navigate('SellerHome',{email:email, userId:uid});
			}
                    })
                    .catch(error => {
                        alert(error)
                    });
            })
            .catch(error => {
                alert(error)
            })
    }
    
    const loggedIn = () => {
        if(type=='Seller'){navigation.navigate('SellerHome',{email:email})} else {navigation.navigate('BuyerHome',{email:email})}
    }
   
    return (
        <View style={styles.container}>
            <View style={{ marginTop: '15%'}}>
            <View style={{flexDirection:'row', display:'flex', marginHorizontal:'10%'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('Register',{type:type})}><Icon name="chevron-left" type="entypo" color="#0095ff" size={35}></Icon></TouchableOpacity>
              </View>
              <View style={{position:'relative', marginLeft:'10%', marginTop:'20%'}}>
                <Text style={{ fontSize:30, color:'#292c2e', fontWeight:'bold'}}>Sign In</Text>
                <TextInput value={email} onChangeText={setEmail} style={{backgroundColor:'#FFF',fontWeight:'bold', borderRadius:10, width:'90%', height:50, marginTop:'5%', paddingLeft:'5%'}} placeholder="Email address" placeholderTextColor="#0553B9"></TextInput>
                <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{backgroundColor:"#FFF", fontWeight:'bold',borderRadius:10, width:'90%', height:50, marginTop:'5%', paddingLeft:'5%'}} placeholder="Password" placeholderTextColor="#0553B9"></TextInput>
              </View>
              <View style={{backgroundColor:'#0095ff', marginTop:'15%', width:'60%', alignSelf:'center', paddingVertical:'5%', borderRadius:20}}>
                <TouchableOpacity onPress={()=> Login()}><Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Sign In</Text></TouchableOpacity>
              </View>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        position: 'relative',
        backgroundColor: '#EDF2F6'
    },
    header: {
        height:'34%',
        width:'34%',
        resizeMode:'contain',
        marginLeft:'10%'
    },

});
