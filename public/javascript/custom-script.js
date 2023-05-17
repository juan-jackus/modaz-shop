// *********** AUTHENTIFICATION HANDLER **********
const user = JSON.parse(localStorage.getItem('modazUser'));
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerPhoneNumber = document.getElementById('register-phone-number');
const logoutButttons = document.querySelectorAll('.logout-btn');
const userProfileBtn = document.querySelector('.menu-extra .user-profile');

// Show username on website header if login
if (user) {
  const boxLogin = document.querySelectorAll('.box-login');
  const usernameSpan = document.querySelector('.menu-extra .username');
  boxLogin.forEach((box) => {
    if (box) box.classList.add('d-none');
  });
  userProfileBtn.classList.remove('d-none');
  logoutButttons.forEach((btn) => {
    if (btn) btn.classList.remove('d-none');
  });
  usernameSpan.innerHTML = user.username;
}

// Add events Listeners
if (loginForm) {
  loginForm.addEventListener('submit', (e) => submitHandler(e, loginForm));
}
if (registerPhoneNumber) {
  registerPhoneNumber.addEventListener('keyup', phoneNumberHandler);
}
if (registerForm) {
  registerForm.addEventListener('submit', (e) =>
    submitHandler(e, registerForm)
  );
}
logoutButttons.forEach((btn) => {
  if (btn) btn.addEventListener('click', logoutHandler);
});
if (userProfileBtn) {
  userProfileBtn.addEventListener('click', getUserProfilePage);
}

// Hide or Show Password
function tooglePassword() {
  const pwdInputs = document.querySelectorAll('.show-password');
  pwdInputs.forEach((pwdInput) => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
    } else {
      pwdInput.type = 'password';
    }
  });
}
// Phone Number Formatter Function
function phoneNumberHandler(e) {
  let formattedPhoneNumber = '';
  // Remove '-' in previous phone Number value
  const phoneNumber = e.currentTarget.value.split('-').join('');
  const length = phoneNumber.length;
  // Format Phone Number
  for (let i = 0; i < length; i++) {
    if (i === 2 || i === 5 || i === 7) {
      formattedPhoneNumber += '-' + phoneNumber.charAt(i);
    } else if (i < 9) {
      formattedPhoneNumber += phoneNumber.charAt(i);
    }
  }

  e.currentTarget.value = formattedPhoneNumber;
}
// Login and Register Submit Handler
function submitHandler(e, htlmElement) {
  e.preventDefault();
  const formValues = Object.values(htlmElement).reduce((obj, field) => {
    if (field.name === 'fullName') {
      obj[field.name] = field.value
        .toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
    } else {
      obj[field.name] = field.value;
    }
    return obj;
  }, {});
  formValues.model = 'customer';
  authHandler(formValues, htlmElement);
}

function authHandler(formValues, htlmElement) {
  const auth = htlmElement.id === 'login-form' ? 'login' : 'register';
  fetch(window.location.origin + '/account/' + auth, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // redirect: 'follow',
    body: JSON.stringify(formValues),
  })
    .then(async (res) => {
      const isJson = res.headers
        .get('content-type')
        ?.includes('application/json');
      const resData = isJson ? await res.json() : null;
      if (!res.ok) {
        return Promise.reject(resData);
      }
      if (auth === 'login' && resData) {
        window.localStorage.setItem('modazUser', JSON.stringify(resData));
        if (
          window.location.href !== `${window.location.origin}/account/register`
        ) {
          return window.location.reload();
        }
        return window.location.replace(window.location.origin);
      }
      const succesRegisterDiv = document.getElementById('success-register');
      registerForm.classList.add('d-none');
      succesRegisterDiv.classList.remove('d-none');
    })
    .catch((error) => {
      authErrorHandler(error, auth);
    });
}

function authErrorHandler(error, auth) {
  const prefix = auth === 'login' ? '.modal-body' : '#register-form';
  const serverErrorDiv = document.querySelector(`${prefix} .server-error`);
  if (error && error.errorObj) {
    error.errorObj.forEach((err) => {
      const htlmElement = document.querySelector(`${prefix} .${err.param}`);
      htlmElement.innerHTML = err.msg;
      setTimeout(() => {
        htlmElement.innerHTML = '';
      }, 5000);
    });
  } else {
    if (serverErrorDiv) {
      serverErrorDiv.innerHTML = 'Network Error';
      serverErrorDiv.classList.add('server-error-message');
      setTimeout(() => {
        serverErrorDiv.innerHTML = '';
        serverErrorDiv.classList.remove('server-error-message');
      }, 5000);
    }
  }
}

