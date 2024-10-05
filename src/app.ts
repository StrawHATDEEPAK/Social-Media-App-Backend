import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import express from "express";
import cookieSession from "cookie-session";
import { json, urlencoded } from "body-parser";

dotenv.config();

import { signupRouter } from "./routes/auth/signup";
import { signinRouter } from "./routes/auth/signin";
import { signoutRouter } from "./routes/auth/signout";
import { currentUserRouter } from "./routes/auth/current-user";
import { updateProfileRouter } from "./routes/auth/update-profile";
import { followUserRouter } from "./routes/follows/follow-user";
import { updatePostRouter } from "./routes/posts/update-post";
import { createPostRouter } from "./routes/posts/create-post";
import { getUserPostsRouter } from "./routes/posts/get-user-posts";
import { deletePostRouter } from "./routes/posts/delete-post";
import { getUserFeedRouter } from "./routes/posts/get-user-feed";
import { fetchUserRouter } from "./routes/auth/fetch-user";
import { updatePasswordRouter } from "./routes/auth/update-password";
import { getAllPostsRouter } from "./routes/posts/get-all-posts";
import { getPostRouter } from "./routes/posts/get-post-by-id";
import { getTrendingPostsRouter } from "./routes/posts/get-trending-post";
import { LikePostRouter } from "./routes/likes/like-post";
import { createCommentRouter } from "./routes/comments/create-comment";
import { updateCommentRouter } from "./routes/comments/update-comment";
import { deleteCommentRouter } from "./routes/comments/delete-comment";
import { importUserTweetsRouter } from "./routes/posts/import-user-tweets";
import { generateCodeRouter } from "./routes/verification/generate-code";
import { verifyCodeRouter } from "./routes/verification/verify-code";
import { getTrendingTweetsRouter } from "./routes/posts/get-twitter-trends";
import { searchPostRouter } from "./routes/posts/search-post";
import { searchUserRouter } from "./routes/auth/get-search-user";
import { activeUserRouter } from "./routes/auth/active-user";
import { claimTokenRouter } from "./routes/reward/claim-token";
import { checkClaimRouter } from "./routes/reward/check-claim-token";
import { updateProfileImageRouter } from "./routes/auth/update-profile-image";
import { airdropRequestRouter } from "./routes/airdrop/request-airdrop";
import { resetPasswordRouter } from "./routes/auth/reset-password";
import { adminSignupRouter } from "./routes/admin/signup";
import { adminSigninRouter } from "./routes/admin/signin";
import { deletePostAdminRouter } from "./routes/admin/delete-post";
import { currentAdminRouter } from "./routes/admin/current-admin";
import { resetAdminPasswordRouter } from "./routes/admin/reset-password";
import { reportPostRouter } from "./routes/posts/report-post";
import { reportUserRouter } from "./routes/auth/report-user";
import { toggleBanRouter } from "./routes/admin/ban-user";
import { getAllUserRouter } from "./routes/admin/get-all-users";
import { getAllCommentRouter } from "./routes/comments/get-all-comment";
import { deleteUserRouter } from "./routes/admin/delete-user";
import { createNotificationRouter } from "./routes/notifications/add-notification";
import { getNotificationRouter } from "./routes/notifications/get-notification";
import { deleteNotificationRouter } from "./routes/notifications/delete-notification";
import { addMessageRouter } from "./routes/message/add-message";
import { repostRouter } from "./routes/reposts/repost";
import { createStoryRouter } from "./routes/story/create-story";
import { getUserStoriesRouter } from "./routes/story/get-stories";
import { getFollowingUserStoriesRouter } from "./routes/story/get-following-user-stories";
import { getMessageRouter } from "./routes/message/get-all-message";
import { getAssociatedUsersRouter } from "./routes/message/get-associated-users";
import { createNotificationForEveryoneRouter } from "./routes/admin/notify-everyone";
import { preferencePostRouter } from "./routes/posts/get-preference-post";
import { addPreferencesRouter } from "./routes/preferences/add-preference";
import { createNotificationforSingleUserRouter } from "./routes/admin/notify-user";
import { createOfficialPostRouter } from "./routes/admin/create-post";
import { fetchUserByIdRouter } from "./routes/auth/fetch-user-by-id";
import { getAllStoriesRouter } from "./routes/story/get-all-stories";
import { createReplyRouter } from "./routes/comments/create-reply";
import { getUserOrdinalsRouter } from "./routes/tokens/get-user-ordinals";
import { getUserStampsRouter } from "./routes/tokens/get-user-stamps";
import { importUserOrdinalsRouter } from "./routes/tokens/import-user-ordinals";
import { importUserStampsRouter } from "./routes/tokens/import-user-stamps";
import { getUserOrdinalsFromDBRouter } from "./routes/tokens/get-user-ordinals-from-db";
import { getUserStampsFromDBRouter } from "./routes/tokens/get-user-stamps-from-db";
import { likeOrdinalRouter } from "./routes/tokens/like-ordinal";
import { likeStampRouter } from "./routes/tokens/like-stamp";
import { getFollowerFollowingRouter } from "./routes/auth/get-follower-following";

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(
  urlencoded({
    extended: true,
  })
);

