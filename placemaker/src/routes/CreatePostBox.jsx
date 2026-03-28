import { useState } from "react";
import AddressAutocomplete from "../components/AddressAutocomplete";
import "./FeedView.css";

const POST_TYPES = {
  REQUEST: "Needs Aid",
  OFFER: "Offering Aid",
  DONATION: "Donation/Swap",
  OTHER: "Other",
};

function snapToGrid(lat, lng, gridSize = 0.01) {
  return {
    lat: Math.round(lat / gridSize) * gridSize,
    lng: Math.round(lng / gridSize) * gridSize,
  };
}

function CreatePostBox({ currentUser, onCreatePost }) {
  const [type, setType] = useState(POST_TYPES.REQUEST);
  const [urgent, setUrgent] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [neededBy, setNeededBy] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  function resetForm() {
    setType(POST_TYPES.REQUEST);
    setUrgent(false);
    setTitle("");
    setBody("");
    setNeededBy("");
    setLocationData(null);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
  
    if (!title.trim() || !body.trim()) {
      setError("Please add a title and description.");
      return;
    }

    if (!locationData?.lat || !locationData?.lng) {
      setError("Please select an address from the dropdown.");
      return;
    }

    const snapped = snapToGrid(locationData.lat, locationData.lng, 0.01);
  
    const payload = {
        type: type || POST_TYPES.OTHER,
        urgent,
        title: title.trim(),
        body: body.trim(),
        neededBy: neededBy.trim() || "",
        imageUrl: "",
        locationPublic: {
          neighborhood:
            locationData.neighborhood ||
            locationData.locality ||
            locationData.zipCode ||
            "General area",
          approxLat: snapped.lat,
          approxLng: snapped.lng,
          radiusMiles: 0.5,
        },
        locationPrivate: {
          formattedAddress: locationData.formattedAddress || "",
          placeId: locationData.placeId || "",
          lat: locationData.lat,
          lng: locationData.lng,
          zipCode: locationData.zipCode || "",
          neighborhood: locationData.neighborhood || "",
          locality: locationData.locality || "",
          adminAreaLevel1: locationData.adminAreaLevel1 || "",
        },
      };
  
    try {
      setIsPosting(true);
      await onCreatePost(payload);
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Couldn’t create post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <form className="createCard createPostBox" onSubmit={handleSubmit}>
      <div className="createPostHeader">
        <div className="avatar"></div>

        <div className="createPostHeaderText">
          <h3>Create a post</h3>
        </div>
      </div>

      <div className="createTypeRow">
        <button
          type="button"
          className={`createChip ${type === POST_TYPES.REQUEST ? "isActive" : ""}`}
          onClick={() => setType(POST_TYPES.REQUEST)}
        >
          🆘 Request Aid
        </button>

        <button
          type="button"
          className={`createChip ${type === POST_TYPES.OFFER ? "isActive" : ""}`}
          onClick={() => setType(POST_TYPES.OFFER)}
        >
          🤝 Offering Aid
        </button>

        <button
          type="button"
          className={`createChip ${type === POST_TYPES.DONATION ? "isActive" : ""}`}
          onClick={() => setType(POST_TYPES.DONATION)}
        >
          ♻️ Donation/Swap
        </button>

        <label className="urgentInline">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          <span>{urgent ? "Urgent" : "Mark urgent"}</span>
        </label>
      </div>

      <div className="createField">
        <label className="createLabel">Title</label>
        <input
          className="createTextInput"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need / offer?"
          maxLength={90}
        />
        <div className="createMeta">{title.length}/90</div>
      </div>

      <div className="createField">
        <label className="createLabel">Description</label>
        <textarea
          className="createTextarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add helpful details (who, what, when, where)..."
          rows={4}
          maxLength={600}
        />
        <div className="createMeta">{body.length}/600</div>
      </div>

      <div className="createField">
        <label className="createLabel">
          Needed by <span className="optionalText">(optional)</span>
        </label>
        <input
          className="createTextInput"
          type="text"
          value={neededBy}
          onChange={(e) => setNeededBy(e.target.value)}
          placeholder='e.g. "Today by 7pm" or "This weekend"'
          maxLength={60}
        />
      </div>
      <div className="createField">
        <label className="createLabel">Location</label>
        <AddressAutocomplete
          onInputChange={() => setLocationData(null)}
          onAddressSelected={setLocationData}
          placeholder="Enter your address..."
        />
        <div className="createHint">
          Only an approximate area will be shown on the post.
        </div>
      </div>

      {error && <div className="createError">{error}</div>}

      <div className="createFooter">
        <div className="createHint">
          Tip: Clear titles + time window help neighbors respond faster.
        </div>

        <div className="createFooterActions">
          <button
            type="button"
            className="createBtn"
            onClick={resetForm}
            disabled={isPosting}
          >
            Reset
          </button>

          <button
            type="submit"
            className="createBtn createBtnPrimary"
            disabled={!canSubmit || isPosting}
          >
            {isPosting ? "Posting..." : "✍️ Post"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default CreatePostBox;