import React, {useEffect, useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import Card from "./components/card";
import {DeviceEventEmitter} from "react-native";

export default function BuyerHome({route}) {

    
    const carInfo = useState([{"postId":2329420, "brand":'BMW',"sellingLoc":'Aberdeen',"model":'3 Series (2016)',"askingPrice":10000,"Images":["https://www.motortrend.com/uploads/sites/5/2021/08/2022-BMW-3-Series-872.jpg", "https://www.bmw.co.uk/content/dam/bmw/marketGB/bmw_co_uk/bmw-cars/3-series/3series-saloon-modelcard-890x501.png", "https://carsalesbase.com/wp-content/uploads/2019/03/BMW_3_series-auto-sales-statistics-Europe.jpg"], desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."},
			      {"postId":134290, "brand":'Ford',"sellingLoc":'Edinburgh',"model":'Fiesta',"askingPrice":5000,"Images":["https://upload.wikimedia.org/wikipedia/commons/7/7d/2017_Ford_Fiesta_Zetec_Turbo_1.0_Front.jpg", "https://media.autoexpress.co.uk/image/private/s--X-WVjvBW--/f_auto,t_content-image-full-desktop@1/v1601890332/autoexpress/2020/10/Ford%20Fiesta%20ST%20Edition%202020-12.jpg", "https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/98-ford-fiesta-st-edition-2020-official-images-hero-rear.jpg?itok=YYFfpUGv"], desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}, {"postId":315189, "brand":'Mercedes-Benz',"sellingLoc":'Glasgow',"model":'A Class',"askingPrice":20000,"Images":["https://www.mercedes-benz.com/en/vehicles/passenger-cars/a-class/a-class-2019-feature-tutorials/_jcr_content/image/MQ6-12-image-20190218150301/00-mercedes-benz-a-class-2018-w177-v177-feature-tutorials-2560x1440.jpeg", "https://www.mercedes-benz.co.uk/passengercars/mercedes-benz-cars/models/a-class/hatchback-w177/explore/amg/_jcr_content/par/productinfotabnav/tabnav/productinfotabnavite/tabnavitem/productinfotextimage/media/slides/videoimageslide/image.MQ6.12.20191004151825.jpeg", "https://m.atcdn.co.uk/a/media/w540/59f9b0b3d38e442d820ffe95bf815845.jpg"], desc:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "}]);
    const index = 0;
    const cars = useState([]);
    const {email} = route.params;
    const {userId} = route.params;

    const navigation = useNavigation();	
    
    // Fairly standard page, primarily relies on the card component
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
		<View>
		    <Card cars={carInfo} navigation={navigation} email={email} userId ={userId} />
		</View>
	</View>
            <View style={styles.footer}>
                    <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                    <View>
                    <Icon name="images" type="entypo" color="#0553B9"></Icon>
                    <Text style={styles.label}>Explore</Text>
                    </View>
                    <TouchableOpacity  onPress={()=>navigation.navigate('BuyerMessages',{email:email, userId: userId})}><View>
                    <Icon name="chat" type="entypo" color="#A6A9B4"></Icon>
                     <Text style={styles.labelInactive}>Messages</Text>
                    </View></TouchableOpacity>
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
