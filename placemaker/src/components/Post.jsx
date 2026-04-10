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

function getStaticMapUrl(locationPublic) {
  if (
    !locationPublic ||
    typeof locationPublic.lat !== "number" ||
    typeof locationPublic.lng !== "number"
  ) {
    return null;
  }

  const { lat, lng } = locationPublic;
  const zoom = locationPublic.zoom || 15;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) return null;

  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=1200x500&scale=2&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
}

export default function Post({ post }) {
  const {
    type,
    urgent,
    title,
    body,
    imageUrl,
    author,
    time,
    locationPublic,
    details
  } = post;

  const labelClass = getLabelClass(type);
  const locationText =
    locationPublic?.neighborhood || "Approximate location";
  const radiusMiles = locationPublic?.radiusMiles || 0.5;
  const mapUrl = getStaticMapUrl(locationPublic);

  return (
    <article className="postCard">
      <header className="postHeader">
        <div className="postAuthor">
          <div className="avatar avatar-sm">{author?.initials}</div>

          <div className="postAuthorMeta">
            <div className="postAuthorLine">
              <span className="postAuthorName">{author?.name}</span>
              <span className="dot">•</span>
              <span className="postTime">{time}</span>
            </div>

            <div className="postSub">
              <span className="pin">📍</span>{locationText}
            </div>
          </div>
        </div>
        
        <div className="postBadges">
          <span className={`badge ${labelClass}`}>{type}</span>
          {urgent && <span className="badge badge-urgent">Urgent</span>}
        </div>
      </header>

      <div className="postBody">
        <h3 className="postTitle">{title}</h3>
        <p className="postText">{body}</p>

        {details?.neededBy && (
          <div className="postMetaRow">
            <span className="metaPill">Needed by: {details.neededBy}</span>
          </div>
        )}
      </div>
      {locationPublic && (
        <div className="postLocationCard">
          <div className="postLocationMap">
            {mapUrl ? (
                <img
                  src={mapUrl}
                  alt={`Map near ${locationText}`}
                  className="postLocationMapImage"
                />
              ) : (
                <div className="postLocationFallback">
                  Map unavailable
                </div>
              )}
          </div>
          <div className="postLocationHint">
            Approximate location within {radiusMiles} mile
            {radiusMiles === 1 ? "" : "s"}
          </div>
        </div>
      )}

      {post.imageUrl && (
        <div className="postImageWrap">
          <img className="postImage" src={imageUrl} alt="Post" />
        </div>
      )}

      <footer className="postFooter">
        <div className="postActions">
          <button className="actionBtn actionPrimary" type="button">
            Contact
          </button>
          <button className="actionBtn" type="button">
            Share
          </button>
        </div>
      </footer>
    </article>
  );
}