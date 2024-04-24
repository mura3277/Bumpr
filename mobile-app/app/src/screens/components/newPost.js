import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Button, Dimensions, Image, TouchableOpacity, SafeAreaView, ScrollView, TextInput, TextArea} from 'react-native';
import PropTypes from 'prop-types';
import Select from "./select";
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from '../../firebase/config';
/*
    Useful links:
    https://aboutreact.com/file-uploading-in-react-native/
    https://www.waldo.com/blog/add-an-image-picker-react-native-app
    https://medium.com/google-cloud/upload-images-to-google-cloud-storage-with-react-native-and-expressjs-61b8874abc49
*/

// Get the Dimensions of the phone
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
// Get the posts and interested buyers collections from firebase
const postsRef = db.collection('posts');
const interestedRef = db.collection('interestedBuyers');

export default class NewPost extends React.Component {
    constructor(){
	super();
    // all the variables needed for a post are 
    // stored in the state
	this.state = {
	    inputBrand:"",
	    brand:"",
	    model:"",
	    askingPrice:"",
	    Desc:"",
	    show:false,
	    selectedFeatures: [],
	    images: [],
        imagesStorage: []
	}
    //this.props.
	this.handleFeatureChange = this.handleFeatureChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
    
    }

    handleFeatureChange(argument) {
	this.setState({selectedFeatures: argument});
    }

    handleSubmit(event) {
	event.preventDefault();
    }

    render(){
	return(
	    <View style = {{height:SCREEN_HEIGHT, width:SCREEN_WIDTH}}>
		<SafeAreaView style = {{backgroundColor:"#FFF", height:'80%', width:'95%',marginHorizontal:'2.5%',borderRadius:20}}>
		    <ScrollView>
			
			<View style = {{flexDirection:'row'}}>
			    <Text style = {{flex:1,  color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Brand: </Text> 
			    <TextInput style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}}type = "text" placeholder="What's the brand?"  value={this.state.brand} onChangeText={(text) => {this.setState({ brand: text})}}/>
			</View>
			<View style = {{flexDirection:'row'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Model: </Text> 
			    <TextInput style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}}type = "text" placeholder="What's the model?"  value={this.state.model} onChangeText={(text) => {this.setState({ model: text})}}/>
			</View>
			<View style = {{flexDirection:'row'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Asking Price: </Text>
			    <TextInput style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}} keyboardType='numeric' placeholder="How much do you want for it?"  multiline value={this.state.askingPrice} onChangeText={(num) => {this.setState({ askingPrice: num})}}/>
			</View>
			<View style = {{flexDirection:'column'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Description: </Text>
			    <TextInput multiline  style={{flex:2, color: "black", fontSize: 18, fontWeight: "800", padding: 10}} type="text" placeholder="Write about your car (optional)"  value={this.state.Desc} onChangeText={(text) => {this.setState({ Desc: text})}}/>
			</View>
			<View style = {{flexDirection:'column'}}>
			    <Text style = {{flex:1, color: "black", fontSize: 24, fontWeight: "800", padding: 10}}>Images: </Text>
			</View>
			<View style = {{alignItems:'flex-start'}}>
			    <View style = {{flexDirection:'row'}}>
				{this.state.images.length>0  && this.state.images.map((uri,idx) => (
				    idx<3 ?
					<Image key={idx} style = {{
						   height:SCREEN_HEIGHT*.15,
						   width:'30%',
						   borderRadius:20,
						   resizeMode:'cover',}} source = {{uri}}
					/>
				    : null
				))}
			    </View>
			    <View style = {{flexDirection:'row'}}>
				{this.state.images.length>3  && this.state.images.map((uri,idx) => (
				    idx>=3 ? 
					<Image key = {idx} style = {{
						   height:SCREEN_HEIGHT*.15,
						   width:'30%',
						   borderRadius:20,
						   resizeMode:'cover',}} source = {{uri}}/>
				    : null
				))}
			    </View>
			    {this.state.images.length<6 && 
			     <TouchableOpacity
				 activeOpacity={0.5}
				 onPress={async ()=>{ let _image =  await ImagePicker.launchImageLibraryAsync({
				     mediaTypes: ImagePicker.MediaTypeOptions.Images,
				     quality: 1});
						      if(!_image.cancelled){
                                  // create a unique name for the picture
                                  let location = this.props.userId + '-' + Date.now()+'.jpg';
                                  let reference = storage.ref('/images/'+location);
                                  // Convert the image to bytes
                                  let img = await fetch(_image.uri);
                                  const bytes = await img.blob();

                                  let task = reference.put(bytes);
                                  task.then(()=>{
                                      // verifies the image
                                      axios.get(baseUrl+`/verifyImage/`+location)
                                      .then(res => {
                                          if(res.data=="True"){
                                              // assuming the image gets verified push it back to be rendered
                                              carData.images.push('images/userUploaded/'+location);
                                              setImages(carData.images);
                                              this.state.images.push('images/userUploaded/'+location);
                                              this.state.imagesStorage.push(location);
                                              this.setState({images:this.state.images});    
                                              this.setState({imagesStorage: this.state.imagesStorage});    
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
			    <Select selectedItems={this.state.selectedFeatures} updateParent = {this.handleFeatureChange} />
			</View>
			
		    </ScrollView>
		</SafeAreaView>
		<View style={{marginLeft:'67.5%',backgroundColor:'#1a64c4', marginTop:5, paddingVertical:'2.5%', width:'30%', borderRadius:30}}>
                    <TouchableOpacity onPress={()=> {
                        // the data dictionary that needs to be added
                        // the backend will have a problem if an apostrophe is sent, hence regex 
                        // replacing all ' with RUFUSAPOSTROPHE 
                       const data = {
                            sellerId: this.props.userId,
                            brand: this.state.brand.replace(RegExp('\'','g'),"RUFUSAPOSTROPHE"),
                            model: this.state.model.replace(RegExp('\'','g'),"RUFUSAPOSTROPHE"),
                            askingPrice: this.state.askingPrice,
                            desc: this.state.Desc.replace(RegExp('\'','g'),"RUFUSAPOSTROPHE"),
                            selectedFeatures: this.state.selectedFeatures,
                            images: this.state.imagesStorage
                        };
                        postsRef
                            .add(data)
                            .then(_doc => {
                                var interestedBuyersPostRef = interestedRef.doc(_doc.id);
                                // create an interested Buyers value for the new post
                                interestedBuyersPostRef.set({"users":[]}).then(()=>{this.props.togglePressed();});
                            })
                            .catch((error) => {
                                alert(error)
                            });

                    }}>
                                <Text style={{textAlign:'center', color:'#FFF',  fontSize:28, fontWeight:'bold'}}>Post</Text>
                            </TouchableOpacity>
		</View>
	    </View>
	);
    }
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
