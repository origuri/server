import { NextFunction, Request, Response, Router } from "express";
import { PostService } from "../service/postService";
import { CommentService } from "../../comments/service";
import { CreateChildCommentDto, CreatePostDto } from "../dto";
import CreateCommentDto from "../../comments/dto/create-comment.dto";
import { RowDataPacket } from "mysql2";

class PostController {
  public router: Router;
  public path = "/posts";

  public postService;
  public commentService;

  constructor() {
    this.router = Router();
    this.postService = new PostService();
    this.commentService = new CommentService();
    this.init();
  }

  private init() {
    this.router.post("/", this.createPost);
    this.router.post("/:postId/comment", this.createComment);
    this.router.post("/child-comment", this.createchildComment);
    this.router.get("/", this.getPosts);
    this.router.get("/:id", this.getPost);
  }

  private createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // 헤더에 넣어놓은 jwt 검사로 유저를 확인
      const user = req.user;
      const { title, content, tags } = req.body;
      if (!user) throw { status: 401, message: "로그인을 진행해주세요" };

      const newPostId = await this.postService.createPost(
        new CreatePostDto({ title, content, userId: user.id, tags })
      );

      return res.status(201).json({ newPostId });
    } catch (error) {
      next(error);
    }
  };
  private createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user;
      const { content } = req.body;
      const { postId } = req.params;
      if (!user) throw { status: 401, message: "로그인을 진행해주세요" };
      console.log({ user, content, postId });

      const newCommentId = await this.commentService.createComment(
        new CreateCommentDto({ content, postId, userId: user.id })
      );
      console.log("이것두 -> ", newCommentId);

      return res.status(201).json({ newCommentId });
    } catch (error) {
      next(error);
    }
  };
  private createchildComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user;
      const { content, parentCommentId } = req.body;

      if (!user) throw { status: 401, message: "로그인을 진행해주세요" };
      console.log({ user, content, parentCommentId });

      const childCommentId = await this.commentService.createChildComment(
        new CreateChildCommentDto({
          content,
          parentCommentId,
          userId: user.id,
        })
      );
      return res.status(201).json({ childCommentId });
    } catch (error) {
      next(error);
    }
  };

  private getPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const searchValue = req.query.searchValue;
      const names = req.query.name;
      console.log({ searchValue, names });

      const { posts, count } = await this.postService.getPosts(
        searchValue as string
      );

      return res.status(200).json({ posts, count });
    } catch (error) {}
  };

  private getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { post } = await this.postService.getPost(id);

      return res.status(200).json(post);
    } catch (error) {
      console.error(error);
    }
  };
}

const postController = new PostController();

export default postController;
