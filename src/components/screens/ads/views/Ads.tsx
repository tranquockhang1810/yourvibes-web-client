import React, { useCallback, useEffect, useState } from "react";
import useColor from "@/hooks/useColor";
import Post from "@/components/common/post/views/Post";
import { useAuth } from "@/context/auth/useAuth";
import AdsViewModel from "../viewModel/AdsViewModel";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { DateTransfer, getDayDiff } from "@/utils/helper/DateTransfer";
import { CurrencyFormat } from "@/utils/helper/CurrencyFormat";
import dayjs from "dayjs";
import { AdsCalculate } from "@/utils/helper/AdsCalculate";
import { FaCalculator, FaCashRegister, FaAd } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Spin, Button, List, DatePicker, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const { Text } = Typography;
const Ads = ({ postId }: { postId: string }) => {
  const price = 30000;
  const { brandPrimary, backgroundColor } = useColor();
  const [method, setMethod] = useState("momo");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { language, localStrings } = useAuth();
  const [diffDay, setDiffDay] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const {
    getPostDetail,
    post,
    loading,
    advertisePost,
    adsLoading,
    getAdvertisePost,
    page,
    ads,
    adsAll,
    getTomorrow,
  } = AdsViewModel(defaultPostRepo);

  const [date, setDate] = useState<Date>(getTomorrow());

  const paymentMethods = [
    {
      id: "momo",
      name: "MoMo",
      image: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    },
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPostDetail(postId);
      await getAdvertisePost(page, postId);
    } finally {
      setRefreshing(false);
    }
  }, [postId, page]);

  const [isHistoryExpanded, setHistoryExpanded] = useState(false);

  useEffect(() => {
    if (postId) {
      getPostDetail(postId);
      getAdvertisePost(page, postId);
    }
  }, [postId]);

  const renderPost = useCallback(() => {
    if (loading) {
      return (
        <div
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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

  const renderAds = useCallback(() => {
    if (loading) return null;
    return (
      <>
        {post?.is_advertisement ? (
          <>
            {/* Advertisement history */}
            <div style={{ flexDirection: "row", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    height: 10,
                    width: 10,
                    backgroundColor: "green",
                    borderRadius: 5,
                    marginRight: 5,
                  }}
                />
                <span
                  style={{
                    fontSize: 16,
                    color: "green",
                  }}
                >
                  {localStrings.Ads.ActiveCampaign}
                </span>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div
                style={{
                  backgroundColor: "#f7f7f7",
                  padding: 20,
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  <span>{localStrings.Ads.Campaign} #1</span>
                  <FaCalculator size={20} color={brandPrimary} />
                </div>
                <div style={{ marginTop: 10 }}>
                  <span
                    style={{
                      fontSize: 14,
                      color: "gray",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {localStrings.Ads.Campaign}:
                    </span>{" "}
                    {DateTransfer(ads?.start_date)}
                  </span>
                  <br />
                  <span
                    style={{
                      fontSize: 14,
                      color: "gray",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {localStrings.Ads.End}:
                    </span>{" "}
                    {DateTransfer(ads?.end_date)}
                  </span>
                  <br />
                  <span
                    style={{
                      fontSize: 14,
                      color: "gray",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      {localStrings.Ads.RemainingTime}:
                    </span>{" "}
                    {ads?.day_remaining} {localStrings.Ads.Day}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Advertisement Information */}
            <div style={{ flex: 1, paddingLeft: 10, paddingRight: 10 }}>
              <div>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  {localStrings.Ads.TimeAndBudget}
                </span>
                <span
                  style={{
                    color: "gray",
                    fontSize: 14,
                  }}
                >
                  {localStrings.Ads.Minimum.replace(
                    "{{price}}",
                    `${CurrencyFormat(price)}`
                  )}
                </span>
                <span
                  style={{
                    color: "gray",
                    fontSize: 14,
                  }}
                >
                  VAT: 10%
                </span>
              </div>

              {/* Select advertising date */}
              <div>
                <FaCalculator size={24} color={brandPrimary} />
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    marginBottom: 5,
                    marginTop: 20,
                  }}
                >
                  {localStrings.Ads.TimeAds} {diffDay} {localStrings.Public.Day}
                </span>
                <DatePicker
                  value={dayjs(date)}
                  onChange={(date) => {
                    if (date) {
                      setDate(date.toDate());
                      setDiffDay(getDayDiff(date.toDate()));
                    }
                  }}
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current && current < dayjs().endOf("day")
                  }
                />
              </div>
              {/* Budget */}
              <div style={{ marginTop: 20 }}>
                <FaCashRegister size={24} color={brandPrimary} />
                <span style={{ paddingLeft: 20 }}>
                  {localStrings.Ads.BudgetAds}{" "}
                  {CurrencyFormat(AdsCalculate(diffDay, price))}
                </span>
              </div>

              {/* Payment Methods */}
              <div style={{ marginTop: 20 }}>
                <span style={{ fontWeight: "bold", marginRight: 10 }}>
                  {localStrings.Ads.PaymentMethod}
                </span>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {paymentMethods.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setMethod(item.id)}
                      title={item.name}
                      style={{
                        borderWidth: 1,
                        borderColor: method === item.id ? "#4CAF50" : "#ccc",
                        backgroundColor:
                          method === item.id ? "#E8F5E9" : "transparent",
                        padding: 5,
                        marginRight: 10,
                        borderRadius: 10,
                      }}
                    >
                      <img src={item.image} style={{ width: 50, height: 50 }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* New Advertisement Button */}
              <Button
                type="primary"
                icon={<FaAd />}
                onClick={() => {
                  advertisePost({
                    post_id: postId,
                    redirect_url: `/ads/${postId}`,
                    end_date: (
                      dayjs(date).format("YYYY-MM-DDT00:00:00") + "Z"
                    ).toString(),
                    start_date: (
                      dayjs().format("YYYY-MM-DDT00:00:00") + "Z"
                    ).toString(),
                  });
                }}
                style={{
                  marginTop: 20,
                  borderRadius: 8,
                  backgroundColor: brandPrimary,
                  color: "white",
                }}
              >
                {localStrings.Ads.Ads}
              </Button>
            </div>
          </>
        )}
      </>
    );
  }, [postId, adsLoading, ads, loading, post, date]);

  return (
    // <div style={{ flex: 1 }}>
    //   {/* Header */}
    //   <div style={{ backgroundColor: backgroundColor }}>
    //     <div
    //       style={{
    //         flexDirection: "row",
    //         alignItems: "flex-end",
    //         height: 60,
    //         paddingBottom: 10,
    //       }}
    //     >
    //       <div
    //         style={{
    //           flexDirection: "row",
    //           alignItems: "center",
    //           justifyContent: "space-between",
    //           paddingLeft: 10,
    //           paddingRight: 10,
    //         }}
    //       >
    //         <span style={{ fontWeight: "bold", fontSize: 20, marginLeft: 10 }}>
    //           {localStrings.Ads.Ads}
    //         </span>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Content */}
    //   <div
    //     style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}
    //   >
    //     {/* Left: Post */}
    //     <div style={{ flex: 1, paddingRight: 20 }}>{renderPost()}</div>

    //     {/* Right: Ads Information */}
    //     <div style={{ flex: 1, paddingLeft: 20 }}>{renderAds()}</div>
    //   </div>
    // </div>
    <div className="p-2.5">
      <div className="mb-2 flex items-center">
        <Button
          icon={<CloseOutlined />}
          type="text"
          onClick={() => router.back()}
        />
        <Text strong style={{ fontSize: "18px", marginLeft: "10px" }}>
          {localStrings.Ads.Ads}
        </Text>
      </div>
      <div>
        <div>{renderPost()}</div>
        <div>{renderAds()}</div>
      </div>
    </div>
  );
};

export default Ads;
