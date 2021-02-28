import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

function Messages({ item }){

    if (item.me){
        return(
            <View style={styles.container}>
                <View style={styles.containerMyMessages}>
                    <View style={styles.containerMyPhoto}>
                        <Image style={styles.myPhoto} source={ item.photo ? {uri: item.photo} : require('../images/camera.png') } />
                    </View>
                    <View style={styles.containerMe}>
                        <Text style={styles.textMe}>{item.text}</Text>
                    </View>
                </View>
                <Text style={styles.textDateMe}>{item.date.hour}:{item.date.minutes}</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.containerOutherMessages}>
                <View style={styles.containerOutherPhoto}>
                    <Image style={styles.outherPhoto} source={ item.photo ? {uri: item.photo} : require('../images/camera.png') } />
                </View>
                <View style={styles.containerWho}>
                    <Text style={styles.textWho}>{item.text}</Text>
                </View>
            </View>
            <Text style={styles.textDateWho}>{item.date.hour}:{item.date.minutes}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },


    containerOutherMessages: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 15,
        paddingRight: 80,
        backgroundColor: 'transparent',
    },
    containerWho: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 7,
        backgroundColor: '#FFF',
    },
    textWho: {
        fontSize: 20,
        color: '#000',
    },
    textDateWho: {
        alignSelf: 'flex-start',
        marginHorizontal: 15,
        fontSize: 17,
        color: '#000',
    },
    containerOutherPhoto: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    outherPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },


    containerMyMessages: {
        flex: 1,
        flexDirection: 'row-reverse',
        marginTop: 15,
        paddingRight: 80,
        backgroundColor: 'transparent',
    },
    containerMe: {
        flexDirection: 'row-reverse',
        alignSelf: 'flex-end',
        marginHorizontal: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 7,
        backgroundColor: '#88F',
    },
    textMe: {
        fontSize: 20,
        color: '#FFF',
    },
    textDateMe: {
        alignSelf: 'flex-end',
        marginHorizontal: 15,
        fontSize: 17,
        color: '#000',
    },
    containerMyPhoto: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    myPhoto: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
})

export default Messages;