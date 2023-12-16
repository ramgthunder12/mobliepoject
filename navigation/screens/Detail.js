import React, { useState, useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Image, StyleSheet, TextInput, Alert, FlatList, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Card } from "@rneui/themed";
import { Rating } from "react-native-ratings";
import { AppContext } from "../../AppContext";
import axios from "axios";

const Detail  = ({ navigation }) => {
  
  const { id, apiUrl, common } = useContext(AppContext);//전역변수
  const url = apiUrl+"review/";
  const route = useRoute();
  const { alcholId } = route.params;
          

  const [reviews, setReviews] = useState([]); // 리뷰 목록을 저장할 상태
  const [visibleReviews, setVisibleReviews] = useState([]); // 화면에 보이는 리뷰 목록
  const [ratingValue, setRatingValue] = useState(1);
  const [visibleReviewCount, setVisibleReviewCount] = useState([]); // 초기에 보이는 리뷰 개수
  const [showLoadMore, setShowLoadMore] = useState(true); // 더 불러오기 버튼 보이기 여부
  const [add_review, setAdd_review] = useState([]);

  const [review, setReview] = useState('');
  const [addReviewText, setAddReviewText] = useState('');

  const itemDetail = {
    id: 1,
    image: require('../../images/alcholicons/sd.jpg'),
    name: '가상의 술', // 이미지 파일의 경로에 맞게 수정
    price: 10000,
    description: '가상의 술에 대한 설명이 들어갑니다.',
  };
  // const fetchReviews = async () => {//주류 리뷰 데이터 불러오기
  //   const url = apiUrl+"review/"+alcholId;

  //   try {
  //     const response = await axios.get(url);
      

  //     if (response.data) {
  //       const fetchedReviews = response.data;
  //       setReviews(fetchedReviews);
  //       const firstVisibleReviews = fetchedReviews.slice(0, visibleReviewCount);
  //       setVisibleReviews(firstVisibleReviews);
  //       setShowLoadMore(visibleReviewCount < fetchedReviews.length);
       
  //     }
  //   } catch (error) {
  //     // API 호출 중 에러가 발생한 경우
  //   }

  // };

  // const addReviews = async (common, starpoint, num, info) => {//리뷰 등록
  //   const url = apiUrl+"review/";

  //   const data={
  //     id: id,
  //     common : common,
  //     review_starpoint : starpoint,
  //     creation_date : "2023-12-10T00:00:00",//시간 데이터 넣을수있는지
  //     alcohol_number : num,
  //     review_info : info
  //   };

  //   try {
  //     const response = await axios.post(url, data);

  //     if (response.data) {
  //       const fetchedReviews = response.data;
  //       setReviews(fetchedReviews);
  //       const firstVisibleReviews = fetchedReviews.slice(0, visibleReviewCount);
  //       setVisibleReviews(firstVisibleReviews);
  //       setShowLoadMore(visibleReviewCount < fetchedReviews.length);
       
  //     }
  //   } catch (error) {
  //     // API 호출 중 에러가 발생한 경우
  //   }

  // };
 
  // 리뷰 목록과 리뷰 작성 상태


  // 리뷰 평균 별점 계산 함수
  const calculateAverageRating = () => {
    if (reviews.length === 0) {
      return 0; // 리뷰가 없는 경우 0 반환
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };
  // // 리뷰 제출 함수
  // const handleReviewSubmit = () => {
  //   // 리뷰 목록 업데이트
  //   const newReview = {
  //     id: reviews.length + 1,
  //     rating: ratingValue,
  //     comment: review,
  //   };

  //   setReviews([...reviews, newReview]);

  //   // 리뷰 작성 후 필요한 로직을 추가하세요.
  //   console.log('Submitted Review:', newReview);

  //   // 평균 별점 업데이트
  //   const averageRating = calculateAverageRating().toFixed(1);
  //   Alert.alert('리뷰가 제출되었습니다.', `평균 별점: ${averageRating}`, [
  //     { text: '확인' },
  //   ]);
  // };
  // // Like function
  // const handleLike = (reviewId) => {
  //   // Find the review by ID
  //   const updatedReviews = reviews.map((review) =>
  //     reviews.id === reviewId
  //       ? { ...reviews, liked: !review.liked }
  //       : reviews
  //   );
  const addReview = async () => {
    //data 요청 보내는 값
    const rqdata = {id : id, common : common, review_starpoint : ratingValue, alcohol_number : alcholId, review_info : review.text};
  
    try {
      const response = await axios.post(url, rqdata);

      //리뷰목록 전체 업데이트 하기
      
      //리뷰 목록 보여주기
      
      //response.data는 응답 온 값  
      // const data = {
      //   id: id,
      //   common: response.common,
      //   review_starpoint: response.starpoint,
      //   creation_date: response.date,
      //   comment: response.comment,
      //   alcohol_number: response.num,
      //   review_info: response.info,
      // };
      
      // 리뷰 등록 API 호출
  
      // 리뷰 작성 후 필요한 로직을 추가하세요.
      console.log('Submitted Review:', addReview);
  
      // 평균 별점 업데이트
      const averageRating = calculateAverageRating(5).toFixed(1);
      Alert.alert('리뷰가 제출되었습니다.', `평균 별점: ${averageRating}`, [
        { text: '확인' },
      ]);
    } catch (error) {
      console.log(error);
      console.error('Error submitting review:', error);
      // 에러 처리 로직을 추가하세요.
    }
    
  };
  
  const fetchReviews = async () => {
    try {
      // '/review/alcholId'에 GET 요청을 보냅니다.
      const response = await axios.get(`url${alcholId}`);
      // 가져온 리뷰 목록을 상태에 업데이트합니다.
      setReviews(response.data);
      // 초기에는 몇 개의 리뷰를 보여줄지 설정합니다.
      setVisibleReviewCount(2);
      setShowLoadMore(response.data.length > 2);
      // 첫 번째로 보일 리뷰들을 설정합니다.
      setVisibleReviews(response.data.slice(0, 2));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // 에러 처리 로직을 추가하세요.
    }
  };
  // 컴포넌트가 처음 로드될 때 리뷰 목록을 가져옵니다.
  useEffect(() => {
    fetchReviews();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 로드될 때 한 번만 실행되게 합니다.


  // Load more reviews function
  const loadMoreReviews = () => {
    const nextVisibleReviewCount = visibleReviewCount + 2; // Increase the count by 2
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
        <Image source={itemDetail.image} style={styles.image} />
        {/* 평균 별점을 나타내는 UI */}
        <View style={styles.averageRatingContainer}>
          <Text style={styles.averageRatingText}>평균 별점:</Text>
          <Rating
            readonly
            startingValue={calculateAverageRating()}
            imageSize={20}
          />
          <Text style={styles.averageRatingNumber}>
            ({calculateAverageRating().toFixed(1)})
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
          startingValue={calculateAverageRating()} // 평균 별점으로 변경
          onFinishRating={(rating) => setRatingValue(rating)}
          style={{ paddingVertical: 10 }}
        />
        {/* 리뷰 작성 UI */}
        <Text style={styles.reviewTitle}>리뷰 작성</Text>
        <TextInput
          style={styles.reviewInput}
          placeholder="리뷰를 작성하세요"
          multiline
          value={review}
          onChangeText={(review) => setReview(review.text)}
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
    keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
    renderItem={({ item }) => (
      <View style={styles.reviewItem}>
                <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
                <Image
                  source={require('../../images/profile/defaultProfile.png')} // 이미지의 경로를 정확히 지정해야 합니다.
                  style={{ width: 24, height: 24, marginTop: 10, justifyContent: 'flex-start',
                 }}
                />
              </TouchableOpacity>

        <Text style={styles.reviewItemText}>
          별점: {item.rating}, 리뷰: {item.review_info}
        </Text>  
              <TouchableOpacity onPress={() => navigation.navigate('UserInfo')}>
          <Image source={require('../../images/profile/note.png')} // 이미지의 경로를 정확히 지정해야 합니다.
            style={{ width: 24, height: 24, padding: 10, marginTop: 5, }}
          />
        </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('UserInfo')}>
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
});

export default Detail;