import * as React from 'react';
import {
    StyleSheet,
    Image,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import carregamento from './cadastro/carregamento.json';

import Services from '../services/Services';

export default class Logando extends React.Component {

    constructor(props){
        super(props);
        
        this.carregarDados();
    }

    carregarDados = async () => {
        let alugueis = false;
        try {

            alugueis = await Services.listaAlugueis();
            
            if (alugueis[0]){
                this.props.navigation.navigate('Alugueis');
            } else {
                this.props.navigation.navigate('Mapa');
            }

        } catch (error){
            Services.logout(this.props);
            return;
        }
    }

    render(){
        return(
            <LinearGradient colors={['#A31AFF', '#7a00cc', '#4C0080']} style={styles.container}>
                <View style={styles.containerImage}>
                    <Image style={styles.image} source={ require('../images/Car_logo.png') } />
                </View>

                <View style={styles.containerAnimacao}>
                    <Lottie resizeMode="contain" source={carregamento} autoSize autoPlay loop />
                </View>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    containerImage: {},
    image: {
      width: 120,
      height: 120,
    },
    containerAnimacao: {
    },
  });