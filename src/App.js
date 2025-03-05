import React, {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    categories: [],
    dishes: [],
    cartCount: 0,
    restaurantData: null,
    quantities: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getMenuDetails()
  }

  getMenuDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(API_URL)

    if (response.ok) {
      const fetchedData = await response.json()
      const menuData = fetchedData[0]

      const initialQuantities = {}
      menuData.table_menu_list?.forEach(category => {
        category.category_dishes?.forEach(dish => {
          initialQuantities[dish.dish_id] = 0
        })
      })

      this.setState({
        categories: menuData.table_menu_list ?? [],
        dishes: menuData.table_menu_list?.[0]?.category_dishes ?? [],
        restaurantData: menuData,
        quantities: initialQuantities,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  handleSelectCategory = categoryId => {
    const {categories} = this.state
    const selectedCat = categories.find(
      cat => cat.menu_category_id === categoryId,
    )
    this.setState({dishes: selectedCat?.category_dishes ?? []})
  }

  handleAddToCart = dishId => {
    this.setState(prevState => {
      const currentQuantity = prevState.quantities[dishId] || 0
      const newQuantity = currentQuantity + 1

      if (currentQuantity === 0) {
        return {
          quantities: {...prevState.quantities, [dishId]: newQuantity},
          cartCount: prevState.cartCount + 1,
        }
      }

      return {
        quantities: {...prevState.quantities, [dishId]: newQuantity},
      }
    })
  }

  handleRemoveFromCart = dishId => {
    this.setState(prevState => {
      const currentQuantity = prevState.quantities[dishId] || 0
      if (currentQuantity > 0) {
        const newQuantity = currentQuantity - 1

        if (newQuantity === 0) {
          return {
            quantities: {...prevState.quantities, [dishId]: newQuantity},
            cartCount: prevState.cartCount - 1,
          }
        }

        return {
          quantities: {...prevState.quantities, [dishId]: newQuantity},
        }
      }
      return prevState
    })
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <p>We are having some trouble processing your request. Please try again.</p>
  )

  renderSuccessView = () => {
    const {categories, dishes, restaurantData, cartCount, quantities} =
      this.state

    return (
      <>
        <div>
          <Header
            restaurantName={restaurantData?.restaurant_name}
            cartCount={cartCount}
          />
          <div className="category-list">
            {categories.map(category => (
              <button
                type="button"
                className="button"
                key={category.menu_category_id}
                onClick={() =>
                  this.handleSelectCategory(category.menu_category_id)
                }
              >
                {category.menu_category}
              </button>
            ))}
          </div>

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

                    <div className="controls">
                      {dish.dish_Availability && (
                        <>
                          <button
                            className="btn"
                            type="button"
                            onClick={() =>
                              this.handleRemoveFromCart(dish.dish_id)
                            }
                            disabled={quantities[dish.dish_id] === 0}
                          >
                            -
                          </button>
                          <p>{quantities[dish.dish_id] || 0}</p>
                          <button
                            className="btn"
                            type="button"
                            onClick={() => this.handleAddToCart(dish.dish_id)}
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
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default App
