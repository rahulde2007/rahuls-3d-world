import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
  loading?: "eager" | "lazy";
  width?: number;
  height?: number;
}

const WorkImage = (props: Props) => {
  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={props.link}
        target="_blank"
        data-cursor={"disable"}
      >
        {props.link && (
          <div className="work-link">
            <MdArrowOutward />
          </div>
        )}
        <img
          src={props.image}
          alt={props.alt}
          loading={props.loading ?? "lazy"}
          decoding="async"
          width={props.width}
          height={props.height}
        />
      </a>
    </div>
  );
};

export default WorkImage;
