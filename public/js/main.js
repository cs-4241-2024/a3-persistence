
document.addEventListener("DOMContentLoaded", function () {
  let cart = {};
  let orderNumber = parseInt(localStorage.getItem('orderNumber')) || 0;
  let cashTotal = parseFloat(localStorage.getItem('cashTotal')) || 0; 
  let cumulativeItemTotal = parseInt(localStorage.getItem('cumulativeItemTotal')) || 0;

  const addToCartForms = document.querySelectorAll(".add-to-cart-form");

  addToCartForms.forEach(form => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const productName = form.querySelector("input[name='product-name']").value;
      const productPrice = parseFloat(form.querySelector("input[name='product-price']").value);
      const quantity = parseInt(form.querySelector("input[name='quantity']").value);

      if (cart[productName]) {
        cart[productName].quantity += quantity;
      } else {
        cart[productName] = {
          price: productPrice,
          quantity: quantity
        };
      }

      updateCart();
    });
  });

  function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (cartItems && cartTotal) {
      cartItems.innerHTML = "";
      let total = 0;

      for (const [name, item] of Object.entries(cart)) {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const listItem = document.createElement("li");
        listItem.textContent = `${name} - $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}`;
        cartItems.appendChild(listItem);
      }

      cartTotal.textContent = `Total: $${total.toFixed(2)}`;

      window.cartTotal = total;
    }
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;
      const instructions = document.getElementById('instructions').value;

      document.getElementById('confirm-name').value = name;
      document.getElementById('confirm-phone').value = phone;
      document.getElementById('confirm-address').value = address;
      document.getElementById('confirm-instructions').value = instructions;

      const basePrice = window.cartTotal || 0;
      const deliveryFee = 5.00;
      const taxRate = 0.07;
      const totalPrice = (basePrice * (1 + taxRate)) + deliveryFee;
      const taxPrice = (basePrice * (1 + taxRate)) - basePrice;

      const confirmBasePrice = document.getElementById('confirm-food');
      if (confirmBasePrice) {
        confirmBasePrice.textContent = `$${basePrice.toFixed(2)}`;
      }

      const confirmPrice = document.getElementById('confirm-price');
      if (confirmPrice) {
        cashTotal += totalPrice;
        confirmPrice.textContent = `$${totalPrice.toFixed(2)}`;
      }

      const confirmTax = document.getElementById('confirm-tax');
      if (confirmTax) {
        confirmTax.textContent = `$${taxPrice.toFixed(2)}`;
      }

      document.querySelector('.contact-form').style.display = 'none';
      document.querySelector('.confirm-form').style.display = 'block';
    });
  }

  const addDataToServer = function (json) {
    console.log(json, "data to be added")
    const body = JSON.stringify(json)

    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'  // Ensure JSON is sent
      },
      body
    })
    .then(response => response.json())
    .then(json => {
      console.log(json, "json data after submitting the data");
        getData();
      })
  }


  const tableBody = document.querySelector("#orders-table tbody");
  const displayData = ({ cart }) => {
    console.log(cart, "display data");
    tableBody.innerHTML = "";
    if (cart.length > 0) {
      cart.forEach(cartItem => {
        const newRow = document.createElement("tr");

        newRow.innerHTML = `
          <td>${cartItem.name}</td>
          <td>${cartItem.address}</td>
          <td>${cartItem.orderNumber}</td>
          <td>${cartItem.totalPrice}</td>
          <td>${cartItem.cashTotal.toFixed(2)}</td>
          <td>${cartItem.itemTotal}</td>
        `;

        tableBody.appendChild(newRow);
      })

    }
  }

  const getData = () => {
    fetch('/getCart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(json => {
        displayData(json);

        if (json.cashTotal !== undefined) {
          cashTotal = json.cashTotal;
          localStorage.setItem('cashTotal', cashTotal.toFixed(2)); // Sync with localStorage
        }
    
        if (json.cumulativeItemTotal !== undefined) {
          cumulativeItemTotal = json.cumulativeItemTotal;
          localStorage.setItem('cumulativeItemTotal', cumulativeItemTotal); // Sync with localStorage
        }

        if (json.orderNumber !== undefined) {
          orderNumber = json.orderNumber;
          localStorage.setItem('orderNumber', orderNumber); // Sync with localStorage
        }
      })
  }

  getData();

  const confirmForm = document.getElementById('confirmForm');
  if (confirmForm) {
    confirmForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const confirmedData = {
        name: document.getElementById('confirm-name').value,
        phone: document.getElementById('confirm-phone').value,
        address: document.getElementById('confirm-address').value,
        instructions: document.getElementById('confirm-instructions').value,
        taxPrice: document.getElementById('confirm-tax').textContent,
        totalPrice: document.getElementById('confirm-price').textContent,
        itemTotal: Object.entries(cart).map(([productName, item]) => item.quantity)
      };

      let currentItemTotal = confirmedData.itemTotal.reduce((sum, quantity) => sum + quantity, 0);  // Calculate total items in the current order
      cumulativeItemTotal += currentItemTotal;  // Add current order's total to cumulative total
      localStorage.setItem('cashTotal', cashTotal);
      localStorage.setItem('cumulativeItemTotal', cumulativeItemTotal);

      orderNumber++;
      localStorage.setItem('orderNumber', orderNumber);

      let newData = {
        orderNumber,
        ...confirmedData,
        cashTotal: cashTotal,
        itemTotal: cumulativeItemTotal,
        action: "addToCart"
      }
   
      addDataToServer(newData);

      cart = {};
      updateCart();

      document.querySelector('.confirm-form').style.display = 'none';
      document.querySelector('.contact-form').style.display = 'block';

      console.log('Order Confirmed:', confirmedData);

      alert('Your order has been placed successfully!');

      this.reset();

    });
  }
});