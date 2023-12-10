import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { AppContext } from "../../AppContext";
import {
  StyledContainer,
  PageLogo,
  PageTitle,
  SubTitle,
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
  Colors,
} from "../../components/styles";

import { View, ActivityIndicator } from "react-native";

//formik  formik styled-components expo-constants
import { Formik } from "formik";

//colors
const { darkLight, brand, primary } = Colors;

// icon
import { Octicons, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";

import KeyboardAvoidingWrapper from "../../components/KeyboardAvodingWrapper";

import axios from "axios";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { setId, apiUrl } = useContext(AppContext);//전역변수

  const handleLogin = async (credentials, setSubmitting) => {
    //이메일, 비밀번호 확인
    handleMessage(null);
    const url = apiUrl+"members/login";

    const data = {
      id: credentials.id,
      password: credentials.password
    };

    try {
      const response = await axios.post(url, data);

      if (response.data) {
        setId(credentials.id);//전역변수 id 저장
        navigation.navigate('TabContainer');
      }
      else{
        handleMessage("No user information");
      }
      setSubmitting(false);
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log(error);
      setSubmitting(false);
      handleMessage("An error occurred. Check your network and try again");
    }
  };

  const handleMessage = (message, type = "FAILED") => {
    setMessage(message);
    setMessageType(type);
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageLogo
            resizeMode="contain"
            source={require("../../assets/expo-bg1.png")}
          />
          <PageTitle>First Drink</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ id: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              //로그인을 눌렀을 때
              if (values.id == "" || values.password == "") {
                handleMessage("Please fill all th fields");
                setSubmitting(false);
              } else {
                handleLogin(values, setSubmitting);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isSubmitting,
            }) => (
              <StyledFormArea>
                <MyTextInput
                  label="id"
                  icon="perm-identity"
                  placeholder="Please enter your ID"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("id")}
                  onBlur={handleBlur("id")}
                  value={values.id}
                  keyboardType="email-address"
                />

                <MyTextInput
                  label="password"
                  icon="lock"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MsgBox type={messageType}>{message}</MsgBox>
                {!isSubmitting && (
                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>
                )}

                {isSubmitting && (
                  <StyledButton>
                    <ActivityIndicator size="large" color={primary} />
                  </StyledButton>
                )}

                <Line />
                <ExtraView>
                  <ExtraText>Don't have an account already? </ExtraText>
                  <TextLink onPress={() => navigation.navigate("Signup")}>
                    <TextLinkContent>Signup</TextLinkContent>
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

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon style={{top: 35, left: 10}}>
        <MaterialIcons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={darkLight}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
