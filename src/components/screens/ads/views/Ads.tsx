import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import React, { useCallback, useState } from 'react'
import AdsViewModel from '../viewModel/AdsViewModel';
import { defaultPostRepo } from '@/api/features/post/PostRepo';
import Post from '@/components/common/post/views/Post';
import { Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { DateTransfer } from '@/utils/helper/DateTransfer';
import { CurrencyFormat } from '@/utils/helper/CurrencyFormat';
import { AdsCalculate } from '@/utils/helper/AdsCalculate';

interface AdsProps {
    postId: string
}

const Ads: React.FC<AdsProps> = ({ postId }) => {
    const price =300000;
    const { brandPrimary, backgroundColor } = useColor();
	const [method, setMethod] = useState("momo");
	const [showDatePicker, setShowDatePicker] = useState(false);
	const { language, localStrings } = useAuth();
	const [diffDay, setDiffDay] = useState(1);
	const [refreshing, setRefreshing] = useState(false);
	const { getPostDetail, post, loading, advertisePost, adsLoading, getAdvertisePost, page, ads, adsAll } =
		AdsViewModel(defaultPostRepo);
    const router = useRouter();

    const getDateTomorrow = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };

    const [date, setDate] = useState<Date>(getDateTomorrow());

    const paymentMethods = [
        {
			id: "momo",
			name: "MoMo",
			image: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
		},
	];

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await getPostDetail(postId);
            await getAdvertisePost(page, postId);
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    }

    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

    const renderPost = useCallback(() => {
        if (loading) {
          return (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          );
        } else {
          return (
            <Post post={post} noFooter>
              {post?.parent_post && <Post post={post?.parent_post} isParentPost />}
            </Post>
          );
        }
      }, [post, loading]);
    

  return (
    <div>
        <div className="mb-2 flex items-center">
        <ArrowLeftOutlined
          className="text-xl cursor-pointer text-blue-500"
          onClick={() => router.back()}
        />
        <h1 className="text-2xl font-bold ml-2">{localStrings.Ads.Ads}</h1>
    </div>
    <div className="flex-1 overflow-auto">
      {/* bài viết được chọn */}
      {renderPost()}

      {post?.is_advertisement ? (
        <>
          {/* Lịch sử Quảng Cáo */}
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full w-2.5 h-2.5 mr-2" />
              <span className="text-green-500 font-bold">{localStrings.Ads.ActiveCampaign}</span>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow-lg mt-4">
            <span className="font-semibold">{localStrings.Ads.Campaign} #1</span>
            <div className="flex items-center space-x-2">
              {/* <FontAwesome name="calendar" size={20} color={brandPrimary} /> */}
              <span>{DateTransfer(ads?.start_date)}</span>
              <span>{DateTransfer(ads?.end_date)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="p-4">
          {/* Thông tin quảng cáo */}
          <div className="mb-4">
            <span className="text-lg font-bold mb-2">{localStrings.Ads.TimeAndBudget}</span>
            <span className="text-gray-500">{localStrings.Ads.Minimum.replace("{{price}}", `${CurrencyFormat(price)}`)}</span>
            <span className="text-gray-500">VAT: 10%</span>
          </div>

          {/* Chọn thời gian quảng cáo */}
          {/* <TouchableOpacity
            onClick={() => setShowDatePicker(true)}
            className="flex flex-row items-center border border-gray-300 p-4 mb-4 rounded-xl"
          >
            <Ionicons name="calendar" size={24} color={brandPrimary} />
            <Text className="pl-4">
              {`${localStrings.Ads.TimeAds} ${DateTransfer(date)} (${diffDay} ${localStrings.Public.Day.toLowerCase()})`}
            </Text>
          </TouchableOpacity> */}

          {/* <MyDateTimePicker
            value={date}
            show={showDatePicker}
            onCancel={() => setShowDatePicker(false)}
            onSubmit={(selectedDate) => setDate(selectedDate)}
            minDate={getTomorrow()}
          /> */}

          {/* Ngân sách */}
          <div className="flex items-center border border-gray-300 p-4 mb-4 rounded-xl">
            {/* <Ionicons name="cash" size={24} color={brandPrimary} /> */}
            <span className="pl-4">{localStrings.Ads.BudgetAds} {CurrencyFormat(AdsCalculate(diffDay, price))}</span>
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex flex-row mt-4">
            <span className="font-semibold mr-4">{localStrings.Ads.PaymentMethod}</span>
            <div className="flex justify-around w-full">
              {/* {paymentMethods.map((item) => (
                // <TouchableOpacity
                //   key={item.id}
                //   onPress={() => setMethod(item.id)}
                //   className={`border border-gray-300 p-2 rounded-xl ${method === item.id ? "bg-green-100" : ""}`}
                // >
                //   <img src={item.image} alt={item.name} className="w-12 h-12" />
                // </TouchableOpacity>
              ))} */}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default Ads