interface ICreatePostDtoProps {
  title: string;
  content: string;
  userId: string;
  tags: string[];
}

export class CreatePostDto {
  private title: string;
  private content: string;
  private userId: string;
  private tags: string[];

  constructor(props: ICreatePostDtoProps) {
    this.title = props.title;
    this.content = props.content;
    this.userId = props.userId;
    this.tags = props.tags;
  }

  public getTitle = () => {
    return this.title;
  };

  public getContent = () => {
    return this.content;
  };

  public getUserId = () => {
    return this.userId;
  };

  public getTags = () => {
    return this.tags;
  };
}
