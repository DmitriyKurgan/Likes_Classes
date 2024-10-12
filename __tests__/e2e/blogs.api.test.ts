import {
  authentication,
  blogCreator,
  blogReturner,
  blogsLength,
  blogUpdater,
  commentCreator,
  commentCreatorSecondPost,
  commentReturner,
  commentsLength,
  commentUpdater,
  eraseAll,
  eraser,
  eraserWithId,
  eraserWithIdBearer,
  firstBlog,
  firstBlogId,
  firstComment,
  firstCommentId,
  firstPost,
  firstPostId,
  firstUser,
  firstUserId,
  findBlogs,
  findComments,
  findPosts,
  findUsers,
  getter,
  getterWithId,
  getterWithInvalidCredentials,
  invalidCommentCreator,
  invalidCommentUpdater,
  postCreator,
  postReturner,
  postsLength,
  postUpdater,
  secondPost,
  userCreator,
  userReturner,
  usersLength,
  secondPostId,
  commentsOfSecondPostLength,
} from "../../src/test-utils/test-functions";
import {
  accountURI,
  basicAuthKey,
  basicAuthValue,
  blogFilterString01,
  blogFilterString02,
  blogFilterString03,
  blogFilterString04,
  blogFilterString05,
  blogNewDescriptionString,
  blogNewNameString,
  blogNewWebsiteUrlString,
  blogsURI,
  commentContentString,
  commentContentString01,
  commentContentString02,
  commentContentString03,
  commentContentString04,
  commentContentString05,
  commentNewContentString,
  commentsURI,
  invalidAuthValue,
  invalidURI,
  longString1013,
  longString109,
  longString17,
  longString39,
  longString508,
  postContentString,
  postNewContentString,
  postNewShortDescriptionString,
  postNewTitleString,
  postShortDescriptionString,
  postsURI,
  postTitleString,
  sortingString02,
  sortingString04,
  sortingString05,
  sortingString07,
  sortingString09,
  spaceString,
  userEmailFilterString01,
  userEmailFilterString02,
  userEmailFilterString03,
  userEmailFilterString04,
  userEmailFilterString05,
  userEmailString,
  userLoginFilterString01,
  userLoginFilterString02,
  userLoginFilterString03,
  userLoginFilterString04,
  userLoginFilterString05,
  usersURI,
} from "../../src/test-utils/test-strings";
import { emptyOutput } from "../../src/test-utils/test-objects";
import {app} from "../../src/app_settings";
import {client} from "../../src/repositories/db";
import request from "supertest";

afterAll(async () => {
  await client.close();
});

describe("Testing delete operation", () => {
  beforeAll(eraseAll);
  it("should create new blog", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toEqual(returnedUser);
  });
  it("should create new comment", async () => {
    // Trying to create comment
    const response = await commentCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created comment
    const comment = await firstComment();
    const returnedComment = await commentReturner();
    expect(comment).toStrictEqual(returnedComment);
  });
  it("should delete everything", async () => {
    // Trying to delete everything
    const commentsResponse = await eraser(commentsURI);
    const lengthOfComments = await commentsLength();
    expect(commentsResponse.status).toBe(204);
    expect(lengthOfComments).toBe(0);

    const postsResponse = await eraser(postsURI);
    const lengthOfPosts = await postsLength();
    expect(postsResponse.status).toBe(204);
    expect(lengthOfPosts).toBe(0);

    const blogsResponse = await eraser(blogsURI);
    const lengthOfBlogs = await blogsLength();
    expect(blogsResponse.status).toBe(204);
    expect(lengthOfBlogs).toBe(0);

    const usersResponse = await eraser(usersURI);
    const lengthOfUsers = await usersLength();
    expect(usersResponse.status).toBe(204);
    expect(lengthOfUsers).toBe(0);
  });
});

describe("Authentication status 400 checks", () => {
  beforeAll(eraseAll);
  it("should NOT authenticate without login (email)", async () => {
    // Trying to authenticate without login (email)
    const response = await authentication(undefined, null);
    expect(response.status).toBe(400);
  });
  it("should NOT authenticate with incorrect login (email) type", async () => {
    // Trying to authenticate with incorrect login (email) type
    const response = await authentication(undefined, 123);
    expect(response.status).toBe(400);
  });
  it("should NOT authenticate without password", async () => {
    // Trying to authenticate without password
    const response = await authentication(undefined, undefined, null);
    expect(response.status).toBe(400);
  });
  it("should NOT authenticate with incorrect password type", async () => {
    // Trying to authenticate without password
    const response = await authentication(undefined, undefined, 123);
    expect(response.status).toBe(400);
  });
});
describe("Authentication status 401 checks", () => {
  beforeAll(eraseAll);
  it("should NOT authenticate without bearer token", async () => {
    // Trying to authenticate without bearer token
    const response = await getterWithInvalidCredentials(accountURI);
    expect(response.status).toBe(401);
  });
});
describe("Authentication operation", () => {
  beforeAll(eraseAll);
  it("should create new user", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should log in user with correct credentials", async () => {
    // Trying to authenticate with login
    const loginResponse = await authentication();
    expect(loginResponse.status).toBe(200);

    // Trying to authenticate with email
    const response = await authentication(undefined, userEmailString);
    expect(response.status).toBe(200);
  });
  it("should NOT log in user with incorrect credentials", async () => {
    // Trying to authenticate with incorrect login (email)
    const incorrectLoginResponse = await authentication(
      undefined,
      longString17
    );
    expect(incorrectLoginResponse.status).toBe(401);
  });
});

