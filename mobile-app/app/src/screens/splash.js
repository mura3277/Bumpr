import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Button, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line } from 'react-native-svg';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';







export default function Splash() {
    const navigation = useNavigation();
    // Landing page for when you open the app
    // allows navigation to the login choice
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
            
           
       
           <View style={{marginTop:'50%'}}></View>
           <Image style={styles.logo} source={require('../assets/bumpr.png')}/>
            <TouchableOpacity onPress={()=>{navigation.navigate('LoginChoice');}}>
                <View style={styles.btn}>
                    <Text style={{color:"#FFF", fontWeight:'bold', textAlign:'center'}}>Continue</Text>
                </View>
            </TouchableOpacity>
               
        </View>
  
        </View>
    );

}

const styles = StyleSheet.create({
    contain: {
        flex:1,
        height: '100%',
        position: 'relative',
        backgroundColor:"#EDF2F6"
    },
    container: {
        flex:1,
        height: '100%',
        position: 'relative',
        paddingHorizontal:'7.5%',
        paddingTop:'7.5%',
        backgroundColor:"#EDF2F6"
    },
    logo: {
        height:'50%',
        width:'100%',
        alignSelf:'center',
    },
    btn: {
        backgroundColor:"#0095ff",
        paddingHorizontal:'5%',
        paddingVertical:'5%',
        borderRadius:15,
        marginTop:'5%'
    }

});