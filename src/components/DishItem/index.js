import {useState} from 'react'
import './index.css'

const DishItem = ({dish, onAddToCart, onRemoveFromCart}) => {
  const [count, setCount] = useState(0)

  const handleAdd = () => {
    setCount(count + 1)
    onAddToCart()
  }

  const handleRemove = () => {
    if (count > 0) {
      setCount(count - 1)
      onRemoveFromCart()
    }
  }

  return (
    <div className="dish-item">
      <div className="each_dish_item">
        <h2 className="name">{dish.dish_name}</h2>
        <p>
          {dish.dish_currency} {dish.dish_price}
        </p>
        <p>{dish.dish_description}</p>
        {dish.addoncat && <p>Customizations available</p>}
        <p>{dish.dish_Availability ? '' : 'Not available'}</p>
        <div className="controls">
          {dish.dish_Availability && (
            <div className="controls">
              <button className="btn" type="button" onClick={handleRemove}>
                -
              </button>
              <p>{count}</p>
              <button className="btn" type="button" onClick={handleAdd}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
      <p>{dish.dish_calories} calories</p>
      <div>
        <img className="image" src={dish.dish_image} alt={dish.dish_name} />
      </div>
    </div>
  )
}

export default DishItem
