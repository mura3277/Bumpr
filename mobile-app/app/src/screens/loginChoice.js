import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Button, ImageBackground, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line, Circle } from 'react-native-svg';
import { Icon } from 'react-native-elements'
import { useFonts } from 'expo-font';





export default function LoginChoice() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   
      
    
   
    return (
        <View style={styles.container}>
            <View style={{ marginTop: '15%',}}>
            <View style={{flexDirection:'row', display:'flex', marginHorizontal:'10%'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('Splash')}><Icon name="chevron-left" type="entypo" color="#0095ff" size={35}></Icon></TouchableOpacity>
              </View>
              <View style={{position:'relative', marginTop:'20%'}}>
                <Text style={{ fontSize:30, color:'#0095ff', textAlign:'center', fontWeight:'bold'}}>Are you a</Text>
                <TouchableOpacity onPress={()=>navigation.navigate('Register', {type:'Seller'})}>
                    <View style={{backgroundColor:'#0095ff', marginTop:'15%', width:'80%', alignSelf:'center', paddingVertical:'5%', borderRadius:20}}>
                        <Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Seller</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('Register', {type:'Buyer'})}>
                    <View style={{backgroundColor:'#0095ff', marginTop:'15%', width:'80%', alignSelf:'center', paddingVertical:'5%', borderRadius:20}}>
                        <Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Buyer</Text>
                    </View>
                </TouchableOpacity>
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