describe("Blogs CRUD operations", () => {
  beforeAll(eraseAll);
  it("should return all blogs", async () => {
    const response = await getter(blogsURI);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(emptyOutput);
  });
  it("should create new blog", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should update blog", async () => {
    // Trying to update a blog
    const response = await blogUpdater();
    expect(response.status).toBe(204);
  });
  it("should return blog by ID with updated data", async () => {
    // Trying to get blog by ID
    const blogId = await firstBlogId();
    const response = await getterWithId(blogsURI, blogId);
    expect(response.status).toBe(200);

    // Checking result by returning updated blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner(
      undefined,
      blogNewNameString,
      blogNewDescriptionString,
      blogNewWebsiteUrlString
    );
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should delete blog by ID", async () => {
    // Trying to delete a blog
    const blogId = await firstBlogId();
    const response = await eraserWithId(blogsURI, blogId, invalidAuthValue);
    expect(response.status).toBe(401);
  });
});
describe("Blogs name filtering", () => {
  beforeAll(eraseAll);
  it("should return blogs with filter", async () => {
    // Trying to create 5 blogs
    await blogCreator(undefined, blogFilterString01);
    await blogCreator(undefined, blogFilterString02);
    await blogCreator(undefined, blogFilterString03);
    await blogCreator(undefined, blogFilterString04);
    const lastBlogResponse = await blogCreator(undefined, blogFilterString05);

    expect(lastBlogResponse.status).toBe(201);

    // Checking result by returning blogs array length
    const length = await blogsLength();
    expect(length).toBe(5);

    // Applying and checking filter

    const response = await getter(blogsURI);
    expect(response.status).toBe(200);

    const blogsWithQuery = await findBlogs("va");
    expect(blogsWithQuery.totalCount).toBe(3);
    expect(blogsWithQuery.items.length).toBe(3);

    // Default sorting for blogs ==> createdAt, desc
    expect(blogsWithQuery.items[0].name).toBe(blogFilterString03);
    expect(blogsWithQuery.items[1].name).toBe(blogFilterString02);
    expect(blogsWithQuery.items[2].name).toBe(blogFilterString01);
  });
});
describe("Blogs sorting", () => {
  beforeAll(eraseAll);
  it("should sort blogs by any field (name for testing)", async () => {
    // Trying to create 5 blogs
    await blogCreator(undefined, sortingString07);
    await blogCreator(undefined, sortingString02);
    await blogCreator(undefined, sortingString04);
    await blogCreator(undefined, sortingString05);
    const lastBlogResponse = await blogCreator(undefined, sortingString09);

    expect(lastBlogResponse.status).toBe(201);

    // Checking result by returning blogs array length
    const length = await blogsLength();
    expect(length).toBe(5);

    const response = await getter(blogsURI);
    expect(response.status).toBe(200);

    // Applying and checking descending sorting
    const blogsWithQueryDesc = await findBlogs(undefined, "name");
    expect(blogsWithQueryDesc.items[0].name).toBe(sortingString09);
    expect(blogsWithQueryDesc.items[1].name).toBe(sortingString07);
    expect(blogsWithQueryDesc.items[2].name).toBe(sortingString05);
    expect(blogsWithQueryDesc.items[3].name).toBe(sortingString04);
    expect(blogsWithQueryDesc.items[4].name).toBe(sortingString02);

    // Applying and checking ascending sorting
    const blogsWithQueryAsc = await findBlogs(undefined, "name", "asc");
    expect(response.status).toBe(200);
    expect(blogsWithQueryAsc.items[0].name).toBe(sortingString02);
    expect(blogsWithQueryAsc.items[1].name).toBe(sortingString04);
    expect(blogsWithQueryAsc.items[2].name).toBe(sortingString05);
    expect(blogsWithQueryAsc.items[3].name).toBe(sortingString07);
    expect(blogsWithQueryAsc.items[4].name).toBe(sortingString09);
  });
});
describe("Blogs pagination", () => {
  beforeAll(eraseAll);
  it("should return correct blogs pagination output", async () => {
    // Trying to create 20 blogs
    let i = 0;
    while (i < 20) {
      const response = await blogCreator(undefined, `Test name ${i}`);
      expect(response.status).toBe(201);
      i++;
    }

    // Checking pagination
    const check = await getter(blogsURI);
    expect(check.status).toBe(200);

    const blogsWithQuery = await findBlogs(
      undefined,
      undefined,
      undefined,
      "2",
      "5"
    );
    expect(blogsWithQuery.pagesCount).toBe(4);
    expect(blogsWithQuery.page).toBe(2);
    expect(blogsWithQuery.pageSize).toBe(5);
    expect(blogsWithQuery.totalCount).toBe(20);
    expect(blogsWithQuery.items.length).toBe(5);
  }, 30000);
});
describe("Blogs status 400 checks", () => {
  beforeAll(eraseAll);
  it("should NOT create new blog without name", async () => {
    // Trying to create a blog without name
    const response = await blogCreator(undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect name type", async () => {
    // Trying to create a blog with incorrect name type
    const response = await blogCreator(undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect name length", async () => {
    // Trying to create a blog with incorrect name length
    const response = await blogCreator(undefined, longString17);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog without description", async () => {
    // Trying to create a blog without description
    const response = await blogCreator(undefined, undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect description type", async () => {
    // Trying to create a blog with incorrect description type
    const response = await blogCreator(undefined, undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect description length", async () => {
    // Trying to create a blog with incorrect description length
    const response = await blogCreator(undefined, undefined, longString508);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog without website URL", async () => {
    // Trying to create a blog without website URL
    const response = await blogCreator(undefined, undefined, undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect website URL type", async () => {
    // Trying to create a blog with incorrect website URL type
    const response = await blogCreator(undefined, undefined, undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect website URL length", async () => {
    // Trying to create a blog with incorrect website URL length
    const response = await blogCreator(
      undefined,
      undefined,
      undefined,
      longString109
    );
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new blog with incorrect website URL format", async () => {
    // Trying to create a blog with incorrect website URL format
    const response = await blogCreator(
      undefined,
      undefined,
      undefined,
      longString17
    );
    expect(response.status).toBe(400);

    // Checking result
    const length = await blogsLength();
    expect(length).toBe(0);
  });
});
describe("Blogs status 401 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should return 401 when creating blog with incorrect credentials", async () => {
    const response = await blogCreator(
      undefined,
      undefined,
      undefined,
      undefined,
      invalidAuthValue
    );
    expect(response.status).toBe(401);
  });
  it("should return 401 when updating blog with incorrect credentials", async () => {
    const response = await blogUpdater(
      undefined,
      undefined,
      undefined,
      undefined,
      invalidAuthValue
    );
    expect(response.status).toBe(401);
  });
  it("should return 401 when deleting blog with incorrect credentials", async () => {
    const blogId = await firstBlogId();
    const response = await eraserWithId(blogsURI, blogId, invalidAuthValue);
    expect(response.status).toBe(401);
  });
});
describe("Blogs status 404 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should return 404 when getting nonexistent blog", async () => {
    const response = await getter(blogsURI + invalidURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when getting posts of nonexistent blog", async () => {
    const response = await getter(blogsURI + invalidURI + postsURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when updating nonexistent blog", async () => {
    const response = await blogUpdater(blogsURI + invalidURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when deleting nonexistent blog", async () => {
    const response = await eraser(blogsURI + invalidURI);
    expect(response.status).toBe(404);
  });
});

describe("Posts CRUD operations", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should return all posts", async () => {
    const response = await getter(postsURI);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(emptyOutput);
  });
  it("should create new post", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should update post", async () => {
    // Trying to update a post
    const response = await postUpdater();
    expect(response.status).toBe(204);
  });
  it("should return post by ID with updated data", async () => {
    // Trying to get post by ID
    const postId = await firstPostId();
    const response = await getterWithId(postsURI, postId);
    expect(response.status).toBe(200);

    // Checking result by returning updated post
    const post = await firstPost();
    const returnedPost = await postReturner(
      undefined,
      postNewTitleString,
      postNewShortDescriptionString,
      postNewContentString
    );
    expect(post).toStrictEqual(returnedPost);
  });
  it("should delete post by ID", async () => {
    // Trying to delete post
    const postId = await firstPostId();
    const response = await eraserWithId(postsURI, postId);
    expect(response.status).toBe(204);

    // Checking result by returning posts array length
    const length = await postsLength();
    expect(length).toBe(0);
  });
});
describe("Posts inside blog CR operations", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for exact blog", async () => {
    // Finding blogId
    const blogId = await firstBlogId();

    // Trying to create a post
    const response = await postCreator(blogsURI + blogId + postsURI);
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);

    // Checking that post is available through blog URI param
    const check = await getter(blogsURI + blogId);
    expect(check.status).toBe(200);
    expect(post).toStrictEqual(returnedPost);
  });
});
describe("Posts sorting", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should sort posts by any field (title for testing)", async () => {
    // Trying to create 5 posts
    await postCreator(undefined, sortingString07);
    await postCreator(undefined, sortingString02);
    await postCreator(undefined, sortingString04);
    await postCreator(undefined, sortingString05);
    const lastBlogResponse = await postCreator(undefined, sortingString09);

    expect(lastBlogResponse.status).toBe(201);

    // Checking result by returning blogs array length
    const length = await postsLength();
    expect(length).toBe(5);

    const response = await getter(postsURI);
    expect(response.status).toBe(200);

    // Applying and checking descending sorting
    const postsWithQueryDesc = await findPosts("title");
    expect(postsWithQueryDesc.items[0].title).toBe(sortingString09);
    expect(postsWithQueryDesc.items[1].title).toBe(sortingString07);
    expect(postsWithQueryDesc.items[2].title).toBe(sortingString05);
    expect(postsWithQueryDesc.items[3].title).toBe(sortingString04);
    expect(postsWithQueryDesc.items[4].title).toBe(sortingString02);

    // Applying and checking descending sorting
    const postsWithQueryAsc = await findPosts("title", "asc");
    expect(postsWithQueryAsc.items[0].title).toBe(sortingString02);
    expect(postsWithQueryAsc.items[1].title).toBe(sortingString04);
    expect(postsWithQueryAsc.items[2].title).toBe(sortingString05);
    expect(postsWithQueryAsc.items[3].title).toBe(sortingString07);
    expect(postsWithQueryAsc.items[4].title).toBe(sortingString09);
  });
});
describe("Posts pagination", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should return correct posts pagination output", async () => {
    // Trying to create 20 posts
    let i = 0;
    while (i < 20) {
      const response = await postCreator(undefined, `Test title ${i}`);
      expect(response.status).toBe(201);
      i++;
    }

    // Checking pagination
    const check = await getter(postsURI);
    expect(check.status).toBe(200);
    const postsWithQuery = await findPosts(undefined, undefined, "2", "5");
    expect(postsWithQuery.pagesCount).toBe(4);
    expect(postsWithQuery.page).toBe(2);
    expect(postsWithQuery.pageSize).toBe(5);
    expect(postsWithQuery.totalCount).toBe(20);
    expect(postsWithQuery.items.length).toBe(5);
  }, 30000);
});
describe("Posts status 400 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for posts testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should NOT create new post without title", async () => {
    // Trying to create a post without title
    const response = await postCreator(undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect title type", async () => {
    // Trying to create a post with incorrect title type
    const response = await postCreator(undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect title length", async () => {
    // Trying to create a post with incorrect title length
    const response = await postCreator(undefined, longString39);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post without short description", async () => {
    // Trying to create a post without short description
    const response = await postCreator(undefined, undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect short description type", async () => {
    // Trying to create a post with incorrect short description type
    const response = await postCreator(undefined, undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect short description length", async () => {
    // Trying to create a post with incorrect short description length
    const response = await postCreator(undefined, undefined, longString109);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post without content", async () => {
    // Trying to create a post without content
    const response = await postCreator(undefined, undefined, undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect content type", async () => {
    // Trying to create a post with incorrect content type
    const response = await postCreator(undefined, undefined, undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect content length", async () => {
    // Trying to create a post with incorrect content length
    const response = await postCreator(
      undefined,
      undefined,
      undefined,
      longString1013
    );
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new post with incorrect blogId", async () => {
    // Trying to create a post with incorrect blogId
    const response = await request(app)
      .post(postsURI)
      .send({
        title: postTitleString,
        shortDescription: postShortDescriptionString,
        content: postContentString,
        blogId: "someString",
      })
      .set(basicAuthKey, basicAuthValue);
    expect(response.status).toBe(400);

    // Checking result
    const length = await postsLength();
    expect(length).toBe(0);
  });
});
describe("Posts status 401 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should return 401 when creating post with incorrect credentials", async () => {
    const response = await postCreator(
      undefined,
      undefined,
      undefined,
      undefined,
      invalidAuthValue
    );
    expect(response.status).toBe(401);
  });
  it("should return 401 when creating post in blog with incorrect credentials", async () => {
    // Finding blogId
    const blogId = await firstBlogId();

    // Trying to create a post
    const response = await postCreator(
      blogsURI + blogId + postsURI,
      undefined,
      undefined,
      undefined,
      invalidAuthValue
    );
    expect(response.status).toBe(401);
  });
  it("should return 401 when updating post with incorrect credentials", async () => {
    const response = await postUpdater(
      undefined,
      undefined,
      undefined,
      undefined,
      invalidAuthValue
    );
    expect(response.status).toBe(401);
  });
  it("should return 401 when deleting post with incorrect credentials", async () => {
    const postId = await firstPostId();
    const response = await eraserWithId(postsURI, postId, invalidAuthValue);
    expect(response.status).toBe(401);
  });
});
describe("Posts status 404 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should return 404 when getting nonexistent post", async () => {
    const response = await getter(postsURI + invalidURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when updating nonexistent post", async () => {
    const response = await blogUpdater(postsURI + invalidURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when deleting nonexistent post", async () => {
    const response = await eraser(postsURI + invalidURI);
    expect(response.status).toBe(404);
  });
});

describe("Users CRD operations", () => {
  beforeAll(eraseAll);
  it("should return all users", async () => {
    const response = await getter(usersURI);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(emptyOutput);
  });
  it("should create new user", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should delete user by ID", async () => {
    // Trying to delete user
    const userId = await firstUserId();
    const response = await eraserWithId(usersURI, userId);
    expect(response.status).toBe(204);

    // Checking result by returning users array length
    const length = await usersLength();
    expect(length).toBe(0);
  });
});
describe("Users login and email filtering", () => {
  beforeAll(eraseAll);
  it("should return users with login filter", async () => {
    // Trying to create 5 users
    await userCreator(
      undefined,
      userLoginFilterString01,
      undefined,
      userEmailFilterString01
    );
    await userCreator(
      undefined,
      userLoginFilterString02,
      undefined,
      userEmailFilterString02
    );
    await userCreator(
      undefined,
      userLoginFilterString03,
      undefined,
      userEmailFilterString03
    );
    await userCreator(
      undefined,
      userLoginFilterString04,
      undefined,
      userEmailFilterString04
    );
    const lastUserResponse = await userCreator(
      undefined,
      userLoginFilterString05,
      undefined,
      userEmailFilterString05
    );

    expect(lastUserResponse.status).toBe(201);

    // Checking result by returning users array length
    const length = await usersLength();
    expect(length).toBe(5);

    // Applying and checking login filter

    const response = await getter(usersURI);
    expect(response.status).toBe(200);

    const usersWithQuery = await findUsers("A");
    expect(usersWithQuery.totalCount).toBe(2);
    expect(usersWithQuery.items.length).toBe(2);

    // Default sorting for users ==> createdAt, desc
    expect(usersWithQuery.items[0].login).toBe(userLoginFilterString04);
    expect(usersWithQuery.items[1].login).toBe(userLoginFilterString02);
  }, 30000);
  it("should return users with email filter", async () => {
    // Applying and checking login filter

    const response = await getter(usersURI);
    expect(response.status).toBe(200);

    const usersWithQuery = await findUsers(undefined, "N");
    expect(usersWithQuery.totalCount).toBe(2);
    expect(usersWithQuery.items.length).toBe(2);

    // Default sorting for users ==> createdAt, desc
    expect(usersWithQuery.items[0].email).toBe(userEmailFilterString04);
    expect(usersWithQuery.items[1].email).toBe(userEmailFilterString02);
  }, 30000);
  it("should return users with login and email filter", async () => {
    // Applying and checking login filter

    const response = await getter(usersURI);
    expect(response.status).toBe(200);

    const usersWithQuery = await findUsers("Zh", "el");
    expect(usersWithQuery.totalCount).toBe(2);
    expect(usersWithQuery.items.length).toBe(2);

    // Default sorting for users ==> createdAt, desc
    expect(usersWithQuery.items[0].email).toBe(userEmailFilterString02);
    expect(usersWithQuery.items[1].email).toBe(userEmailFilterString01);
  }, 30000);
});
describe("Users sorting", () => {
  beforeAll(eraseAll);
  it("should sort users by any field (login for testing)", async () => {
    // Trying to create 5 users
    await userCreator(
      undefined,
      userLoginFilterString03,
      undefined,
      userEmailFilterString03
    );
    await userCreator(
      undefined,
      userLoginFilterString04,
      undefined,
      userEmailFilterString04
    );
    await userCreator(
      undefined,
      userLoginFilterString02,
      undefined,
      userEmailFilterString02
    );
    await userCreator(
      undefined,
      userLoginFilterString05,
      undefined,
      userEmailFilterString05
    );
    const lastUserResponse = await userCreator(
      undefined,
      userLoginFilterString01,
      undefined,
      userEmailFilterString01
    );

    expect(lastUserResponse.status).toBe(201);

    // Checking result by returning users array length
    const length = await usersLength();
    expect(length).toBe(5);

    const response = await getter(usersURI);
    expect(response.status).toBe(200);

    // Applying and checking descending sorting
    const usersWithQueryDesc = await findUsers(undefined, undefined, "login");
    expect(usersWithQueryDesc.items[0].login).toBe(userLoginFilterString01);
    expect(usersWithQueryDesc.items[1].login).toBe(userLoginFilterString05);
    expect(usersWithQueryDesc.items[2].login).toBe(userLoginFilterString04);
    expect(usersWithQueryDesc.items[3].login).toBe(userLoginFilterString02);
    expect(usersWithQueryDesc.items[4].login).toBe(userLoginFilterString03);

    // Applying and checking ascending sorting
    const usersWithQueryAsc = await findUsers(
      undefined,
      undefined,
      "login",
      "asc"
    );
    expect(response.status).toBe(200);
    expect(usersWithQueryAsc.items[0].login).toBe(userLoginFilterString03);
    expect(usersWithQueryAsc.items[1].login).toBe(userLoginFilterString02);
    expect(usersWithQueryAsc.items[2].login).toBe(userLoginFilterString04);
    expect(usersWithQueryAsc.items[3].login).toBe(userLoginFilterString05);
    expect(usersWithQueryAsc.items[4].login).toBe(userLoginFilterString01);
  },30000);
});
describe("Users pagination", () => {
  beforeAll(eraseAll);
  it("should return correct users pagination output", async () => {
    // Trying to create 20 users
    let i = 0;
    while (i < 20) {
      const response = await userCreator(
        undefined,
        `login${i}`,
        undefined,
        `addr${i}@mailforspam.com`
      );
      expect(response.status).toBe(201);
      i++;
    }

    // Checking pagination
    const check = await getter(usersURI);
    expect(check.status).toBe(200);

    const usersWithQuery = await findUsers(
      undefined,
      undefined,
      undefined,
      undefined,
      "2",
      "5"
    );
    expect(usersWithQuery.pagesCount).toBe(4);
    expect(usersWithQuery.page).toBe(2);
    expect(usersWithQuery.pageSize).toBe(5);
    expect(usersWithQuery.totalCount).toBe(20);
    expect(usersWithQuery.items.length).toBe(5);
  }, 30000);
});
describe("Users status 400 checks", () => {
  beforeAll(eraseAll);
  it("should NOT create new user without login", async () => {
    // Trying to create user without login
    const response = await userCreator(undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect login type", async () => {
    // Trying to create user with incorrect name type
    const response = await userCreator(undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect login length", async () => {
    // Trying to create user with incorrect login length
    const response = await userCreator(undefined, longString17);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect login format", async () => {
    // Trying to create login with incorrect website URL format
    const response = await userCreator(undefined, spaceString);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user without password", async () => {
    // Trying to create user without password
    const response = await userCreator(undefined, undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect password type", async () => {
    // Trying to create a user with incorrect password type
    const response = await userCreator(undefined, undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect password length", async () => {
    // Trying to create a user with incorrect password length
    const response = await userCreator(undefined, undefined, longString39);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user without email", async () => {
    // Trying to create user without email
    const response = await userCreator(undefined, undefined, undefined, null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect email type", async () => {
    // Trying to create user with incorrect email type
    const response = await userCreator(undefined, undefined, undefined, 123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
  it("should NOT create new user with incorrect email format", async () => {
    // Trying to create user with incorrect email format
    const response = await userCreator(
      undefined,
      undefined,
      undefined,
      spaceString
    );
    expect(response.status).toBe(400);

    // Checking result
    const length = await usersLength();
    expect(length).toBe(0);
  });
});
describe("Users status 401 checks", () => {
  beforeAll(eraseAll);
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should return 401 when getting users with incorrect credentials", async () => {
    const response = await getterWithInvalidCredentials(usersURI);
    expect(response.status).toBe(401);
  });
  it("should return 401 when creating user with incorrect credentials", async () => {
    const response = await userCreator(
      undefined,
      undefined,
      undefined,
      undefined,
      invalidAuthValue
    );
    expect(response.status).toBe(401);
  });
  it("should return 401 when deleting user with incorrect credentials", async () => {
    const userId = await firstUserId();
    const response = await eraserWithId(usersURI, userId, invalidAuthValue);
    expect(response.status).toBe(401);
  });
});
describe("Users status 404 checks", () => {
  beforeAll(eraseAll);
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should return 404 when deleting nonexistent user", async () => {
    const response = await eraser(usersURI + invalidURI);
    expect(response.status).toBe(404);
  });
});

describe("Comments CRUD operations", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should create new comment", async () => {
    // Trying to create comment with authenticated user
    const response = await commentCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const comment = await firstComment();
    const returnedComment = await commentReturner();
    expect(comment).toStrictEqual(returnedComment);
  });
  it("should update comment", async () => {
    // Trying to update comment
    const response = await commentUpdater();
    expect(response.status).toBe(204);
  });
  it("should return comment by ID with updated data", async () => {
    // Trying to get comment by ID
    const commentId = await firstCommentId();
    const response = await getterWithId(commentsURI, commentId);
    expect(response.status).toBe(200);

    // Checking result by returning updated post
    const comment = await firstComment();
    const returnedComment = await commentReturner(
      undefined,
      commentNewContentString
    );
    expect(comment).toStrictEqual(returnedComment);
  });
  it("should delete comment by ID", async () => {
    // Trying to delete comment
    const commentId = await firstCommentId();
    const response = await eraserWithIdBearer(commentsURI, commentId);
    expect(response.status).toBe(204);

    // Checking result by returning blogs array length
    const length = await commentsLength();
    expect(length).toBe(0);
  });
});
describe("Comments filtering by post (return all comments)", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create two posts for testing", async () => {
    // Trying to create two posts
    let i = 0;
    while (i < 2) {
      const response = await postCreator();
      i++;
      expect(response.status).toBe(201);
    }

    // Checking result by returning created posts
    const postOne = await firstPost();
    const postTwo = await secondPost();
    const returnedPost = await postReturner();
    expect(postOne).toStrictEqual(returnedPost);
    expect(postTwo).toStrictEqual(returnedPost);

    const length = await postsLength();
    expect(length).toBe(2);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should create new comments for posts", async () => {
    // Trying to create 4 comments for first post
    let i = 0;
    while (i < 4) {
      const response = await commentCreator();
      expect(response.status).toBe(201);
      i++;
    }

    // Trying to create 3 comments for second post
    let j = 0;
    while (j < 3) {
      const response = await commentCreatorSecondPost();
      expect(response.status).toBe(201);
      j++;
    }

    // Trying to return comments for first post
    const firstPost = await firstPostId();
    const responseOne = await getter(postsURI + firstPost + commentsURI);
    expect(responseOne.status).toBe(200);

    // Trying to return comments for second post
    const secondPost = await secondPostId();
    const responseTwo = await getter(postsURI + secondPost + commentsURI);
    expect(responseTwo.status).toBe(200);

    const lengthOfPostOne = await commentsLength();
    expect(lengthOfPostOne).toBe(4);

    const lengthOfPostTwo = await commentsOfSecondPostLength();
    expect(lengthOfPostTwo).toBe(3);
  });
});
describe("Comments sorting", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should sort comments by any field (content for testing)", async () => {
    // Trying to create 5 comments
    await commentCreator(commentContentString01);
    await commentCreator(commentContentString02);
    await commentCreator(commentContentString03);
    await commentCreator(commentContentString04);
    const lastCommentResponse = await commentCreator(commentContentString05);

    expect(lastCommentResponse.status).toBe(201);

    // Checking result by returning comments array length
    const length = await commentsLength();
    expect(length).toBe(5);

    const firstPost = await firstPostId();
    const response = await getter(postsURI + firstPost + commentsURI);
    expect(response.status).toBe(200);

    // Applying and checking descending sorting
    const CommentsWithQueryDesc = await findComments("content", undefined);
    expect(CommentsWithQueryDesc.items[0].content).toBe(commentContentString02);
    expect(CommentsWithQueryDesc.items[1].content).toBe(commentContentString05);
    expect(CommentsWithQueryDesc.items[2].content).toBe(commentContentString01);
    expect(CommentsWithQueryDesc.items[3].content).toBe(commentContentString03);
    expect(CommentsWithQueryDesc.items[4].content).toBe(commentContentString04);

    // Applying and checking ascending sorting
    const CommentsWithQueryAsc = await findComments("content", "asc");
    expect(CommentsWithQueryAsc.items[0].content).toBe(commentContentString04);
    expect(CommentsWithQueryAsc.items[1].content).toBe(commentContentString03);
    expect(CommentsWithQueryAsc.items[2].content).toBe(commentContentString01);
    expect(CommentsWithQueryAsc.items[3].content).toBe(commentContentString05);
    expect(CommentsWithQueryAsc.items[4].content).toBe(commentContentString02);
  });
});
describe("Comments pagination", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should return correct comments pagination output", async () => {
    // Trying to create 20 comments
    let i = 0;
    while (i < 20) {
      const response = await commentCreator();
      expect(response.status).toBe(201);
      i++;
    }

    // Checking pagination
    const firstPost = await firstPostId();
    const response = await getter(postsURI + firstPost + commentsURI);
    expect(response.status).toBe(200);

    const commentsWithQuery = await findComments(
      undefined,
      undefined,
      "2",
      "5"
    );
    expect(commentsWithQuery.pagesCount).toBe(4);
    expect(commentsWithQuery.page).toBe(2);
    expect(commentsWithQuery.pageSize).toBe(5);
    expect(commentsWithQuery.totalCount).toBe(20);
    expect(commentsWithQuery.items.length).toBe(5);
  }, 30000);
});
describe("Comments status 400 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should NOT create new comment without content", async () => {
    // Trying to create comment without content
    const response = await commentCreator(null);
    expect(response.status).toBe(400);

    // Checking result
    const length = await commentsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new comment with incorrect content type", async () => {
    // Trying to create comment with incorrect content type
    const response = await commentCreator(123);
    expect(response.status).toBe(400);

    // Checking result
    const length = await commentsLength();
    expect(length).toBe(0);
  });
  it("should NOT create new comment with incorrect content length", async () => {
    // Trying to create comment with incorrect content length
    const response = await commentCreator(longString17);
    expect(response.status).toBe(400);

    // Checking result
    const length = await commentsLength();
    expect(length).toBe(0);
  });
});
describe("Comments status 401 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should create new comment for testing", async () => {
    // Trying to create comment with authenticated user
    const response = await commentCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const comment = await firstComment();
    const returnedComment = await commentReturner();
    expect(comment).toStrictEqual(returnedComment);
  });
  it("should return 401 when creating comment with incorrect credentials", async () => {
    const postId = await firstPostId();
    const response = await request(app)
      .post(postsURI + postId + commentsURI)
      .send({
        commentContentString,
      })
      .set(basicAuthKey, invalidAuthValue);
    expect(response.status).toBe(401);
  });
  it("should return 401 when updating comment with incorrect credentials", async () => {
    const commentId = await firstCommentId();
    const response = await request(app)
      .put(commentsURI + commentId)
      .send({
        commentContentString,
      })
      .set(basicAuthKey, invalidAuthValue);
    expect(response.status).toBe(401);
  });
  it("should return 401 when deleting comment with incorrect credentials", async () => {
    const commentId = await firstCommentId();
    const response = await request(app)
      .delete(commentsURI + commentId)
      .set(basicAuthKey, invalidAuthValue);
    expect(response.status).toBe(401);
  });
});
describe("Comments status 403 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should create new villain user for testing", async () => {
    // Trying to create user
    const response = await userCreator(
      undefined,
      "Villain",
      undefined,
      "villain@hacker.com"
    );
    expect(response.status).toBe(201);
  });
  it("should create new comment for testing", async () => {
    // Trying to create comment with authenticated user
    const response = await commentCreator();
    expect(response.status).toBe(201);
  });
  it("should return 403 when updating comment with incorrect token", async () => {
    const response = await commentUpdater(undefined, "Villain");
    expect(response.status).toBe(403);
  });
  it("should return 403 when deleting comment with incorrect token", async () => {
    const commentId = await firstCommentId();
    const response = await eraserWithIdBearer(
      commentsURI,
      commentId,
      "Villain"
    );
    expect(response.status).toBe(403);
  });
});
describe("Comments status 404 checks", () => {
  beforeAll(eraseAll);
  it("should create new blog for testing", async () => {
    // Trying to create a blog
    const response = await blogCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created blog
    const blog = await firstBlog();
    const returnedBlog = await blogReturner();
    expect(blog).toStrictEqual(returnedBlog);
  });
  it("should create new post for testing", async () => {
    // Trying to create a post
    const response = await postCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created post
    const post = await firstPost();
    const returnedPost = await postReturner();
    expect(post).toStrictEqual(returnedPost);
  });
  it("should create new user for testing", async () => {
    // Trying to create user
    const response = await userCreator();
    expect(response.status).toBe(201);

    // Checking result by returning created user
    const user = await firstUser();
    const returnedUser = await userReturner();
    expect(user).toStrictEqual(returnedUser);
  });
  it("should return 404 when getting comments of nonexistent post", async () => {
    const response = await getter(postsURI + invalidURI + commentsURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when creating comment of nonexistent post", async () => {
    const response = await invalidCommentCreator();
    expect(response.status).toBe(404);
  });
  it("should return 404 when getting nonexistent comment", async () => {
    const response = await getter(commentsURI + invalidURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when updating nonexistent comment", async () => {
    const response = await invalidCommentUpdater(commentsURI + invalidURI);
    expect(response.status).toBe(404);
  });
  it("should return 404 when deleting nonexistent comment", async () => {
    const response = await eraser(commentsURI + invalidURI);
    expect(response.status).toBe(404);
  });
});