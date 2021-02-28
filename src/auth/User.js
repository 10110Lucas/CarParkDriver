import React from 'react';
import auth from '@react-native-firebase/auth';
import BancoDados from '../data/BancoDados';

export default class User extends React.Component {
    
    static autenticado = {
        email: '',
        password: '',
        user: {},
        ativo: false
    }

    static setAutenticado = (email, password, user, ativo) => {
        this.autenticado.email = email;
        this.autenticado.password = password;
        this.autenticado.user = user;
        this.autenticado.ativo = ativo;
    }
    static limpeza = () => {
        this.autenticado.email = '';
        this.autenticado.password = '';
        this.autenticado.user = {};
        this.autenticado.ativo = false;
    }
    static setLogin = (email, pass) => {
        this.autenticado.email = email;
        this.autenticado.password = pass;
    }

    static setAuthenticated = (usr, pass, usuario, on) => {
        this.setAutenticado(usr, pass, usuario, on);
        return this.autenticado.ativo;
    }
    
    static getAutenticado = () => {
        return this.autenticado;
    }

    
    //-----------------------  Uso de API e Autenticações  ----------------------------------------
    static logout = () => {
        if (auth().currentUser) auth().signOut();
        else return;
    }
    static login = async (usuario, senha) => {
        
        this.setLogin(usuario, senha);
        let uid = false;

        try{
            const { email, password } = this.autenticado;            
            await auth().signInWithEmailAndPassword(email, password)
                .then(Response => {
                    this.autenticado.user = Response.user.toJSON();
                    uid = Response.user.uid;
                }
            );
            
            BancoDados.setConta(email, password);
            this.autenticado.ativo = await BancoDados.buscarUsuario(uid);
            
        } catch(error){
            this.limpeza();
            alert('Conta de Usuário Inválido, verifique o email e senha.');
            if (error.code === 'auth/user-not-found')
                console.log('Não há registro de usuário correspondente a este identificador. O usuário pode ter sido excluído.');
        }
        console.log(`Login ${this.autenticado.ativo ? 'Realizado!' : 'Falhado!'}`);
        return this.autenticado.ativo;
    }

    static atualizar = async (email, password) => {
        await auth().currentUser.updateEmail(email);
        await auth().currentUser.updatePassword(password);
    }

    static excluirConta = async () => {
        await auth().currentUser.delete();
    }
    
    static criarConta = async () => {
        const {email, password} = BancoDados.getConta();
        let valido = false;

        await auth().createUserWithEmailAndPassword(email, password).then((response)=>{
            // console.log(`Email no banco: ${response.user.email}`);
            // console.log(response.user.toJSON());
            if(response.user.uid){
                valido = BancoDados.setUid(response.user.uid);
            }

        }).catch(error => {
            if (error.code === 'auth/email-already-in-use')
                console.log('\nEsse endereço de email já esta em uso!\n');
            else if (error.code === 'auth/invalid-email')
                console.log('Endereço de email invalido!');
            console.error(error);
        });

        return valido;
    }
}