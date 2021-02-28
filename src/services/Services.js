import * as React from 'react';

import BancoDados from '../data/BancoDados';
import User from '../auth/User';

export default class Services extends React.Component {

    static login = async (login, password) => {
        return await User.login(login, password);
    }
    static logout = (props) => {
        try{
            User.logout();
            User.limpeza();
            BancoDados.limpeza();
        } catch (err){
            console.log(`Erro de Logout: ${err}`);
        }
        console.log(`Usuário desconectado!`);
        props.navigation.navigate('Login');
    }
    static logout2 = () => {
        try{
            User.logout();
            User.limpeza();
            BancoDados.limpeza();
        } catch (err){
            console.log(`Erro de Logout: ${err}`);
        }
        console.log(`Realizar Login!`);
    }

    static adicionarConta = ({email, password}) => {
        if (email && password){
            BancoDados.limpeza();
            BancoDados.setConta(email, password);
            return true;
        } else {
            return false;
        }
    }
    static adicionarContato = ({foto, nome, sobrenome, cpf, celular}) => {
        BancoDados.setFoto(foto);
        return BancoDados.setContato(nome, sobrenome, cpf, celular);
    }
    static adicionarFoto = (foto) => {
        BancoDados.setFoto(foto);
        return true;
    }
    static getFoto = () => {
        return BancoDados.getFoto();
    }
    static uploadFoto = async (img, pasta) => {
        return await BancoDados.uploadFoto(img, pasta);
    }
    static atualizaPerfil = async (perfil) => {
        const {email, password} = perfil;
        await User.atualizar(email, password);
        return await BancoDados.atualizar(perfil);
    }
    static getPerfil = () => {
        return BancoDados.getUsuario();
    }
    static getUid = () => {
        return BancoDados.getUid();
    }

    static localizacoes = async () => {
        return await BancoDados.localizacoes();
    }
    static garagemInfo = async (id) => {
        return await BancoDados.buscarGaragem(id);
    }

    static excluirConta = async () => {
        await BancoDados.excluirConta();
        await User.excluirConta();
        return true;
    }
    static criarConta = async () => {
        let valido = await User.criarConta();

        const img = BancoDados.getFoto();
        if (img.local && img.local !== '' && img.local !== undefined && img.local !== null){
            let url = await BancoDados.uploadFoto(img.local, 'Perfil');
            let foto = {local: img.local, remoto: url};
            BancoDados.setFoto(foto);
        }
        
        if (valido){
            valido = await BancoDados.criarConta();
        } else {
            this.props.navigation.navigate('Contato');
            return false;
        }

        if (valido){
            const {email, password} = BancoDados.getConta();
            return await User.login(email, password);
        } else {
            return false;
        }
    }

    static getLocador = async (uid) => {
        return await BancoDados.buscarLocador(uid);
    }
    static alugarGaragemLocador = async (garagem) => {
        // console.log(`____Garagem:  ${JSON.stringify(garagem)}`);
        return await BancoDados.alugarUmaGaragem(garagem);
    }

    static ajustarAlugelLocatario = async (locatario) => {
        // console.log(`____Locatario:  ${JSON.stringify(locatario)}`);
        return await BancoDados.adicionarNovoContrato(locatario);
    }

    static listaConversas = async () => {
        return await BancoDados.listaConversas();
    }
    static listaAlugueis = async () => {
        return await BancoDados.listaAlugueis();
    }
}