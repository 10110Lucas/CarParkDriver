import React from 'react';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';

export default class BancoDados extends React.Component {

    static contaUsuario = {
        foto: {local: '', remoto: ''},
        nome: '',
        sobrenome: '',
        cpf: '',
        celular: '',
        email: '',
        password: '',
        registroID: '',
    }

    static setUid = (uid) => {
        this.contaUsuario.registroID = uid;
        return true;
    }
    static getUid = () => {
        return this.contaUsuario.registroID;
    }
    static setConta = (email, password) => {
        this.contaUsuario.email = email;
        this.contaUsuario.password = password;
    }
    static getConta = () => {
        return {
            email: this.contaUsuario.email,
            password: this.contaUsuario.password
        };
    }
    static setContato = (nome, sobrenome, cpf, celular) => {
        this.contaUsuario.nome = nome;
        this.contaUsuario.sobrenome = sobrenome;
        this.contaUsuario.cpf = cpf;
        this.contaUsuario.celular = celular;
        return true;
    }
    static setFoto = (foto) => {
        this.contaUsuario.foto = foto;
    }
    static getFoto = () => {
        return this.contaUsuario.foto;
    }
    static getUsuario = () => {
        return this.contaUsuario;
    }

    static setUsuario(foto, nome, sobrenome, cpf, celular, email, uid){
        this.contaUsuario.foto = foto;
        this.contaUsuario.nome = nome;
        this.contaUsuario.sobrenome = sobrenome;
        this.contaUsuario.cpf = cpf;
        this.contaUsuario.celular = celular;
        this.contaUsuario.email = email;
        this.contaUsuario.registroID = uid;
    }

    static limpeza = () => {
        this.setUsuario({local: false, remoto: false}, '', '', '', '', '', false);
        this.contaUsuario.password = '';
    }

    static buscarUsuario = async (uid) => {
        try{
            await database().ref(`/carpark/locatario/${uid}`).once('value').then((snapshot)=>{
    
                let foto = snapshot.child('foto').val();
                let nome = snapshot.child('nome').val();
                let sobrenome = snapshot.child('sobrenome').val();
                let cpf = snapshot.child('cpf').val();
                let celular = snapshot.child('celular').val();
                let email = snapshot.child('email').val();
                
                this.setUsuario(foto, nome, sobrenome, cpf, celular, email, uid);
            });
        }catch(err){
            this.limpeza();
            console.log(`Erro ao buscar usuario: ${err}`);
        }
        return true;
    }

    static localizacoes = async () => {
        let locais = [];
        await database().ref('/carpark/enderecos/').once('value').then( snapshot => {
            snapshot.forEach( childSnapshot => {
                if (childSnapshot.val()) {
                    locais.push(childSnapshot.val());
                }
            });
        });
        return locais;
    }

    static buscarGaragem = async (id) => {
        
        let ref = database().ref('/carpark/enderecos/'+id);
        let garagem = {};

        await ref.once('value').then((snapshot)=>{
            garagem = {
                foto: snapshot.child('foto').val(),
                address: snapshot.child('address').val(),
                id: id,
                anunciante: snapshot.child('anunciante').val(),
                altura: snapshot.child('altura').val(),
                largura: snapshot.child('largura').val(),
                comprimento: snapshot.child('comprimento').val(),
                cobertura: snapshot.child('cobertura').val(),
                rampa: snapshot.child('rampa').val(),
                cadeirante: snapshot.child('cadeirante').val(),
                diaria: snapshot.child('diaria').val(),
                preco: snapshot.child('preco').val(),
                idAnunciante: snapshot.child('userID').val(),
            };
        });

        return garagem;
    }

    static atualizar = async ({foto, nome, sobrenome, cpf, celular, email, password}) => {
        let dado = {
            foto: foto, nome: nome, sobrenome: sobrenome, 
            cpf: cpf, celular: celular, email: email
        };
        this.setUsuario(foto, nome, sobrenome, 
            cpf, celular, email, this.contaUsuario.registroID
        );
        this.setConta(email, password);
        await database().ref('/carpark/locatario/'+this.contaUsuario.registroID).update(dado);
        return true;
    }

    static excluirConta = async () => {
        const ref = database().ref('/carpark/locatario/'+this.contaUsuario.registroID);
        await ref.remove();
    }
    
