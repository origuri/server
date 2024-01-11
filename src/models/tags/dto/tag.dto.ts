interface ITagsProps {
  id: string;
  name: string;
}

export class TagDto {
  private id;
  private name;

  constructor(props: ITagsProps) {
    this.id = props.id;
    this.name = props.name;
  }
}
