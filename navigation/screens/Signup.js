import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

import {
    StyledContainer,
    PageTitle,
    StyledInputLabel,
    StyledFormArea,
    StyledButton,
    StyledTextInput,
    LeftIcon,
    RightIcon,
    InnerContainer,
    ButtonText,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent,
    SubTitle,
    Colors,
} from '../../components/components/styles';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

//colors
const { darkLight, brand, primary } = Colors;

// icon
import { Octicons, Ionicons } from '@expo/vector-icons';

import DateTimePicker from '@react-native-community/datetimepicker';

import KeyboardAvoidingWrapper from '../../components/components/KeyboardAvodingWrapper';

import axios from 'axios';

const Signup = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));

    const [message, setMessage]= useState();
    const [messageType, setMessageType] = useState();

    const [dob, setDob] = useState();

    const onChange = (event, selectedDate) =>{
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);
    }

    const showDatePicker = () => {
        setShow(true);
    }

    const handleSignup = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = 'https://715d-210-119-34-14.ngrok-free.app/users/';

        axios.post(url, credentials).then((respone) => {
            const result = respone.data;
            const {message, status, data} = result;

            if (status !== 'SUCESS') {
                handleMessage(message, status);
            } else {
                navigation.navigate('Welcome', {...data });
            }
            setSubmitting(false);
        })
        .catch(error => {
            console.log(error);
            setSubmitting(false);
            handleMessage('An error occurred. Check your network and try again');
        });
    };

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    };

    return (
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Flower Crib</PageTitle>
                <SubTitle>Account Signup</SubTitle>

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        style={{
                            backgroundColor: 'yellow',
                        }}
                    />
                )}

                <Formik
                    initialValues={{ name: '', email: '', dateOfBirth: '', password: '', confirmPassword: '' }}
                    onSubmit={(values, {setSubmitting }) => {
                        values = {...values, dateOfBirth: dob};
                        if(
                            values.email == '' || 
                            values.password == '' ||
                            values.name == '' ||
                            values.dateOfBirth == '' || 
                            values.confirmPassword == ''
                            ) {
                            handleMessage('Please fill all th fields');
                            setSubmitting(false);
                        } else if (values.password !== values.confirmPassword) {
                            handleMessage('Passwords do not match');
                            setSubmitting(false);
                        } else {
                            handleSignup(values, setSubmitting);
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values , isSubmitting}) => (
                        <StyledFormArea>
                            <MyTextInput
                                label="Full Name"
                                placeholder="Richard Barnes"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                icon="person"
                            />
                            <MyTextInput
                                label="Email Address"
                                placeholder="andyj@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                                icon="mail"
                            />
                            <MyTextInput
                                label="Date of Birth"
                                placeholder="YYYY - MM - DD"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('dateOfBirth')}
                                onBlur={handleBlur('dateOfBirth')}
                                value={dob ? dob.toDateString() : ''}
                                icon="calendar"
                                editable={false}
                                isDate={true}
                                showDatePicker={showDatePicker}
                            />
                            <MyTextInput
                                label="Password"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                icon="lock"
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <MyTextInput
                                label="Confirm Password"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                secureTextEntry={hidePassword}
                                icon="lock"
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword}
                            />
                            <MsgBox type={messageType}>{message}</MsgBox>

                            {!isSubmitting && <StyledButton onPress={handleSubmit}>
                            <ButtonText>Login</ButtonText>
                        </StyledButton>}

                        {!isSubmitting && <StyledButton>
                            <ActivityIndicator size="large" color={primary} />
                        </StyledButton>}
                            <Line />
                            <ExtraView>
                                <ExtraText>Already have an account? </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Login')}>
                                    <TextLinkContent>Login</TextLinkContent>
                                </TextLink>
                            </ExtraView>
                        </StyledFormArea>
                    )}
                </Formik>
            </InnerContainer>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
    return (
      <View>
        <LeftIcon>
          <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
  
        {isDate && (
          <TouchableOpacity onPress={showDatePicker}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
        )}
        {!isDate && <StyledTextInput {...props} />}
  
        {isPassword && (
          <RightIcon
            onPress={() => {
              setHidePassword(!hidePassword);
            }}
          >
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={darkLight} />
          </RightIcon>
        )}
      </View>
    );
  };

export default Signup;