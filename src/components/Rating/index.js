import './index.css'

const Rating = props => {
  const {ratingsList, updateOnRating} = props
  const {imageUrl, ratingId} = ratingsList
  const onClickRating = () => {
    updateOnRating(ratingId)
  }

  return (
    <div>
      <li className="list-item1">
        <button
          type="button"
          onClick={onClickRating}
          className="start-btn list-item1"
        >
          <img
            className="stars-image"
            src={imageUrl}
            alt={`rating ${ratingId}`}
          />
          <p>&up</p>
        </button>
      </li>
    </div>
  )
}

export default Rating
