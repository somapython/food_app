import { createStore } from 'vuex';
export default createStore({
  state: {
    menuItems: [],
    restaurant: [],
    cart: []
  },
  mutations: {
     ADD_ITEMS(state, item) {
      const product = state.cart.find(product => product.id === item.id);
      if (!product) {
        state.cart.push({ ...item, quantity: 1 });
      } else {
        product.quantity++;
      }
    },
    REMOVE_FROM_CART(state, itemId) {
      const index = state.cart.findIndex(item => item.id === itemId);
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
    },
    EDIT_TO_CART(state, { itemId, quantity }) {
      const product = state.cart.find(product => product.id === itemId);
      if (product && quantity > 0) {
            product.quantity = quantity;
        }
    },
    SET_RESTAURANT(state, restaurantData) {
      state.restaurant.push(restaurantData);
    },
    ADD_MENU_ITEM(state, menuItem) {
        const index = state.menuItems.findIndex(item => item.id === menuItem.id);
        if (index !== -1) {
            state.menuItems.splice(index, 1, menuItem);
        } else {
            state.menuItems.push(menuItem);
        }
    },
    DELETE_MENU_ITEM(state, id) {
      const index = state.menuItems.findIndex(item => item.id === id);
      if (index !== -1) {
        state.menuItems.splice(index, 1);  
      }
    }
  },
  actions: {
    addItems({ commit }, item) {
      commit('ADD_ITEMS', item);
    },
    removeFromCart({ commit }, itemId) {
      commit('REMOVE_FROM_CART', itemId);
    },
    EditToCart({ commit}, payload){
      commit('EDIT_TO_CART', payload);
    },
    setRestaurant({ commit }, restaurantData) {
      commit('SET_RESTAURANT', restaurantData);
    },
    addMenuItem({ commit }, newItem) {
      commit('ADD_MENU_ITEM', newItem);
    },
    deleteMenuItem({ commit },  id ) {
      console.log(id)
      commit('DELETE_MENU_ITEM', id);
    }
  },
  getters: {
    menuItems: (state) => state.menuItems,
    cart: (state) => state.cart,
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    },
    getRestaurant: state => state.restaurant,
    getMenuItems:state => state.menuItems,
  }
});