    static uploadFoto = async (img, pasta) => {
        const uid = this.contaUsuario.registroID;
        const destino = `CarPark/${uid}/${pasta}`;
        let nome = String(img).split('\/');
        nome = nome[nome.length - 1];

        let reference = storage().ref(`${destino}/${nome}`);

        //realizar upload
        let imagem = await RNFS.readFile(img, 'base64');
        const task = reference.putString(imagem, 'base64');
        task.on(
            'state_changed',
            snapshot => {
                let porcentagem = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(`Uploading Foto ${porcentagem}%`);
            },
            error => {
                console.log('UpLoad foto erro:', error);
            }
        );

        const foto = []

        await task.then(async imageSnapshot => {
            await storage()
                .ref(imageSnapshot.metadata.fullPath)
                .getDownloadURL()
                .then(downloadURL => {
                    foto.push({url: downloadURL});
                })
                .catch(err => console.log('Falha de URL: '+err))
        });

        return foto[0].url;
    }

    static criarConta = async () => {
        const {foto, nome, sobrenome, cpf, celular, email, registroID} = this.contaUsuario;
        let dataCriacao = `${new Date().getDate()}-${(new Date().getMonth() + 1)}-${new Date().getFullYear()}`;

        const referencia = '/carpark/locatario/' + registroID;
        let update = {};
        update[String(referencia)] = {
            foto: foto,
            nome: nome,
            sobrenome: sobrenome,
            cpf: cpf,
            celular: celular,
            email: email,
            dataCriacao: dataCriacao
        };
        let valido = false;
        let uploading = database().ref();
        await uploading.update(update)
                .then(() => {
                    console.log(`Locatario criado!`);
                    valido = true;
                })
                .catch( error => { console.log(`Erro para registrar dados: ${error}`) });
        return valido;
    }

    static alugarUmaGaragem = async ({idGaragem, garagem}) => {
        const referencia = `/carpark/enderecos/${idGaragem}`;
        console.log(`__id para enderecos: ${referencia}`);
        
        let valido = false;
        let uploading = database().ref(referencia);

        await uploading.update({aluguel: garagem})
            .then(() => {
                // console.log(`Garagem Alugada!`);
                valido = true;
            })
        .catch( error => { console.log(`Erro para registrar dados: ${error}`) });
                
        return valido;
    }

    static adicionarNovoContrato = async (contrato) => {
        const referencia = `/carpark/locatario/${this.contaUsuario.registroID}`;
        // console.log(`__id para contrato: ${referencia}`);

        let valido = false;
        let uploading = database().ref(referencia);
        await uploading.update({
            contratos: contrato.contratos,
            conversas: contrato.conversas,
            formaPagamento: contrato.formaPagamento,
            veiculo: contrato.veiculo
        })
            .then(() => {
                // console.log(`Novo Contrato adicionado!`);
                valido = true;
            })
        .catch( error => { console.log(`Erro para registrar dados: ${error}`) });

        return valido;
    }
    static buscarLocador = async (uid) => {
        let locador = {};
        try{
            await database().ref(`/carpark/locador/${uid}`).once('value').then((snapshot)=>{
                locador = {
                    idLocador: uid,
                    nome: snapshot.child('nome').val()+' '+snapshot.child('sobrenome').val(),
                    foto: snapshot.child('foto').val(),
                    celular: snapshot.child('celular').val(),
                }
            });
            return locador;

        }catch(err){
            this.limpeza();
            console.log(`Erro ao buscar locador: ${err}`);
            return false;
        }
    }

    static listaConversas = async () => {
        const conversas = [];
        // await database().ref('/carpark/enderecos/').once('value').then( snapshot => {
        //     snapshot.forEach( childSnapshot => {
        //         let indice = childSnapshot.val();
        //         locais.push(indice);
        //     });
        // });
        await database().ref(`/carpark/locatario/${this.contaUsuario.registroID}/conversas`).once('value').then( snapshot => {
            snapshot.forEach( childSnapshot => {
                var conversa = childSnapshot.val();
                if (conversa){
                    conversas.push(conversa);
                }
            });
        });
        return conversas;
    }

    static listaAlugueis = async () => {
        const alugueis = [];
        // await database().ref('/carpark/enderecos/').once('value').then( snapshot => {
        //     snapshot.forEach( childSnapshot => {
        //         let indice = childSnapshot.val();
        //         locais.push(indice);
        //     });
        // });
        await database().ref(`/carpark/locatario/${this.contaUsuario.registroID}/contratos`).once('value').then( snapshot => {
            snapshot.forEach( childSnapshot => {
                var aluguel = childSnapshot.val();
                if (aluguel){
                    alugueis.push(aluguel);
                }
            });
        });
        return alugueis;
    }
}