
import { ApiPath } from "../../ApiPath";
import { BaseApiResponseModel } from "../../baseApiResponseModel/baseApiResponseModel";
import client from "../../client";
import { UserModel } from "../authenticate/model/LoginModel";
import { UpdateProfileRequestModel } from "./model/UpdateProfileModel";
import { ReportUserRequestModel } from "./model/ReportUser";
import { GetFriendRequestModel } from "./model/GetFriendModel";
import { FriendResponseModel, } from "./model/FriendReponseModel";
import { TransferToFormData } from "@/utils/helper/TransferToFormData";
import { ChangePasswordRequestModel } from "./model/ChangPasswordModel";

interface IProfileRepo {
  getProfile(userId: string): Promise<BaseApiResponseModel<UserModel>>;
  updateProfile(data: UpdateProfileRequestModel): Promise<BaseApiResponseModel<UserModel>>;
  sendFriendRequest(userId: string): Promise<BaseApiResponseModel<any>>;
  cancelFriendRequest(userId: string): Promise<BaseApiResponseModel<any>>;
  acceptFriendRequest(userId: string): Promise<BaseApiResponseModel<any>>;
  refuseFriendRequest(userId: string): Promise<BaseApiResponseModel<any>>;
  unfriend(userId: string): Promise<BaseApiResponseModel<any>>;
  getListFriends(data: GetFriendRequestModel): Promise<BaseApiResponseModel<FriendResponseModel>>; 
  changePassword(data: ChangePasswordRequestModel): Promise<BaseApiResponseModel<any>>;
}

export class ProfileRepo implements IProfileRepo {
  async getProfile(userId: string): Promise<BaseApiResponseModel<UserModel>> {
    return client.get(ApiPath.PROFILE + userId);
  }
  async updateProfile(data: UpdateProfileRequestModel): Promise<BaseApiResponseModel<UserModel>> {
    const formData = TransferToFormData(data);   
    return client.patch(ApiPath.PROFILE, formData, { headers: { "Content-Type": "multipart/form-data" } });
  }
  async sendFriendRequest(userId: string): Promise<BaseApiResponseModel<any>> {
    return client.post(ApiPath.FRIEND_REQUEST + userId);
  }
  async cancelFriendRequest(userId: string): Promise<BaseApiResponseModel<any>> {
    return client.delete(ApiPath.FRIEND_REQUEST + userId);
  }
  async acceptFriendRequest(userId: string): Promise<BaseApiResponseModel<any>> {
    return client.post(ApiPath.FRIEND_RESPONSE + userId);
  }
  async refuseFriendRequest(userId: string): Promise<BaseApiResponseModel<any>> {
    return client.delete(ApiPath.FRIEND_RESPONSE + userId);
  }
  async unfriend(userId: string): Promise<BaseApiResponseModel<any>> {
    return client.delete(ApiPath.UNFRIEND + userId);
  }
  async reportUser(params: ReportUserRequestModel): Promise<BaseApiResponseModel<any>> {
    return client.post(ApiPath.REPORT_USER, params);
  }
  async getListFriends(data: GetFriendRequestModel): Promise<BaseApiResponseModel<FriendResponseModel>> {
    return client.get(ApiPath.LIST_FRIENDS + data.user_id, data);
  } 
  async changePassword(data: ChangePasswordRequestModel): Promise<BaseApiResponseModel<any>> {
    return client.patch(ApiPath.CHANGE_PASSWORD, data);
  }
}

export const defaultProfileRepo = new ProfileRepo();