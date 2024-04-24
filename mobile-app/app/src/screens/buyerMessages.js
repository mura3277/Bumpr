import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Image, Text, View, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../../App';

export default function BuyerMessages({route}) {
    const navigation = useNavigation();
    const {email} = route.params;
    const {userId} = route.params;
    const [convoInfo, setConvoInfo] = useState([{"postId":120910,"brand":"BMW","model":"7 Series","images":["https://upload.wikimedia.org/wikipedia/commons/9/93/2019_BMW_740Li_Automatic_facelift_3.0.jpg"], "buyerResponse":false}]);

    const messagesInfo = useState([{"postId":120910,"brand":"BMW","model":"7 Series","img":"https://upload.wikimedia.org/wikipedia/commons/9/93/2019_BMW_740Li_Automatic_facelift_3.0.jpg", "buyerResponse":false},
				   {"postId":589410,"brand":"Porsche","model":"911 Turbo S","img":"https://cdn.motor1.com/images/mgl/VmVwy/s3/porsche-911-turbo-s.jpg", "buyerResponse":false},
				   {"postId":632189,"brand":"Chevrolet","model":"Camaro","img":"https://upload.wikimedia.org/wikipedia/commons/5/5e/2019_Chevrolet_Camaro_2SS_6.2L_front_3.16.19.jpg", "buyerResponse":true},
				   {"postId":299834,"brand":"Jeep","model":"Wrangler","img":"https://upload.wikimedia.org/wikipedia/commons/b/b9/2018_Jeep_Wrangler_Sahara_Unlimited_Multijet_2.1_Front.jpg", "buyerResponse":true},
				   {"postId":864321,"brand":"Toyota","model":"Camry","img":"https://www.cnet.com/a/img/resize/b9cb3466480927557fb89f3558e9b92acd390508/hub/2021/08/20/257caf0a-f3a2-45db-9c70-d6ed50a85e6f/2021-toyota-camry-trd-ogi-1.jpg?auto=webp&fit=crop&height=675&width=1200", "buyerResponse":true},
				   {"postId":5843124,"brand":"Dodge","model":"Charger","img":"https://aeceurope.com/wp-content/uploads/2020-charger-rt-gomango.jpg", "buyerResponse":true},
				   {"postId":9873345,"brand":"BMW","model":"Mini Cooper","img":"https://cdn.motor1.com/images/mgl/B36GR/s1/2022-mini-cooper-hardtop-front.jpg", "buyerResponse":true}]);

    // when you get to this page, load the conversations in
    useEffect(() => {
        axios.get(baseUrl+`/getConvos/`+userId+'/True')
		  .then(res => {
			let convoData = res.data.data;
			setConvoInfo(convoData);
		  }).catch((error)=>{
			alert(error);
		  })
        }, []);
    
    // for each conversation, show the car's post details and when you tap on it
    // take it to the individual convo
    const showMessages = convoInfo.map((data) => {
	return (
	    <View style = {styles.msgViews} key={data.postId}>
		<TouchableOpacity onPress = {()=>navigation.navigate('BuyerConvo',{postId:data.postId, convoId:data.convoId, email:email, userId:userId, convoData:data})}>
		    <View style = {styles.horizontal}>
			<Image source={ {uri: "https://firebasestorage.googleapis.com/v0/b/bumprgcp.appspot.com/o/"+data["images"][0].replace(RegExp('/','g'),"%2F")+"?alt=media"} } style={styles.imgStyle}></Image>
			<View style = {{ flex:8,alignItems: 'center', flexDirection:'row'}}>
			    <Text style = {{color: "black", fontSize: scaleFont(data.brand.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")+" "+data.model.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")), fontWeight: "800", padding: 10}}> {data.brand.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} {data.model.replace(RegExp('RUFUSAPOSTROPHE','g'),"\'")} </Text>
			</View>
			<View style = {{flex:1, alignItems: 'center', justifyContent:'center'}}>
			    </View>
		    </View>		    
		</TouchableOpacity>
	    </View>
	)});
    
    return (
        <View style={styles.contain}>
            <View style={styles.container}>
		<View style={{flexDirection:'row', alignSelf:'flex-end', marginTop:10}}>
		    <View style={{paddingHorizontal:'7%',paddingVertical:'2.5%', borderRadius:10}}>
			<Text style={{textAlign:'center', fontFamily:'sans-serif-thin', color:'#292c2e',  fontSize:32, fontWeight:'bold'}}>bumpr</Text>
		    </View>
                        <View style={{backgroundColor:'#b3bdc4', paddingHorizontal:'5%',paddingVertical:'2.5%', borderRadius:10}}>
                            <TouchableOpacity onPress={()=>navigation.navigate('Splash')}>
                                <Text style={{textAlign:'center', color:'#292c2e',  fontSize:28, fontWeight:'bold'}}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                </View>
		<SafeAreaView style = {{flex: 1, paddingBottom:'25%'}}>
		    <ScrollView style = {{overflow:'hidden'}}>
			{convoInfo!=null &&
            showMessages
            }
		    </ScrollView>
		</SafeAreaView>
                 
        </View>
            <View style={styles.footer}>
                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>navigation.navigate('BuyerHome',{email:email, userId: userId})}><View>
                    <Icon name="images" type="entypo" color="#A6A9B4"></Icon>
                    <Text style={styles.labelInactive}>Explore</Text>
                    </View></TouchableOpacity>
                    <View>
                    <Icon name="chat" type="entypo" color="#0553B9"></Icon>
                     <Text style={styles.label}>Messages</Text>
                    </View>
                    <TouchableOpacity  onPress={()=>navigation.navigate('BuyerSettings',{email:email, userId: userId})}><View>
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
