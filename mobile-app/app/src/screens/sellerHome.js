import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Dimensions, Image, Text, View, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import NewPost from "./components/newPost";
import { db, storage } from '../firebase/config';
import axios from 'axios';
import { baseUrl } from '../../App';
import { useIsFocused } from "@react-navigation/native";
import {DeviceEventEmitter} from "react-native";

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
export default function SellerHome({route}) {
    const navigation = useNavigation();
    const {email} = route.params;
    const isFocused = useIsFocused();
    const {userId} = route.params;
    const [footerHeight, setFooterHeight] = React.useState('10%');
    const [newPost, setNewPost] = React.useState(null);
    const [didDelete, setDidDelete] = React.useState(null);

    const postings = useState([{"postId":123153, "brand":"BMW", "model":"7 Series","img":"https://upload.wikimedia.org/wikipedia/commons/9/93/2019_BMW_740Li_Automatic_facelift_3.0.jpg", "askingPrice":15000},
			       {"postId":589410,"brand":"Porsche","model":"911 Turbo S","img":"https://cdn.motor1.com/images/mgl/VmVwy/s3/porsche-911-turbo-s.jpg", "askingPrice":45000},
			       {"postId":632189,"brand":"Chevrolet","model":"Camaro","img":"https://upload.wikimedia.org/wikipedia/commons/5/5e/2019_Chevrolet_Camaro_2SS_6.2L_front_3.16.19.jpg", "askingPrice":18000},
			       {"postId":299834,"brand":"Jeep","model":"Wrangler","img":"https://upload.wikimedia.org/wikipedia/commons/b/b9/2018_Jeep_Wrangler_Sahara_Unlimited_Multijet_2.1_Front.jpg", "askingPrice":12000}]);

    const [postData, setPostData] = React.useState(null);
    
    // Updated the seller posts when a post is deleted
    DeviceEventEmitter.addListener("event.testEvent", (eventData) => 
    axios.get(baseUrl+`/getSellerPosts/`+userId)
		  .then(res => {
			let postData = res.data;
			setPostData(postData);
            //alert(typeof(postData));
		  }).catch((error)=>{
			alert(error);
		  }));
    // when the page is loaded in, retrieve the seller posts from the backend
    useEffect(() => {
        async function fetchData() {axios.get(baseUrl+`/getSellerPosts/`+userId)
		  .then(res => {
			let postData = res.data;
			setPostData(postData);
            //alert(typeof(postData));
		  }).catch((error)=>{
			alert(error);
		  })}
          fetchData();
    }, [useIsFocused]);
    
    // map each item in the array to show the post's data
    // if you click on it, it will take you to the edit post
    const showPostings = (arr) => {
        return arr.map((data)=>{
            return(
	    <View style = {styles.posting} key={data.postId}>
		<TouchableOpacity onPress = {()=>navigation.navigate('EditPost',{postId:data.postId, email:email, userId:userId, carData:data, updatePage:setDidDelete()})}>
		    <View style = {styles.horizontal}>
			{data.images!=null && <Image source={ {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+data.images[0].replace(RegExp('/','g'),"%2F")+"?alt=media"} } style={styles.imgStyle}></Image>}
			<View style = {{ flex:4,alignItems: 'center',  flexDirection:'row'}}>
			    <Text style = {{color: "black", fontSize: 15, fontWeight: "800", padding: 10}}> {data.brand.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} {data.model.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}</Text>
			</View>
			<Text style = {{flex:2, color: "black", fontSize: 14, fontWeight: "800", padding: 10}}>{'\u00A3'} {data.askingPrice}</Text>
		    </View>
		    
		</TouchableOpacity>
	    </View>
	)});
        }
    const footerStyle = ()=> {
	return {
	    width:'100%',
        height:footerHeight,
        position:'absolute',
        bottom:0,
        backgroundColor:"#FFF",
        paddingHorizontal:'10%',
        justifyContent:'space-evenly'
	}
    }
    const backButton = () => {
	if(!newPost){
	    navigation.navigate('SellerHome', {email:email, userId:userId});
	}
	else {
	    togglePressed();
	}
    }
    const togglePressed = () => {
	setNewPost(!newPost);
	if(!newPost){
	    setFooterHeight('0%');
	} else {
	    setFooterHeight('10%');
	}
    }
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
		<View style={{flexDirection:'row', alignSelf:'flex-end', marginTop:10}}>
		    {newPost && <View style = {{marginTop:'5%'}}>
			<TouchableOpacity onPress={()=>togglePressed()}><Icon name="chevron-left" type="entypo" color="#0095ff" size={35}></Icon></TouchableOpacity>
				</View>}
		    <View style={{paddingHorizontal:'7%',paddingVertical:'2.5%', borderRadius:10}}>
			<Text style={{textAlign:'center', fontFamily:'sans-serif-thin', color:'#292c2e',  fontSize:32, fontWeight:'bold'}}>bumpr</Text>
		    </View>
                        <View style={{backgroundColor:'#b3bdc4', paddingHorizontal:'5%',paddingVertical:'2.5%', borderRadius:10}}>
                            <TouchableOpacity onPress={()=>navigation.navigate('Splash')}>
                                <Text style={{textAlign:'center', color:'#292c2e',  fontSize:28, fontWeight:'bold'}}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                </View>
		<View style = {{alignItems:'center'}}>
		    {newPost && <NewPost navigation={navigation} userId={userId} email={email} togglePressed={togglePressed}/>}
		</View>
	    <SafeAreaView style = {{flex: 1, paddingBottom:'25%'}}>
		<ScrollView style = {{overflow:'hidden'}}>
		    {postData!=null && showPostings(postData)
            }
		</ScrollView>
	    </SafeAreaView>
		{!newPost && 
		<View opacity={.8} style={{ position: "absolute", top: '85%', left: SCREEN_WIDTH*.8}}>
		    <TouchableOpacity  onPress={()=>togglePressed()}>
		    <Icon name="circle-with-plus" type="entypo" color="#1a64c4" size = {65}></Icon></TouchableOpacity>
		</View>
		}
        </View>
            <View style={footerStyle()}>
            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
		<View>
		    <Icon name="calendar" type="entypo" color="#0553B9"></Icon>
                     <Text style={styles.label}>My Cars</Text>
               </View>
                <TouchableOpacity  onPress={()=>navigation.navigate('SellerMessages', {email:email, userId: userId})}>
		    <View>
			<Icon name="chat" type="entypo" color="#A6A9B4"></Icon>
			<Text style={styles.labelInactive}>Messages</Text>
                    </View>
		</TouchableOpacity>
                <TouchableOpacity  onPress={()=>navigation.navigate('SellerSettings', {email:email, userId: userId})}>
		    <View>
			<Icon name="cog" type="entypo" color="#A6A9B4"></Icon>
			<Text style={styles.labelInactive}>Settings</Text>
                    </View>
		</TouchableOpacity>
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
        flexWrap: 'wrap'
    },
    imgStyle: {
	flex:2,
        height:50,
        width:'30%',
	borderRadius:20,
        resizeMode:'cover',
        alignSelf:'center',
    },
    container: {
        flex:1,
        height: '100%',
        position: 'relative',
        paddingHorizontal:'7.5%',
        paddingTop:'7.5%',
	// 121212 for darkmode
        backgroundColor:"#EDF2F6"
    },
    horizontal: {
        flexDirection:'row',
        display:'flex',
    },
    posting: {
        backgroundColor:"#FFF",
        borderRadius:15,
        paddingHorizontal:'2.5%',
        paddingVertical:'5%',
        alignContent:'center',
        marginHorizontal:10,
        marginVertical:10
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
    }
});

function scaleFont(text){
    if(text.length>12){
	return (12/text.length)*23;
    }
    return 23;
}
