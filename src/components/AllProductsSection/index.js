import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import FiltersGroup from '../FiltersGroup'
import Rating from '../Rating'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchedProduct: '',
    ratingId: '',
    categoryValue: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  updateOnRating = rating => {
    console.log(rating)
    this.setState({ratingId: rating}, this.getProducts)
  }

  onFailureApiCall = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
      />
    </div>
  )

  getProducts = async () => {
    this.setState({
      isLoading: true,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      searchedProduct,
      ratingId,
      categoryValue,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${categoryValue}&title_search=${searchedProduct}&rating=${ratingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        isLoading: false,
      })
    } else {
      this.onFailureApiCall()
    }
  }

  updateOnCategory = category => {
    this.setState({categoryValue: category}, this.getProducts)
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onClickClearFilters = () => {
    this.setState(
      {
        ratingId: '',
        categoryValue: '',
        searchedProduct: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId, searchedProduct} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          searchedProduct={searchedProduct}
          updateOnSearch={this.updateOnSearch}
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  onFailureProductsList = () => {
    const {productsList, isLoading} = this.state
    if (productsList.length === 0) {
      return (
        <div className="no-products">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
            className="no-products-img"
          />
          <p>No Products Found!</p>
        </div>
      )
    }
    return isLoading ? this.renderLoader() : this.renderProductsList()
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onChangeSearchEvent = event => {
    console.log(event.target.value)
    this.setState({searchedProduct: event.target.value}, this.getProducts)
  }

  // TODO: Add failure view

  render() {
    const {isLoading} = this.state

    return (
      <div className="all-products-section">
        <div className="categories-section ">
          <div className="search-tab">
            <input
              className="input"
              onChange={this.onChangeSearchEvent}
              placeholder="Search"
              type="search"
            />
            <BsSearch />
          </div>
          <h1 className="category-name">Category</h1>
          <ul className="ul-list">
            {categoryOptions.map(each => (
              <FiltersGroup
                updateOnCategory={this.updateOnCategory}
                categoryOptions={each}
              />
            ))}
          </ul>
          <p className="category-name">Rating</p>
          <ul className="ul-list">
            {ratingsList.map(each => (
              <Rating updateOnRating={this.updateOnRating} ratingsList={each} />
            ))}
          </ul>
          <button
            type="button"
            onClick={this.onClickClearFilters}
            className="clear-btn"
          >
            Clear Filters
          </button>
        </div>
        {this.onFailureProductsList()}
      </div>
    )
  }
}

export default AllProductsSection
