import DishItem from '../DishItem'

const DishList = ({dishes, onAddToCart, onRemoveFromCart}) => (
  <div className="dish-list">
    {dishes.length > 0 ? (
      dishes.map(dish => (
        <DishItem
          key={dish.dish_id}
          dish={dish}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
        />
      ))
    ) : (
      <p>No dishes available</p>
    )}
  </div>
)

export default DishList
