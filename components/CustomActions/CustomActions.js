
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import * as Location from 'expo-location';
import {useActionSheet} from '@expo/react-native-action-sheet';
import { PropTypes } from 'prop-types';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import { contrastText, changeAlpha } from '../../color-library';

//Main Component
const CustomActions = ({storage, themeColor, onSend, userID}) => {
    
    const contrastTheme = contrastText(themeColor);

    ////#################/
    ///##   States   ###/
    //#################/

    const actionSheet = useActionSheet();

    const noPermissions = () => {
        Alert.alert('No permission given');
    };

    ////#################/
    ///##  Functions ###/
    //#################/

    const generateID = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split('/')[uri.split('/').length -1];
        return `${userID}-${timeStamp}-${imageName}`;
    };

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

    const uploadAndSendImage = async(imageURI) => {
        try{
            //Get the image and make it uploadable
            const response = await fetch(imageURI);
            const blob = await response.blob();
            //Get the image name
            const newUploadRef = ref(storage, generateID(imageURI));
            //Upload and reference
            uploadBytes(newUploadRef, blob)
                .then( async() => {
                    console.log('File has been uploaded successfully');
                    //This may need a catch
                    const imageURL = await getDownloadURL(newUploadRef);
                    onSend({image:imageURL});
                });
        } catch (error) {
            console.error('Error uploading and sending image: ', error);
        }
    };

    //Button - Pick image to post
    const pickImage = async() => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                //We can specify types here (Images, Videos, All)
                mediaTypes: ImagePicker.MediaTypeOptions.Images
            });

            if(!result?.canceled){
                uploadAndSendImage(result.assets[0].uri);
            }else {
                noPermissions();
            }
                
        }

    };

    //Button - Use camera
    const takePhoto = async() => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if(permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            if(!result.canceled) 
                uploadAndSendImage(result.assets[0].uri);
            else
                noPermissions();
        }
    };

    //Button - Geolocation
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();

        if(permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if(location){
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else {
                Alert.alert('Error while fetching location');
            }
        } else {
            Alert.alert('Permissions were denied.');
        }
    };

    ////#################/
    ///##    return   ##/
    //#################/ 
    return (

        <View
            style={[styles.container]}
        >
            <TouchableOpacity
                onPress={onActionPress}
                style={[styles.wrapper, {borderColor: contrastTheme, backgroundColor: changeAlpha(contrastTheme, .8)}]}
            >
                <Text style={[styles.iconText, {  color: contrastText(contrastTheme)}]}>+</Text>
            </TouchableOpacity>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    }
});

CustomActions.propTypes = {
    themeColor: PropTypes.string.isRequired,
    onSend: PropTypes.func.isRequired,
    userID: PropTypes.string.isRequired,
    storage: PropTypes.shape({
        
    }).isRequired,
};

export default CustomActions;