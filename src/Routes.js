import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import EstiloMenuLateral from './EstiloMenuLateral';

import Mapa from './pages/Mapa';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Alugar from './pages/Alugar';
import Perfil from './pages/Perfil';
import Garagem from './pages/Garagem';
import Logando from './pages/Logando';
import Alugueis from './pages/Alugueis';
import Alugando from './pages/Alugando';
import Conversas from './pages/Conversas';
import Pagamento from './pages/Pagamento';
//-- pasta cadastro --
import Conta from './pages/cadastro/Conta';
import Contato from './pages/cadastro/Contato';
import Cadastro from './pages/cadastro/Cadastro';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MenuLateral(){
  return (
    <Drawer.Navigator
    drawerContent={props => <EstiloMenuLateral {...props}/>}
    // unmountInactiveRoutes={true}
    initialRouteName='Mapa'>
      <Drawer.Screen
      name='Mapa'
      component={Mapa}
      options={{
        unmountOnBlur: true,
      }}
      />
      <Drawer.Screen
      name='Perfil'
      component={Perfil}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Conversas'
      component={Conversas}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Alugueis'
      component={Alugueis}
      options={{
        unmountOnBlur: true
      }}
      />
    </Drawer.Navigator>
  );
}

function Logar(){
  return(
    <Drawer.Navigator 
    drawerContent={props => <EstiloMenuLateral {...props}/>}
    initialRouteName='Logando'>
      <Stack.Screen
        name='Logando'
        component={Logando}
        options={{
          headerShown: false,
          unmountOnBlur: true
        }}
      />
      <Drawer.Screen
      name='Mapa'
      component={MenuLateral}
      options={{
        unmountOnBlur: true,
      }}
      />
      <Drawer.Screen
      name='Perfil'
      component={Perfil}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Conversas'
      component={Conversas}
      options={{
        unmountOnBlur: true
      }}
      />
      <Drawer.Screen
      name='Alugueis'
      component={Alugueis}
      options={{
        unmountOnBlur: true
      }}
      />
    </Drawer.Navigator>
  );
}

function NavegacaoTelas(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Login}>
        <Stack.Screen
          name='Login'
          component={Login}
          options={{
            headerShown: false,
            unmountOnBlur: true,
          }}
        />
        <Stack.Screen 
          name='Conta'
          component={Conta}
          options={{
            title: 'Crie seu Usuário',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Contato'
          component={Contato}
          options={{
            title: 'Adicione seu Contato',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Alugar'
          component={Alugar}
          options={{
            title: 'Escolha o período',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Pagamento'
          component={Pagamento}
          options={{
            title: 'Forma de Pagamento',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Alugando'
          component={Alugando}
          options={{
            headerShown: false,
            title: 'Forma de Pagamento',
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Logando'
          component={Logar}
          options={{
            headerShown: false,
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Cadastro'
          component={Cadastro}
          options={{
            title: 'Adicione sua Foto de Perfil',
            headerShown: false,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen
          name='Chat'
          component={Chat}
          options={{
            title: 'Chat',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
        <Stack.Screen 
          name='Mapa'
          component={MenuLateral}
          options={{
            headerShown: false,
            unmountOnBlur: true
          }}
        />
        <Stack.Screen 
          name='Garagem'
          component={Garagem}
          options={{
            title: 'Detalhes',
            headerShown: true,
            headerTitleAlign: 'center',
            headerTitleStyle: 'bold',
            unmountOnBlur: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Routes = () => {
  return (
    <NavegacaoTelas />
  );
}

export default Routes;