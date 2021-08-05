import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FlashMessage from 'react-native-flash-message';
import {Icon} from '@components';
import * as images from '@config/images';
import * as color from '@config/color';
import * as size from '@config/size';

import PhoneScreen from '../screens/#Phone';
import VerificationScreen from '../screens/#Verification';
import RegisterScreen from '../screens/#Register';
import MyProfileScreen from '../screens/#MyProfile';
import ProfileScreen from '../screens/#Profile';
import ContactScreen from '../screens/#Contact';
import ChatScreen from '../screens/#Chat';
import MessageScreen from '../screens/#Message';
import NewGroupScreen from '../screens/#NewGroup';
import MyGroupScreen from '../screens/#MyGroup';
import EditGroupScreen from '../screens/#EditGroup';
import NewContactScreen from '../screens/#NewContact';
import InitScreen from '../screens/#Init';
import SplashScreen from '../screens/#Splash';

import {AndroidBackHandler} from 'react-navigation-backhandler';
import {BackHandler} from 'react-native';
// import Test from '../screens/#Test';

import {AuthActions} from '@actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = (props) => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          {/* <Stack.Screen
            name="Test"
            component={Test}
            options={{headerShown: false, gestureEnabled: false}}
          /> */}
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="InitScreen"
            component={InitScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="PhoneScreen"
            component={PhoneScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="VerificationScreen"
            component={VerificationScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="MessageScreen"
            component={MessageScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="NewGroupScreen"
            component={NewGroupScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="MyGroupScreen"
            component={MyGroupScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="EditGroupScreen"
            component={EditGroupScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="NewContactScreen"
            component={NewContactScreen}
            options={{headerShown: false, gestureEnabled: false}}
          />
          <Stack.Screen
            name="TabNav"
            component={TabNav}
            options={{headerShown: false, gestureEnabled: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </>
  );
};

const TabNav = () => {
  return (
    <AndroidBackHandler
      onBackPress={() => {
        BackHandler.exitApp();
        return true;
      }}>
      <Tab.Navigator
        initialRouteName={'ContactScreen'}
        backBehavior={'none'}
        tabBarOptions={{
          style: {
            backgroundColor: color.primary,
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
          },
          labelStyle: {
            fontWeight: 'normal',
            fontSize: size.font.xs,
          },
          activeTintColor: color.third,
          inactiveTintColor: color.white,
        }}>
        <Tab.Screen
          name="ContactScreen"
          component={ContactScreen}
          options={{
            title: 'Contact',
            tabBarIcon: ({focused, iconColor, iconSize}) => (
              <Icon
                tintColor={focused ? color.third : color.white}
                source={images.icons.contact}
                size={20}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            title: 'Chat',
            tabBarIcon: ({focused, iconColor, iconSize}) => (
              <Icon
                tintColor={focused ? color.third : color.white}
                source={images.icons.chat}
                size={20}
              />
            ),
          }}
        />

        <Tab.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({focused, iconColor, iconSize}) => (
              <Icon
                tintColor={focused ? color.third : color.white}
                source={images.icons.profile}
                size={20}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </AndroidBackHandler>
  );
};

const mapStateToProps = (state) => {
  return {network: state.network};
};

const mapDispatchToProps = (dispatch) => {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