function getUserProfilePage(e) {
  e.preventDefault();
  window.location.assign(
    window.location.origin + '/account/userprofile/' + user.id
  );
}

function logoutHandler(e) {
  e.preventDefault();
  window.localStorage.removeItem('modazUser');
  window.location.assign(window.location.origin);
}

// ********** SHOPPING CART HANDLERS **********
const navShopCart = document.querySelector('.nav-shop-cart');
const cartListUl = document.querySelector('.box-cart .cart_list');
const produtQuantityInput = document.querySelector('.product-quantity input');
const iconCart = document.querySelector('.icon_cart');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const productColors = document.querySelectorAll(
  '.product-colors .color-wrapper'
);

// Add Click Event
addToCartButtons.forEach((btn) => {
  if (btn) btn.addEventListener('click', addCartItemHandler);
});
productColors.forEach((el) => {
  if (el) el.addEventListener('click', selectColorHandler);
});

showShoppingCartItems();

function showShoppingCartItems() {
  // Get Shopping Cart Items
  const shoppingCart =
    JSON.parse(localStorage.getItem('modazShoppingCart')) || [];
  // SHow Number of items in Shopping Cart
  iconCart.innerHTML = shoppingCart.length
    ? `<span>${shoppingCart.length}</span>`
    : '';
  // No Items In Shopping Cart Text
  let shoppingItemsList =
    '<li class="p-3 text-center">Aucun produit dans le panier</li>';
  if (shoppingCart.length) {
    let cartTotal = 0;
    shoppingItemsList = '';
    shoppingCart.forEach((item) => {
      cartTotal += item.product.price * item.qty;
      shoppingItemsList += `
        <li class="header-cart-item">
          <span 
            class="delete-btn" 
            data-product-id="${item.product._id}"
            data-product-color="${item.color}"
          >
            <i class="fa fa-remove"></i>
          </span>
          <img src="${item.product.image}"/>
          <div class="infos">
            <p class="text-truncate">${item.product.name}</p>
            <div class="qty-price-color">
              <div class="price">$${item.product.price}</div>
              <div class="color" style="background-color:${item.color}"></div>
              <div class="qty">Qty : ${item.qty}</div>
            </div>
          </div>
        </li>`;
    });
    // Add cart Bottom
    shoppingItemsList += `
      <li class="cart-bottom">
        <div class="wrapper">
          <span class="clear-btn mb-1">Clear All</span>
          <div class="cart-total text-truncate mb-1">
            Total : <span>$${cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <!--<button id="checkout-btn" class=" w-100 mt-2" >
          PROCEED TO CHECKOUT
        </button>-->
      </li>`;
  }
  // SHow items or 'No items text' in Shopping Cart
  cartListUl.innerHTML = shoppingItemsList;
  // Get newly added htlm elements
  const cartItems = document.querySelectorAll('.cart_list .header-cart-item');
  const deleteButtons = document.querySelectorAll('.cart_list .delete-btn');
  const clearCart = document.querySelector('.cart_list .clear-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  //  Add event listerner to newly added htlm elements
  cartItems.forEach((item) => {
    if (item) {
      item.addEventListener('click', (e) => {
        const className = ['delete-btn', 'fa-remove'];
        if (className.some((c) => e.target.classList.contains(c))) return;
        const itemId = item.firstElementChild.dataset.productId;
        window.location.assign(
          window.location.origin + '/shop/product-details/' + itemId
        );
      });
    }
  });
  deleteButtons.forEach((btn) => {
    if (btn) btn.addEventListener('click', deleteCartItemHandler);
  });
  if (clearCart) clearCart.addEventListener('click', deleteCartItemHandler);
  if (checkoutBtn)
    checkoutBtn.addEventListener('click', (e) =>
      cartCheckoutHandler(shoppingCart)
    );
}

function selectColorHandler(e) {
  const el = e.currentTarget;
  if (el.classList.contains('active')) return;
  // Remove previous selected color
  productColors.forEach((el) => {
    el.classList.remove('active');
  });
  // Set selected color
  el.classList.add('active');
  el.style.borderColor = el.dataset.productColor;
}

function addCartItemHandler(e) {
  e.preventDefault();
  const product = JSON.parse(e.currentTarget.dataset.product);
  const shoppingCart =
    JSON.parse(localStorage.getItem('modazShoppingCart')) || [];
  const defaultColor = product.colors ? product.colors[0] : '';
  const activeColor = document.querySelector('.product-colors .active');
  const selectedColor = activeColor?.dataset.productColor || defaultColor;
  const productQuantity = produtQuantityInput ? produtQuantityInput.value : 1;

  const founProduct = shoppingCart.findIndex(
    //return -1 when no product found
    (item) => item.product._id === product._id && item.color === selectedColor
  );
  // If added Product is already in Shopping Cart with exact same value
  if (founProduct > -1 && shoppingCart[founProduct].qty === productQuantity) {
    return;
  }
  // Add product if it not in shopping cart or color different
  if (founProduct === -1 || shoppingCart[founProduct].color !== selectedColor) {
    shoppingCart.unshift({
      product,
      color: selectedColor,
      qty: productQuantity,
    });
  } else {
    // Update Quantity
    shoppingCart[founProduct].qty = productQuantity;
  }
  // Show Added Item Message
  const el = e.currentTarget;
  el.innerHTML =
    '<div class="success-add" ><i class="fa fa-check"></i> ITEM ADDED</div>';
  setTimeout(() => {
    el.innerHTML = '<a href="#"> ADD TO CART </a>';
  }, 2000);
  // Update Shopping Cart
  window.localStorage.setItem(
    'modazShoppingCart',
    JSON.stringify(shoppingCart)
  );
  showShoppingCartItems();
}

function cartCheckoutHandler(shoppingCart) {
  if (!user?._id) {
    const loginBtn = document.querySelector('.menu-extra .box-login a');
    return loginBtn.click();
  }
  fetch(window.location.origin + '/account/cart/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    body: JSON.stringify({ customerId: user._id, shoppingCart }),
  })
    .then(async (res) => {
      const isJson = res.headers
        .get('content-type')
        ?.includes('application/json');
      const resData = isJson ? await res.json() : null;
      if (!res.ok) {
        return Promise.reject(resData);
      }
      if (resData) {
      }
    })
    .catch((error) => {});
}

