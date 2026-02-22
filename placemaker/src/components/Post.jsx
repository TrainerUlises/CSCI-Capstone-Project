import "./components.css";

export default function Post({
  authorName = "Name",
  authorHeadline = "Neighborhood",
  timeAgo = "1h",
  content = "Post text content here",
  imageUrl = "https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg", // optional
  likes = 0,
  comments = 0,
}) {
  return (
    <article className="post">
      <header className="post_header">
        <div className="post_avatar" aria-hidden="true" />
        <div className="post_meta">
          <div className="post_metaTop">
            <span className="post_author">{authorName}</span>
            <span className="post_dot">•</span>
            <span className="post_time">{timeAgo}</span>
          </div>
          <div className="post_headline">{authorHeadline}</div>
        </div>

        <button className="post_more" type="button" aria-label="More options">
          ⋯
        </button>
      </header>

      <div className="post_body">
        <p className="post_content">{content}</p>

        {imageUrl ? (
          <div className="post_imageWrap">
            <img className="post_image" src={imageUrl} alt="Post media" />
          </div>
        ) : null}
      </div>

      <footer className="post_footer">
        <div className="post_stats">
          <span className="post_stat">{likes} likes</span>
          <span className="post_dot">•</span>
          <span className="post_stat">{comments} comments</span>
        </div>

        <div className="post_actions" role="group" aria-label="Post actions">
          <button className="post_actionBtn" type="button">Like</button>
          <button className="post_actionBtn" type="button">Comment</button>
          <button className="post_actionBtn" type="button">Share</button>
        </div>
      </footer>
    </article>
  );
}