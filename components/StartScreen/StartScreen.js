import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import image from '../../assets/background.png';


// This function takes the "backgroundcolor" and messes with the alpha.
const changeAlpha = (rgbaString, newAlpha) => {
    //Match one or more digits "\d+", then an optional "?" decimal "\.\d+"
    const match = rgbaString.match(/(\d+(\.\d+)?)/g);
    if(!match || match.length !== 4)
        return rgbaString;

    // eslint-disable-next-line
    const [red, green, blue, _] = match;
    const returnRGBA = `rgba(${red},${green},${blue},${newAlpha})`;

    return returnRGBA;
};

const StartScreen = ({navigation}) => {

    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('rbga(100, 0, 0, 1)');

    const colorOptions = ['rgba(100, 0, 0, 1)', 'rgba(0, 100, 0, 1)', 'rgba(100,0,100, 1)'];

    

    return (
        <ImageBackground source = {image} resizeMode='cover' style={styles.container}>
            {
                //LOGIN CONTAINER
            }
            <View style={[styles.loginContainer, {backgroundColor: changeAlpha(backgroundColor, 0.4)}]}> 
                {
                    //USERNAME INPUT
                }
                <TextInput
                    style={[styles.textInput, styles.loginItem]}
                    value={name}
                    onChangeText={setName}
                    placeholder='Type your username here'
                />
                {
                    //BACKGROUND COLOR SELECTOR
                }
                <View
                    style={[styles.loginItem, {paddingTop:0, paddingBottom:0}]}
                >
                    {
                        //COLOR SELECTION LABEL
                    }
                    <Text style={[{color: changeAlpha(backgroundColor, 1), paddingBottom: 5, width:'100%', textAlignVertical:'center', fontSize:14, textAlign: 'left', marginVertical:0}]}>
                        Choose Background Color:
                    </Text>
                    {
                        //COLOR SELECTION BUTTONS
                        //Reads from array above and dynamically creates buttons
                    }
                    <View style={[styles.backgroundColorSelectorContainer]}>
                        {colorOptions.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.backgroundColorSelector, {backgroundColor: color}]}
                                onPress={() => setBackgroundColor(colorOptions[index])}
                            >
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
                {
                    //NAVIGATION BUTTON
                }
                <TouchableOpacity
                    style={[styles.loginItem, styles.loginButton, {backgroundColor: changeAlpha(backgroundColor, .5)}]}
                    onPress={() => navigation.navigate('ChatScreen', {name: name, backgroundColor: backgroundColor})}
                >
                    <Text 
                        style={styles.loginButtonText}
                    >
                        Start Chatting
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundColorSelectorContainer: {
        width: '100%',
        flex:1, 
        flexDirection:'row',
        justifyContent: 'flex-start'
    },
    backgroundColorSelector: {
        //DEBUG COLOR
        backgroundColor: 'rgba(200,255,200,1)',
        height: '90%',
        aspectRatio: 1,
        borderRadius: 100,
        margin: 5        
    },
    highlight: {
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    loginContainer: {
        width: '88%',
        height: '44%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'

    },
    loginButton: {
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    loginButtonText: {
        color: 'rgba(255,255,255,.8)',
        fontSize: 20,
    },
    loginItem: {
        flex: 1,
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column-reverse',
        alignItems: 'center'
    }
});

StartScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default StartScreen;