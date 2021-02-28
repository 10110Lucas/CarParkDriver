import * as React from 'react';
import {
    SafeAreaView
} from 'react-native';
import Lottie from 'lottie-react-native';
import carregamento from './carregamento.json';

import Services from '../../services/Services';

export default class Cadastro extends React.Component {

    constructor(props){
        super(props);

        this.criarConta();
    }

    criarConta = async () => {
        let valido = false;
        try {
            valido = await Services.criarConta();
            if (valido){
                this.props.navigation.navigate('Mapa');
            } 
            else {
                this.props.navigation.navigate('Contato');
            }

        } catch (err){
            log(`Erro para criar conta: ${err}`)
            return this.props.navigation.navigate('Foto');
        }
    }

    render(){
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Lottie resizeMode="contain" source={carregamento} autoSize autoPlay loop />
            </SafeAreaView>
        );
    }
}