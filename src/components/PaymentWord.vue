<template>
    <div class="item-list-container">
        <div class="item-details animated">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center justify-content-center margin-bottom">
                <img src="./assets/payment/pay.png" alt="shopping-cart" class="product-image1 mr-10" loading="lazy"/>
                <h2 class="text-muted">Pay : </h2>
              </div>
                <h1> ₹ {{ totalCost }}</h1>
            </div>
            <div class="order-card">
                <div class="product-details">
                    <div class="product" v-for="(item, index) in cartProductList" :key="index">
                        <div class="row">
                            <div class="col">
                                <img :src="item.image" alt="Product Image" class="product-image" loading="lazy">
                            </div>
                            <div class="col">
                                <h5 class="font-size">{{ item.name }}</h5>
                            </div>
                            <div class="col">
                                <p class="product-price">Price: ₹ {{ item.price }}</p> 
                            </div>
                            <div class="col">
                                <p class="text-muted">Quantity: {{ item.quantity }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div >
                <div class="imagePayment">
                    <div class="d-flex align-items-center justify-content-center">
                        <img class="payImage" src="./assets/payment/pay_graphics.jpg" alt="pay_graphic" loading="lazy"/>
                    </div>
                </div>
                <div class="mt-20">
                    <p class="deliveryAddress"><img class="locationImage" style="width:24px; margin-right: 10px;" src="./assets/payment/location.png" alt="location" loading="lazy" />Delivery Address : <span class="text-muted1">{{ deliveryAddress }}</span></p>
                    <p class="deliveryAddress"><img class="locationImage" style="margin-right: 10px;" src="./assets/payment/clock.png" alt="clock" loading="lazy" />Estimated Delivery Time : <span class="text-muted1">{{ deliveryTime }}</span></p>
                </div>
            </div>
            <div class="backButton">
                <a href="#" @click="backButtonClick" style="text-decoration: none !important">←<span style="margin-left:5px">Back</span></a>
            </div>
        </div>
  
        <div class="payment-methods animated">
            <h3 style="color: white;">Select Payment Method</h3>
            <div class="payment-options">
                <div class="mbottom-5">
                    <input class="mr-10" type="radio" id="upi" value="UPI" v-model="selectedPayment" />
                    <img class="card-logoNew mr-10" src="./assets/payment/upi.png" alt="UPI" loading="lazy" />
                    <label for="upi" class="payment-label">UPI</label>
                </div>
                <div class="mbottom-5">
                    <input class="mr-10" type="radio" id="card" value="Card" v-model="selectedPayment" />
                    <img class="card-logoNew mr-10" src="./assets/payment/card.png" alt="Card" loading="lazy">
                    <label for="card" class="payment-label ">Credit/Debit Card</label>  
                </div>
                <div class="mbottom-5">
                    <input class="mr-10" type="radio" id="netBanking" value="NetBanking" v-model="selectedPayment" />
                    <img class="card-logoNew mr-10" src="./assets/payment/netbanking.png" alt="Netbanking" loading="lazy">
                    <label for="card" class="payment-label ">NetBanking</label>    
                </div>
                <div class="mbottom-5">
                    <input class="mr-10" type="radio" id="cod" value="COD" v-model="selectedPayment" />
                    <img class="card-logoNew mr-10" src="./assets/payment/cod.png" alt="COD" loading="lazy">
                    <label for="card" class="payment-label">Cash on Delivery</label>            
                </div>
            </div>
  
            <transition name="fade">
                <div class="payment-details" v-if="selectedPayment === 'Card'">
                    <h4>Enter Card Details : </h4>
                    <form @submit.prevent="submitCardDetails">
                        <div class="input-wrapper">
                            <input type="text" v-model="cardNumber" placeholder="Card Number" required />
                            <img class="card-logo1" src="./assets/payment/card_image.png" alt="card_image" loading="lazy">
                        </div>
                        <input type="text" v-model="cardName" placeholder="Cardholder Name" required />
                        <div class="row">
                            <div class="col">
                                <input type="text" v-model="expiryDate" placeholder="Expiry Date (MM/YY)" required />
                            </div>
                            <div class="col" style="display: flex;">
                                <div class="input-wrapper">
                                    <input type="text" v-model="cvv" placeholder="CVV" required />
                                    <img class="icon" src="./assets/payment/cvv_image.png" alt="Card Icon" loading="lazy">
                                </div>
                            </div>
                        </div>
                        <p v-if="cardError" style="color:#f77582;">{{ cardError }}</p>           
                        <button type="submit" :disabled="isSubmitting" @click="handlePayment">
                          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span v-else>Pay Now</span>
                        </button>
                    </form>
                </div>
            </transition>
            <transition name="fade">
            <div class="payment-details" v-if="selectedPayment === 'UPI'">
                <h4>Enter UPI ID : </h4>
                <form @submit.prevent="submitUpiDetails">
                    <input type="text" v-model="upiId" placeholder="UPI ID" required />
                    <p v-if="upiError" style="color:#f77582;">{{ upiError }}</p>
                    <button type="submit" :disabled="isSubmitting" @click="handlePayment">
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span v-else>Pay Now</span>
                    </button>
                </form>
            </div>
            </transition>
            <transition name="fade">
                <div class="payment-details" v-if="selectedPayment === 'NetBanking'">
                    <h4>Select Bank : </h4>
                    <form @submit.prevent="handlePayment">
                        <select class="form-control" v-model="bank" required>
                            <option value="" disabled>Select Bank</option>
                            <option value="SBI">State Bank of India</option>
                            <option value="ICICI">ICICI Bank</option>
                            <option value="HDFC">HDFC Bank</option>
                            <option value="BOI">Bank of India</option>
                            <option value="OTHERS">OTHERS</option>
                        </select>
                        <input v-if="bank === 'OTHERS'" v-model="bankName" placeholder="Bank Name" />
                        <input v-model="accountNumber" placeholder="Bank Account Number" />
                        <input v-model="ifscCode" placeholder="IFSC Code" />
                        <input v-model="accountHolderName" placeholder="Account Holder's Name" />
                        <p v-if="netBankingError" style="color:#f77582;">{{ netBankingError }}</p>
                        <button style="margin-top: 20px;" type="submit" :disabled="isSubmitting" @click="netBankingClick($event)">
                          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span v-else>Pay Now</span>
                        </button>
                    </form>
                </div>
            </transition>
            <transition name="fade">
                <div class="payment-details" v-if="selectedPayment === 'COD'" >
                  <button type="submit" :disabled="isSubmitting" 
                  @click="handlePayment">
                      <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span v-else>Confirm Order</span>
                  </button>
                </div>
            </transition>
        </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h2 class="processingHeader">Processing Your Payment</h2>
            <div class="sandglass-wrapper">
                <div class="sandglass"></div>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <p class="processParagraph">Please wait while we process your request...</p>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <p class="text-muted">Please do not press back or refresh button</p>
            </div>
        </div>
    </div>
    <div v-if="showModalSuccess" class="modal">
      <div class="modalSection">
			<div class="text-container">
				<div class="success-checkmark">
					<div class="check-icon">
						<span class="icon-line line-tip"></span>
						<span class="icon-line line-long"></span>
						<div class="icon-circle"></div>
						<div class="icon-fix"></div>
					</div>
				</div>
				<h2 class="regular-text">Order Submitted Successfully</h2>
			</div>
			<div class="fireworks-container">
				<div class="firework pink">
					<div class="border-three pink">
						<div class="border-two pink">
							<div class="border-one pink">
								<div class="center pink"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="firework green">
					<div class="border-three green">
						<div class="border-two green">
							<div class="border-one green">
								<div class="center green"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="firework orange">
					<div class="border-three orange">
						<div class="border-two orange">
							<div class="border-one orange">
								<div class="center orange"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="firework aqua">
					<div class="border-three aqua">
						<div class="border-two aqua">
							<div class="border-one aqua">
								<div class="center aqua"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="firework red">
					<div class="border-three red">
						<div class="border-two red">
							<div class="border-one red">
								<div class="center red"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="firework blue">
					<div class="border-three blue">
						<div class="border-two blue">
							<div class="border-one blue">
								<div class="center blue"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="firework purple">
							<div class="border-three purple">
								<div class="border-two purple">
									<div class="border-one purple">
										<div class="center purple"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="firework yellow">
							<div class="border-three yellow">
								<div class="border-two yellow">
									<div class="border-one yellow">
										<div class="center yellow"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
    </div>
    <CreateLogsWord @logCreated="addLogToLogs" ref="createLogsComponent" />
    <LoaderWord :loading="isLoading" />
    <ToasterWord ref="toaster" />
</template>
  
  <script>
  import ToasterWord from './ToasterWord.vue';
  import axios from 'axios';
  import CreateLogsWord from './CreateLogsWord.vue';
  import LoaderWord from './LoaderWord.vue';
  export default {
    name: 'ItemList',
    components: {
        ToasterWord,
        CreateLogsWord,
        LoaderWord,
  },
    data() {
      return {
        isLoading: false,
        isSubmitting: false,
        deliveryAddress: '',
        deliveryTime: this.getDeliveryTime(),
        selectedPayment: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        cardError: "",
        upiId: '',
        upiError: "",
        bank: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        netBankingError: '',
        cartProductList: [],
        reviewForms:{},
        showModal: false,
        showModalSuccess: false,
        cartProductListSave: [],
      };
    },
    computed: {
    totalCost() {
    return this.cartProductList.reduce((total, item) => {
      const itemCost = item.discountApplied ? parseFloat(item.discountedPrice) * item.quantity : item.price * item.quantity;
      return total + itemCost;
    }, 0);
  }
    },
    mounted(){
        this.toaster = this.$refs.toaster;
        this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
        this.fetchCartProductList();   
  },
    methods: {
    async fetchCartProductList(){
        try {
        const response = await axios.get('http://localhost:3000/auth/fetch-CartProduct');
        this.cartProductListSave = response.data;   
      } catch (error) {
      // console.error('Error fetching MenuItems:', error);
        
      } 
        const storedCartProductList = localStorage.getItem("cartProductList");
        if (storedCartProductList) {
            this.cartProductList = JSON.parse(storedCartProductList);
        }
        const reviewOrderFormsList = localStorage.getItem("reviewOrderForms");
        if (reviewOrderFormsList) {
            this.reviewForms = JSON.parse(reviewOrderFormsList);
        }
            this.deliveryAddress = this.reviewForms.address + "," + this.reviewForms.selectedCity +","+ this.reviewForms.selectedState
        + ".";
    },
    getDeliveryTime() {
      const date = new Date();
      date.setMinutes(date.getMinutes() + 45);
  
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = String(date.getFullYear()).slice(-2);
      
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12; 
      hours = String(hours).padStart(2, '0');

      return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
    },
    backButtonClick(){
        this.$router.push({name: 'Cart'});
    },
    netBankingClick(event){
        event.preventDefault(); 
        this.handlePayment();
    },
    handlePayment() {
      if (this.selectedPayment === 'Card') {
            if (!this.validateCardNumber(this.cardNumber)) {
                this.cardError = "Invalid card number";
                this.showToast('Please do form validation','error');
                return
            } else if (this.cardName == "") {
                this.cardError = "Invalid Card name";
                this.showToast('Please do form validation','error');
                return
            } else if (!this.validateExpiryDate(this.expiryDate)) {
                this.cardError = "Invalid or expired date";
                this.showToast('Please do form validation','error');
                return
            } else if (!this.validateCVV(this.cvv)) {
                this.cardError = "Invalid CVV";
                this.showToast('Please do form validation','error');
                return
            } else {
                this.cardError = "";
                this.submitCardDetails();
            }
      } else if (this.selectedPayment === 'UPI') {
            if (!this.validateUpiId(this.upiId)) {
                this.upiError = "Invalid UPI ID format";
                this.showToast('Please do form validation','error');
                return
            } else {
                this.upiError = "";
                this.submitUpiDetails();
        }
      }
      else if (this.selectedPayment === 'NetBanking') {
        if (!this.validateAccountNumber(this.accountNumber)) {
            this.netBankingError = "Invalid bank account number";
            this.showToast('Please do form validation', 'error');
            return;
        }
        if (!this.validateIfscCode(this.ifscCode)) {
            this.netBankingError = "Invalid IFSC code";
            this.showToast('Please do form validation', 'error');
            return;
        }
        if (!this.validateAccountHolderName(this.accountHolderName)) {
            this.netBankingError = "Invalid account holder name";
            this.showToast('Please do form validation', 'error');
            return;
        }
        if (this.bank === 'OTHERS' && (!this.bankName || this.bankName.trim() === "")) {
            this.netBankingError = "Please enter a valid bank name";
            this.showToast('Please do form validation', 'error');
            return;
        }
            this.netBankingError = "";
            this.submitNetBankingDetails();
      }
      else if (this.selectedPayment === 'COD') {
            this.submitcodOrder();
      } else {
            this.showToast('Please select a payment method.','error');
            return
      }
    },
    async submitCardDetails() {
      this.isSubmitting = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.isLoading = false;
        this.openProcessModal();
      }, 1000);
    },
    async submitUpiDetails() {
      this.isSubmitting = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.isLoading = false;
        this.openProcessModal();
      }, 1000);
    },
    async submitNetBankingDetails() {
      this.isSubmitting = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.isLoading = false;
        this.openProcessModal();
      }, 1000);
    },
    async submitcodOrder() {
      this.isSubmitting = true;
      this.isLoading = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.isLoading = false;
        this.openProcessModal();
      }, 1000);
    },
    validateUpiId(upiId) {
        const upiPattern = /^[\w.-]+@[a-zA-Z]+$/;
        return upiPattern.test(upiId);
    },
    validateCardNumber(cardNumber) {
        let sum = 0;
        let alternate = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let n = parseInt(cardNumber[i], 10);
            if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 === 0;
    },
    validateExpiryDate(expiry) {
        const [month, year] = expiry.split("/").map(Number);
        if (!month || !year || month < 1 || month > 12) return false;

        const now = new Date();
        const expDate = new Date(year + 2000, month);
        return expDate > now;
    },
    validateCVV(cvv) {
        return /^[0-9]{3,4}$/.test(cvv);
    },
    validateAccountNumber(accountNumber) {
        const accountPattern = /^\d{9,18}$/;
        return accountPattern.test(accountNumber);
    },
    validateIfscCode(ifscCode) {
        const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        return ifscPattern.test(ifscCode);
    },
    validateAccountHolderName(accountHolderName) {
        const namePattern = /^[a-zA-Z\s.-]+$/;
        return accountHolderName && namePattern.test(accountHolderName);
    },
    showToast(msg, status) {
        if (this.toaster) {
            this.toaster.show(msg, status);
        } 
    },
    addLogToLogs(log) {
      console.log('Log Created:', log);
    },
    playProcessingAudio() {
      const audio = new Audio(require('./assets/payment/play.mp3')); 
      audio.play();
    },
    openProcessModal(){
        this.playProcessingAudio();
        this.showModal = true; 
        setTimeout(() => {
            this.showModal = false;
            this.openSuccessModal();
        }, 10000);   
    },
    openSuccessModal(){
      this.showModalSuccess = true;
      const audio = new Audio(require('./assets/payment/payment.mp3')); 
      audio.play();
      this.placeOrder();
      setTimeout(() => {
            this.showModalSuccess = false;
            this.$router.push({ name: "OrderTracking" });
        }, 10000);
    },
    async placeOrder() {
      //SMS notification data
      const smsData = {
        message : 'Your order has been placed successfully!',
        to: '+919876543210',
  };

  try {
    const response = await fetch('http://localhost:3000/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData),
    });

    if (!response.ok) {
      const errorResponse = await response.text(); // Try to read the response even if not JSON
      throw new Error(`Request failed: ${response.statusText}, Body: ${errorResponse}`);
    }

    const result = await response.json();
    if (result.success) {
      console.log('SMS sent successfully');
      this.showToast('SMS sent successfully.','success');
      return
    } else {
      console.error('Failed to send SMS:', result.error);
      this.showToast('Failed to send SMS.','error');
      return
    }
  } catch (error) {
    console.error('Error:', error);
    this.showToast('SMS sent successfully.','success');
    return
  }
    },
    }
  };
  </script>
  
  <style scoped>
  .item-list-container {
    display: flex;
    justify-content: space-between;
    padding: 2rem;
    background: linear-gradient(to right, #f0f0f0, #e0e0e0);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
  }
  
  .item-details{
    width: 48%;
    background-color: #fff; 
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }
  .payment-methods{
    width: 48%;
    background-color: #5F259F;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }
  .backButton {
  margin-top: 1rem;
  text-decoration: none !important;
}

.mr-10{
    margin-right: 10px;
}
.mbottom-5{
    margin-bottom: 5px;
}
.margin-bottom{
  margin-bottom: 10px;
}
.mt-20{
    margin-top: 20px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding-right: 40px; 
  padding-left: 10px;
  font-size: 16px;
  height: 35px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
}

.card-logo {
  position: absolute;
  right: 10px;
  width: 35px;
  height: auto;
}

.font-size{
  font-size: 18px;
}
  
.imagePayment{
    background-color:#692121;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
}

.card-logo1{
    position: absolute;
    right: 10px;
    width: 80px;
    height: 30px;
}
.card-logoNew {
  width: 50px;
  height: auto;
}
.icon {
  position: absolute;
  right: 10px;
  width: 25px;
  height: auto;
}
 
  h2 {
    color: #333;
  }

  h3{
    color:white;
  }

  h4{
    color: #2fe7f9;
  }

  .processingHeader{
    color: black;
  }

  .text-muted1{
    color:#f34511;
  }
  
  .order-card {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #fafafa;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    text-transform: capitalize;
  }
  
  .product {
    margin-bottom: 1rem;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
    margin-right: 1rem;
    border-radius: 4px;
  }
  .payImage{
    width: 200px;
    height: auto;
    border-radius: 20px;
  }
  .deliveryAddress{
    font-size: 16px;
    font-weight: 700;
    text-transform: capitalize;
  }
  
  .product-info {
    flex-grow: 1;
    display: flex;
    text-align: center;
    text-transform: capitalize;
  }
  
  .product-price {
    color: red;
  }
  
  .total-cost {
    margin-top: 1rem;
    font-weight: bold;
    color: #5cb85c;
  }
  
  .payment-options {
    margin-bottom: 1rem;
  }
  
  .payment-label {
    color: #fbff04;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .payment-label:hover {
    color:#c3c536;
  }
  
  .payment-details {
    margin-top: 1rem;
  }
  
  .payment-details input {
    display: block;
    margin: 0.5rem 0;
    padding: 0.8rem;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: border-color 0.3s ease;
  }
  
  .payment-details input:focus {
    border-color:7805f7;
  }
  
  button {
    padding: 0.7rem 1.5rem;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }

  .processParagraph{
    font-size: 22px;
    font-weight: 400;
    color: white;
    margin-top: 30px;
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

.modal-content {
  background-color: #0f1a9d;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
  width: 800px;
  height: 600px;
}

.sandglass-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.sandglass {
  position: relative;
  width: 100px;
  height: 200px;
  background-color: #e35555;
  overflow: hidden;
  animation: rotateSandglass 2s infinite linear;
}

.sandglass::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 50%;
  top: 0;
  background: linear-gradient(to bottom, #d4af37, #f5f5f5);
  background-color: #e35555;
  z-index: 1;
  animation: fillUp 2s infinite;
}

.sandglass::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 50%;
  bottom: 0;
  background: linear-gradient(to top, #d4af37, #f5f5f5);
  z-index: 0;
  animation: fillDown 5s infinite;
}

@keyframes fillUp {
  0% {
    height: 50%;
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  }
  100% {
    height: 0;
    clip-path: polygon(50% 100%, 50% 100%, 50% 100%);
  }
}

@keyframes fillDown {
  0% {
    height: 0;
    clip-path: polygon(50% 100%, 50% 100%, 50% 100%);
  }
  100% {
    height: 50%;
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  }
}

@keyframes rotateSandglass {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #39df18;
  z-index: 1;
}

:root {
	--pink: #4b044b;
	--green: #39d31a;
	--orange: #523109;
	--aqua: #0a4d53;
	--red: #610909;
	--purple: #1b0c70;
	--yellow: #6a6d09;
	--blue: #0b3475;
}

.text-container {
	margin: 25vh auto;
	width: 590px;
	z-index: 1;
	background-color: hsla(245, 80%, 4%, 0.8);
	border-radius: 25px;
	text-align: center;
	line-height: 4rem;
	padding: 4px 0;
	animation: 1.4s pulse-txt infinite;
}

.regular-text, .special-text {
	color: GhostWhite;
}

.regular-text {
	font-family: "Playfair Display";
	font-size: 2rem;
}

.special-text {
	font-family: "Carter One";
	font-size: 9rem;
}

.fireworks-container {
	width: 100%;
	height: 100%;
}

.firework {
	position: absolute;
	z-index: -1;
	opacity: 0;
	animation: boom 5.6s infinite;
}

.border-three, .border-two, .border-one {
	border-width: 10px;
	border-style: dotted;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.border-three {
	width: 350px;
	height: 340px;
	filter: blur(0.95px);
}

.border-two {
	width: 240px;
	height: 230px;
}

.border-one {
	width: 130px;
	height: 125px;
}

.center {
	width: "";
	height: "";
	border-width: 12px;
	border-style: dotted;
	border-radius: 50%;
}

.pink {
	top:10%;
	left:10%;
	border-color: var(--pink);
	animation-delay: 2.8s;
}

.green {
	top: 5%;
	left: 20%;
	border-color: var(--green);
	animation-delay: 0s;
}

.orange {
	top:20%;
	left: 50%;
	border-color: var(--orange);
	animation-delay: 4.2s;
}

.aqua {
	top: 13%;
	right:15%;
	border-color: var(--aqua);
	animation-delay: 0.7s;
}

.red {
	bottom:20%;
	left: 20%;
	border-color: var(--red);
	animation-delay: 4.9s;
}

.blue {
	bottom: 35%;
	left: 15%;
	border-color: var(--blue);
	animation-delay: 1.4s;
}

.purple {
	bottom: 10%;
	left: 45%;
	border-color: var(--purple);
	animation-delay: 3.5s;
}

.yellow {
	bottom: 15%;
	right: 2%;
	border-color: var(--yellow);
	animation-delay: 2.1s;
}

@keyframes boom {
	0% {
		opacity: 0;
		transform: scale(0.1);
	}
	4% {
		opacity: 1;
		transform: scale(0.1);
	}
	8% {
		opacity: 1;
		transform: scale(1.0);
	}
	12% {
		opacity: 0;
		transform: scale(1.0);
	}
	16% {
		opacity: 0;
		transform: scale(0.1);
	}
	100% {
		opacity: 0;
		transform: scale(0.1);
	}
}

@keyframes pulse-txt {
	0% {
		transform: scale(1.0)
	} 50% {
		transform: scale(1.2);
	} 100% {
		transform: scale(1.0);
	}
}

.success-checkmark {
    width: 80px;
    height: 115px;
    margin: 0 auto;
}
    
    .check-icon {
        width: 80px;
        height: 80px;
        position: relative;
        border-radius: 50%;
        box-sizing: content-box;
        border: 4px solid #4CAF50;
        
        &::before {
            top: 3px;
            left: -2px;
            width: 30px;
            transform-origin: 100% 50%;
            border-radius: 100px 0 0 100px;
        }
        
        &::after {
            top: 0;
            left: 30px;
            width: 60px;
            transform-origin: 0 50%;
            border-radius: 0 100px 100px 0;
            animation: rotate-circle 4.25s ease-in;
        }
        
        &::before, &::after {
            content: '';
            height: 100px;
            position: absolute;
            background: #FFFFFF;
            transform: rotate(-45deg);
        }
        
        .icon-line {
            height: 5px;
            background-color: #4CAF50;
            display: block;
            border-radius: 2px;
            position: absolute;
            z-index: 10;
            
            &.line-tip {
                top: 46px;
                left: 14px;
                width: 25px;
                transform: rotate(45deg);
                animation: icon-line-tip 0.75s;
            }
            
            &.line-long {
                top: 38px;
                right: 8px;
                width: 47px;
                transform: rotate(-45deg);
                animation: icon-line-long 0.75s;
            }
        }
        
        .icon-circle {
            top: -4px;
            left: -4px;
            z-index: 10;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            position: absolute;
            box-sizing: content-box;
            border: 4px solid rgba(76, 175, 80, .5);
        }
        
        .icon-fix {
            top: 8px;
            width: 5px;
            left: 26px;
            z-index: 1;
            height: 85px;
            position: absolute;
            transform: rotate(-45deg);
            background-color: #FFFFFF;
        }
    }

    @keyframes rotate-circle {
    0% {
        transform: rotate(-45deg);
    }
    5% {
        transform: rotate(-45deg);
    }
    12% {
        transform: rotate(-405deg);
    }
    100% {
        transform: rotate(-405deg);
    }
}
@keyframes icon-line-tip {
    0% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    54% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    70% {
        width: 50px;
        left: -8px;
        top: 37px;
    }
    84% {
        width: 17px;
        left: 21px;
        top: 48px;
    }
    100% {
        width: 25px;
        left: 14px;
        top: 45px;
    }
}
@keyframes icon-line-long {
    0% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    65% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    84% {
        width: 55px;
        right: 0px;
        top: 35px;
    }
    100% {
        width: 47px;
        right: 8px;
        top: 38px;
    }
}
@media (max-width: 1084px) {
  .item-list-container {
    gap: 2rem; 
    padding: 1.5rem;
  }

  .item-details{
    width: 58%;
    background-color: #fff; 
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    
  }
  .payment-methods{
    width: 40%;
    background-color: #5F259F;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);  
  }
    
    .imagePayment {
        margin: 20px 0;
    }

    .backButton {
        margin-top: 20px;
    }

    .processingHeader {
        font-size: 22px; 
    }

    .success-checkmark {
        transform: scale(0.95); 
    }

    .order-card {
        padding: 1.5rem; 
    }

    h2, h3, h4 {
        font-size: 22px; 
    }

    .payment-options {
        flex-direction: column; 
        gap: 1.5rem;
    }

    .product {
        gap: 15px;
    }

    .product .col {
        width: 100%; 
    }

    .card-logo1,
    .card-logoNew{
        width: 45px; 
    }

    .icon {
        width: 25px; 
    }
    .product-image {
        width: 50px;
        height: 50px;
    }
    .product-price{
      font-size: 14px;
    }

    .deliveryAddress {
        font-size: 0.9rem;
        line-height: 1.2;
        white-space: nowrap; 
        overflow: hidden;
        text-overflow: ellipsis; 
        max-width: 100%;
        display: block;
    }
}
@media (max-width: 768px) {
  .item-list-container {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  .item-details,
  .payment-methods {
    width: 100%;
    margin-bottom: 1rem;
    padding: 1rem;
  }

  .product-image {
    width: 50px;
    height: 50px;
  }

  .product-image1{
    width:50px;
  }
  .product .row .col {
    text-align: center;
    margin-bottom: 0.5rem;
  }

  h2, h3, h4 {
    font-size: 1rem;
  }

  .imagePayment{
    display: none;
  }

  .payImage {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .card-logoNew {
    width: 40px;
    height: auto;
  }

  .input-wrapper input {
    font-size: 14px;
    height: 30px;
  }

  .input-wrapper .card-logo1 {
    width: 50px;
    height: auto;
  }

  .order-card {
    padding: 0.5rem;
  }

  .deliveryAddress {
    font-size: 0.9rem;
    line-height: 1.2;
  }

  .backButton a {
    font-size: 0.9rem;
  }

  .modal-overlay {
    padding: 1rem;
    align-items: center;
  }

  .modal-content {
    width: 90%;
    padding: 1rem;
    text-align: center;
  }

  .success-checkmark .check-icon {
    width: 60px;
    height: 60px;
  }

  .regular-text {
    font-size: 1.1rem;
  }

  button {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}
@media (max-width: 510px) {
  .item-list-container {
    flex-direction: column;
    align-items: stretch; 
    padding: 0.5rem;
    gap: 1rem;
  }

  .item-details,
  .payment-methods {
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    box-sizing: border-box; 
  }

  .product-image {
    width: 40px;
    height: 40px;
    object-fit: cover; 
  }

  .product-image1{
    width:40px;
  }

  .product{
    margin-bottom: 0px;
}

  .product .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .product .row .col {
    flex: 1 1 calc(50% - 1rem); 
    text-align: center;
    margin-bottom: 0px !important;
  }

  h2, h3, h4 {
    font-size: 0.9rem; 
    margin: 0.5rem 0; 
  }

  .imagePayment {
    display: none; 
  }

  .payImage {
    width: 100%;
    height: auto;
    border-radius: 8px;
    max-width: 300px; 
  }

  .card-logoNew,
  .input-wrapper .card-logo1 {
    width: 35px;
    height: auto;
  }

  .input-wrapper input {
    font-size: 12px; 
    height: 28px; 
    padding: 0.3rem; 
  }

  .order-card {
    padding: 0.5rem;
    border: 1px solid #ddd; 
    border-radius: 8px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  }

  .deliveryAddress {
    font-size: 0.8rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden; 
    text-overflow: ellipsis; 
    max-width: 100%; 
    display: block;
  }

  .text-muted {
    margin-bottom: 0px !important;
  }

  .locationImage{
    width: 18px !important;
    margin-right: 5px !important;
  }

  .backButton a {
    font-size: 0.9rem;
    display: block;
    margin: 0 auto; 
    padding: 0.5rem 1rem;
  }

  .modal-overlay {
    padding: 1rem;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .modal-content {
    width: 100%;
    max-width: 350px; 
    padding: 1rem;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
  }

  .success-checkmark .check-icon {
    width: 50px;
    height: 50px;
  }

  .regular-text {
    font-size: 0.9rem;
    margin: 0.5rem 0; 
  }

  button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    margin: 0.3rem; 
  }
}
  </style>
  