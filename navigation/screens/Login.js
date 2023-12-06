import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";

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
import { Octicons, Fontisto, Ionicons } from "@expo/vector-icons";

import KeyboardAvoidingWrapper from "../../components/KeyboardAvodingWrapper";

import axios from "axios";

const Login = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleLogin = async (credentials, setSubmitting) => {
    //이메일, 비밀번호 확인
    handleMessage(null);
    const url = "https://715d-210-119-34-14.ngrok-free.app/users/";//email과 pw 비교하는 api 필요

    const data = {
      email: credentials.email,
      name: "jae",
    };

    try {
      const response = await axios.get(url);

      // 응답으로 받은 데이터에서 이메일을 비교하여 일치하는 사용자 찾기
      const matchingUser = response.data.find(
        (user) => user.email === credentials.email
      );

      if (matchingUser) {
        // 로그인 성공 처리 로직
        navigation.navigate("TabContainer");
      }
      setSubmitting(false);
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log(error);
      setSubmitting(false);
      handleMessage("An error occurred. Check your network and try again");
    }

    /*
    axios
      .post(url, credentials)
      .then((respone) => {
        const result = respone.data;
        console.log(result);
        const { message, status, data } = result;

        if (status !== "SUCESS") {
          handleMessage(message, status);
        } else {
          navigation.navigate("Welcome", { ...data[0] });
        }
        setSubmitting(false);
      })
      .catch((error) => {
        console.log(error);
        setSubmitting(false);
        handleMessage("An error occurred. Check your network and try again");
      });
      */
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
            resizeMode="cover"
            source={require("../../assets/expo-bg1.png")}
          />
          <PageTitle>First Drink</PageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values, { setSubmitting }) => {
              //로그인을 눌렀을 때
              if (values.email == "" || values.password == "") {
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
                  label="Email Address"
                  icon="mail"
                  placeholder="andy@gmail.com"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  keyboardType="email-address"
                />

                <MyTextInput
                  label="Password"
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
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
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
