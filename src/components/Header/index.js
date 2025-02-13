import './index.css'

const Header = ({cartCount, restaurantName}) => (
  <header>
    <h1>{restaurantName}</h1>
    <p>My Orders</p>
    <div className="cart">
      <span>Cart </span>
      <p>{cartCount}</p>
    </div>
  </header>
)

export default Header
