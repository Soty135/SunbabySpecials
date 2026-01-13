// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Function to set active link based on current URL
  function setActiveLink() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      if (link.href === window.location.href) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Set active link on page load
  setActiveLink();

  // Add click event listener to each nav link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
      e.target.classList.add('active');
      window.location.href = e.target.getAttribute('href');
    });
  });

  // Hero Text Animation
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    setTimeout(() => {
      heroText.classList.add('show-animation');
    }, 500);
  }

  // Review form functionality
  const reviewForm = document.querySelector('.review-form');
  const reviewsContainer = document.querySelector('.reviews');

  if (reviewForm && reviewsContainer) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = reviewForm.name.value.trim();
      const reviewText = reviewForm.review.value.trim();

      if (name && reviewText) {
        const newReview = document.createElement('div');
        newReview.classList.add('review');
        newReview.innerHTML = `
          <h3>${name}</h3>
          <p>${reviewText}</p>
          <div class="review-actions">
            <button class="like-btn">👍 Like <span class="like-count">0</span></button>
            <button class="dislike-btn">👎 Dislike <span class="dislike-count">0</span></button>
          </div>
        `;
        reviewsContainer.insertBefore(newReview, reviewForm);
        reviewForm.reset();
      }
    });

    reviewsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('like-btn')) {
        const likeCount = e.target.querySelector('.like-count');
        const dislikeBtn = e.target.nextElementSibling;
        const dislikeCount = dislikeBtn.querySelector('.dislike-count');

        if (e.target.classList.contains('liked')) {
          likeCount.textContent = parseInt(likeCount.textContent) - 1;
          e.target.classList.remove('liked');
        } else {
          likeCount.textContent = parseInt(likeCount.textContent) + 1;
          e.target.classList.add('liked');
          if (dislikeBtn.classList.contains('disliked')) {
            dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
            dislikeBtn.classList.remove('disliked');
          }
        }
      } else if (e.target.classList.contains('dislike-btn')) {
        const dislikeCount = e.target.querySelector('.dislike-count');
        const likeBtn = e.target.previousElementSibling;
        const likeCount = likeBtn.querySelector('.like-count');

        if (e.target.classList.contains('disliked')) {
          dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
          e.target.classList.remove('disliked');
        } else {
          dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
          e.target.classList.add('disliked');
          if (likeBtn.classList.contains('liked')) {
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            likeBtn.classList.remove('liked');
          }
        }
      }
    });
  }

  // Function to add item to cart
  function addToCart(id, name, price) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCart();

    // Display SweetAlert message for 2 seconds
    Swal.fire({
      title: 'Item Added',
      text: `${name} has been added to your cart.`,
      icon: 'success',
      showConfirmButton: false,
      timer: 2000
    });
  }

  // Function to update cart display
  function updateCart() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemsContainer = document.querySelector('.items');
    const totalPriceElement = document.querySelector('.total-price');

    if (itemsContainer && totalPriceElement) {
      itemsContainer.innerHTML = '';
      let total = 0;

      cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
          <h3>${item.name}</h3>
          <div class="quantity-controls">
            <button class="decrease" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="increase" data-id="${item.id}">+</button>
          </div>
          <span class="price" data-price="${item.price}">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="delete" data-id="${item.id}">Delete</button>
        `;
        itemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
      });

      totalPriceElement.textContent = `$${total.toFixed(2)}`;

      // Attach event listeners for increase, decrease, and delete buttons
      itemsContainer.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', () => changeQuantity(button.getAttribute('data-id'), 1));
      });

      itemsContainer.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', () => changeQuantity(button.getAttribute('data-id'), -1));
      });

      itemsContainer.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', () => showDeleteConfirmation(button.getAttribute('data-id')));
      });
    }
  }

  // Function to change the quantity of an item
  function changeQuantity(id, amount) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const item = cartItems.find(item => item.id == id);

    if (item) {
      item.quantity += amount;
      if (item.quantity <= 0) {
        showDeleteConfirmation(id);
      } else {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCart();
      }
    }
  }

  // SweetAlert2 delete confirmation
  function showDeleteConfirmation(id) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id == id);

    if (itemIndex !== -1) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this item from the cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          cartItems.splice(itemIndex, 1);
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          updateCart();
          Swal.fire('Deleted!', 'The item has been removed from your cart.', 'success');
        }
      });
    }
  }

  // Attach event listeners to all add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = parseInt(button.getAttribute('data-id'));
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart(id, name, price);
    });
  });

  // Initial call to update the cart display when the page loads
  updateCart();

  // Fetch products from the API
fetch('http://localhost:5000/api/products')
.then(response => response.json())
.then(data => {
  console.log(data); // You can use this data to display products on your page
})
.catch(error => console.error('Error fetching products:', error));

});
