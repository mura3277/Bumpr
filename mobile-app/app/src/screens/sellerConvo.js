import React, {useEffect, useState, useContext} from 'react';
import { StyleSheet, Button, Dimensions, SafeAreaView, Image, Text, View, ScrollView, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import ViewCar from "./components/viewCar";
import axios from 'axios';
import { baseUrl } from '../../App';

/*
Just a copy of BuyerConvo, but modified for Seller 
*/
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default function SellerConvo({route}) {
    const navigation = useNavigation();
    const {email} = route.params;
    const {postId} = route.params;
    const {userId} = route.params;
    const {convoId} = route.params;
    const {convoData} = route.params;
    const [footerHeight, setFooterHeight] = React.useState('20%');
    const [pressed, setPressed] = React.useState(false);
    const [inputText, onTextChange] = React.useState(null);
    const conversations = useState([{"userId":190212,"usersName":"Sarah","postId":120910,"brand":"BMW","model":"7 Series","sellingLoc":"St Andrew's","askingPrice":15000,"Images":["https://upload.wikimedia.org/wikipedia/commons/9/93/2019_BMW_740Li_Automatic_facelift_3.0.jpg","https://www.topgear.com/sites/default/files/cars-car/image/2019/04/bmw_750li_xdrive_19.jpg","https://mediapool.bmwgroup.com/cache/P9/201812/P90333060/P90333060-the-new-bmw-7-series-in-painting-bernina-grey-amber-effect-metallic-with-light-alloy-wheel-styling-7-2250px.jpg"],desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "messages":[{user:false, msgId: 0, msg:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{user:true, msgId: 1, msg:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}, {user:false, msgId: 2, msg:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}, {user:false, msgId:3, msg:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}]},
				    {"userId":190212,"usersName":"Nathaniel","postId":589410,"brand":"Porsche","model":"911 Turbo S","sellingLoc":"Petercutler","askingPrice":45000,"Images":["https://cdn.motor1.com/images/mgl/VmVwy/s3/porsche-911-turbo-s.jpg", "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/is8rDPGsGlcg/v1/-1x-1.jpg", "https://www.autocar.co.uk/sites/autocar.co.uk/files/1-porsche-911-2019-rt-hero-front.jpg", "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/porsche-911_0.jpg"],desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", "messages":[{user:false, msgId: 0, msg:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{user:true, msgId: 1, msg:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}, {user:true, msgId: 2, msg:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}, {user:false, msgId:3, msg:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}]},
				    {"userId":190212,"usersName":"Montel","postId":632189,"brand":"Chevrolet","model":"Camaro","sellingLoc":"Stonehaven","askingPrice":18000,"Images":["https://upload.wikimedia.org/wikipedia/commons/5/5e/2019_Chevrolet_Camaro_2SS_6.2L_front_3.16.19.jpg", "https://cdn.motor1.com/images/mgl/byQ3v/s1/2019-chevrolet-camaro-zl1-1le.jpg"],desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.","messages":[{user:false, msgId: 0, msg:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{user:true, msgId: 1, msg:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}, {user:false, msgId: 2, msg:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}, {user:true, msgId:3, msg:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}]},
				    {"userId":190212,"usersName":"Rachel","postId":299834,"brand":"Jeep","model":"Wrangler","sellingLoc":"Sterling","askingPrice":12000,"Images":["https://upload.wikimedia.org/wikipedia/commons/b/b9/2018_Jeep_Wrangler_Sahara_Unlimited_Multijet_2.1_Front.jpg"],desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.","messages":[{user:true, msgId: 0, msg:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{user:false, msgId: 1, msg:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}, {user:false, msgId: 2, msg:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}, {user:true, msgId:3, msg:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}]},
				    {"userId":190212,"usersName":"Naveed","postId":864321,"brand":"Toyota","model":"Camry","sellingLoc":"Dundee","askingPrice":8000,"Images":["https://www.cnet.com/a/img/resize/b9cb3466480927557fb89f3558e9b92acd390508/hub/2021/08/20/257caf0a-f3a2-45db-9c70-d6ed50a85e6f/2021-toyota-camry-trd-ogi-1.jpg?auto=webp&fit=crop&height=675&width=1200"],desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.","messages":[{user:true, msgId: 0, msg:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},{user:false, msgId: 1, msg:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}, {user:false, msgId: 2, msg:"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."}, {user:true, msgId:3, msg:"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}]},

				   ]);
    const [messageInfo, setMessageInfo] = useState(null);
    // when the page is loaded in, retrieve the particular messages
    // related to the conversation
    useEffect(() => {
    axios.get(baseUrl+`/getMessages/`+userId+'/'+convoId)
        .then(res => {
        let msgData = res.data.data;
        setMessageInfo(msgData);
        
        }).catch((error)=>{
        alert(error);
        })
    }, []);

    // send the message to the backend, the response wil be pushed back 
    // to the messages array to be displayed 
    const sendMessage = () =>
    {
        if(inputText!=""){
            axios.get(baseUrl+`/sendMessage/`+userId+'/'+convoId+'/False/'+inputText)
            .then(res => {
            let msgData = res.data;
            let tmpMsgInfo = messageInfo;
            tmpMsgInfo.push(msgData);
            setMessageInfo(tmpMsgInfo);
            onTextChange("");

            }).catch((error)=>{
            alert(error);
            });
        }
    }

    // for each message in the array, display it accordingly
    const renderMessages = (arr) => {
	return arr.map((item)=>{
	    if(item.user==1){
		return(
		    <View style={styles.sellerMsg} key={item.msgId}>
                      <Text style={{ fontSize: 16, color: "#000",justifyContent:"center" }}> {item.msg.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}</Text>
                      <View style={styles.leftArrow}>
                      </View>
                      <View style={styles.leftArrowOverlap}></View>
                  </View>
		);
	    }
	    return(
		<View style={styles.userMsg} key={item.msgId}>
			<Text style={{ fontSize: 16, color: "#fff", }}> {item.msg.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")}</Text>
                      <View style={styles.rightArrow}>
                      </View>
                      <View style={styles.rightArrowOverlap}></View>
                  </View>
		);
	});
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
	if(!pressed){
	    navigation.navigate('SellerMessages', {email:email, userId: userId});
	}
	else {
	    togglePressed();
	}
    }
    const togglePressed = () => {
	setPressed(!pressed);
	if(!pressed){
	    setFooterHeight('0%');
	} else {
	    setFooterHeight('20%');
	}
    }
   
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
		<View style={{flexDirection:'row', alignSelf:'flex-end', marginTop:10}}>
		    <View style = {{marginTop:'5%'}}>
			<TouchableOpacity onPress={()=>backButton()}><Icon name="chevron-left" type="entypo" color="#0095ff" size={35}></Icon></TouchableOpacity>
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
		<View>
        <View>
		    <View style = {styles.titleView}>
		    <View style = {styles.horizontal}>
			<Image source={ {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+convoData["images"][0].replace(RegExp('/','g'),"%2F")+"?alt=media"} } style={styles.imgStyle}></Image>
			<View style = {{ flex:6,alignItems: 'center', flexDirection:'row'}}>
			    <Text style = {{color: "black", fontSize:30, fontWeight: "800", padding: 10}}> {convoData.usersName} </Text>
			</View>
		    </View>
		    </View>
		    <SafeAreaView style = {{paddingTop:'30%',paddingBottom:'70%'}}>
			<ScrollView>
			    {messageInfo!=null && renderMessages(messageInfo)
                }
			</ScrollView>
		    </SafeAreaView>
		</View>
		</View>
                 
        </View>
            <View style={footerStyle()}>
		{!pressed &&
		<SafeAreaView style = {{flexDirection:'row',
					    display:'flex'}}>
			<TextInput
			    style={styles.input}
			    onChangeText={onTextChange}
			    value={inputText}
			    placeholder="Type a message..."
			/>
		    <View style={{backgroundColor:'#0095ff', paddingVertical:'2.5%', paddingHorizontal:'5%', borderRadius:18}}>
			<TouchableOpacity onPress={()=> {sendMessage()}}><Text style={{textAlign:'center', color:'#FFF',  fontSize:18, fontWeight:'bold'}}>Send</Text></TouchableOpacity>
              </View>
		</SafeAreaView>}
                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('SellerHome',{email:email, userId: userId})}><View>
                    <Icon name="calendar" type="entypo" color="#A6A9B4"></Icon>
                    <Text style={styles.labelInactive}>My Cars</Text>
                    </View></TouchableOpacity>
                    <View>
                    <Icon name="chat" type="entypo" color="#0553B9"></Icon>
                     <Text style={styles.label}>Messages</Text>
                    </View>
                    <TouchableOpacity  onPress={()=>navigation.navigate('SellerSettings',{email:email,userId: userId})}><View>
                    <Icon name="cog" type="entypo" color="#A6A9B4"></Icon>
                    <Text style={styles.labelInactive}>Settings</Text>
                    </View></TouchableOpacity>
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
    imgStyle: {
	flex:2,
        height:'100%',
        width:'30%',
	borderRadius:20,
        resizeMode:'cover',
        alignSelf:'center',
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
    input: {
	backgroundColor: 'white',
	flex:6,
	height: 40,
	margin: 7,
	borderWidth: 1,
	padding: 10,
    },
    titleView: {
	position:'absolute',
        backgroundColor:"#FFF",
        borderRadius:15,
	    width: SCREEN_WIDTH*.9,
        zIndex: 1,
        paddingHorizontal:'2.5%',
        paddingVertical:'2.5%',
        alignContent:'center',
        marginHorizontal:-10,
        marginVertical:10
    },
    sellerMsg: {
	backgroundColor: "#e8e8e8",
	padding:10,
	marginTop: 5,
	marginLeft: "5%",
	maxWidth: '90%',
	alignSelf: 'flex-start',
        borderRadius: 20,
        paddingHorizontal:'2.5%',
        paddingVertical:'5%',
        alignContent:'center',
        marginHorizontal:10,
        marginVertical:10
    },
    userMsg: {
        backgroundColor:"#03e8fc",
        borderRadius:15,
        paddingHorizontal:'2.5%',
        paddingVertical:'5%',
        alignContent:'center',
        marginHorizontal:10,
        marginVertical:10,
	maxWidth:'90%',
	padding:10,
	marginLeft: '10%',
	marginTop: 5,
	marginRight: "5%",
	alignSelf: 'flex-end',
    },
    footer:{
        width:'100%',
        height:'20%',
        position:'absolute',
        bottom:0,
        backgroundColor:"#FFF",
        paddingHorizontal:'10%',
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
    rightArrow: {
  position: "absolute",
  backgroundColor: "#03e8fc",
  //backgroundColor:"red",
  width: 20,
  height: 25,
  bottom: 0,
  borderBottomLeftRadius: 25,
  right: -10
},

rightArrowOverlap: {
  position: "absolute",
  backgroundColor: "#EDF2F6",
  //backgroundColor:"green",
  width: 20,
  height: 35,
  bottom: -6,
  borderBottomLeftRadius: 18,
  right: -20

},

/*Arrow head for recevied messages*/
leftArrow: {
    position: "absolute",
    backgroundColor: "#e8e8e8",
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10
},

leftArrowOverlap: {
    position: "absolute",
    //background color is the same as screen background
    // so it's 'invisible'
    backgroundColor: "#EDF2F6",
    width: 20,
    height: 35,
    bottom: -6,
    borderBottomRightRadius: 18,
    left: -20

},
});

function scaleFont(text){
    if(text.length>12){
	return (12/text.length)*27;
    }
    return 27;
    }
