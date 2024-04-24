import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

// Get the phone's size
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default class ViewCar extends React.Component {
    constructor(){
	super();
	// which image to show
	this.state = {
	    imageIdx : 0
	}
    }
	
	// Renders circles at the bottom  of each image to show 
	// which picture of the car is currently being displayed 
    circleRender = () => {
	return this.props.carsInfo["images"].map((url, i) => {
	    if(i<0){
		return null;
	    } else if(i == this.state.imageIdx){
		return(
		    <View
			key = {url}
			style = {{
			    bottom:-SCREEN_HEIGHT/2,
			    left: (SCREEN_WIDTH/(this.props.carsInfo["images"].length+1))+(SCREEN_WIDTH/(this.props.carsInfo["images"].length+1))*i,
			    position:'absolute',
			    width: 25,
			    height: 25,
			    borderRadius: 25 / 2,
			    backgroundColor: "#848a86",
			    borderColor: "black",
			    borderWidth: 2,
			    zIndex: 10003
			}}
		    />
		);
	    } else{
		return(
		    <View
			key = {url}
			style = {{
			    bottom:-SCREEN_HEIGHT/2,
			    left: (SCREEN_WIDTH/(this.props.carsInfo["images"].length+1))+(SCREEN_WIDTH/(this.props.carsInfo["images"].length+1))*i,
			    position:'absolute',
			    width: 25,
			    height: 25,
			    borderRadius: 25 / 2,
			    borderColor: "black",
			    backgroundColor: "white",
			    borderWidth: 2,
			    zIndex: 10003
			}}
		    />
		);
	    }});
    }
    negateIdx = () => {
	if(this.state.imageIdx>0){
	    this.setState({imageIdx:this.state.imageIdx-1});
	}
    }
    incrementIdx(isPositive){
	if(this.state.imageIdx<this.props.carsInfo["images"].length-1){
	    this.setState({imageIdx:this.state.imageIdx+1});
	}
    }
    navRender = () => {

    }
    loadView = () => {
	if(this.props.isClicked){
	    return(
		<View style = {{backgroundColor:"#EDF2F6", height:SCREEN_HEIGHT, zIndex: 1001}}>
		    <TouchableOpacity onPress = {()=>this.negateIdx()} style = {{bottom:SCREEN_HEIGHT/2,
					left:0,
					zIndex:10004,
					width: SCREEN_WIDTH/2,
					height: SCREEN_HEIGHT/2,
					position:'absolute'}}>
		    </TouchableOpacity>
		    <TouchableOpacity onPress = {()=>this.incrementIdx()} style = {{bottom:SCREEN_HEIGHT/2,
					left:SCREEN_WIDTH/2,
					zIndex:10004,
					width: SCREEN_WIDTH/2,
					height: SCREEN_HEIGHT/2,
					position:'absolute'}}>
		</TouchableOpacity>
		    <View>
			{this.circleRender()}
		    </View>
		    <Image
			style = {{
			    height: '50%',
			    width: SCREEN_WIDTH,
			    resizeMode: "cover",
			    borderRadius: 20,
			    borderWidth: 2,
			    borderColor: "black",
			    zIndex:-1
			}}
			source = { {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+this.props.carsInfo["images"][this.state.imageIdx].replace(RegExp('/','g'),"%2F")+"?alt=media"}}
		    />
		    
			<Text style = {{color:"#3b424d",fontWeight:'bold',fontSize:scaleTitleText(this.props.carsInfo["brand"]+" "+this.props.carsInfo["model"]),textAlign:'left',flexWrap:'wrap'}}>
			    {this.props.carsInfo["brand"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} {this.props.carsInfo["model"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}
			</Text>
			<View style={{flexDirection:"row", flexWrap:'wrap'}}>
			    <View style={{flex:2}}>
				<Text style = {{color:"#3b424d",fontWeight:'bold',fontSize:scaleSubheader(this.props.carsInfo.sellingLoc),textAlign:'left'}}>
				    {this.props.carsInfo.sellingLoc.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}
				</Text>
			    </View>
			    <View style={{flex:3, flexDirection:'row'}}>
				<Text style = {{color:"#3b424d",fontWeight:'bold',fontSize:scaleSubheader("Asking Price:$"+ this.props.carsInfo["askingPrice"]),textAlign:'left'}}>
				    Asking Price: 
				</Text>
				<Text style = {{color:"#3b424d",fontWeight:'bold',fontSize:scaleSubheader("Asking Price:$"+ this.props.carsInfo["askingPrice"]),textAlign:'left'}}>
				    {'\u00A3'}{this.props.carsInfo["askingPrice"]}
				</Text>
			    </View>
			    </View>
			    <Text>
				{this.props.carsInfo.desc.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}
			    </Text>
		    <View
			opacity={.8}
			style={{
				position: "absolute",
				top: SCREEN_HEIGHT*.69,
			    left: SCREEN_WIDTH*.8,
			}}
			>
        <TouchableOpacity  onPress={()=>{this.props.toggle();}}>
         <Icon name="arrow-with-circle-down" type="entypo" color="#1a64c4" size = {65}></Icon></TouchableOpacity>
		    </View>
		</View>
	    );
	}
};
    render(){
	return(
	    <View>
		{this.loadView()}
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
