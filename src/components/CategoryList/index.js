import './index.css'

const CategoryList = ({categories, onSelectCategory}) => (
  <div className="category-list">
    {categories.length > 0 ? (
      categories.map(category => (
        <button
          type="button"
          className="button"
          key={category.menu_category_id}
          onClick={() => onSelectCategory(category.menu_category_id)}
        >
          {category.menu_category}
        </button>
      ))
    ) : (
      <p>No categories available</p>
    )}
  </div>
)

export default CategoryList
