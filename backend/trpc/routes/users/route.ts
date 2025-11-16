import { protectedProcedure } from "../../create-context";
import { z } from "zod";
import { db } from "../../../db";
import { TRPCError } from "@trpc/server";

export const followUserProcedure = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    if (ctx.userId === input.userId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot follow yourself",
      });
    }

    const userToFollow = db.getUserById(input.userId);
    if (!userToFollow) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const success = db.followUser(ctx.userId, input.userId);
    
    if (!success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Already following this user",
      });
    }

    console.log(`User ${ctx.user.display_name} followed ${userToFollow.display_name}`);

    return { success: true };
  });

export const unfollowUserProcedure = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const success = db.unfollowUser(ctx.userId, input.userId);
    
    if (!success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Not following this user",
      });
    }

    console.log(`User ${ctx.user.display_name} unfollowed user ${input.userId}`);

    return { success: true };
  });

export const getFollowingProcedure = protectedProcedure.query(async ({ ctx }) => {
  const followingIds = db.getFollowing(ctx.userId);
  
  const followingUsers = followingIds
    .map(id => db.getUserById(id))
    .filter((user): user is NonNullable<typeof user> => user !== undefined)
    .map(user => ({
      user_id: user.user_id,
      display_name: user.display_name,
      handle: user.handle,
      avatar_url: user.avatar_url,
      bio: user.bio,
    }));

  return followingUsers;
});

export const getFollowersProcedure = protectedProcedure.query(async ({ ctx }) => {
  const followerIds = db.getFollowers(ctx.userId);
  
  const followers = followerIds
    .map(id => db.getUserById(id))
    .filter((user): user is NonNullable<typeof user> => user !== undefined)
    .map(user => ({
      user_id: user.user_id,
      display_name: user.display_name,
      handle: user.handle,
      avatar_url: user.avatar_url,
      bio: user.bio,
    }));

  return followers;
});

export const discoverUsersProcedure = protectedProcedure
  .input(z.object({ 
    query: z.string().optional(),
    limit: z.number().optional().default(20),
  }))
  .query(async ({ input, ctx }) => {
    let users = input.query 
      ? db.searchUsers(input.query, input.limit)
      : db.getAllUsers().slice(0, input.limit);

    const following = db.getFollowing(ctx.userId);

    return users
      .filter(user => user.user_id !== ctx.userId)
      .map(user => ({
        user_id: user.user_id,
        display_name: user.display_name,
        handle: user.handle,
        avatar_url: user.avatar_url,
        bio: user.bio,
        is_following: following.includes(user.user_id),
      }));
  });

export const getUserProfileProcedure = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const user = db.getUserById(input.userId);
    
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const following = db.getFollowing(input.userId);
    const followers = db.getFollowers(input.userId);
    const sessions = db.getSessionsByUserId(input.userId);
    const isFollowing = db.isFollowing(ctx.userId, input.userId);

    return {
      user_id: user.user_id,
      display_name: user.display_name,
      handle: user.handle,
      avatar_url: user.avatar_url,
      bio: user.bio,
      following_count: following.length,
      followers_count: followers.length,
      sessions_count: sessions.length,
      is_following: isFollowing,
      is_own_profile: ctx.userId === input.userId,
    };
  });

export default {
  follow: followUserProcedure,
  unfollow: unfollowUserProcedure,
  getFollowing: getFollowingProcedure,
  getFollowers: getFollowersProcedure,
  discover: discoverUsersProcedure,
  getProfile: getUserProfileProcedure,
};