function deleteCartItemHandler(e) {
  const shoppingCart =
    JSON.parse(localStorage.getItem('modazShoppingCart')) || [];
  // Get Id & Color of Product to Delete
  const id = e.currentTarget.dataset.productId;
  const color = e.currentTarget.dataset.productColor;
  if (id) {
    const filteredShoppingCart = shoppingCart.filter((item) => {
      if (item.product._id === id && item.color === color) {
        return false;
      }
      return true;
    });
    // return;
    window.localStorage.setItem(
      'modazShoppingCart',
      JSON.stringify(filteredShoppingCart)
    );
  } else {
    window.localStorage.removeItem('modazShoppingCart');
  }
  showShoppingCartItems();
}

// *********** SHOP PRODUCTS FILTERS HANDLERS **********
// Get Filter Elements
const shopSearchForms = document.querySelectorAll('.shop-search-form');
const shopClearSearch = document.querySelectorAll('.shop-clear-search');
const shopSearchInput = document.querySelector('.shop-search-input');
const shopModalSearchInput = document.querySelector(
  '.shop-search-input.modal-filter'
);
const shopFilter = {};
shopFilter.inCollection = document.getElementById('collection');
shopFilter.sortBy = document.getElementById('shop-sort-by');
shopFilter.perPage = document.getElementById('shop-per-page');
shopFilter.categories = document.querySelectorAll('.categories-checkbox');
shopFilter.priceRange = document.querySelectorAll('.priceRange-radio');
shopFilter.gender = document.querySelectorAll('.gender-radio');
shopFilter.modalInCollection = document.getElementById('modal-collection');
shopFilter.modalCategories = document.querySelectorAll('.modal-cat-checkbox');
shopFilter.modalPriceRange = document.querySelectorAll('.modal-range-radio');
shopFilter.modalGender = document.querySelectorAll('.modal-gender-radio');
// Add Submit Event To Search Forms
shopSearchForms.forEach((el) => {
  if (el) el.addEventListener('submit', onShopFilterChange);
});
// Add Click Event To Clear Search Buttons
shopClearSearch.forEach((el) => {
  if (el) el.addEventListener('click', onShopFilterChange);
});
// Add Change Event To Categories & Price Range filters
for (const el in shopFilter) {
  // check if Element is a Nodelist
  if (NodeList.prototype.isPrototypeOf(shopFilter[el])) {
    shopFilter[el].forEach((el) => {
      if (el) el.addEventListener('change', onShopFilterChange);
    });
  } else {
    if (shopFilter[el])
      shopFilter[el].addEventListener('change', onShopFilterChange);
  }
}

