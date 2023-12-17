import React, { useState, useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Image, StyleSheet, TextInput, Alert, FlatList, ScrollView, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Card, Icon } from "@rneui/themed";
import { Rating } from "react-native-ratings";
import { AppContext } from "../../AppContext";
import axios from "axios";

const Detail = ({ navigation }) => {

  const { id, apiUrl, common } = useContext(AppContext);//전역변수
  const route = useRoute();
  const { alcohol } = route.params;

  const [reviews, setReviews] = useState([]); // 리뷰 목록을 저장할 상태
  const [visibleReviews, setVisibleReviews] = useState([]); // 화면에 보이는 리뷰 목록
  const [ratingValue, setRatingValue] = useState(0.0);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3); // 초기에 보이는 리뷰

  const [review, setReview] = useState({ text: '' });

  const fetchReviews = async () => {//리뷰 불러오기
    const url = apiUrl + "review/";
    try {
      const response = await axios.get(`${url}/${alcohol.alcoholNumber}`);
      console.log('리뷰 업데이트 : '+response.data);

      setReviews(response.data); // 리뷰 목록을 상태에 설정
      // 초기에 보이는 리뷰 개수 설정
      const initialVisibleReviews = response.data.slice(0, visibleReviewCount);
      setVisibleReviews(initialVisibleReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // 에러 처리 로직을 추가하세요.
    }
  };

  const alcoholInfoRefresh = async () => {
    const url = apiUrl + "alcohols/"
    try {
      const response = await axios.get(`${url}/${alcohol.alcoholNumber}`);
      //이거 값 들어가는지 확인하기 ->그래서 const itemDetail에서 let itemDetail로 바꿈
      itemDetail.avgStar = response.avgStar;

    } catch (error) {
      console.log(error);
      console.error('Error submitting alcoholInfoRefresh:', error);
      // 에러 처리 로직을 추가하세요.
    }
  };

  let itemDetail = {
    number: alcohol.alcoholNumber,
    image: alcohol.picture,
    name: alcohol.name,
    price: alcohol.price,
    description: alcohol.tasteDetail,
    avgStar: alcohol.avgStar,
    picture: alcohol.picture
  };

  const addReview = async () => {//리뷰 추가
    //data 요청 보내는 값
    const url = apiUrl + "review/";

    const requestData = { 
      id: id, 
      common: common, 
      review_starpoint: ratingValue, 
      alcohol_number: itemDetail.number, 
      review_info: review.text 
    };
    console.log(requestData);

    try {
      const response = await axios.post(url, requestData);

      if(response.data){
        console.log('리뷰 제출');
      }

      alcoholInfoRefresh();// 평균 별점 업데이트

      Alert.alert('리뷰가 제출되었습니다.');
    } catch (error) {
      console.log(error);
      console.error('Error submitting review:', error);
      // 에러 처리 로직을 추가하세요.
    }

  };


  const loadMoreReviews = () => {//리뷰 더 불러오기
    const nextVisibleReviewCount = visibleReviewCount + 5; // Increase the count by 2
    setVisibleReviewCount(nextVisibleReviewCount);

    // Update the visible reviews based on the new count
    const nextVisibleReviews = reviews.slice(0, nextVisibleReviewCount);
    setVisibleReviews(nextVisibleReviews);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);
    return formattedDate;
  };

  const handleTasteNotePress = async (id, num) => {//사용자 노트 가져오기
    const url = apiUrl + "/tastenote/alcohols/";

    const requestData = { 
      id: id, 
      alcohol_number: num
    };

    console.log(requestData);

    try {

      const response = await axios.post(url, requestData);
      if (response.data) {
        navigation.navigate("ViewTasteNote", { note: response.data[0], image: itemDetail.image, name: itemDetail.name, avgStar: itemDetail.avgStar});
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();//리뷰 불러오기
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{flexDirection: "row", justifyContent: "space-between", marginBottom: 15}}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>술 상세 정보</Text>
        <TouchableOpacity
          onPress={()=>navigation.navigate("WriteDownNote", { alcoholId: itemDetail.number, alcoholName: itemDetail.name, alcoholImage: itemDetail.image })}
          style={{flexDirection: "row", marginTop: 8, padding: 7, marginRight: -10}}
        >
          <Icon name="note" type='simple-line-icon' size={28}/>
        </TouchableOpacity>
        </View>
        
        
        <View style={styles.containerCenter}>
          <Image source={{ uri: alcohol.picture }} style={styles.coverImage} resizeMode="cover" />
        </View>


        {/* 평균 별점을 나타내는 UI */}
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingText}>평균 별점:</Text>
          <Rating
            readonly
            startingValue={itemDetail.avgStar}
            imageSize={20}
          />
          <Text style={styles.averageRatingNumber}>
            ({itemDetail.avgStar.toFixed(1)})
          </Text>
        </View>
        <Text style={styles.detailText}>
          <Text style={styles.labelText}>술 이름:</Text> {itemDetail.name}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.labelText}>가격:</Text> ₩{itemDetail.price}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.labelText}>설명:</Text> {itemDetail.description}
        </Text>
        <Card.Divider style={{ marginTop: 20 }} />
        <View style={styles.noteTitleView}>
          <Text style={styles.noteTitleText}>별점을 선택해주세요</Text>
        </View>
        <Rating
          startingValue={0} // 별 처음 값 0으로 설정
          onFinishRating={(rating) => setRatingValue(rating.toFixed(1))}
          style={{ paddingVertical: 10 }}
        />
        {/* 리뷰 작성 UI */}
        <Text style={styles.reviewTitle}>리뷰 작성</Text>
        <TextInput
          style={styles.reviewInput}
          placeholder="리뷰를 작성하세요"
          multiline
          value={review.text}
          onChangeText={(reviewText) => setReview({ text: reviewText })}
        />
        <View style={{flexDirection: "row", justifyContent: "center"}}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={addReview}
        >
          <Text style={styles.reviewButtonText}>리뷰 작성 완료</Text>
        </TouchableOpacity>
        </View>
        <Text style={styles.reviewListTitle}>리뷰 목록</Text>
        <FlatList
          scrollEnabled={false}
          data={visibleReviews}
          keyExtractor={(item, index) => item.reviewNumber.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <TouchableOpacity onPress={() => navigation.navigate("UserInfo", { id: item.id})}>
                <Text>
                  <Image
                    source={require('../../images/profile/defaultProfile.png')} // 이미지의 경로를 정확히 지정해야 합니다.
                    style={{
                      width: 24, height: 24, marginTop: 10, justifyContent: 'flex-start'
                    }}
                    
                  />
                   {"  "}{item.id}
                </Text>
                
                
              </TouchableOpacity>
{/* {{
    "alcohol_number": 53,
    "common": "Y",
    "creationDate": "2023-12-16T17:31:22.000+00:00",
    "id": "test",
    "picture": null,
    "reviewInfo": "당신은 곳이에요!!!",
    "reviewNumber": 29,
    "review_info": "당신은 곳이에요!!!",
    "review_starpoint": 0,
  } 이거 보고 item안의 값 참고하기} */}
              <Text style={styles.reviewItemText}>
                별점: {item.review_starpoint}, 날짜: {formatDate(item.creationDate)}
              </Text>
              <Text style={styles.reviewItemText}>
                {item.reviewInfo}
              </Text>
              <TouchableOpacity onPress={() => handleTasteNotePress(item.id, item.alcohol_number)}/* 해당 남의 테이스팅노트 */> 
                <Image source={require('../../images/profile/note.png')} // 이미지의 경로를 정확히 지정해야 합니다.
                  style={{ width: 24, height: 24, padding: 10, marginTop: 5, }}
                />
              </TouchableOpacity>
            </View>
          )}

        />


        <TouchableOpacity onPress={loadMoreReviews}>
          <Text style={{ color: 'blue', marginTop: 10 }}>더 보기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  detailText: {
    marginBottom: 8,
    textAlign: 'left',
  },
  labelText: {
    fontWeight: 'bold',
  },

  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 70,
  },
  reviewButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    width: Dimensions.get("window").width-50,
    borderRadius: 5,
    alignItems: 'center',
    height: 50,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 16,
  },

  averageRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  averageRatingText: {
    fontSize: 16,
    marginRight: 5,
  },
  averageRatingNumber: {
    fontSize: 16,
    color: 'gray',
  },
  homeButton: {
    flexDirection: 'row',
    marginTop: 15,
  },//좋아요 순위=추천순
  noteTitleView: {
    alignItems: 'center',
    marginBottom: 10,
  },
  noteTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  reviewItemToUser: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewItemText: {
    fontSize: 15,
  },
  coverImage: {
    width: 100, // 큰 이미지 크기로 조절
    height: 170, // 큰 이미지 크기로 조절
    marginRight: 20,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // 배경색을 원하는 색으로 지정하세요
  },
  imagecenter: {
    height: 100,
    width: 170,
    resizeMode: 'cover',
  },
});

export default Detail;