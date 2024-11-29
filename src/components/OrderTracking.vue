<template>
  <div class="order-tracking-container">
      <div class="row">
           <div class="col backButton">
              <div @click="backButtonClick">
                  <a href="#" style="text-decoration: none !important">←<span style="margin-left: 5px">Back</span></a>
              </div>
          </div>
          <div class="col">
              <div class="d-flex align-items-center justify-content-center">
                  <img src="./assets/orderTracking/tracking.png" alt="tracking" class="product-image1" loading="lazy"/>
                  <h2>Order Tracking</h2>
              </div>
          </div>
          <div class="col"></div>
      </div>
      <div v-if="showModalOpen" class="modal-overlay">
          <div class="modal-content">
              <h3>Note: For Practice Purpose the default Start and Destination is taken.</h3>
              <p class="startModal"><strong>Start:</strong> Pune</p>
               <p class="destModal"><strong>Destination:</strong> Solapur</p>
              <div class="modal-actions" >
                  <button @click="Confirmed" class="modal-ok-btn">OK</button>
              </div>
          </div>
      </div>
      <OrderTrackingMap v-if="showMap && selectedCity  && selectedCoords && selectedCoords.lat && selectedCoords.lng"
      :latitude="puneLocation.lat" :longitude="puneLocation.lng" :deliveryAddress="selectedCity"
      :deliveryCoords="selectedCoords"/>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  </div>
  <LoaderWord :loading="isLoading" />
</template>

<script>
import OrderTrackingMap from './OrderTrackingMap.vue';
import LoaderWord from './LoaderWord.vue';
import axios from 'axios';

export default {
components: {
  OrderTrackingMap,
  LoaderWord,
},
data() {
  return {
    isLoading: false,
    isSubmitting: false,
    showMap: true,
    showModalOpen: false,
    errorMessage: '',
    // Pune location coordinates
    puneLocation: {
      lat: 18.5204,
      lng: 73.8567,
    },
    deliveryC: {
      // Default to Solapur
      lat: 17.6599,
      lng: 75.9064,
    },
    reviewForms: [],
    selectedCity: null,
    selectedCoords: null,
  };
},
mounted() {
  this.isLoading = true;
  setTimeout(() => {
    this.modalToOpen();
    this.isLoading = false;
  }, 2000);
  const reviewOrderFormsList = localStorage.getItem('reviewOrderForms');
  if (reviewOrderFormsList) {
    this.reviewForms = JSON.parse(reviewOrderFormsList);
  }
  this.selectedCity = this.reviewForms.selectedCity;
  if (this.selectedCity) {
    this.selectedCoords = this.deliveryC;
  }
},
methods: {
  async getCoordinatesForCity(cityName) {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName
        )}&format=json&limit=1`);
      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        this.selectedCoords = {
          lat: location.lat,
          lng: location.lon,
        }; 
      } else {
        this.errorMessage = 'Could not find coordinates for the selected city.';
      }
    } catch (error) {
     // console.error('Error fetching city coordinates:', error);
      this.errorMessage = 'Failed to fetch city coordinates. Please try again later.';
    }
  },
  backButtonClick() {
    this.$router.push({ name: 'Cart' });
  },
  modalToOpen(){
      this.showModalOpen = true;
  },
  Confirmed(){
      this.showModalOpen = false;
      const myDiv = document.getElementById('map');
      myDiv.style.opacity = '1';
  },
},
};
</script>
<style scoped>
.order-tracking-container {
  text-align: center;
  padding: 0px 10px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.col {
  flex: 1;
  text-align: center;
}

.backButton {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 10px;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

.leaflet-bottom {
  display: none;
}

.product-image1{
  width: 32px;
  margin-right: 10px;
}

.modal-overlay {
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  text-align: center;
}

.modal-ok-btn {
  background: blue; 
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

h3{
  font-size: 22px;
}

.startModal{
  margin-bottom: 10px;
  font-size: 30px;
  color: green;
}

.destModal{
  margin-bottom: 30px;
  font-size: 30px;
  color: red;
}

@media (max-width: 990px) {
h2 {
  font-size: 18px;
}

.modal-content {
  padding: 16px;
  width: 400px;
}

h3{
  font-size: 18px;
}
.startModal, .destModal{
  font-size: 26px; 
}
}

@media (max-width: 768px) {
h2 {
  font-size: 16px;
  width:120px;
}

.product-image1 {
  width: 28px;
}

.modal-content {
  padding: 14px;
  width: 300px;
}

h3{
  font-size: 16px;
}

.startModal, .destModal{
  font-size: 24px; 
}

.modal-overlay {
  top: 10px;
  bottom: 20px;
}
}

@media (max-width: 480px) {
h2 {
  font-size: 16px;
  width:120px;
}

.error {
  font-size: 12px;
}

.backButton {
  font-size: 14px;
}

.product-image1 {
  width: 24px;
}

.modal-content {
  padding: 14px;
  width: 300px;
}

h3{
  font-size: 16px;
}

.startModal, .destModal{
  font-size: 22px; 
}

.modal-overlay {
  top: 10px;
  bottom: 20px;
}
}
</style>