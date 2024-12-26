"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Input, Button, Image, message } from "antd";
import useColor from "@/hooks/useColor";
import { useAuth } from "@/context/auth/useAuth";
import { defaultPostRepo } from "@/api/features/post/PostRepo";
import { Privacy } from "@/api/baseApiResponseModel/baseApiResponseModel"; 
import EditPostViewModel from "../viewModel/EditPostViewModel";
import { UpdatePostRequestModel } from "@/api/features/post/models/UpdatePostRequestModel";
import { convertMediaToFiles } from "@/utils/helper/TransferToFormData";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";

interface EditPostScreenProps {
  id: string;
}

const EditPostScreen = ({ id }: EditPostScreenProps) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, localStrings } = useAuth();
  const { brandPrimary, backgroundColor, brandPrimaryTap, lightGray } = useColor();

  const viewModel = useMemo(() => EditPostViewModel(defaultPostRepo, id), [id]);

  const {
    postContent,
    setPostContent,
    updatePost,
    updateLoading,
    privacy,
    setPrivacy,
    originalImageFiles,
    setOriginalImageFiles,
    handleMedias,
    post,
    getDetailPost,
  } = viewModel;

  useEffect(() => {
    if (id ) {
      getDetailPost(id);
    }
  }, [id, post]);
  

  if (!isClient) {
    return null;
  }
 
  const pickImage = async () => {
    setLoading(true);
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;

      input.onchange = async (e) => {
        const files = (e.target as HTMLInputElement)?.files;
        if (files) {
          const images: string[] = [];
          for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onload = () => {
              images.push(reader.result as string);
              setOriginalImageFiles([...originalImageFiles, ...images]);
            };
            reader.onerror = () => {
              message.error("Failed to upload image");
            };
            reader.readAsDataURL(file);
          }
        }
      };

      input.click();
    } catch (error) {
      console.error(error);
      message.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };
 
  const removeImage = (index: number) => {
    const updatedImageFile = [...originalImageFiles];
    updatedImageFile.splice(index, 1);
    setOriginalImageFiles(updatedImageFile);
  };
 
  const handleSubmitPost = async () => {
    if (!postContent.trim() && originalImageFiles.length === 0) {
      message.warning("Content or Media Required");
      return;
    }

    const { deletedMedias, newMediaFiles } = handleMedias([], originalImageFiles);
    const mediaFiles = await convertMediaToFiles(newMediaFiles);

    const updatedPost: UpdatePostRequestModel = {
      postId: id,
      content: postContent.trim(),
      privacy,
      location: "HCM",
      media: mediaFiles.length > 0 ? mediaFiles : undefined,
      media_ids: deletedMedias.length > 0 ? deletedMedias : undefined,
    };

    await updatePost(updatedPost);
  };

  const renderPrivacyText = () => {
    switch (privacy) {
      case Privacy.PUBLIC:
        return localStrings.Public.Everyone.toLowerCase();
      case Privacy.FRIEND_ONLY:
        return localStrings.Public.Friend.toLowerCase();
      case Privacy.PRIVATE:
        return localStrings.Public.Private.toLowerCase();
      default:
        return localStrings.Public.Everyone.toLowerCase();
    }
  };

  return (
    <div style={{ padding: 20 }}> 
      <div style={{ backgroundColor, paddingTop: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
            alignItems: "center",
          }}
        >
          <Button onClick={() => router.back()} style={{ border: "none" }}>
            <IoMdClose size={24} color={brandPrimary} />
          </Button>
          <h2>{localStrings.Post.EditPost}</h2>
        </div>
      </div>
 
      <div style={{ display: "flex", marginBottom: 20 }}>
        <Image
          src={
            user?.avatar_url ||
            "https://res.cloudinary.com/dfqgxpk50/image/upload/v1712331876/samples/look-up.jpg"
          }
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
        <div style={{ marginLeft: 10, flex: 1 }}>
          <h4>
            {user?.family_name + " " + user?.name ||
              localStrings.Public.UnknownUser}
          </h4>
          <Input.TextArea
            placeholder={localStrings.AddPost.WhatDoYouThink}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            autoSize={{ minRows: 3 }}
            style={{ paddingLeft: 10, borderColor: brandPrimaryTap }}
          />
        </div>
      </div>
 
      <div style={{ padding: "0 60px" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {originalImageFiles.map((file, index) => (
            <div key={index} style={{ marginRight: 10, marginBottom: 10 }}>
              <Image src={file} style={{ width: 75, height: 75, borderRadius: 10 }} />
              <Button onClick={() => removeImage(index)}>
                <IoMdClose size={18} color={brandPrimary} />
              </Button>
            </div>
          ))}
        </div>
      </div>
 
      <div style={{ marginTop: 20 }}>
        <span>{localStrings.AddPost.PrivacyText}</span>
        <Button>{renderPrivacyText()}</Button>
      </div>
 
      <Button
        type="primary"
        onClick={handleSubmitPost}
        loading={updateLoading}
        style={{ marginTop: 20, width: "100%" }}
      >
        {localStrings.Public.Save}
      </Button>
    </div>
  );
};

export default EditPostScreen;