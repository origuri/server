import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { CreatePostDto } from "../dto";
import { getConnection } from "../../../dbPromiseConnection";
import { UserService } from "../../users/service/userService";
import { IUser } from "../../users/dto";
import { TagService } from "../../tags";
import { IPostsDtoProps, PostsDto } from "../dto/posts.dto";
import { IPostDtoProps, ITag, PostDto } from "../dto/post.dto";
import { CommentDto, ICommentDtoPorps } from "../../comments/dto/comment.dto";

interface IPaging {
  limit: number;
  offset: number;
}

export class PostService {
  public userService;
  public tagService;

  constructor() {
    this.userService = new UserService();
    this.tagService = new TagService();
  }

  // props : createPostDto 게시글 생성
  public createPost = async (props: CreatePostDto) => {
    const db: Pool = await getConnection();
    console.log({ props });

    try {
      // 유효한 유저인지 확인.
      const user = await this.userService.findById(props.getUserId());

      const newPost = await db.query<ResultSetHeader>(
        "insert post (title, content, userId) values(?,?,?)",
        /*  user 타입 정해서 as로 강제 캐스팅하기  */
        [props.getTitle(), props.getContent(), (user as IUser).id]
      );
      console.log("여기 나옴?");

      if (!newPost || newPost[0].affectedRows === 0) {
        throw { status: 400, message: "post 등록 실패" };
      }
      await this.tagService.insertTag(
        newPost[0].insertId + "",
        props.getTags()
      );

      return newPost[0].insertId;
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };

  // 게시글 전체 조회
  /*  public getPosts = async (props: IPaging, searchValue: string) => {
    const db: Pool = await getConnection();
    try {
      const posts = await db.query<RowDataPacket[]>(
        `select * from post p where p.title like concat("%",?,"%") order by p.createAt desc, p.id limit  ? offset  ?;`,
        [searchValue, props.limit, props.offset]
      );

      const count = await db.query<RowDataPacket[]>(
        "select count(*) as postCount from post where title like concat('%',?,'%')",
        [searchValue]
      );
      console.log("이거이거 -> ", count[0][0]);

      return { posts: posts[0], postCounts: count[0][0] };
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  }; */
  // 게시글 전체 조회
  public getPosts = async (): Promise<{
    posts: PostsDto[];
    count: RowDataPacket;
  }> => {
    const db: Pool = await getConnection();
    try {
      const posts = await db.query<RowDataPacket[]>(
        `select p.id as postId, p.title as title, p.content as content, p.createAt as createAt, u.id as userId, u.email as email, u.name as name, u.description as description, u.password as password from post p join user u on u.id = p.userId order by createAt desc;`
      );

      console.log("이거 확인 -> ", posts[0]);

      /* where title like concat('%',?,'%') */
      const count = await db.query<RowDataPacket[]>(
        "select count(*) as count from post "
      );
      console.log("이거이거 -> ", count[0][0]);

      if (posts[0].length === 0 && count[0].length === 0)
        throw { status: 404, message: "없음" };

      return {
        posts: posts[0].map((post) => new PostsDto(post as IPostsDtoProps)),
        count: count[0][0],
      };
    } catch (error) {
      console.error(error);
      // Promise할 때 이걸 catch문에 꼭 넣어주기.
      return Promise.reject(error);
    } finally {
      db.end();
    }
  };

  // 게시글 상세 조회
  public getPost = async (postId: string): Promise<{ post: PostDto[] }> => {
    const db: Pool = await getConnection();

    try {
      const post = await db.query<RowDataPacket[]>(
        `select p.id as postId, p.title as title, p.content as content, p.createAt as createAt, u.id as userId, u.email as email, u.name as name, u.description as description, u.password as password from post p join user u on u.id = p.userId where p.id = ?;`,
        [postId]
      );

      if (post[0].length === 0) {
        throw { status: 404, message: "게시글이 없습니다." };
      }

      const tags = await db.query<RowDataPacket[]>(
        " select t.id as tagId, t.name as tagName  from tag t where t.postId = ?;",
        [postId]
      );

      const comments = await db.query<RowDataPacket[]>(
        "select * from comment where postId = ?;",
        [postId]
      );

      const result = comments[0].map((comment) => {
        return new CommentDto({
          // CommentDto 객체 생성
          id: (comment as ICommentDtoPorps).id,
          content: (comment as ICommentDtoPorps).content,
          parentCommentId: (comment as ICommentDtoPorps).parentCommentId,
          userId: (comment as ICommentDtoPorps).userId,
          postId: (comment as ICommentDtoPorps).postId,
          // comment[0]을 새로 풀어서 얻은 parentsCommentId와 현재 map으로 풀어놓은 id가 일치한 것만 넣어라 .
          childComments: comments[0].filter(
            (c) => c.parentCommentId === comment.id
          ),
        });
      });

      // 부모 댓글만 나오게 하는 필터
      const commentList = result.filter(
        (parentComments) => parentComments.parentCommentId === null
      );

      console.log(
        result.filter(
          (parentComments) => parentComments.parentCommentId === null
        )
      );

      return {
        post: post[0].map(
          (post) =>
            new PostDto(post as IPostDtoProps, tags[0] as ITag[], commentList)
        ),
      };
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    } finally {
      db.end();
    }
  };

  // 좋아요 누르기 isLike가 true인 상태면 좋아요가 되어있으니까 취소해야 함.
  // isLike가 false인 상태면 좋아요가 안되어 있는 상태니까 좋아요 해야 함.
  public postLike = async (userId: string, postId: string, isLike: boolean) => {
    const db: Pool = await getConnection();
    try {
      const user = await this.userService.findById(userId);

      // 좋아요를 누를 게시글 확인
      const post = await db.query<RowDataPacket[]>(
        "select * from post where id = ? ",
        [postId]
      );

      if (post[0].length === 0) {
        throw { status: 400, message: "좋아요 누르기 : 게시글이 없네요 " };
      }

      // 좋아요를 눌렀는지 먼저 확인 후에
      const isLiked = await db.query<RowDataPacket[]>(
        "select * from postlike where userId = ? and postId = ?",
        [userId, postId]
      );

      // 좋아요 해야 됨.-> isLike : false => 좋아요 안한 상태, isLiked[0].length === 0 => db에 좋아요 값이 없다.
      if (isLiked[0].length === 0 && !isLike) {
        // 안눌렀다면 좋아요 실행
        await db.query<ResultSetHeader>(
          "insert into postlike(userId, postId) values (?,?)",
          [userId, postId]
        );
      }
      // 좋아요 취소해야 됨 -> isLike : true => 좋아요 한 상태, isLiked[0].length > 0 => db에 좋아요 값이 있다.
      else if (isLiked[0].length > 0 && isLike) {
        // 안눌렀다면 좋아요 실행
        await db.query<ResultSetHeader>(
          "delete from postlike where userId = ? and postId = ?",
          [userId, postId]
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      db.end();
    }
  };
}
