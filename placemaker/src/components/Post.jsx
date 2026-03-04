import "./Post.css";

export default function Post() {
  return (
    <div className="postBox">

      <div className={`postLabel ${labelClass}`}>
        {type}
        {urgent && <span className="urgentDot">●</span>}
      </div>

      <h3 className="postTitle">{title}</h3>

      <p className="postDescription">{description}</p>

      {imageUrl && (
        <div className="postImageWrapper">
          <img src={imageUrl} alt="Post visual" />
        </div>
      )}

      <div className="postFooter">
        <div className="postMeta">
          <span className="postAuthor">{author}</span>
          <span className="postAddress">📍 {address}</span>
          <span className="postTime">{time}</span>
        </div>

        <div className="postActions">
          <button className="postBtn primary">Contact</button>
          <button className="postBtn secondary">Share</button>
        </div>
      </div>
    </div>
  );
}