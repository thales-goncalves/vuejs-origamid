const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
    shoppingCart: [],
    alertMessage: '',
    alertActive: false
  },
  filters: {
    priceNumber(price) {
      return price.toLocaleString('en-us', {
        style: 'currency',
        currency: 'USD'
      });
    }
  },
  computed: {
    totalCart() {
      let total = 0;
      if (this.shoppingCart.length) {
        this.shoppingCart.forEach(element => {
          total += element.price;
        });
      }
      return total;
    }
  },
  methods: {
    fetchProducts() {
      fetch('./api/products.json')
        .then(response => response.json())
        .then(response => {
          this.products = response;
        });
    },
    fetchProduct(id) {
      fetch(`./api/products/${id}/data.json`)
        .then(response => response.json())
        .then(response => {
          this.product = response;
        });
    },
    addItem() {
      this.product.stock--;
      const { id, name, price } = this.product;
      this.shoppingCart.push({ id, name, price });
      this.alert(`${name} added to cart`);
    },
    removeItem(index) {
      this.shoppingCart.splice(index, 1);
    },
    openModal(id) {
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    modalClose({ target, currentTarget }) {
      if (target === currentTarget) {
        this.product = false;
      }
    },
    checkLocalStorage() {
      if (window.localStorage.shoppingCart) {
        this.shoppingCart = JSON.parse(window.localStorage.shoppingCart);
      }
    },
    alert(message) {
      this.alertMessage = message;
      this.alertActive = true;
      setTimeout(() => {
        this.alertActive = false;
      }, 1000);
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.fetchProduct(hash.replace('#', ''));
      }
    }
  },
  watch: {
    shoppingCart() {
      window.localStorage.shoppingCart = JSON.stringify(this.shoppingCart);
    },
    product() {
      document.title = this.product.name || 'Techno';
      const hash = this.product.id || '';
      history.pushState(null, null, `#${hash}`);
    }
  },
  created() {
    this.fetchProducts();
    this.router();
    this.checkLocalStorage();
  }
});
