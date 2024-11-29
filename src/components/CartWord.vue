<template>
    <div class="cart-container">
        <div class="shopping-cart">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center justify-content-center">
                <img src="./assets/cart/purchase-order.png" alt="shopping-cart" class="product-image1" loading="lazy"/>
                <h2>Shopping Cart</h2>
              </div>
                <p  class="cartItemsCount">Items : <span> {{ cartItems.length }} </span></p>
            </div>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product Details</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in cartItems" :key="index">
                        <td>
                            <div class="product-details">
                                <img :src="item.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'" :alt="item.name" class="product-image" loading="lazy"/>
                                <div>
                                    <h5 class="cartHeader">{{ item.name }}</h5>
                                    <a href="#" @click.prevent="removeItem(index)" class="remove-link">Remove</a>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="quantity-controls">
                                <button @click="decrementQuantity(item)">-</button>
                                <input type="number" v-model="item.quantity" min="1" />
                                <button @click="incrementQuantity(item)">+</button>
                            </div>
                        </td>
                        <td>₹{{ item.price }}</td>
                        <td>₹{{ item.price * item.quantity }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="continue-shopping">
                <a href="#" @click="continueShopping">← <span>Continue Shopping</span></a>
            </div>
        </div>


        <div class="order-summary">
            <div class="summary-header d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center justify-content-center">
                <h3>Order Summary</h3>
              </div>  
                <p class="orderSummaryCount">Items : <span> {{ cartItems.length }} </span></p>
            </div>
            <div class="summary-item_new">
              <div class="summary-item">
                  <div class="row">
                      <div class="col label">
                      Shipping :
                      </div>
                      <div class="col input">
                          <select v-model="shippingCost">
                              <option value="0">Free Delivery</option>
                              <option value="10">Standard Delivery - ₹10</option> 
                          </select>
                      </div>
                  </div>
              </div>
              <div class="summary-item">
                  <div class="row">
                      <div class="col label">
                          Promo Code :
                      </div>
                      <div class="col input d-flex">
                          <input class="mr-10" type="text" v-model="promoCode" placeholder="Enter your code" :disabled="isInputDisabled"/>
                          <button class="apply-btn" @click="applyPromoCode()" :disabled="isSubmitting" >
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            <span v-else>Apply</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
            <div class="summary-item total-cost d-flex align-items-center justify-content-between">
                <span>Total Cost : </span>
                <span>₹{{ totalCost }}</span>
            </div>
            <button class="checkout-btn" :disabled="isSubmitting" @click="proceedToCheckout">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              <span v-else>Checkout</span>
            </button>
        </div>
     <div class="modal fade" id="reviewOrderModal" tabindex="-1" aria-labelledby="reviewOrderModalLabel" aria-hidden="true" ref="reviewOrderModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="d-flex align-items-center justify-content-between"> 
                        <h5 class="modal-title modalHeader" id="loginModalLabel">Review Your Order</h5>
                        <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close" @click.prevent="closeModal()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                <div>
                <p class="modal-subtitle mb-0">Verify your details carefully before finalizing your order.</p>
            </div>
        </div>
        <div class="modal-body reviewOrderFormModal">
            <form id="reviewOrderForm">
                <div class="form-group">
                    <label for="reviewOrderFullName">FullName : <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="reviewOrderFullName" placeholder="Enter Full Name" maxlength="30" v-model="reviewForms.fullName" required>
                    <div class="invalid-feedback" v-if="!reviewForms.fullName">
                        Please enter Full name.
                    </div>
                </div>
                <div class="form-group">
                    <label for="reviewOrderEmail">Email : </label>
                    <input type="email" class="form-control" id="reviewOrderEmail" placeholder="Enter email" v-model="reviewForms.email" required disabled>
                </div>
                <div class="form-group">
                    <label for="reviewOrderNumber">Contact : <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="reviewOrderMobile" placeholder="Enter contact no." required minlength="10" v-model="reviewForms.contact"> 
                    <div class="invalid-feedback" v-if="!isValidContact(reviewForms.contact)">
                        Please enter a valid Contact number.
                    </div>
                </div>
                <div class="form-group">
                    <label for="reviewOrderAddress">Address : <span class="text-danger">*</span></label>
                        <textarea type="text" class="form-control" id="reviewOrderAddress" v-model="reviewForms.address" required maxlength="50" placeholder="Enter Address" ></textarea>
                    <div class="invalid-feedback" v-if="!reviewForms.address">
                        Please enter address
                    </div>
                </div>

                <div class="form-group">
                        <label for="reviewOrderState">State : <span class="text-danger">*</span></label>
                        <select class="form-control" v-model="reviewForms.selectedState" @change="onStateChange">
                            <option disabled value="">Select State</option>
                            <option v-for="(state, index) in states" :key="index" :value="state">{{ state }}</option>
                        </select>
                        <div class="invalid-feedback" v-if="!reviewForms.selectedState">Please select a state</div>
                    </div>
                    <div class="form-group">
                        <label for="reviewOrderCity">City : <span class="text-danger">*</span></label>
                        <select class="form-control" v-model="reviewForms.selectedCity" required>
                            <option disabled value="">Select City</option>
                            <option v-for="(city, index) in cities" :key="index">{{ city }}</option>
                        </select>
                        <div class="invalid-feedback" v-if="!reviewForms.selectedCity">Please select a city</div>
                    </div>
              </form>

            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-warning" :disabled="isSubmitting" id="reviewOrderButton">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span v-else>Continue to payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-content1">
                <canvas ref="canvas" id="canvas"></canvas>
                <div class="manual">
                    <div style="color: #27d7ff;font-weight: bold;display: flex;align-items: center;justify-content: center;">Congratulation</div>
                </div>
            </div>
        </div>
    <CreateLogsWord @logCreated="addLogToLogs" ref="createLogsComponent" />
    <LoaderWord :loading="isLoading" />
    <ToasterWord ref="toaster" />
</template>

<script>

import ToasterWord from './ToasterWord.vue';
import { Modal } from 'bootstrap';
import { nextTick } from "vue";
import axios from 'axios';
import CreateLogsWord from './CreateLogsWord.vue';
import LoaderWord from './LoaderWord.vue';

export default {
    name: 'CartWord',
    components: {
      ToasterWord,
      CreateLogsWord,
      LoaderWord,
    },
  data() {
    return {
    isLoading: false,
    isSubmitting: false,
    reviewOrderModal: null,
    reviewOrderFormId: null,
    reviewOrderFormButtonId: null,
    shippingCost: 0,
    promoCode: '',
    cartItems: [],
    isInputDisabled : false,
    reviewForms:{
        fullName: '',
        email: '',
        contact: '',
        address: '',
        selectedState: '',
        selectedCity: '',
    },
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Delhi','Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
      'Jharkhand', 'Karnataka', 'Maharashtra', 'Punjab', 'Rajasthan', 
      'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
    ],
    cities: [], 
    stateCityMap: {
      'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
      'Arunachal Pradesh': ['Itanagar', 'Tawang'],
      'Assam': ['Guwahati', 'Dibrugarh', 'Jorhat'],
      'Bihar': ['Patna', 'Gaya', 'Bhagalpur'],
      'Chhattisgarh':['Raipur','Bilaspur'],
      'Delhi':['New Delhi','Yoginipura'],
      'Goa':['Panaji','Madgaon','Marmagao','Vasco da Gama'], 
      'Gujarat':['Ahmedabad','Surat','Vadodara','Dwarka','Baroda', 'Rajkot'],
      'Haryana':['Gurugram','Kurukshetra','Panipat'], 
      'Himachal Pradesh':['Manali','Shimla','Palampur'],
      'Jharkhand':['Jamshedpur','Dhanbad','Bokaro'],
      'Karnataka': ['Bangalore', 'Mysore', 'Mangalore','Vijayapura'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur','Solapur','Kolhapur','Pimpri Chinchwad','Chatrapati SambhajiNagar','Satara'],
      'Punjab':['Amritsar','Patiala','Mohali','Jalandhar','Chandigarh'], 
      'Rajasthan':['Jaipur','Ajmer'], 
      'Tamil Nadu':['Chennai','Coimbatore','Madurai','Vellore'], 
      'Telangana':['Hyderabad','Nizamabad'],     
      'Uttar Pradesh':['Agra','Lucknow','Kanpur','Varanasi','Meerut'], 
      'West Bengal':['Kolkata','Durgapur','Howrah'],
    },
    citiesFromResponse: [],
    discount: 0,
    showModal: false,
    animationRunning: true,
    fireWorks: [],
      frm: 10,
      ctx: null,
      animationTimeout: null,
      seconds: 0,
      timer: null,
      orderDetailsDataSave: [],
      removeItemsDataForSave: [],
      itemNewParamsToRoute: '',
      continuePaymentDataForSave: [],
    };
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        nextTick(() => {
          this.initializeCanvas();
          this.animate();
          window.addEventListener("resize", this.resizeCanvas);
        });
      }
    },
  },
  computed: {
    totalCost() {
      const itemsCost = this.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const discountAmount = (itemsCost + parseFloat(this.shippingCost)) * (this.discount / 100);
      return itemsCost + parseFloat(this.shippingCost) - parseInt(discountAmount);
    },
  },
  mounted() {
    this.reviewOrderModal = new Modal(this.$refs.reviewOrderModal);
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
    this.reviewOrderFormId = document.getElementById('reviewOrderForm');
    this.reviewOrderFormButtonId = document.getElementById('reviewOrderButton');
    this.toaster = this.$refs.toaster;
    this.fetchOrderDetails();
   
  },
  methods: {
    async fetchOrderDetails(){
      try {
        const response = await axios.get('http://localhost:3000/auth/fetch-orderDetails');
        this.orderDetailsDataSave = response.data;
        
      } catch (error) {
      // console.error('Error fetching MenuItems:', error);
        
      } 
        const storedCartItems = localStorage.getItem("cartItems");
        if (storedCartItems) {
        this.cartItems = JSON.parse(storedCartItems);
        }
        this.itemNewParamsToRoute = this.cartItems[0].nameNew.toLowerCase().replace(/\s+/g, '');  
    
    },
    initializeCanvas() {
        const canvas = this.$refs.canvas;
        if (canvas) {
            this.ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

        } 
    },
    async removeItem(index) {
      this.isLoading = true;
        try {
            const response = await axios.post('http://localhost:3000/auth/remove-item',  this.cartItems, { headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
            this.removeItemsDataForSave = response.data;   
            } catch (error) {
               // console.log(error)
            }
        this.cartItems.splice(index, 1);
        setTimeout(()=>{
              this.isLoading = false;  
            },500) 
        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
        this.$refs.createLogsComponent.createLog('Items removed from Cart', 'Remove-Order', this.cartItems.id);
        this.$emit("update-cart-count", this.cartItems.length);
    },
    decrementQuantity(item) {
      if (item.quantity > 1) item.quantity--;
    },
    incrementQuantity(item) {
      item.quantity++;
    },
    async applyPromoCode() {
      this.isSubmitting = true;
      this.isLoading = true;
      if(this.promoCode == "somnath"){
        try {
            const response = await axios.post('http://localhost:3000/auth/applyPromoCode',  this.promoCode, { headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
            this.removeItemsDataForSave = response.data;  
            } catch (error) {
               // console.log(error)
            }
            this.isSubmitting = false;
            this.isLoading = false;
            const audio = new Audio(require('./assets/cart/fataka.mp3')); 
            audio.play();
            this.showModal = true; 
            setTimeout(() => {
                this.showModal = false;
                this.discount = 25;
                this.cartItems = this.cartItems.map(item => {
              const discountedPrice = item.price - (item.price * (this.discount / 100));
              return {
                ...item,
                discountedPrice: discountedPrice.toFixed(2),
                discountApplied: true
              };
            });

        this.$refs.createLogsComponent.createLog('Promocode Applied Successfully in Cart', 'PromoCode', this.cartItems.id);
            this.isInputDisabled = true;
        }, 8000);
      }else{
        setTimeout(() => {
          this.isLoading = false;
          this.isSubmitting = false;
          this.discount = 0;
          this.showToast('No promo code added!', 'error');
        }, 1000);
      }
    },
    proceedToCheckout() {
        this.reviewForms.fullName = '';
        this.reviewForms.address = '';
        this.reviewForms.selectedState = '';
        this.reviewForms.selectedCity = '';
        this.reviewForms.email = "foodapp84@gmail.com";
        this.reviewForms.contact = "";
        this.reviewOrderModal.show();
        this.handleFormErrors("firstTime",this.reviewOrderFormId);
        this.reviewOrderFormButtonId .removeEventListener('click', this.reviewOrderFormHandler);
        this.reviewOrderFormHandler = (event) => {
                event.preventDefault();
                this.clearInvalidClasses(this.reviewOrderFormId);
                if (this.reviewOrderFormId.checkValidity()) {
                    this.continueToPayment();
                } else {
                    this.handleFormErrors("error", this.reviewOrderFormId);
                    this.showToast('Please do form validation!', 'error');
                }
            };
        this.reviewOrderFormButtonId.addEventListener('click', this.reviewOrderFormHandler);
    },
    clearInvalidClasses(formElement) {
            formElement.querySelectorAll('.form-control').forEach((input) => {
                input.classList.remove('is-invalid');
            });
        },
    handleFormErrors(type,formElement) {
            if(type == "error"){
                formElement.reportValidity();
            formElement.querySelectorAll('.form-control:invalid').forEach((input) => {
                input.classList.add('is-invalid');
            });
            this.showToast('Please do form validation!', 'error');
            return
            }
            else if(type == "firstTime"){
                formElement.querySelectorAll('.form-control:invalid').forEach((input) => {
                input.classList.remove('is-invalid');
            });  
            }
            
        },
    continueShopping(){
      this.$router.push({
      name: 'ItemDetail', 
      params: {
        'itemName': this.itemNewParamsToRoute,
      }
    });
    },
    isValidContact(contact) {
      const re = /^\d{10}$/;
      return re.test(contact);
    },
   async continueToPayment(){
        this.isSubmitting = true;
        this.isLoading = true;
            try {
            const response = await axios.post('http://localhost:3000/auth/continue-payment',  this.cartItems, { headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
                this.continuePaymentDataForSave = response.data;  
                
            } catch (error) {
                //console.log(error)
            }
            localStorage.setItem("cartProductList", JSON.stringify(this.cartItems));
            localStorage.setItem("reviewOrderForms", JSON.stringify(this.reviewForms));
            this.$refs.createLogsComponent.createLog('Continue Payment from Cart', 'Continue-Payment', this.cartItems.id);
            setTimeout(()=>{
              this.isSubmitting = false;
              this.isLoading = false;
              this.reviewOrderModal.hide();
              this.$router.push({ name: "Payment" });
            },1000)       
    },
    addLogToLogs(log) {

      console.log('Log Created:', log);
    },
    closeModal() {
          this.reviewOrderModal.hide();
      },
      showToast(msg, status) {
        if (this.$refs.toaster) {
          this.$refs.toaster.show(msg, status);
        }
      },
      async onStateChange(e) {
        if(this.reviewForms.selectedState != "" && e.isTrusted == true){
            try {
            const response = await axios.post('http://localhost:3000/auth/find-city',  this.reviewForms.selectedState, { headers: {
                'Content-Type': 'multipart/form-data'
                }
            });
            this.citiesFromResponse = response.data;   
            } catch (error) {
                //console.log(error)
            }
        }
        this.cities = this.stateCityMap[this.reviewForms.selectedState] || [];
        this.reviewForms.selectedCity = '';
    },
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    },
    random(max, min) {
      return Math.floor(Math.random() * max) + min;
    },
    FireWorkParticle(x, y, size, color, ctx) {
      return {
        x: x,
        y: y,
        speed: this.random(4, 1),
        color: color,
        moveX: Math.random() * 3 - 1.5,
        moveY: Math.random() * 3 - 1.5,
        size: size / 2.5 > 1 ? size / 2.5 : 1,
        v: 0.0,
        update() {
          this.x += this.moveX;
          this.y += this.moveY + this.v;
          if (this.size > 0.1) {
            this.v += 0.015;
            this.size -= 0.01;
          }
        },
        draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        },
      };
    },
    FireWork(ctx) {
      const fireWorkParticle = this.FireWorkParticle;  
      return {
        x: this.random(this.$refs.canvas.width, 1),
        y: this.$refs.canvas.height + 20,
        speed: this.random(4, 1),
        exp: this.random(this.$refs.canvas.height / 2, 0),
        size: this.random(3, 1),
        life: true,
        expParticle: [],
        color: `hsl(${Math.random() * 360 - 1},100%,50%)`,
        draw() {
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
          ctx.fill();
        },
        move() {
          let dy = this.y - this.exp;
          if (dy > 10) {
            this.y -= (this.speed * dy) / 50;
          } else {
            this.y = this.exp;
            this.explode(ctx);
            this.color = "transparent";
          }
          if (!this.life) {
            this.explodeUpdate(ctx);
          }
        },
        explode(ctx) {
          if (this.life) {
            for (let i = 0; i < 100; i++) {
              this.expParticle.push(
                fireWorkParticle(this.x, this.y, this.size, this.color, ctx)
              );
            }
          }
          this.life = false;
        },
        explodeUpdate() {
          for (let i = 0; i < this.expParticle.length; i++) {
            this.expParticle[i].update();
            this.expParticle[i].draw();
            if (this.expParticle[i].size < 0.2) {
              this.expParticle.splice(i, 1);
            }
          }
          if (this.expParticle.length < 1) {
            this.life = "end";
          }
        },
      };
    },
     FireWorkInit(apendNew) {
      if (apendNew) {
        this.fireWorks.push(this.FireWork(this.ctx));
      }
      for (let i = 0; i < this.fireWorks.length; i++) {
        this.fireWorks[i].draw();
        this.fireWorks[i].move();
        if (this.fireWorks[i].life === "end") {
          this.fireWorks.splice(i, 1);
        }
      }
    },
    animate() {
        if (this.animationRunning) {
        this.ctx.fillStyle = "rgba(0,0,0,.1)";
        this.ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
        this.frm++;
        this.timer = setInterval(() => {
                this.seconds++;
                if (this.seconds >= 8000) {
                    this.animationRunning = false;
                    clearInterval(this.timer); 
                    this.timer = null; 
                    this.seconds = 0;
                    this.fireWorks = [];
                    return
                }
                }, 1000);

                if(this.$refs.canvas.width !== null && this.$refs.canvas.width !== 'null'){
                  if (this.frm % 20 === 0) {
                        this.FireWorkInit(true);
                    } else {
                        this.FireWorkInit();
                    }
                }
        }
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeCanvas);
  },
};
</script>
<style scoped>
.cart-container {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  padding: 2rem;
  background-color: #f9f9f9;
  margin-top: 20px;
}

.form-group label{
    margin-bottom: 5px !important;
}

.shopping-cart {
  width: 60%;
  border-radius: 10px;
  background-color: #d9db2d;
  padding: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.cartHeader{
    text-transform:capitalize;
}

.cartItemsCount{
    color: #2209f1;
    margin-bottom: 0px;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-header{
    background-color: #2f2fe7;
    display: block;
}

.modal-footer{
    background-color: #2f2fe7;
    padding: 5px 15px;
}

.modal-footer button{
    border-radius: 25px;
}

.btn-warning {
    color: #000;
    background-color: yellow !important;
    border-color: yellow !important;
    font-size: 20px;
    font-weight: 500;
}

.btn-warning:hover {
    background-color: rgb(189, 189, 49) !important;
    border-color: rgb(189, 189, 49) !important;
}

.modal-subtitle{
    color: black;
}

.cartItemsCount span{
    width:35px !important;
    height: 35px !important;
    border-radius: 50%;
    background-color: blue;
    color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px !important;
}

.orderSummaryCount{
    color: #2209f1;
    margin-bottom: 0px;
    font-size: 18px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}

.orderSummaryCount span{
    width:30px !important;
    height: 30px !important;
    border-radius: 50%;
    background-color:blue;
    color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;

    margin-left: 10px !important;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.cart-table th, .cart-table td {
  padding: 1rem;
  text-align: left;
  text-align: center;
}

.product-details {
  display: flex;
  align-items: center;
}

.product-image {
  width: 50px;
  height: 50px;
  margin-right: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button {
  border: none;
  padding: 0.5rem;
  background-color: transparent;
}

.quantity-controls input {
  width: 50px;
  text-align: center;
  margin: 0 0.5rem;
}

.remove-link {
  color: #f00;
  cursor: pointer;
  margin-top: 0.5rem;
  display: block;
}

.order-summary {
  width: 40%;
  background-color: #22c33e;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.summary-item {
  margin-bottom: 15px;
}

.summary-item .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  flex: 1;
  font-weight: 600;
  padding-right: 10px;
}

.summary-item .input {
  flex: 2;
}

.summary-item select,
.summary-item input {
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.mr-10{
  margin-right: 10px;
}
.total-cost {
  font-size: 26px;
  font-weight: 600;
}

.continue-shopping {
  margin-top: 1rem;
}
.continue-shopping a{
    text-decoration: none;
}
.continue-shopping a span{
    text-decoration: underline;
    margin-left: 5px;
}

.summary-header {
  margin-bottom: 20px;
}
.summary-item .apply-btn {
  background-color: red;
  color: white;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.apply-btn:hover {
    background-color: #ff4d4f;
}

.checkout-btn {
  width: 100%;
  color: #fff;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  padding: 10px;
  background-color:  #0a4ee7;
  font-size: 16px;
  font-weight: 400; 
 border-radius: 5px; 
}

.reviewOrderFormModal{
    padding: 10px 20px !important;
}

.checkout-btn:hover {
  background-color: #2c3bc0;
}
.modalHeader{
    font-size: 24px;
    font-weight: 500;
    color: ivory;
   
  }
.buttonClose {
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    outline: none;
    padding: 8px;
  }
  .buttonClose:hover {
    background-color: rgba(51, 51, 51, 0.8);
    transform: scale(1.05);
    box-shadow: none;
    border: none;
  }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content1 {
  border-radius: 10px;
  position: relative;
  width: 800px;
  height: 400px;
  display: flex;
    align-items: center;
    justify-content: center;
}
#canvas {
  position: absolute;
  height: 400px;
  width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.manual {
  position: absolute;
  z-index: 99999;
  font-size: 50px;
  color: #999;
  pointer-events: none;
}

@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    margin-top: 5px;
  }

  .shopping-cart, .order-summary {
    width: 100%;
  }

  .cart-table th, .cart-table td {
    padding: 0.5rem;
    font-size: 14px;
  }
  .cart-table th{
    text-align: center;
  }

  .product-image {
    width: 40px;
    height: 40px;
    margin-bottom: 0.5rem;
  }

  .quantity-controls {
    flex-direction: column;
    display: block;
  }

  .quantity-controls button {
    padding: 0.3rem;
    margin: 0.2rem 0;
  }

  .quantity-controls input {
    width: 40px;
    margin: 0;
  }

  .continue-shopping {
    margin-top: 1rem;
  }

  .product-image1{
    width:40px;
  }

  .order-summary {
    padding: 1rem;
    box-shadow: none;
    font-size: 14px;
  }

  .summary-header {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .summary-item {
    margin-bottom: 10px;
  }

  .summary-item .label {
    font-size: 14px;
    width: 100%;
    margin-bottom: 10px;
  }

  .summary-item select {
    padding: 0.3rem;
    font-size: 14px;
  }

  .summary-item input{
    padding: 0.3rem;
    font-size: 14px;
    width: 100%;
    margin-bottom: 10px;
  }

  .summary-item .apply-btn {
    padding: 0.3rem;
    font-size: 14px;
  }

  .total-cost {
    font-size: 18px;
    font-weight: 600;
  }

  .checkout-btn {
    font-size: 14px;
    padding: 0.7rem;
  }

  .modal-content {
    padding: 1rem;
  }

  .modal-header {
    text-align: center;
  }

  .modal-title {
    font-size: 22px;
  }

  .modal-body {
    font-size: 14px;
  }

  .form-group label {
    font-size: 14px;
  }

  .form-group input, .form-group select, .form-group textarea {
    font-size: 14px;
    padding: 0.5rem;
  }

  .btn-warning {
    font-size: 14px;
    padding: 0.5rem;
  }

  .buttonClose {
    padding: 0.5rem;
  }

}
@media (max-width: 468px) {
  .cart-container {
    flex-direction: column;
    padding: 0.5rem;
    gap: 0.5rem;
    margin-top: 5px;
  }

  .shopping-cart, .order-summary {
    width: 100%;
    margin: 0 auto;
  }

  .cart-table {
    font-size: 12px;
  }

  .cart-table th, .cart-table td {
    padding: 0.4rem;
  }

  .product-image {
    width: 30px;
    height: 30px;
    margin-bottom: 0.5rem;
  }
  .product-image1{
    width:32px;
  }
  .quantity-controls {
    flex-direction: column;
    gap: 0.3rem;
  }

  .quantity-controls button {
    padding: 0.3rem;
    font-size: 12px;
  }

  .quantity-controls input {
    width: 30px;
    font-size: 12px;
    margin: 0;
  }

  .continue-shopping {
    margin-top: 1rem;
    font-size: 16px;
  }

  .order-summary {
    padding: 0.8rem;
    font-size: 12px;
    box-shadow: none;
  }

  .summary-header {
    font-size: 14px;
    margin-bottom: 8px;
    text-align: center;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .summary-item .label {
    font-size: 12px;
  }

  .summary-item select, .summary-item input {
    padding: 0.3rem;
    font-size: 12px;
  }

  .summary-item .apply-btn {
    padding: 0.3rem;
    font-size: 12px;
  }

  .total-cost {
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  }

  .checkout-btn {
    font-size: 12px;
    padding: 0.5rem;
    width: 100%;
  }

  .modal-content {
    padding: 0.8rem;
  }

  .modal-header {
    text-align: center;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-subtitle{
    font-size: 12px;
    font-family: 400;
  }

  .modal-body {
    font-size: 12px;
  }

  .form-group label {
    font-size: 12px;
  }

  .form-group input, .form-group select, .form-group textarea {
    font-size: 12px;
    padding: 0.4rem;
  }

  .btn-warning {
    font-size: 12px;
    padding: 0.4rem;
  }

  .buttonClose {
    padding: 0.4rem;
    font-size: 12px;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-track {
    background: #f0f0f0;
  }
}



</style>
