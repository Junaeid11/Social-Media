"use client";
import React, { useEffect, useState, use } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  sendFriendRequest,
  cancelSentRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  fetchSentRequests,
  fetchReceivedRequests,
  fetchFriendsList,
} from "@/redux/friendRequests/friendRequestsSlice";
import { getAllPosts } from "@/redux/posts/postsSlice";
import AuthRedirect from "@/components/AuthRedirect";
import {
  FiHome,
  FiUser,
  FiList,
  FiAlertCircle,
  FiUserPlus,
} from "react-icons/fi";
import { AiOutlineFileText } from "react-icons/ai";
import { fetchUsers } from "@/redux/users/usersSlice";
import { motion } from "framer-motion";

import ProfileInfo from "@/components/userProfile/ProfileInfo";
import FriendList from "@/components/userProfile/FriendList";
import Followers from "@/components/userProfile/Followers";
import Following from "@/components/userProfile/Following";
import Posts from "@/components/userProfile/Posts";
// import StatsSection from '@/components/userProfile/StatsSection';
import Link from "next/link";
import { Loading } from "@/components";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import ImageModal from "@/components/common/Image/ImageModel";
import logo from "../../../components/varification.png";

const UserProfile = (props) => {
  const params = use(props.params);
  const [user, setUser] = useState(null);
  const users = useSelector((state) => state.users.users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("Profile");
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const posts = useSelector((state) => state.posts.posts);
  const userPosts = posts.filter((post) => post.user._id === user?._id);
  const sentRequests = useSelector(
    (state) => state.friendRequests.sentRequests
  );
  const receivedRequests = useSelector(
    (state) => state.friendRequests.receivedRequests
  );
  const friendsList = useSelector((state) => state.friendRequests.friendsList);
  const loggedInUserId = useSelector((state) => state.auth.userDetails?._id);

  const handleImageClick = (imgUrl) => {
    setModalImage(imgUrl);
    setModalOpen(true);
  };

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(fetchUsers());
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/userDetails/${params.profileId}`
        );
        setUser(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user details");
        setLoading(false);
      }
    };
    fetchUserDetails();
    dispatch(fetchSentRequests());
    dispatch(fetchReceivedRequests());
    dispatch(fetchFriendsList());
  }, [params.profileId, dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Check friendship status and requests
  const isFriend = friendsList.some((friend) => friend._id === user._id);
  const hasSentRequest = sentRequests.some(
    (req) => req.receiver._id === user._id
  );
  const sentRequestId = sentRequests.find(
    (req) => req.receiver._id === user._id
  )?._id;
  const hasReceivedRequest = receivedRequests.some(
    (req) => req.sender._id === user._id
  );
  const receivedRequestId = receivedRequests.find(
    (req) => req.sender._id === user._id
  )?._id;

  // Handle friend request actions
  const handleSendRequest = () => {
    dispatch(sendFriendRequest(user._id));
    dispatch(fetchSentRequests());
  };

  const handleCancelRequest = () => {
    dispatch(cancelSentRequest(sentRequestId));
  };

  const handleAcceptRequest = () => {
    dispatch(acceptFriendRequest(receivedRequestId));
    dispatch(fetchFriendsList());
  };

  const handleRejectRequest = () => {
    dispatch(rejectFriendRequest(receivedRequestId));
  };

  const handleUnfriend = () => {
    dispatch(unfriend(user._id));
    dispatch(fetchFriendsList());
  };

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return (
          <>
            {/* <StatsSection user={user} />
            <FriendList users={users} user={user} />
            <Followers users={users} user={user} />
            <Following users={users} user={user} /> */}
            <Posts
              userPosts={userPosts}
              loggedInUserId={loggedInUserId}
              user={user}
              usersList={users}
            />
          </>
        );
      case "Profile Info":
        return <ProfileInfo user={user} />;
      case "Friend List":
        return <FriendList users={users} user={user} />;
      case "Followers":
        return <Followers users={users} user={user} />;
      case "Following":
        return <Following users={users} user={user} />;
      // case 'Posts':
      //   return <Posts userPosts={userPosts} loggedInUserId={loggedInUserId} user={user} usersList={false} />;
      default:
        return null;
    }
  };

  const handleMenuClick = (section) => {
    setActiveSection(section);
  };

  return (
    <AuthRedirect>
      <div className="min-h-screen bg-[#F5F6FA] flex justify-center p-3">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
          <motion.div
            className="relative h-60 sm:h-80 bg-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              height={200}
              width={200}
              src={user.coverImage || "https://via.placeholder.com/150"}
              alt="Cover"
              className="w-full h-full object-cover"
              onClick={() =>
                handleImageClick(
                  user.coverImage || "https://via.placeholder.com/150"
                )
              }
            />
            {loggedInUserId === user._id && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Link
                  href="/settings"
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition duration-300"
                >
                  Edit Cover
                </Link>
                <Link
                  href="/settings"
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition duration-300"
                >
                  Edit Profile
                </Link>
              </div>
            )}
          </motion.div>

          <motion.div className="relative px-4 pt-20 pb-6 sm:pt-24 flex flex-col sm:flex-row items-center sm:items-start sm:pb-12">
            {/* Profile Picture */}
            <div className="absolute -top-16 sm:-top-24 left-1/2 sm:left-6 transform -translate-x-1/2 sm:translate-x-0">
              <Image
                height={200}
                width={200}
                src={
                  user.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt={user.fullName}
                className="w-36 h-36 sm:w-52 sm:h-52 rounded-full border-4 border-white shadow-lg hover:scale-105 transition-transform object-cover"
                onClick={() =>
                  handleImageClick(
                    user.profilePicture ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  )
                }
              />
            </div>

            {/* User Info */}
            <div className="mt-10 sm:mt-0 sm:ml-56 text-center sm:text-left w-full sm:flex-1">
              <div className="ml-0 sm:ml-2">
                <div className="flex justify-center sm:justify-start items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold capitalize">
                    {user.fullName}
                  </h1>
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={logo}
                      alt="verified"
                      height={24}
                      width={30}
                      className="ml-2"
                    />
                  </motion.div>
                </div>
                <h2 className="text-sm sm:text-lg HelvR">@{user.username}</h2>
                <p className="text-sm sm:text-base HelvR text-gray-800">
                  {user.bio}
                </p>
                <p className="text-sm sm:text-base text-gray-700 HelvR">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 sm:mt-0 flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto sm:ml-auto">
              {loggedInUserId === user._id ? (
                <button className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                  Your Profile
                </button>
              ) : isFriend ? (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  onClick={handleUnfriend}
                >
                  Unfriend
                </button>
              ) : hasReceivedRequest ? (
                <>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    onClick={handleAcceptRequest}
                  >
                    Accept
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                    onClick={handleRejectRequest}
                  >
                    Reject
                  </button>
                </>
              ) : hasSentRequest ? (
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                  onClick={handleCancelRequest}
                >
                  Cancel Request
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                  onClick={handleSendRequest}
                >
                  Add Friend
                </button>
              )}
            </div>
          </motion.div>

          <nav className="border-b border-gray-200 mt-2">
            <ul className="flex flex-wrap justify-center sm:justify-start  sm:space-x-4">
              {menuItems.map((item) => (
                <li key={item.label} className="relative group">
                  <button
                    className={`flex items-center px-2 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-t-lg transition duration-300 ${
                      activeSection === item.label
                        ? "bg-[#F6F8FF] text-blue-700 border-b-2 border-blue-500"
                        : "hover:bg-[#F6F8FF] hover:text-blue-700 hover:border-b-2 hover:border-blue-500"
                    }`}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    {item.icon}
                    <span className="ml-2 sm:ml-4">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Render the active section */}
          <div className="flex">{renderSection()}</div>
        </div>
      </div>
      {modalOpen && (
        <ImageModal imageUrl={modalImage} onClose={() => setModalOpen(false)} />
      )}
    </AuthRedirect>
  );
};

// Menu items data
const menuItems = [
  {
    label: "Profile",
    icon: <FiHome className="w-4 h-6 text-blue-500" />,
  },
  {
    label: "Profile Info",
    icon: <FiUser className="w-4 h-6 text-green-500" />,
  },
  {
    label: "Friend List",
    icon: <FiList className="w-4 h-6 text-orange-500" />,
  },
  {
    label: "Followers",
    icon: <FiAlertCircle className="w-4 h-6 text-yellow-500" />,
  },
  {
    label: "Following",
    icon: <AiOutlineFileText className="w-4 h-6 text-teal-500" />,
  },
  // {
  //   label: 'Posts',
  //   icon: <FiUserPlus className="w-4 h-6 text-pink-500" />,
  // },
];

export default UserProfile;
