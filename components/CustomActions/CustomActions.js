
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import {useActionSheet} from '@expo/react-native-action-sheet';

//Main Component
const CustomActions = (themeColor) => {
    

    ////#################/
    ///##   States   ###/
    //#################/

    const actionSheet = useActionSheet();

    const [image, setImage] = useState(null);
    const [location, setLocation] = useState(null);

    ////#################/
    ///##  Functions ###/
    //#################/

    const onActionPress = () => {
        const options = ['Choose Image From Library', 'Use Camera', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length -1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                        return;
                    default:
                }
            }
        );
    };

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
            {/* Clickable menu */}
            <TouchableOpacity
                onPress={onActionPress}
                style={[styles.container]}
            >
                <View style={[styles.wrapper]}>
                    <Text style={[styles.iconText]}> 
                        +
                    </Text>
                </View>

            </TouchableOpacity>

            {/*
            {/* Pick Image Button /}
            <TouchableOpacity
                style={[styles.photoButton,]}
                onPress={pickImage}
            >
                <Text>
                    Pick image from library
                </Text>
            </TouchableOpacity>
            
            {/* Camera Button /}
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
            */}
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
    container: {
        width: 26, 
        height: 26,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
        justifyContent: 'center',
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 100,
        backgroundColor: 'transparent',
        textAlign: 'center',
    }
});

export default CustomActions;