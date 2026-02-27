import "./Post.css";

export default function Post({ post }) {
  /*const {
    type,
    title,
    description,
    author,
    address,
    time,
    imageUrl,
    urgent,
  } = post;

  const labelClass = {
    "Needs Aid": "label-needs",
    "Request Aid": "label-request",
    "Donation/Swap": "label-donation",
    "Other": "label-other",
  }[type];*/

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