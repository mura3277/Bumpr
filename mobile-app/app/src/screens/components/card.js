import React from 'react';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import ViewCar from "./viewCar";
import axios from 'axios';
import { baseUrl } from '../../../App';
import {DeviceEventEmitter} from "react-native";

/* Learned how to do react-native tinder cards from here: https://instamobile.io/react-native-controls/react-native-swipe-cards-tinder/ 
Essentially an Animated and PanResponder from 'react-native' tutorial.

The email of the user will be passed into this Component and then a batch of n (15? max) posts will be retrieved.
Once 15 have been gone through, it will empty and reload the posts array
 
*/
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default class Card extends React.Component {
    constructor(){
	super();
	this.position = new Animated.ValueXY();
	this.state = {
	    currentIdx: 0,
	    pressed: false,
		cars: []
	}
	
	this.rotate = this.position.x.interpolate({
	    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
	    outputRange: ['-10deg', '0deg', '10deg'],
	    extrapolate: 'clamp'
	})
	this.rotateAndTranslate = {
	    transform: [{
		rotate:this.rotate
	    },
			...this.position.getTranslateTransform()
		       ]
	}
	this.nextCardOpacity = this.position.x.interpolate({
	    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
	    outputRange: [1, 0, 1],
	    extrapolate: 'clamp'
	})

	this.nextCardScale = this.position.x.interpolate({
	    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
	    outputRange: [1, 0.8, 1],
	    extrapolate: 'clamp'
	})
    }

	componentDidMount() {
		DeviceEventEmitter.addListener("event.updateEvent", (eventData) => 
		axios.get(baseUrl+`/getBuyerPosts/`+this.props.userId)
		.then(res => {
		  let cars = res.data.data;
		  this.setState({ cars });
		}).catch((error)=>{
		  alert(error);
		}));
		axios.get(baseUrl+`/getBuyerPosts/`+this.props.userId)
		  .then(res => {
			let cars = res.data.data;
			this.setState({ cars });
		  }).catch((error)=>{
			alert(error);
		  });
	  }

    UNSAFE_componentWillMount() {
	this.PanResponder = PanResponder.create({
	    onStartShouldSetPanResponder: (evt, gestureState) => true,
	    onPanResponderMove: (evt, gestureState) => {
		//assign XY value from gestureState
		this.position.setValue({x : gestureState.dx, y:gestureState.dy});
	    },
	    onPanResponderRelease: (evt, gestureState) => {
		// Releasing the card
		// These cards will be loaded in batches of certain number
		// need to implement currentIdx check to see if a new batch of cars is required from the server
		
		
		// Positive - animate the card off-screen and inform the server
		if(gestureState.dx>200){
		    Animated.spring(this.position, {
			toValue: {x:SCREEN_WIDTH+100, y:gestureState.dy},
			useNativeDriver: false
		    }).start(()=>{
			// informs the server, the user does like this post
			axios.get(baseUrl+`/likePost/`+this.props.userId+'/'+this.state.cars[this.state.currentIdx]["postId"])
		  .then(res => {
			// set to next car
			this.setState({currentIdx:this.state.currentIdx+1},()=>{
			    // reset position
			    this.position.setValue({x:0,y:0})
			})
		  }).catch((error)=>{
			alert(error);
		  });
		})   
		} else if(gestureState.dx<-120) {
		    // Left Swipe - uninterested, animate other direction also inform server
		    Animated.spring(this.position,{
			toValue: {x:-SCREEN_WIDTH-100, y:gestureState.dy},
			useNativeDriver: false
		    }).start(()=>{
				// Informs the server the user dislikes this post
			axios.get(baseUrl+`/dislikePost/`+this.props.userId+'/'+this.state.cars[this.state.currentIdx]["postId"])
			.then(res => {
			  // set to next car
			  this.setState({currentIdx:this.state.currentIdx+1},()=>{
				  // reset position
				  this.position.setValue({x:0,y:0})
			  })
			}).catch((error)=>{
			  alert(error);
			});
		    })
		    
		} else {
		    // If not committed in either direction, spring back to the center
		  Animated.spring(this.position,{
		      toValue: {x:0, y:0},
		      useNativeDriver: false
		  }).start() 
		}
		if(this.state.currentIdx==this.state.cars.length-2){
			// If we're running out posts,
			// get more and update the index
			axios.get(baseUrl+`/getBuyerPosts/`+this.props.userId)
			.then(res => {
			let cars = [];
			let newCars = res.data.data;
			for (let index = 0; index < 2; index++) {
				cars.push(this.state.cars[index+this.state.currentIdx]);
			}
			for (let index = 0; index < newCars.length; index++) {
				cars.push(newCars[index]);
			}
			this.setState({ cars:cars, currentIdx:0 });
		  }).catch((error)=>{
			alert(error);
		  });
		}
	    }
	})
    }
    togglePressed = () => {
	this.setState({pressed:!this.state.pressed});
    }
    viewCar = () => {
	return (
	    <ViewCar isClicked ={this.state.pressed} toggle = {this.togglePressed} otherCars = {this.state.cars[0]} carsInfo = {this.state.cars[this.state.currentIdx]} />
	);
    };
    loadCars = () => {
		// map every car loaded from the background
	return this.state.cars.map((item, i) => {
	    if (i<this.state.currentIdx){
		return null;
	    } else if (i == this.state.currentIdx){
	    return (
		<Animated.View
		    {...this.PanResponder.panHandlers}
		    key = {item.postId}
		    style = {
			[this.rotateAndTranslate,
			 {height: SCREEN_HEIGHT - 140,
			width: SCREEN_WIDTH,
			position: 'absolute',
			padding: 10
		    }]}
		>
		    <Animated.View
      style={{
        position: "absolute",
        top: SCREEN_HEIGHT*.65,
        left: 15,
        zIndex: 1000
      }}
		    >
    <View style={{backgroundColor:'rgba(0,0,0,0.5)', borderRadius:20}}>
      <Text
        style={{
              color: "white",
              fontSize: scaleFont(item["brand"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")+" $"+item["model"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")),
          fontWeight: "800",
          padding: 10
        }}
      >
	  {item["brand"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} {item["model"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}
      </Text>
			    <Text
              style={{
		  color: "white",
		  fontSize: scaleFont(item["sellingLoc"].substring(0,item["sellingLoc"].search(','))+" $"+item["askingPrice"]),
		  fontWeight: "800",
		  padding: 10
              }}
	  >
	      {item["sellingLoc"].replace(RegExp('RUFUSAPOSTROPHE','g'),"\'").substring(0,item["sellingLoc"].search(','))} {'\u00A3'}{item["askingPrice"]}
	  </Text>
      </View>
     </Animated.View>
     <Animated.View
      style={{
        position: "absolute",
        top: SCREEN_HEIGHT*.69,
        left: SCREEN_WIDTH*.8,
        zIndex: 1000
      }}
     >
	 <TouchableOpacity  onPress={()=>{this.togglePressed();}}>
         <Icon name="arrow-with-circle-up" type="entypo" color="#1a64c4" size = {65}></Icon></TouchableOpacity>
		    </Animated.View>
		    
		    <Image
			style = {{
			    flex: 1,
			    height: null,
			    width: null,
			    resizeMode: "cover",
			    borderRadius: 20
			}}
			source = { {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+item["images"][0].replace(RegExp('/','g'),"%2F")+"?alt=media"}}
		    />
		</Animated.View>
	    );
	    } else {
		return (
		<Animated.View
		    key = {item.postId}
		    style = {[{
			opacity: this.nextCardOpacity,
			transform: [{ scale: this.nextCardScale }],
			height: SCREEN_HEIGHT - 140,
			width: SCREEN_WIDTH,
			position: 'absolute',
			padding: 10
		    }]}
		>
		    <Animated.View
      style={{
        position: "absolute",
        top: SCREEN_HEIGHT*.65,
        left: 15,
        zIndex: 1000
      }}
		    >
		        <View style={{backgroundColor:'rgba(0,0,0,0.5)', borderRadius:20}}>
      <Text
        style={{
              color: "white",
              fontSize: scaleFont(item["brand"]+" $"+item["model"]),
          fontWeight: "800",
          padding: 10
        }}
      >
	  {item["brand"]} {item["model"]}
      </Text>
			    <Text
              style={{
		  color: "white",
		  fontSize: scaleFont(item["sellingLoc"].substring(0,item["sellingLoc"].search(','))+" $"+item["askingPrice"]),
		  fontWeight: "800",
		  padding: 10
              }}
	  >
	      {item["sellingLoc"].substring(0,item["sellingLoc"].search(','))} ${item["askingPrice"]}
			    </Text>
			          </View>
			    </Animated.View>
		    <Image
			style = {{
			    flex: 1,
			    height: null,
			    width: null,
			    resizeMode: "cover",
			    borderRadius: 20
			}}
			source = { {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+item["images"][0].replace(RegExp('/','g'),"%2F")+"?alt=media"}}
		    />
		</Animated.View>
		);
	    }
	}).reverse();
    };
    
    render(){
	return (
	    <View>
		<View style = {{alignItems:'center'}}>
		    {this.viewCar()}
		    {this.loadCars()}
		</View>
	    </View>
    );
    }
}

const styles = StyleSheet.create({
    
});


function scaleFont(text){
    if(text.length>20){
	return text.length*.9
    }
    return 25;
    }