function onShopFilterChange(e) {
  if (e.type === 'submit') e.preventDefault();
  const queryParams = shopFilterHandler(e);
  if (!queryParams) return;
  window.location.replace(
    window.location.origin + '/shop?' + queryParams.toString()
  );
}

function shopFilterHandler(e) {
  const classList = e.currentTarget.classList;
  let sortBy = shopFilter.sortBy.value,
    perPage = shopFilter.perPage.value,
    textSearch = shopSearchInput.value,
    selectedCategories = [],
    selectedPriceRange = 0,
    selectedGender = '',
    inCollection = false,
    categoriesCheckbox = shopFilter.categories,
    priceRangeRadio = shopFilter.priceRange,
    genderRadio = shopFilter.gender,
    collectionCheckbox = shopFilter.inCollection;
  // Small Screen Filter
  if (classList.contains('modal-filter')) {
    textSearch = shopModalSearchInput.value;
    categoriesCheckbox = shopFilter.modalCategories;
    priceRangeRadio = shopFilter.modalPriceRange;
    genderRadio = shopFilter.modalGender;
    collectionCheckbox = shopFilter.modalInCollection;
  }
  // Clear Search Text Input
  if (classList.contains('shop-clear-search')) {
    if (!textSearch) return false;
    textSearch = '';
  }
  if (collectionCheckbox.checked) {
    inCollection = true;
  }
  categoriesCheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedCategories.push(checkbox.value);
    }
  });

  for (let i = 0; i < genderRadio.length; i++) {
    const radio = genderRadio[i];
    if (radio.checked) {
      selectedGender = radio.value;
      break;
    }
  }

  for (let i = 0; i < priceRangeRadio.length; i++) {
    const radio = priceRangeRadio[i];
    if (radio.checked) {
      selectedPriceRange = radio.value.split(',');
      break;
    }
  }
  const query = { sortBy, perPage, selectedGender, selectedPriceRange };
  if (inCollection) query.inCollection = inCollection;
  if (textSearch) query.textSearch = textSearch;
  if (selectedCategories.length) query.selectedCategories = selectedCategories;

  return new URLSearchParams(query);
}

// ********** SHOP PRODUCTS NAVIGATION HANDLERS **********
const shopPaginationUl = document.querySelector(
  '.product-pagination .flat-pagination'
);
const shopPaginationButtons = document.querySelectorAll(
  '.product-pagination .pagination-btn'
);
const shopActivePageButton = document.querySelector(
  '.product-pagination .active a'
);
// Add click event to each pagination button
shopPaginationButtons.forEach((el) => {
  el.addEventListener('click', shopPaginationHandler);
});

function shopPaginationHandler(e) {
  e.preventDefault();
  const totalPage = shopPaginationUl.getAttribute('data-totalPage');
  const activePage = shopActivePageButton.getAttribute('data-page');
  let page = e.currentTarget.getAttribute('data-page');
  if (activePage == page) return;
  if (page == 'prev' && activePage == '1') return;
  if (page == 'next' && +activePage + 1 > +totalPage) return;
  if (page == 'prev') page = parseInt(activePage) - 1;
  if (page == 'next') page = parseInt(activePage) + 1;
  // Get Querry Params
  const queryParams = shopFilterHandler(e);
  if (!queryParams) return;
  queryParams.set('currentPage', page);
  window.location.href =
    window.location.origin + '/shop?' + queryParams.toString();
}

