import mongoose from "mongoose";
import { CommentDoc } from "./Comment";
import { UserDoc } from "./User";
import { CommunityDoc } from "./Community";

interface media {
  url: string;
  mediatype: string;
}

export enum PostType {
  CommunityPost = "CommunityPost",
  UserPost = "UserPost",
}

interface PostAttrs {
  caption: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: UserDoc[];
  comments?: CommentDoc[];
  reposts?: number;
  media?: media;
  gifLink?: string;
  twitterId?: string;
  createdAt?: Date;
  reports?: string[];
  originalPostId?: string;
  type?: PostType;
  communityId?: CommunityDoc;
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

export interface PostDoc extends mongoose.Document {
  caption: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: UserDoc[];
  comments?: CommentDoc[];
  reposts?: number;
  updatedAt?: Date;
  createdAt?: Date;
  media?: media;
  gifLink?: String;
  twitterId?: string;
  reports?: string[];
  originalPostId?: string;
  type?: PostType;
  communityId?: CommunityDoc;
}

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hashtags: [
      {
        type: String,
      },
    ],
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
      default: [],
    },
    reposts: {
      type: Number,
      default: 0,
    },
    media: {
      type: {
        url: {
          type: String,
        },
        mediatype: {
          type: String,
        },
      },
      default: {
        url: "",
        mediatype: "",
      },
    },
    gifLink: {
      type: String,
      default: "",
    },
    twitterId: {
      type: String,
      default: "",
    },
    reports: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    originalPostId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: PostType.UserPost,
    },
    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

PostSchema.set("timestamps", true);
PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>("Post", PostSchema);

export { Post, PostSchema };
