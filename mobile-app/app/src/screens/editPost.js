import React, {useState, useContext, useEffect} from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Button, Dimensions, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, TextArea} from 'react-native';
import PropTypes from 'prop-types';
import Select from "./components/select";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { baseUrl } from '../../App';
import { storage } from '../firebase/config';
import {DeviceEventEmitter} from "react-native";

/*
This is essentially the same as new post, but as a screen rather than 
component  with passed prop values

*/

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function EditPost({route}) {
    const navigation = useNavigation();
    const {email} = route.params;
    const {postId} = route.params;
	const {userId} = route.params;
	const {carData} = route.params;
    const [brand, setBrand] = React.useState(null);
	const [updater, setUpdater] = React.useState(null);
    const [model, setModel] = React.useState(null);
    const [askingPrice, setAskingPrice] = React.useState(null);
    const [desc, setDesc] = React.useState(null);
    const [selectedFeatures, setFeatures] = React.useState(null);
    const [images, setImages] = React.useState(null);
    
    const [values, setValues] = React.useState({"values":[
	{"postId":123153,
	 "brand":"BMW",
	 "model":"7 Series",
	 "askingPrice":"15000",
	 "Desc":"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident",
	 "selectedFeatures": [21, 14, 31],
	 "images": ["https://upload.wikimedia.org/wikipedia/commons/9/93/2019_BMW_740Li_Automatic_facelift_3.0.jpg","https://www.topgear.com/sites/default/files/cars-car/image/2019/04/bmw_750li_xdrive_19.jpg","https://mediapool.bmwgroup.com/cache/P9/201812/P90333060/P90333060-the-new-bmw-7-series-in-painting-bernina-grey-amber-effect-metallic-with-light-alloy-wheel-styling-7-2250px.jpg"]},
	{"postId":589410,
	 "brand":"Porsche",
	 "model":"911 Turbo S",
	 "askingPrice":"45000",
	 "Desc":"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident",
	 "selectedFeatures": [22, 17],
	 "images": ["https://cdn.motor1.com/images/mgl/VmVwy/s3/porsche-911-turbo-s.jpg","https://assets.bwbx.io/images/users/iqjWHBFdfxIU/is8rDPGsGlcg/v1/-1x-1.jpg", "https://www.autocar.co.uk/sites/autocar.co.uk/files/1-porsche-911-2019-rt-hero-front.jpg", "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/porsche-911_0.jpg"]},
	{"postId":632189,
	 "brand":"Chevrolet",
	 "model":"Camaro",
	 "askingPrice":"18000",
	 "Desc":"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident",
	 "selectedFeatures": [32, 19],
	 "images": ["https://upload.wikimedia.org/wikipedia/commons/5/5e/2019_Chevrolet_Camaro_2SS_6.2L_front_3.16.19.jpg","https://cdn.motor1.com/images/mgl/byQ3v/s1/2019-chevrolet-camaro-zl1-1le.jpg"]},
	{"postId":299834,
	 "brand":"Jeep",
	 "model":"Wrangler",
	 "askingPrice":"12000",
	 "Desc":"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident",
	 "selectedFeatures": [22, 32, 17],
	 "images": ["https://upload.wikimedia.org/wikipedia/commons/b/b9/2018_Jeep_Wrangler_Sahara_Unlimited_Multijet_2.1_Front.jpg"]}
	
    ]});

	// sends all the current data to the backend
	const updateValues = () =>
    {
		let imgs = [];
		for(let i = 0; i<carData.images.length; i++){
			imgs.push(carData.images[i].replace(RegExp('/','g'),"FORWARDSLASHRUFUSBEHR"));
		}
		let data = {
			'brand':brand!=null ? brand : carData["brand"],
			'selectedFeatures':{'selectedFeatures':selectedFeatures!=null ? selectedFeatures["selectedItems"] : carData["selectedFeatures"]['selectedFeatures']},
			'askingPrice':askingPrice!=null ? askingPrice : carData["askingPrice"],
			'model': model!=null ? model : carData["model"],
			'images':imgs,
			'desc':carData.desc,
			'postId':postId,
		}
		
        axios.get(baseUrl+`/editPost/`+userId+'/'+postId+'/'+JSON.stringify(data))
        .then(res => {
        }).catch((error)=>{
        alert(error);
        });
		
    }

	// If you delete the post, update the seller's posts
	const deletePost = () => {
		axios.get(baseUrl+`/deletePost/`+userId+'/'+postId)
        .then(res => {
            alert("Succesfully deleted your post");
			DeviceEventEmitter.emit("event.testEvent", {data:null});
			navigation.navigate('SellerHome',{email:email, userId:userId});
        }).catch((error)=>{
        alert(error);
        });
	}


	const renderSelect = () => {
		return (<Select selectedItems={carData["selectedFeatures"]["selectedFeatures"]} updateParent = {setFeatures}/>);
	}
    const renderPage = () => {
	    return(
		<View key = {postId} style = {{height:SCREEN_HEIGHT, width:SCREEN_WIDTH}}>
		<SafeAreaView style = {{backgroundColor:"#FFF", height:'80%', width:'95%',marginHorizontal:'2.5%',borderRadius:20}}>
		    <ScrollView>
			<TouchableOpacity onPress = {()=>navigation.navigate('InterestedBuyers',{email:email, postId:postId, userId:userId})}>
			    <View style = {{backgroundColor:'#a1f3f7',width:'80%',marginVertical:5, marginHorizontal:'10%',borderRadius:20, alignItems:'center',justifyContent:'center', flexDirection:'row'}}>
				<Text style={{textAlign:'center', fontFamily:'sans-serif-thin', color:'#292c2e',  fontSize:27, fontWeight:'bold'}}>See Interested Buyers</Text>
				</View>
		</TouchableOpacity>
			<View style = {{flexDirection:'row'}}>
			    <Text style = {{flex:1,  color: "black", fontSize: 24, fontWeight: "800", padding: 10}}> Brand: </Text> 
			    <TextInput style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}} type = "text" placeholder="Write the brand..."  value={carData.brand.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} onChangeText={(text) => {setBrand(text); carData.brand = text; }}/>
			</View>
			<View style = {{flexDirection:'row'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Model: </Text> 
			    <TextInput style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}}type = "text" placeholder="What's the model?"  value={carData.model.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} onChangeText={(text) => {setModel(text); carData.model = text; }}/>
			</View>
			<View style = {{flexDirection:'row'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Asking Price: </Text>
			    <TextInput style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}} keyboardType='numeric' placeholder="How much do you want for it?"  multiline value={carData.askingPrice} onChangeText={(num) => {setAskingPrice(num); carData.askingPrice = num; }}/>
			</View>
			<View style = {{flexDirection:'column'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Description: </Text>
			    <TextInput multiline  style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}} type="text" placeholder="Write about your car (optional)"  value={carData.desc.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} onChangeText={(text) => {setDesc(text); carData.desc = text; }}/>
			</View>
			<View style = {{flexDirection:'column'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Images: {carData.images.length} </Text>
			</View>
			<View style = {{alignItems:'flex-start'}}>
			    <View style = {{flexDirection:'row'}}>
				{carData.images.length>0  && carData["images"].map((uri,idx) => (
				    idx<3 ?
					<Image key={idx} style = {{
						   height:SCREEN_HEIGHT*.15,
						   width:'30%',
						   borderRadius:20,
						   resizeMode:'cover',}} source = { {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+ uri.replace(RegExp('/','g'),"%2F")+"?alt=media"} }
					/>
				    : null
				))}
			    </View>
			    <View style = {{flexDirection:'row'}}>
				{carData.images.length>3  && carData["images"].map((uri,idx) => (
				    idx>=3 ? 
					<Image key = {idx} style = {{
						   height:SCREEN_HEIGHT*.15,
						   width:'30%',
						   borderRadius:20,
						   resizeMode:'cover',}} source = { {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+ uri.replace(RegExp('/','g'),"%2F")+"?alt=media"} }/>
				    : null
				))}
			    </View>
			    {carData.images.length<6 && 
			     <TouchableOpacity
				 activeOpacity={0.5}
				 onPress={async ()=>{ let _image =  await ImagePicker.launchImageLibraryAsync({
				     mediaTypes: ImagePicker.MediaTypeOptions.Images,
				     quality: 1});
						      if(!_image.cancelled){
								let location = userId + '-' + Date.now()+'.jpg';
                              let reference = storage.ref('/images/userUploaded/'+location);
                              // Convert the image to bytes
                              let img = await fetch(_image.uri);
                              const bytes = await img.blob();

                              let task = reference.put(bytes);
                             task.then(()=>{
								 
                                axios.get(baseUrl+`/verifyImage/`+location)
								.then(res => {
									if(res.data=="True"){
										carData.images.push('images/userUploaded/'+location);
										setImages(carData.images);
										setUpdater(updater);
									} else{
										alert("That image needs to contain more of the car.")
									}
								}).catch((error)=>{
								alert(error);
								});
                             }).catch((e)=>{alert('uploading image error ', e)});
						      }
						    }
					 }
			     >
				 <Icon name="image" type="entypo" color="#1a64c4" style={{paddingHorizontal:'5%'}}size = {65}></Icon>
			     </TouchableOpacity>
			    }
			</View>
			<View>
				{carData.selectedFeatures!=null &&renderSelect()}
			</View>
			
		    </ScrollView>
		</SafeAreaView>
		    <View style = {{flexDirection:'row'}}>
			<View style = {{flex:1}}/>
			
			<View style={{flex:3, backgroundColor:'#fc0303', marginTop:5, paddingVertical:'2.5%', width:'30%', borderRadius:30}}>
				<TouchableOpacity onPress={()=> {deletePost()}}>
                                <Text style={{textAlign:'center', color:'#FFF',  fontSize:28, fontWeight:'bold'}}> Delete </Text>
								</TouchableOpacity>
			</View>
			
			<View style = {{flex:1}}/>
			<View style={{flex:3, backgroundColor:'#1a64c4', marginTop:5, paddingVertical:'2.5%', width:'30%', borderRadius:30}}>
                    <TouchableOpacity onPress={()=> {updateValues()}}>
                                <Text style={{textAlign:'center', color:'#FFF',  fontSize:28, fontWeight:'bold'}}> Update </Text>
                            </TouchableOpacity>
			</View>
			<View style = {{flex:1}}/>
		    </View>
	    </View>
	);
    }
    const footerStyle = ()=> {
	return {
	    width:'100%',
        height:'10%',
        position:'absolute',
        bottom:0,
        backgroundColor:"#FFF",
        paddingHorizontal:'10%',
        justifyContent:'space-evenly'
	}
    }
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
		<View style={{flexDirection:'row', alignSelf:'flex-end', marginTop:10}}>
		    <View style = {{marginTop:'5%'}}>
			<TouchableOpacity onPress={()=>navigation.navigate('SellerHome',{email:email, userId:userId})}><Icon name="chevron-left" type="entypo" color="#0095ff" size={35}></Icon></TouchableOpacity>
		    </View>
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
		    {renderPage()}
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
    container: {
        flex:1,
        height: '100%',
        position: 'relative',
        paddingHorizontal:'7.5%',
        paddingTop:'7.5%',
        backgroundColor:"#EDF2F6"
    },
    horizontal: {
        flexDirection:'row',
        display:'flex',
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

function scaleTitleText(text){
    if(text.length>21){
	return 32*21/(text.length)
    }
    return 32;
    }

function scaleSubheader(text){
    if(text.length>21){
	return 32*21/(text.length)
    }
    return 18;
    }