// *********** BLOG POST FILTERS HANDLERS **********
// Get Filter Elements
const blogSortBy = document.getElementById('blog-sort-by');
const blogPerPage = document.getElementById('blog-per-page');
const blogCategories = document.querySelectorAll('.blog-category');
const blogSearchForms = document.querySelectorAll('.blog-search-form');
const blogClearSearch = document.querySelectorAll('.blog-clear-search');
const blogSearchInput = document.querySelector('.blog-search-input');
const blogModalSearchInput = document.querySelector('.blog-modal-search-input');
// Add Change Event
if (blogSortBy) blogSortBy.addEventListener('change', onBlogFilterChange);
if (blogPerPage) blogPerPage.addEventListener('change', onBlogFilterChange);
// Add Click Event
blogCategories.forEach((el) => {
  if (el) el.addEventListener('click', onBlogFilterChange);
});
blogClearSearch.forEach((el) => {
  if (el) el.addEventListener('click', onBlogFilterChange);
});
// Add Submit Event To Search Forms
blogSearchForms.forEach((el) => {
  if (el) el.addEventListener('submit', onBlogFilterChange);
});

function onBlogFilterChange(e) {
  if (e.type === 'submit') e.preventDefault();
  const queryParams = blogFilterHandler(e);
  if (!queryParams) return;
  window.location.replace(
    window.location.origin + '/blog?' + queryParams.toString()
  );
}

function blogFilterHandler(e) {
  const classList = e.currentTarget.classList;
  let sortBy = blogSortBy.value,
    perPage = blogPerPage.value,
    textSearch = blogSearchInput.value,
    selectedCategory = '';
  // Modal Search Text Input
  if (classList.contains('modal-filter')) {
    textSearch = blogModalSearchInput.value;
  }
  // Clear Search Text Input
  if (classList.contains('blog-clear-search')) {
    if (!textSearch) return false;
    textSearch = '';
  }
  // Category filter
  if (classList.contains('blog-category')) {
    if (!classList.contains('active')) {
      selectedCategory = e.currentTarget.dataset.category;
    }
  } else {
    for (let i = 0; i < blogCategories.length; i++) {
      if (classList.contains('active')) {
        selectedCategory = blogCategories[i].dataset.category;
        break;
      }
    }
  }

  const query = { sortBy, perPage };
  if (textSearch) query.textSearch = textSearch;
  if (selectedCategory) query.selectedCategory = selectedCategory;

  return new URLSearchParams(query);
}

// ********** SHOP PRODUCTS NAVIGATION HANDLERS **********
const blogPaginationUl = document.querySelector(
  '.blog-pagination .flat-pagination'
);
const blogPaginationButtons = document.querySelectorAll(
  '.blog-pagination .pagination-btn'
);
const blogActivePageButton = document.querySelector(
  '.blog-pagination .active a'
);
// Add click event to each pagination button
blogPaginationButtons.forEach((el) => {
  el.addEventListener('click', blogPaginationHandler);
});

function blogPaginationHandler(e) {
  e.preventDefault();
  const totalPage = blogPaginationUl.getAttribute('data-totalPage');
  const activePage = blogActivePageButton.getAttribute('data-page');
  let page = e.currentTarget.getAttribute('data-page');
  if (activePage == page) return;
  if (page == 'prev' && activePage == '1') return;
  if (page == 'next' && +activePage + 1 > +totalPage) return;
  if (page == 'prev') page = parseInt(activePage) - 1;
  if (page == 'next') page = parseInt(activePage) + 1;
  // Get Querry Params
  const queryParams = blogFilterHandler(e);
  if (!queryParams) return;
  queryParams.set('currentPage', page);
  window.location.href =
    window.location.origin + '/blog?' + queryParams.toString();
}

// ********** PREVENT DEFAULT BEHAVIOUR OF HTML ELEMENTS **********
const elements = document.querySelectorAll('.prevent');
elements.forEach((el) => {
  if (el)
    el.addEventListener('click', (e) => {
      e.preventDefault();
    });
});

// ********** CAROUSEL IMAGE ZOOM MODAL **********
const modal = document.getElementById('img-modal');
const carouselImgs = document.querySelectorAll('.carousel-img');
const imgModalContent = document.getElementById('img-modal-content');

carouselImgs.forEach((img) => {
  img.onclick = function () {
    modal.style.display = 'flex';
    imgModalContent.src = this.src;
    imgModalContent.alt = this.alt;
    document.body.style.position = 'fixed';
  };
});

if (modal) {
  modal.onclick = function () {
    imgModalContent.className += ' out';
    setTimeout(function () {
      modal.style.display = 'none';
      imgModalContent.className = 'img-modal-content';
      document.body.style.position = 'static';
    }, 400);
  };
}
