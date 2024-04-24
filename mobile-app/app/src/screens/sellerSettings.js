import React, { useEffect, useState } from 'react';
import { Switch, FlatList, StyleSheet, Text, View, Image,  Dimensions, Button, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line } from 'react-native-svg';
import { Icon, SearchBar } from 'react-native-elements'
import { TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import Select from "./components/select";
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
import axios from 'axios';
import { baseUrl } from '../../App';
import {DeviceEventEmitter} from "react-native";

export default function BuyerSettings({route}) {
    const navigation = useNavigation();
    const {email} = route.params;
    const {userId} = route.params;
    /* user's Preferences, which will be retrieved from a server request
       given the user's email from the router*/
    const [userPreferences, setUserPreferences] = useState({"locationRadius":45,"miles":true,"accountType":1});
    const [settings, setSettings] = useState();
    const [location, setLocation] = useState(userPreferences.locationRadius);

    // depending on the account type of the user, display accordingly
    const showAccountType = () => {
	if(userPreferences.accountType==1){
	    return(<Text style={styles.centerText}>Basic</Text>);
	} else {
	    return(<Text style={styles.centerText}>Premium</Text>);
	}
    };

    // will update the user's preferences on the backend
    const saveValues = () =>
    {
        let data = {
            'locationRadius': location,
            'miles': 1
        }
        axios.get(baseUrl+`/updateSettings/`+userId+'/'+JSON.stringify(data))
        .then(res => {
            alert("Succesfully updated settings");
            // Once the settings are updated let the interested buyers know, so 
            // they can refresh who the buyers are
            DeviceEventEmitter.emit("event.ibUpdate", {data:null});
        }).catch((error)=>{
        alert(error);
        });
    }
    // When the page is loaded, retrieve the settings from the backend
    useEffect(() => {
        axios.get(baseUrl+`/getSettings/`+userId)
            .then(res => {
            let settingsData = res.data;
            // Works but makes the bar look a bit scuffed
            setLocation(settingsData["locationRadius"]);
            
            setSettings(settingsData);
            }).catch((error)=>{
            alert(error);
            })
    }, []);
    
    const viewLocation = () => {
	if(location>200){
	    return(
		<Text style={styles.centerText}> 200+ miles </Text>
	    );
	} else {
	    return(
		<Text style={styles.centerText}>{location.toFixed(0)} miles</Text>
	    );
	}
    };
    
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
		<View style={{flexDirection:'row', display:'flex', alignSelf:'flex-end'}}>
		    <View style={{paddingHorizontal:'7%',paddingVertical:'2.5%', borderRadius:10}}>
			<Text style={{textAlign:'center', fontFamily:'sans-serif-thin', color:'#292c2e',  fontSize:32, fontWeight:'bold'}}>bumpr</Text>
		    </View>
                        <View style={{backgroundColor:'#b3bdc4', paddingHorizontal:'5%',paddingVertical:'2.5%', borderRadius:10}}>
                            <TouchableOpacity onPress={()=>navigation.navigate('Splash')}>
                                <Text style={{textAlign:'center', color:'#292c2e',  fontSize:28, fontWeight:'bold'}}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                </View>
		
                <View>
		    <ScrollView>
			<View style = {styles.colStyle}>
			    <View style = {{flexDirection:'row', marginVertical:'5%'}}>
				<View style = {{flex:1}}>
				    <Text style={styles.descriptionText}> Location Radius : </Text>
				</View>
				{viewLocation()}
			    </View>
			    <View>
				<Slider
				    style={{width: SCREEN_WIDTH*.9, height: 40}}
				    minimumValue={1}
				    maximumValue={220}
				    minimumTrackTintColor="#34c0eb"
				    maximumTrackTintColor="#000000"
				    thumbTintColor="#0095ff"
				    value = {userPreferences.locationRadius}
				    onValueChange={value => setLocation(value)}
				/>
			    </View>
			    <View style = {{flexDirection:'row'}}>
				<View style = {{flex:1}}>
				    <Text style={styles.descriptionText}>Account Type: </Text>
				</View>
				{showAccountType()}
			    </View>
                <View style = {{flexDirection: 'row'}}>
			    <View style={{backgroundColor:'#0095ff', marginTop:'15%', width:'45%', paddingVertical:'5%', borderRadius:20}}><TouchableOpacity><Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Upgrade Account</Text></TouchableOpacity></View>
                <View style = {{flex:1}}></View>
                <View style={{backgroundColor:'#0095ff', marginTop:'15%', width:'45%', alignSelf:'flex-end', paddingVertical:'5%', borderRadius:20}}><TouchableOpacity onPress={saveValues}><Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Save Values</Text></TouchableOpacity></View>
                </View>
			</View>
			<View style = {{flexDirection:'row'}}>
			    <View style={{backgroundColor:'#757876', marginTop:'15%', width:'45%', paddingVertical:'5%', borderRadius:20}}><TouchableOpacity><Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Contact Support</Text></TouchableOpacity></View>
			    <View style={{flex:1}}/>
			    <View style={{backgroundColor:'#fc0b03', marginTop:'15%', width:'45%', alignSelf:'flex-end', paddingVertical:'5%', borderRadius:20}}><TouchableOpacity><Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Delete Account</Text></TouchableOpacity></View>
			    </View>
		    </ScrollView>
                    <View style = {{ marginTop:'20%'}}>
                        <View style={styles.horizontal}>
                        </View>
                    </View>
                </View>
        </View>
         <View style={styles.footer}>
                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('SellerHome',{email:email, userId: userId})}><View>
                    <Icon name="calendar" type="entypo" color="#A6A9B4"></Icon>
                    <Text style={styles.labelInactive}>My Cars</Text>
                    </View></TouchableOpacity>
                    <TouchableOpacity  onPress={()=>navigation.navigate('SellerMessages',{email:email, userId: userId})}><View>
                    <Icon name="chat" type="entypo" color="#A6A9B4"></Icon>
                     <Text style={styles.labelInactive}>Messages</Text>
                    </View></TouchableOpacity>
                    <View>
                    <Icon name="cog" type="entypo" color="#0553B9"></Icon>
                    <Text style={styles.label}>Settings</Text>
                    </View>
                </View>
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
    rowStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop:'10%',
        alignItems: 'flex-start' // if you want to fill rows left to right
      },
      colStyle: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
      },
    container: {
        flex:1,
        height: '100%',
        position: 'relative',
        paddingHorizontal:'7.5%',
        paddingTop:'7.5%',
        backgroundColor:"#EDF2F6"
    },
    title: {
        fontFamily:'Roboto',
        color:"#0095ff",
        fontWeight:'bold',
        fontSize:25,
        textAlign:'left',
        flexWrap:'wrap',
    },
    descriptionText: {
        fontFamily:'Roboto',
        color:"#2a2b2e",
        fontWeight:'bold',
        fontSize:23,
        textAlign:'left',
        flexWrap:'wrap',
    },
    centerText: {
        fontFamily:'Roboto',
        color:"#a7aab5",
        fontWeight:'bold',
        fontSize:23,
        flexWrap:'wrap',
    },
    tlogo: {
        fontFamily:'Roboto',
        color:"#0553B9",
        fontWeight:'bold',
        fontSize:25,
        textAlign:'left',
        marginLeft:'5%',
        letterSpacing:-7
    },
    largerTitle: {
        fontFamily:'Roboto',
        color:"#0095ff",
        fontWeight:'bold',
        fontSize:28,
        textAlign:'left',
        flexWrap:'wrap',
	textDecorationLine:'underline'
    },
    subtitle: {
        fontFamily:'Roboto',
        color:"#0095ff",
        fontWeight:'bold',
        fontSize:16,
        textAlign:'left',
    },
    horizontal: {
        flexDirection:'row',
        display:'flex',
    },
    avatar: {
        height:50,
        width:50,
        resizeMode:'cover',
        position:'absolute',
        right:0,
        borderRadius:20
    },
    create: {
        backgroundColor:'#FFF',
        borderRadius:20,
        paddingLeft:'5%',
        paddingRight:'10%',
        paddingVertical:'5%',
        marginRight:'2.5%',
        marginVertical:'5%',
        width:'50%',
    },
    createlabel: {
        fontFamily:'Roboto',
        color:"#0553B9",
        fontWeight:'bold',
        fontSize:20,
        textAlign:'left',
        flexWrap:'wrap',
        marginLeft:'7.5%',
        textAlignVertical:'bottom',
    },
    footer:{
        width:'100%',
        height:'10%',
        position:'absolute',
        bottom:0,
        backgroundColor:"#FFF",
        paddingHorizontal:'10%',
        paddingVertical:'5%',
        justifyContent:'space-evenly'
    },
    label: {
        fontFamily:'Roboto',
        color:"#0553B9",
        fontWeight:'bold',
        fontSize:12,
        textAlign:'center',
        flexWrap:'wrap',
    },
    labelInactive: {
        fontFamily:'Roboto',
        color:"#A6A9B4",
        fontWeight:'bold',
        fontSize:12,
        textAlign:'center',
        flexWrap:'wrap',
    },
    categoriesStyle: {
        backgroundColor:"#FFF",
        borderRadius:15,
        paddingHorizontal:'5%',
        paddingVertical:'5%',
        alignContent:'center',
        width:125,
        height:150,
        marginHorizontal:10,
        marginVertical:10,
    },
    logo: {
        height:50,
        width:50,
        resizeMode:'cover',
        alignSelf:'center',
    },
    categoryLabel: {
        fontFamily:'Roboto',
        color:"#A6A9B4",
        fontWeight:'bold',
        fontSize:16,
        textAlign:'center',
    },
    coinAmount: {
        fontFamily:'Roboto',
        color:"#04408D",
        fontWeight:'bold',
        fontSize:22,
        textAlign:'center',
    },
    jobViews: {
        backgroundColor:"#FFF",
        borderRadius:15,
        paddingHorizontal:'5%',
        paddingVertical:'5%',
        alignContent:'center',
        width:'90%',
        marginHorizontal:10,
        marginVertical:10,
    },
    jobTitle: {
        fontFamily:'Roboto',
        color:"#0553B9",
        fontWeight:'bold',
        fontSize:18,
        textAlign:'left',
        flexWrap:'wrap',
        marginLeft:'5%'
    },
    location: {
        fontFamily:'Roboto',
        color:"#A6A9B4",
        fontWeight:'bold',
        fontSize:15,
        textAlign:'left',
        flexWrap:'wrap',
        marginLeft:'5%',
        width:'70%'
    },

});
