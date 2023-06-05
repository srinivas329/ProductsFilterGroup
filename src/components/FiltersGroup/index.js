import './index.css'

const FiltersGroup = props => {
  const {categoryOptions, updateOnCategory} = props
  const {categoryId, name} = categoryOptions

  const onclickCategory = () => {
    updateOnCategory(categoryId)
  }

  return (
    <div className="filters-group-container">
      <li className="list-item">
        <button
          onClick={onclickCategory}
          className="category-btn"
          type="button"
        >
          <p>{name}</p>
        </button>
      </li>
    </div>
  )
}
export default FiltersGroup