app.use(activeUserRouter);
app.use(searchPostRouter);
app.use(searchUserRouter);
app.use(getUserFeedRouter);
app.use(checkClaimRouter);
app.use(claimTokenRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(generateCodeRouter);
app.use(verifyCodeRouter);
app.use(updateProfileRouter);
app.use(signoutRouter);
app.use(addPreferencesRouter);
app.use(preferencePostRouter);
app.use(currentUserRouter);
app.use(fetchUserRouter);
app.use(followUserRouter);
app.use(updateProfileImageRouter);
app.use(resetPasswordRouter);
app.use(updatePasswordRouter);
app.use(createPostRouter);
app.use(getPostRouter);
app.use(getFollowerFollowingRouter);
app.use(getTrendingPostsRouter);
app.use(getUserPostsRouter);
app.use(updatePostRouter);
app.use(deletePostRouter);
app.use(LikePostRouter);
app.use(getPostRouter);
app.use(getUserPostsRouter);
app.use(getAllPostsRouter);
app.use(createCommentRouter);
app.use(getAllCommentRouter);
app.use(updateCommentRouter);
app.use(deleteCommentRouter);
app.use(getTrendingTweetsRouter);
app.use(importUserTweetsRouter);
app.use(airdropRequestRouter);
app.use(adminSignupRouter);
app.use(adminSigninRouter);
app.use(currentAdminRouter);
app.use(deletePostAdminRouter);
app.use(resetAdminPasswordRouter);
app.use(getAllUserRouter);
app.use(reportPostRouter);
app.use(reportUserRouter);
app.use(deleteUserRouter);
app.use(toggleBanRouter);
app.use(createNotificationRouter);
app.use(addMessageRouter);
app.use(getMessageRouter);
app.use(getAssociatedUsersRouter);
app.use(fetchUserByIdRouter);
app.use(getNotificationRouter);
app.use(deleteNotificationRouter);
app.use(repostRouter);
app.use(getUserStoriesRouter);
app.use(getAllStoriesRouter);
app.use(createStoryRouter);
app.use(getFollowingUserStoriesRouter);
app.use(createNotificationForEveryoneRouter);
app.use(createNotificationforSingleUserRouter);
app.use(createOfficialPostRouter);
app.use(createReplyRouter);
app.use(getUserOrdinalsRouter);
app.use(getUserStampsRouter);
app.use(importUserOrdinalsRouter);
app.use(importUserStampsRouter);
app.use(getUserOrdinalsFromDBRouter);
app.use(getUserStampsFromDBRouter);
app.use(likeOrdinalRouter);
app.use(likeStampRouter);

app.all("*", async (req: any, res: any) => {
  throw new Error("Route not found!!");
});

export { app };
