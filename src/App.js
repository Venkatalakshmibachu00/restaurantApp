import {useState, useEffect} from 'react'
import Header from './components/Header'
import CategoryList from './components/CategoryList'
import DishList from './components/DishList'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const fetchMenuDetails = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data = await response.json()
    return data[0] // Access the first object inside the array
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

const App = () => {
  const [categories, setCategories] = useState([])
  const [dishes, setDishes] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [restaurantData, setRestaurantData] = useState(null)

  useEffect(() => {
    const getMenuDetails = async () => {
      const data = await fetchMenuDetails()
      if (data) {
        setCategories(data.table_menu_list ?? [])
        setDishes(data.table_menu_list?.[0]?.category_dishes ?? [])
        setRestaurantData(data)
      }
    }
    getMenuDetails()
  }, [])

  const handleSelectCategory = categoryId => {
    const selectedCat = categories.find(
      cat => cat.menu_category_id === categoryId,
    )
    setDishes(selectedCat?.category_dishes ?? []) // Ensure it clears properly when no dishes are found
  }

  const handleAddToCart = () => {
    setCartCount(cartCount + 1)
  }

  const handleRemoveFromCart = () => {
    setCartCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0))
  }

  return (
    <div className="app">
      <Header
        restaurantName={restaurantData?.restaurant_name}
        cartCount={cartCount}
      />
      {categories.length > 0 ? (
        <>
          <CategoryList
            categories={categories}
            onSelectCategory={handleSelectCategory}
          />
          <DishList
            dishes={dishes}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        </>
      ) : (
        <p>Loading menu details...</p>
      )}
    </div>
  )
}

export default App
