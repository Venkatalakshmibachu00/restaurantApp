import {useState, useEffect} from 'react'
import Header from './components/Header'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const INITIAL_VIEW = 'INITIAL_VIEW'
const SUCCESS_VIEW = 'SUCCESS_VIEW'
const FAILURE_VIEW = 'FAILURE_VIEW'

const fetchMenuDetails = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data[0]
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

const App = () => {
  const [categories, setCategories] = useState([])
  const [dishes, setDishes] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [restaurantData, setRestaurantData] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [apiStatus, setApiStatus] = useState(INITIAL_VIEW)

  useEffect(() => {
    const getMenuDetails = async () => {
      setApiStatus(INITIAL_VIEW)
      try {
        const data = await fetchMenuDetails()
        if (data) {
          setCategories(data.table_menu_list ?? [])
          setDishes(data.table_menu_list?.[0]?.category_dishes ?? [])
          setRestaurantData(data)

          const initialQuantities = {}
          data.table_menu_list?.forEach(category => {
            category.category_dishes?.forEach(dish => {
              initialQuantities[dish.dish_id] = 0
            })
          })
          setQuantities(initialQuantities)

          setApiStatus(SUCCESS_VIEW)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setApiStatus(FAILURE_VIEW)
      }
    }
    getMenuDetails()
  }, [])

  const handleSelectCategory = categoryId => {
    const selectedCat = categories.find(
      cat => cat.menu_category_id === categoryId,
    )
    setDishes(selectedCat?.category_dishes ?? [])
  }

  const handleAddToCart = dishId => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[dishId] || 0
      const newQuantity = currentQuantity + 1

      // Increase cart count only when item is added for the first time
      if (currentQuantity === 0) {
        setCartCount(prevCount => prevCount + 1)
      }

      return {...prevQuantities, [dishId]: newQuantity}
    })
  }

  const handleRemoveFromCart = dishId => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[dishId] || 0
      if (currentQuantity > 0) {
        const newQuantity = currentQuantity - 1

        // Decrease cart count only when the item's quantity becomes 0
        if (newQuantity === 0) {
          setCartCount(prevCount => prevCount - 1)
        }

        return {...prevQuantities, [dishId]: newQuantity}
      }
      return prevQuantities
    })
  }

  const renderView = () => {
    switch (apiStatus) {
      case INITIAL_VIEW:
        return <p>Loading menu details...</p>

      case SUCCESS_VIEW:
        return (
          <>
            <div>
              <Header
                restaurantName={restaurantData?.restaurant_name}
                cartCount={cartCount}
              />
              {/* Category List */}
              <div className="category-list">
                {categories.map(category => (
                  <button
                    type="button"
                    className="button"
                    key={category.menu_category_id}
                    onClick={() =>
                      handleSelectCategory(category.menu_category_id)
                    }
                  >
                    {category.menu_category}
                  </button>
                ))}
              </div>

              {/* Dish List */}
              <div className="dish-list">
                {dishes.length > 0 ? (
                  dishes.map(dish => (
                    <div key={dish.dish_id} className="dish-item">
                      <div className="each_dish_item">
                        <h2 className="name">{dish.dish_name}</h2>
                        <p>
                          {dish.dish_currency} {dish.dish_price}
                        </p>
                        <p>{dish.dish_description}</p>
                        {dish.addonCat && dish.addonCat.length > 0 && (
                          <p>Customizations available</p>
                        )}
                        <p>{dish.dish_Availability ? '' : 'Not available'}</p>

                        {/* Dish Quantity Controls */}
                        <div className="controls">
                          {dish.dish_Availability && (
                            <>
                              <button
                                className="btn"
                                type="button"
                                onClick={() =>
                                  handleRemoveFromCart(dish.dish_id)
                                }
                                disabled={quantities[dish.dish_id] === 0} // Prevent decrement below 0
                              >
                                -
                              </button>
                              <p>{quantities[dish.dish_id] || 0}</p>
                              <button
                                className="btn"
                                type="button"
                                onClick={() => handleAddToCart(dish.dish_id)}
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <p>{dish.dish_calories} calories</p>
                      <div>
                        <img
                          className="image"
                          src={dish.dish_image}
                          alt={dish.dish_name}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No dishes available</p>
                )}
              </div>
            </div>
          </>
        )

      case FAILURE_VIEW:
        return <p>Failed to load menu details. Please try again later.</p>

      default:
        return null
    }
  }

  return <div className="app">{renderView()}</div>
}

export default App
