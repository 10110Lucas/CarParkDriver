import React from 'react';
import {
    StyleSheet, 
    Image, 
    View
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Services from './services/Services';

function EstiloMenuLateral(props){

    function renderFoto(){
        // const foto = {local: false, remoto: false};
        const foto = Services.getFoto();
        if (foto.local && typeof foto.local === 'string' && foto.local !== null){
            return {uri: foto.local};
        }
        else if (foto.remoto && typeof foto.remoto === 'string' && foto.remoto !== null){
            return {uri: foto.remoto};
        }
        else {
            return require('./images/camera.png');
        }
    }

    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.areaSuperior}>
                    <DrawerItem
                    icon={()=> (
                        <Image
                        style={styles.perfilImagem}
                        source={ renderFoto() }
                        />
                    )}
                    label=""
                    style={styles.perfil}
                    onPress={() => props.navigation.navigate('Perfil')}
                    />
                    <DrawerItem
                    icon={()=> (
                        // <Image
                        // style={{width: 40, height: 40}} 
                        // source={require('./images/home.png')}
                        // />
                        <IconFontAwesome5 name='map-marked-alt' color={'#9400D3'} size={40} />
                    )}
                    label="Mapa"
                    labelStyle={{fontSize: 18}}
                    style={styles.options}
                    onPress={() => props.navigation.navigate('Mapa')}
                    />
                    <DrawerItem
                    icon={()=> (
                        <IconMaterialCommunityIcons name='note-text-outline' color={'#9400D3'} size={40} />
                    )}
                    label="Meus Alugueis"
                    labelStyle={{fontSize: 18}}
                    style={styles.options}
                    onPress={() => props.navigation.navigate('Alugueis')}
                    />
                    {/* <DrawerItem
                    icon={()=> (
                        <IconAntDesign name='contacts' color={'#9400D3'} size={40} />
                    )}
                    label="Contatos"
                    labelStyle={{fontSize: 18}}
                    style={styles.options}
                    onPress={() => props.navigation.navigate('Conversas')}
                    /> */}
                </View>
            </DrawerContentScrollView>
            <View style={styles.areaInferior}>
                <DrawerItem
                icon={()=> (
                    <IconMaterialIcons name='exit-to-app' color={'#9400D3'} size={40} />
                )}
                label="Sair"
                labelStyle={{fontSize: 18, }}
                style={{alignContent:'flex-end'}}
                onPress={() => Services.logout(props) }
                />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    areaSuperior: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    perfil: {
        flexDirection: 'column',
        alignItems: 'center',
        borderBottomWidth: 3,
        borderColor: '#EEE',
        backgroundColor: '#FFF'
    },
    perfilImagem: {
        width: 100,
        height: 100,
        marginLeft: '30%',
        borderRadius: 50,
    },
    options: {
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    },
    areaInferior: {
        marginLeft: 15,
        borderTopWidth: 3,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF'
    }
});

export default EstiloMenuLateral;