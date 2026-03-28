// toggle menu
var MenuItems = document.getElementById("menu-items");

MenuItems.style.maxHeight = "0px";

function menutoggle(){
    if(MenuItems.style.maxHeight == "0"){
        MenuItems.style.maxHeight = "200px";
    } else {
        MenuItems.style.maxHeight = "0px";
    }
}
// ==========================================
// CART FUNCTIONALITY
// ==========================================

// 1. Load existing cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 2. Function to update the little red badge on the cart icon
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        // Calculate total quantity of all items in the cart array
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// 3. Wait for the page to load before attaching click events
document.addEventListener('DOMContentLoaded', () => {
    // Update the counter immediately on page load
    updateCartCount();

    // Find all 'Add to Cart' buttons on the page
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Find the closest product container to the button that was clicked
            const productContainer = event.target.closest('.box-container');
            
            // Extract the name and price text
            const productName = productContainer.querySelector('.product_name').innerText;
            const productPriceText = productContainer.querySelector('.price_name').innerText;
            
            // Clean up the price (remove 'Rs' and convert to a real decimal number)
            const productPrice = parseFloat(productPriceText.replace('Rs', '').trim());

            // Check if this item is already in the cart array
            const existingItem = cart.find(item => item.name === productName);

            if (existingItem) {
                // If it exists, just increase the quantity
                existingItem.quantity += 1;
            } else {
                // If it's new, add it to the cart array
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            // Save the updated cart array back to the browser's localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update the UI counter
            updateCartCount();
            
            // Optional: Give the user quick visual feedback
            alert(`${productName} added to your cart!`);
        });
    });
});
// ==========================================
// CART PAGE RENDERING LOGIC
// ==========================================

function renderCartPage() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceContainer = document.getElementById('total-price-container');
    const emptyMessage = document.getElementById('empty-cart-message');
    const cartTable = document.getElementById('cart-table');
    
    // Only run this script if we are actually on the cart.html page
    if (!cartContainer) return;

    cartContainer.innerHTML = ''; // Clear out existing items
    let subtotal = 0;

    if (cart.length === 0) {
        // Show empty state
        cartTable.style.display = 'none';
        totalPriceContainer.style.display = 'none';
        emptyMessage.style.display = 'block';
    } else {
        // Show cart items
        cartTable.style.display = 'table';
        totalPriceContainer.style.display = 'flex';
        emptyMessage.style.display = 'none';

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="cart-info">
                        <div>
                            <p>${item.name}</p>
                            <small>Price: Rs${item.price.toFixed(2)}</small>
                            <br>
                            <a onclick="removeItem(${index})">Remove</a>
                        </div>
                    </div>
                </td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>Rs${itemTotal.toFixed(2)}</td>
            `;
            cartContainer.appendChild(tr);
        });

        // Calculate Taxes and Total
        const tax = subtotal * 0.05; // Assuming 5% tax
        const finalTotal = subtotal + tax;

        document.getElementById('cart-subtotal').innerText = `Rs${subtotal.toFixed(2)}`;
        document.getElementById('cart-tax').innerText = `Rs${tax.toFixed(2)}`;
        document.getElementById('cart-total').innerText = `Rs${finalTotal.toFixed(2)}`;
    }
}

// Function to remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Update the red badge
    renderCartPage();  // Re-render the table
}

// Function to handle quantity input changes
function updateQuantity(index, newQuantity) {
    if (newQuantity < 1) return;
    cart[index].quantity = parseInt(newQuantity);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
}

// Trigger the render function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderCartPage();
});