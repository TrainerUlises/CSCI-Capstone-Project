import "./Post.css";

function getLabelClass(type) {
  switch (type) {
    case "Needs Aid":
      return "label-needs";
    case "Offering Aid":
      return "label-request";
    case "Donation/Swap":
      return "label-donation";
    default:
      return "label-other";
  }
}

export default function Post() {
  const {
    type,
    urgent,
    title,
    body,
    imageUrl,
    author,
    time,
    locationPublic,
  } = post;

  const labelClass = getLabelClass(type);
  const locationText =
    locationPublic?.neighborhood || "Approximate location";
  const radiusMiles = locationPublic?.radiusMiles || 0.5;

  return (
    <div className="postBox">

      <div className={`postLabel ${labelClass}`}>
        {type}
        {urgent && <span className="urgentDot">●</span>}
      </div>

      <h3 className="postTitle">{title}</h3>

      <p className="postDescription">{description}</p>

      {locationPublic && (
        <div className="postLocationCard">
          <div className="postLocationTitle">📍 {locationText}</div>
          <div className="postLocationMap">
            <div className="postLocationCircle" />
          </div>
          <div className="postLocationHint">
            Approximate location within {radiusMiles} mile
            {radiusMiles === 1 ? "" : "s"}
          </div>
        </div>
      )}

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