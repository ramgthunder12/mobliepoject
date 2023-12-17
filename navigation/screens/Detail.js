import React, { useState, useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Image, StyleSheet, TextInput, Alert, FlatList, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Card } from "@rneui/themed";
import { Rating } from "react-native-ratings";
import { AppContext } from "../../AppContext";
import axios from "axios";

const Detail = ({ navigation }) => {

  const { id, apiUrl, common } = useContext(AppContext);//전역변수
  const url = apiUrl + "review/";
  const alcoholOneUrl = apiUrl + "alcohols/"
  const route = useRoute();
  const { alcohol } = route.params;

  const [reviews, setReviews] = useState([]); // 리뷰 목록을 저장할 상태
  const [visibleReviews, setVisibleReviews] = useState([]); // 화면에 보이는 리뷰 목록
  const [ratingValue, setRatingValue] = useState(0.0);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3); // 초기에 보이는 리뷰
  const [showLoadMore, setShowLoadMore] = useState(true); // 더 불러오기 버튼 보이기 여부
  const [add_review, setAdd_review] = useState([]);

  const [TasteNotes, setTasteNotes] = useState([]); //테이스팅노트
  const [alcoholImage, setAlcoholImage] = useState({}); //alcoholId : url

  const [review, setReview] = useState({ text: '' });
  const [addReviewText, setAddReviewText] = useState('');

  const responseAlcoholData = "";
  
  if (!alcohol || typeof alcohol !== 'object' || !alcohol.alcoholNumber) {
    // alcohol이 정의되지 않았거나 alcohol.alcoholNumber 속성이 없는 경우
    // 에러 처리 또는 기본값 설정을 추가하세요.
    console.error('Invalid alcohol data:', alcohol);
    // 또는 기본값을 설정하려면 다음과 같이 사용합니다.
    // const alcohol = { alcoholNumber: 'default' };
  }
  const fetchReviews = async () => {
    try {
      const response = await reviewListUpdate();
      setReviews(response.data); // 리뷰 목록을 상태에 설정
      // 초기에 보이는 리뷰 개수 설정
      const initialVisibleReviews = response.data.slice(0, visibleReviewCount);
      setVisibleReviews(initialVisibleReviews);
      // "Load More" 버튼 토글 설정
      setShowLoadMore(visibleReviewCount < response.data.length);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // 에러 처리 로직을 추가하세요.
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const imagePrint = (url) => {
    if (url === null) {
      return null;
    } else {
      return { uri: url };
    }
  };
  const alcoholInfoRefresh = async () => {
    try {
      const response = await axios.get(`${alcoholOneUrl}/${alcohol.alcoholNumber}`);
      //이거 값 들어가는지 확인하기 ->그래서 const itemDetail에서 let itemDetail로 바꿈
      itemDetail.avgStar = response.avgStar;

    } catch (error) {
      console.log(error);
      console.error('Error submitting alcoholInfoRefresh:', error);
      // 에러 처리 로직을 추가하세요.
    }
  };
  const reviewListUpdate = async () => {
    try {
      const response = await axios.get(`${url}/${alcohol.alcoholNumber}`);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!reviewListUpdate 확인");
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error);
      console.error('Error submitting reviewListUpdate:', error);
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

  const addReview = async () => {
    //data 요청 보내는 값
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

      console.log('Submitted Review:', addReview);

      // 평균 별점 업데이트
      const averageRating = alcoholInfoRefresh();
      // 리뷰 목록 업데이트
      reviewListUpdate();
      Alert.alert('리뷰가 제출되었습니다.');
    } catch (error) {
      console.log(error);
      console.error('Error submitting review:', error);
      // 에러 처리 로직을 추가하세요.
    }

  };


  // Load more reviews function
  const loadMoreReviews = () => {
    const nextVisibleReviewCount = visibleReviewCount + 5; // Increase the count by 2
    setVisibleReviewCount(nextVisibleReviewCount);

    // Update the visible reviews based on the new count
    const nextVisibleReviews = reviews.slice(0, nextVisibleReviewCount);
    setVisibleReviews(nextVisibleReviews);

    // Toggle the "Load More" button based on whether more reviews are available
    setShowLoadMore(nextVisibleReviewCount < reviews.length);
  };

  // Close reviews function
  const closeReviews = () => {
    setVisibleReviewCount(2); // Reset to the initial count
    const firstVisibleReviews = reviews.slice(0, visibleReviewCount);
    setVisibleReviews(firstVisibleReviews);

    // Toggle the "Load More" button
    setShowLoadMore(true);


    
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('ko-KR', options);
    return formattedDate;
  };
  const handleMenuItemPress = (menuItem) => {
    navigation.navigate("UserInfo", { alcohol: menuItem});
  };
  const imagePrintUsingTastenote = async (num) => {
    //노트 주류 사진 가져오기
    const url = apiUrl + "alcohols/" + num;

    try {
      const response = await axios.get(url);

      if (response.data && response.data.picture !== null) {
        setAlcoholName((prevImage) => ({
          ...prevImage,
          [num]: response.data.name,
        }));

        setAlcoholStar((prevImage) => ({
          ...prevImage,
          [num]: response.data.avgStar,
        }));

        return response.data.picture;
      } else {
        return null;
      }
    } catch (error) {
      // API 호출 중 에러가 발생한 경우
      console.log("error : " + error);
    }
  };
  const handleTasteNotePress = async (menuItem) => {
    //note얻으려면 id랑 주류번호 -> list<tastenote>
    //통신 -> list얻으면 -> 주류 번호 해당 된것만 다시 저장-> list 주루륵 뿌려줌
    //새로운 api -> list얻으면 -> viewTasteNote 주루룩 뿌려줌
    try {

      const response = await axios.get(`${apiUrl}/tastenote/${item.id}`);
      if (response.data) {
        setTasteNotes(response.data);

        const promises = response.data.map(async (item) => {
          const num = parseInt(item.alcohol_number, 10);
          if (alcoholImage[num] === undefined) {
            const image = await imagePrintUsingTastenote(num);
            setAlcoholImage((prevImage) => ({
              ...prevImage,
              [num]: image,
            }));
          }
        });
        await Promise.all(promises);
      }
      
      //이거 값 들어가는지 확인하기 ->그래서 const itemDetail에서 let itemDetail로 바꿈
      itemDetail.avgStar = response.avgStar;

    } catch (error) {
      console.log(error);
      console.error('Error submitting alcoholInfoRefresh:', error);
      // 에러 처리 로직을 추가하세요.
    }
    navigation.navigate("ViewTasteNote", { alcohol: menuItem});//tasteNote에note를 줘야함
  };
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>술 상세 정보</Text>
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
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={addReview}
        >

          <Text style={styles.reviewButtonText}>리뷰 작성 완료</Text>
        </TouchableOpacity>
        <Text style={styles.reviewListTitle}>리뷰 목록</Text>
        <FlatList
          scrollEnabled={false}
          data={visibleReviews}
          keyExtractor={(item, index) => item.reviewNumber.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewItem}>
              <TouchableOpacity onPress={() => {handleTasteNotePress()}}>
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
              <TouchableOpacity onPress={() => {handleTasteNotePress()}}/* 해당 남의 테이스팅노트 */> 
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
    marginBottom: 16,
    textAlign: 'center',
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
    width: 350,
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