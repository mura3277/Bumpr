import React, {useEffect, useReducer, useState} from 'react';
import { StyleSheet, SafeAreaView, Image, Text, View, ScrollView, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../../App';
import {DeviceEventEmitter} from "react-native";

export default function InterestedBuyers({route}) {
    const navigation = useNavigation();
    const {email} = route.params;
    const {postId} = route.params;
    const {userId} = route.params;
    const [ibs, setIbs] = useState(null);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const interestedBuyers = useState([{"userId":190211,"usersName":"Sarah", "location":"Aberdeen"},
				       {"userId":190212,"usersName":"Nathaniel", "location":"Aberdeen"},
				       {"userId":190214,"usersName":"Montel", "location":"Stonehaven"},
				       {"userId":190137,"usersName":"Rachel", "location":"Edinburgh"},
				       {"userId":153158,"usersName":"Millie", "location":"Edinburgh"},
				       {"userId":190216,"usersName":"Matilda", "location":"Dundee"},
				       {"userId":199611,"usersName":"Lukas", "location":"St Andrews"},
				       {"userId":153155,"usersName":"Raheem", "location":"St Andrews"}]);

    // when settings get updated this device event emitter will reload the data, 
    // as there may be newly applicable interested buyers that weren't possible before
    DeviceEventEmitter.addListener("event.ibUpdate", (eventData) => 
    axios.get(`http://192.168.1.233:5000/getInterestedBuyers/`+userId+'/'+postId)
            .then(res => {
            let ibs = res.data;
            setIbs(ibs);
            }).catch((error)=>{
            alert(error);
            }));
    // when the page gets loaded in retrieve the user's interested buyers
    useEffect(() => {
        axios.get(`http://192.168.1.233:5000/getInterestedBuyers/`+userId+'/'+postId)
            .then(res => {
            let ibs = res.data;
            setIbs(ibs);
            }).catch((error)=>{
            alert(error);
            })
    }, []);

    // deletes an interested buyer both from the backend and resets 
    // what the frontend is displaying
    const remove = (buyerId) =>
    {
        let tmp = [];
        axios.get(`http://192.168.1.233:5000/deleteInterestedBuyer/`+userId+'/'+postId+'/'+buyerId)
        .then(res => {
        for(let i = 0; i<ibs.length; i++){
            if(ibs[i].userId!=buyerId){
                tmp.push(ibs[i]);
            }
        }
        setIbs(tmp);
        
        }).catch((error)=>{
        alert(error);
        })
    
    }

    // Confirms the interested buyers in the backend
    // also removes the buyer from the list in the frontend
    const confirm = (buyerId) => 
    {
        let tmp = [];
        axios.get(`http://192.168.1.233:5000/confirmInterestedBuyer/`+userId+'/'+postId+'/'+buyerId)
        .then(res => {
        for(let i = 0; i<ibs.length; i++){
            if(ibs[i].userId!=buyerId){
                tmp.push(ibs[i]);
            }
        }
        setIbs(tmp);
        
        }).catch((error)=>{
        alert(error);
        })
    }

    // for each buyer, display their location and an option
    // to choose or remove them (green check or red x)
    const showInterested = (arr) => {

        return arr.map((data)=>{
            return(
	    <View style = {styles.msgViews} key={data.userId}>
		<View style = {{flexDirection:'row',
				display:'flex', alignItems: 'center'}}>
		    <View style = {{flex:1}}>
			<TouchableOpacity onPress={()=>{remove(data.userId); forceUpdate();}}><Icon name="squared-cross" type="entypo" color="#fc0b03" size={60}></Icon></TouchableOpacity>
			</View>
		    <View style = {{ flex:2, alignItems: 'center', flexDirection:'column'}}>
			    <Text style = {{color: "black", fontSize: 20, fontWeight: "800", padding: 10}}> {data.location}</Text>
			</View>
		    <View style = {{flex:1}}>
			<TouchableOpacity onPress={()=>{confirm(data.userId)}}><Icon name="check" type="entypo" color="#03fc28" size={60}></Icon></TouchableOpacity>
		    </View>
		    </View>
	    </View>
	)});
}
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
		<View style={{flexDirection:'row', alignSelf:'flex-end', marginTop:10}}>
		    <View style = {{marginTop:'5%'}}>
			<TouchableOpacity onPress={()=>navigation.navigate('EditPost',{email:email, postId:postId})}><Icon name="chevron-left" type="entypo" color="#0095ff" size={35}></Icon></TouchableOpacity>
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
		<SafeAreaView style = {{flex: 1}}>
		    <ScrollView style = {{overflow:'hidden'}}>
			{ibs!=null && showInterested(ibs)
            }
		    </ScrollView>
		</SafeAreaView>
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
        height:50,
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
    msgViews: {
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
