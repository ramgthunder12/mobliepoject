import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    Avatar,
    WelcomeImage,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    InnerContainer,
    WelcomeContainer,
    ButtonText,
    Line,
} from '../../components/styles';

const Welcome = ({navigation, route}) => {
    return (
        <>
            <StatusBar style="light" />
            <InnerContainer>
                <WelcomeImage resizeMode="cover" source={require('../../assets/expo-bg1.png')}/>
                <WelcomeContainer>
                    <StyledFormArea>
                        <PageTitle welcome={true}>Welcome Buddy!</PageTitle>
                        <SubTitle welcome={true}>{'olga Simpson'}</SubTitle>
                        <SubTitle welcome={true}>{'olgasimp@gmail.com'}</SubTitle>
                        <Avatar resizeMode="cover" source={require('../../assets/expo-bg1.png')} />
                        <Line />
                        <StyledButton onPress={() => {navigation.navigate('Login');}}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                    </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};

export default Welcome;