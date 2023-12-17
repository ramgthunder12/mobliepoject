import React, { useState, useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { AppContext } from "../../AppContext";
// formik
import { Formik } from "formik";

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
} from "../../components/styles";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";

//colors
const { darkLight, brand, primary } = Colors;

// icon
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@rneui/themed";

import KeyboardAvoidingWrapper from "../../components/KeyboardAvodingWrapper";

import axios from "axios";

const Signup = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const { setId, apiUrl } = useContext(AppContext);//전역변수

  const handleSignup = async (credentials, setSubmitting) => {
    //회원가입 시키기
    handleMessage(null);
    const url = apiUrl+"members/signup";

    const data = {
      nickname: credentials.nickname,
      id: credentials.id,
      password: credentials.password,
      phone: phoneNumber,
    };

    try {
      const response = await axios.post(url, data);

      if (response.data) {
        setId(credentials.id);//전역변수 id 저장
        navigation.navigate("TabContainer");
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

  const formatPhoneNumber = (input) => {
    // 숫자가 아닌 문자 제거
    const phoneNumber = input.replace(/\D/g, "");

    // 입력 길이가 10자 이하인지 확인
    if (phoneNumber.length <= 11) {
      // 하이픈으로 핸드폰 번호 포맷
      return phoneNumber.replace(
        /(\d{3})(\d{1,4})?(\d{1,4})?/,
        (match, p1, p2, p3) => {
          let formattedNumber = p1;
          if (p2) formattedNumber += `-${p2}`;
          if (p3) formattedNumber += `-${p3}`;
          return formattedNumber;
        }
      );
    } else {
      // 입력 길이가 10자보다 크면 자르기
      return phoneNumber
        .slice(0, 11)
        .replace(/(\d{3})(\d{1,4})?(\d{1,4})?/, (match, p1, p2, p3) => {
          let formattedNumber = p1;
          if (p2) formattedNumber += `-${p2}`;
          if (p3) formattedNumber += `-${p3}`;
          return formattedNumber;
        });
    }
  };

  const handlePhoneChange = (value) => {
    setPhoneNumber(formatPhoneNumber(value));
  };

  return (
    <KeyboardAvoidingWrapper>
      <StyledContainer>
        <StatusBar style="dark" />
        <InnerContainer>
          <PageTitle>First Drink</PageTitle>
          <SubTitle>Account Signup</SubTitle>

          <Formik
            initialValues={{
              nickname: "",
              id: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={(values, { setSubmitting }) => {
              //로그인 버튼 눌렀을 때
              values = { ...values };
              if (
                values.id == "" ||
                values.password == "" ||
                values.nickname == "" ||
                values.confirmPassword == "" ||
                phoneNumber == ""
              ) {
                handleMessage("Please fill all th fields");
                setSubmitting(false);
              } else if (values.password !== values.confirmPassword) {
                handleMessage("Passwords do not match");
                setSubmitting(false);
              } else if (phoneNumber.length !== 13) {
                handleMessage("Please fill phone number");
                setSubmitting(false);
              } else {
                handleSignup(values, setSubmitting); //회원가입 시키기
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
                  label="Nick Name"
                  placeholder="Richard Barnes"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("nickname")}
                  onBlur={handleBlur("nickname")}
                  value={values.nickname}
                  icon="person"
                  type="octicon"
                />
                <MyTextInput
                  label="Id"
                  onChangeText={handleChange("id")}
                  onBlur={handleBlur("id")}
                  value={values.id}
                  icon="identifier"
                  type="material-community"
                />
                <MyTextInput
                  label="phone number"
                  placeholder="010-0000-0000"
                  placeholderTextColor={darkLight}
                  onChangeText={handlePhoneChange}
                  onBlur={() => {}}
                  value={phoneNumber}
                  icon="phone"
                  type="antdesign"
                />
                <MyTextInput
                  label="Password"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  icon="lock"
                  type="octicon"
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                <MyTextInput
                  label="Confirm Password"
                  placeholder="* * * * * * * *"
                  placeholderTextColor={darkLight}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  icon="lock"
                  type="octicon"
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
                  <ExtraText>Already have an account? </ExtraText>
                  <TextLink onPress={() => navigation.navigate("Login")}>
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

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidePassword,
  type,
  ...props
}) => {
  return (
    <View>
      <LeftIcon style={{ top: 35, left: 10 }}>
        <Icon name={icon} type={type} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>

      <StyledTextInput {...props} />

      {isPassword && (
        <RightIcon
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
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

export default Signup;
