
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

//Main Component
const ActionSheet = () => {
    

    ////#################/
    ///##   States   ###/
    //#################/

    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

    ////#################/
    ///##  Functions ###/
    //#################/

    //Button - Pick image to post
    const pickImage = async() => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                //We can specify types here (Images, Videos, All)
                mediaTypes: ImagePicker.MediaTypeOptions.Images
            });

            if(!result.canceled)
                setImage(result.assets[0]);
            else
                setImage(null);
        }

    };

    //Button - Use camera
    const takePhoto = async() => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if(permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            if(!result.canceled) 
                setImage(result.assets[0]);
            else
                setImage(null);
        }
    };

    //Button - Geolocation
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();

        if(permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        } else {
            Alert.alert('Permission to read location has not been granted');
        }
    };

    ////#################/
    ///##    return   ##/
    //#################/ 
    return (
        <View>
            {/* Pick Image Button */}
            <TouchableOpacity
                style={[styles.photoButton,]}
                onPress={pickImage}
            >
                <Text>
                    Pick image from library
                </Text>
            </TouchableOpacity>
            
            {/* Camera Button */}
            <TouchableOpacity
                style={[styles.photoButton,]}
                onPress={takePhoto}
            >
                <Text>
                    Take a Photo
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={[{width:'50%', height:'10%'},]}
                onPress={getLocation}
            >
                <Text>
                    Geolocation
                </Text>
            </TouchableOpacity>
            
        </View>

    );
};

/*
    {location &&
        <MapView
            style= {{width: 300, height: 200}}
            region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        />
    }

*/

const styles = StyleSheet.create({
    photoButton: {
        height: '10%',
        width: '50%',
        justifyContent: 'center',
    },
});

export default ActionSheet;