<template >
    <div class="main">
      <div class="container">
        <div class="home">
            <div class="home-content text-center"> 
            <h1 class="display-4 textColor">Welcome to Our Food Ordering App</h1>
            <p class="lead">Order your favorite meals quickly and easily!</p>
                <div class="search-bar-main d-flex align-items-center">
                    <img src="./assets/home/location.png" alt="Location" class="location" id="locationIcon" width="20" loading="lazy"/>
                    <select v-model="selectedLocation" class="select-dropdown form-select" @change="handleLocationSelect">
                        <option value="" disabled><span>Location</span></option>
                        <option value="currentLocation">
                        <span style="width: 24px; height: 24px;background-color:red" id="detectLocationIcon">&#x2719;</span> 
                        {{ currentLocation }}</option>
                    </select>
                    <span class="horizontalLine mx-1 d-flex align-items-center justify-content-center">|</span>
                    <input v-model="searchQuery" @keyup="handleSearch" type="text" class="search-bar" placeholder="Search restaurants..." :disabled="isLoading"
                    aria-label="Search"/>
                </div>
            </div>
        </div>
        <hr class="carHeaderhr" />
        <div class="filter-section mt-4">
          <h2 class="text-center mb-4">Filter Restaurants</h2>
          <div class="filter-options d-flex flex-wrap justify-content-around">
            <div v-for="filter in filters" :key="filter.id" :class="['filter-card', { selected: isSelected(filter.type) }]"
              @click="applyFilter(filter.type)">
              <img :src="filter.image" :alt="filter.type" class="filter-image" loading="lazy"/>
              <p class="filter-title">{{ filter.type }}</p>
            </div>
          </div>
        </div>
        <hr class="carHeaderhr"/>
            <div id="card" class="card-fetch" >
                <div class="container mt-4">
                    <div v-if="restaurants.length === 0" class="alert alert-warning restaurant_no">
                    <img src="./assets/home/no_restaurant_available.jpg" class="restaurant_no_image" alt="No_Restaurant_Image" loading="lazy"/> 
                        <p class="restaurant_no_content">No Restaurant found near your places.</p>
                    </div>
                    <div v-else class="row">
                        <h1 class="cardHeaderText">Top Restaurants near you</h1> 
                        <div v-for="restaurant in restaurants" :key="restaurant.id" class="col-md-4 mb-4">
                            <div class="card">
                                <div class="card-body card-body-height" @click="openCardDetails(restaurant)">
                                    <div class="card-title-image">
                                        <img :src="restaurant.image" class="card-img-top card-image-height" alt="Restaurant Image" loading="lazy"/>
                                    </div>
                                    <h5 class="card-title turncate1">{{ restaurant.name }}</h5>
                                    <p class="card-text truncate paragraphHeight">{{ restaurant.description }}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span>
                                            <i class="bi" v-for="n in 5" :key="n" :class="n <= restaurant.rating ? 'bi-star-fill' : 'bi-star'" style="color: #ffc107;"></i>
                                        </span>
                                        <span class="badge bg-primary">{{ restaurant.rating }} / 5</span>
                                    </div>
                                    <div class="height-2 card-line">
                                        <div class="w-100 h-100 red-background"></div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="carHeaderhr"/>
            </div>
        </div>
        <div class="filter-section1">
          <div className='appdownload' id='appdownload'>
              <p>For Better Experience Download<br/>Food App</p>
              <div className='appdownload-platform'>
                  <img src="./assets/home/play_store.png" alt='play_store'/>
                  <img src="./assets/home/app_store.png" alt='app_store'/>
              </div>
          </div>
      </div>
        <div className='footer' id='footer'>
            <div className='footer-content'>
                <div className='footer-content-left'>
                    <a class="navbar-brand logoImageContent" href="#">FoodApp</a>
                    <p>Indulge in a seamless food ordering experience with our app. Explore a world of delicious cuisines from your favorite local restaurants, delivered right to your doorstep. Whether you’re craving a spicy Indian curry, a cheesy pizza, or a refreshing salad, we’ve got it all.</p>
                    <div className='footer-social-icons'>
                        <img src="./assets/home/facebook.png" alt='facebook_icon'/>
                        <img src="./assets/home/instagram.png" alt='instagram_icon'/>
                        <img src="./assets/home/twitter.png" alt='twitter_icon'/>
                        <img src="./assets/home/youtube.png" alt='youtube_icon'/>
                    </div>
                </div>
                <div className='footer-content-center'>
                    <h2 class="animation">Company</h2>
                    <ul class="pl-0">
                        <li class="footer-content-text"><img src="./assets/home/home.png" alt='home_icon' class="input-icon"/>Home</li>
                        <li class="footer-content-text"><img src="./assets/home/group.png" alt='about_icon' class="input-icon"/>About Us</li>
                        <li class="footer-content-text"><img src="./assets/home/delivery.png" alt='delivery_icon' class="input-icon"/>Delivery</li>
                        <li class="footer-content-text"><img src="./assets/home/privacy.png" alt='privacy_icon' class="input-icon"/>Privacy Policy</li>
                    </ul>
                </div>
                <div className='footer-content-right'>
                    <h2 class="animation">GET IN TOUCH</h2>
                    <ul class="pl-0">
                        <li class="d-flex animation"><img src="./assets/home/phone.png" alt='call_icon' class="input-icon"/>8459305176</li>
                        <li class="d-flex animation"><img src="./assets/home/mail.png" alt='mail_icon' class="input-icon"/>somnathbagale12@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr/>
            <div>
               
                <p className='footer-copyright animation'>Copyright 2024 @ FoodApp.com All Right Reserved</p>
            </div> 
        </div>
    </div>
    <ToasterWord ref="toaster" />
    <LoaderWord :loading="isLoading" />
</template>

<script>
import { mapGetters } from 'vuex';
import ToasterWord from './ToasterWord.vue';
import LoaderWord from './LoaderWord.vue';
import axios from 'axios';
export default {
  name: 'HomeWord',
  components: {
    ToasterWord,
    LoaderWord,
  },
  data() {
    return {
      searchQuery: '',
      selectedLocation: '',
      currentLocation: 'Detect current location',
      detectIcon: '',
      restaurants: [],
      menuItemData:[],
      itemsNew:[],
      isLoading: false,
      selectedFilter: "All",
      filters: [
        { id: 1, type: "All", image: "/assets/home/all.png" },
        { id: 2, type: "Pure Veg", image: "/assets/home/veg.png" },
        { id: 3, type: "Non-Veg", image: "/assets/home/nonveg.png" },
        { id: 4, type: "Veg/Non-Veg", image: "/assets/home/veg-nonVeg.png" },
        { id: 5, type: "Fast-Food", image: "/assets/home/burger.png" },
        { id: 6, type: "Bakery", image: "/assets/home/bakery.png" },
        { id: 7, type: "Chinese", image: "/assets/home/chinese.png" },
      ],
      originalRestaurants: [
      { id: 1, name: "Pizza Hut", address:"Phase-3,Hinjewadi,Pune-04", description: "Delicious pizza!, Good food, good vibes, good times, Your local stop for global flavors.", rating: 4, image: "/assets/new/admin.webp", type: "Fast-Food" },
        { id: 2, name: "Pakwan Veg Restaurant", address:"Baner-Aundh Road,Aundh,Pune-04", description: "Best desserts in town, Healthy eating, made delicious, Wholesome food for a wholesome life.", rating: 4.5, image: "/assets/new/admin-3.jpg", type: "Pure Veg" },
        { id: 3, name: "China Town", address:"Hadapsar,Pune-04", description: "Authentic Chinese cuisine, Bite into happiness, Fuel your cravings on the go.", rating: 5, image: "/assets/new/admin-12.jpg", type: "Chinese" },
        { id: 4, name: "Manas Hotel", address:"JM Road,Manapa,Pune-04", description: "Food provides essential nutrients for overall health and well-being, Because good food equals good mood.", rating: 4, image: "/assets/new/admin-1.jpg", type: "Fast-Food" },
        { id: 5, name: "Radha Krishna Chinese", address:"WTC,Kharadi,Pune-04", description: "Authentic Chinese cuisine, Food provides essential nutrients for overall health and well-being!.", rating: 5, image: "/assets/new/admin-16.jpg", type: "Chinese" },
        { id: 6, name: "Hotel Jagadamb", address:"Nigdi,PCMC,Pune-04", description: "Elevating dining to an art form, An elegant escape for your palate, A symphony of taste and ambiance.", rating: 4.5, image: "/assets/new/admin-15.jpg", type: "Non-Veg" },
      ],
    };
  },
  computed: { 
    ...mapGetters(['getRestaurant','getMenuItems']),
    restaurant() {
     return this.getRestaurant;
      },
  },
  mounted() {
    this.toaster = this.$refs.toaster;
    this.fetchRestaurants();
    this.menuItemData = this.getMenuItems;
    this.restaurants = [...this.originalRestaurants];
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    methods: {
      async fetchRestaurants() {
        this.isLoading = true;
            try {
                const response = await axios.get('http://localhost:3000/auth/fetch-restaurant');
                this.restaurants = response.data.restaurants;
                this.$store.commit('SET_RESTAURANTS', response.data.restaurants);
            } catch (error) {
                if (this.getRestaurant && this.getRestaurant.length > 0) {
                this.restaurants = this.getRestaurant;
            } 
            }
            finally {
            this.isLoading = false;
        }
    },
      handleSearch() {
            this.isLoading = true; 
            const query = this.searchQuery.trim().toLowerCase();
            try {
            if (query) {
                this.restaurants = this.getRestaurant.filter((restaurant) =>
                restaurant.name.toLowerCase().includes(query)
                );
                if (this.restaurants.length === 0) {
                this.showToast('No matching restaurants found.', 'warning');
                }
            } else {
                this.restaurants = this.getRestaurant;
            }
            } catch (error) {
            this.showToast('An error occurred while searching.', 'error');
            } finally {
                setTimeout(() => {
                    this.isLoading = false;
                }, 2000);
            }
      },
      handleLocationSelect() {
        this.detectIcon = document.getElementById('detectLocationIcon');
        if (this.selectedLocation === 'currentLocation') {
          this.getLocation();
        }
      },
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
                this.detectIcon.style.display = 'none';
                this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            
            },
            (error) => {
                this.currentLocation = "Unable to retrieve location";
                this.detectIcon.style.display = 'none';
                this.showToast('Error retrieving location: ' + error.message, 'error');
            }
          );
        } else {
            this.currentLocation = "Geolocation not supported";
            this.detectIcon.style.display = 'none';
            this.showToast('Geolocation is not supported by this browser.', 'error');
        }
      },
      async reverseGeocode(lat, long) {
        // http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true&key=YOUR_API_KEY
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=AlzaSyYgW1MJsGP5ufNowwwOrc7k7HfS6i4LNvW`
          );
          const data = await response.json();
          if (data && data.results && data.results.length > 0) {
            this.currentLocation = data.results[0].formatted;
            this.detectIcon.style.display = 'none';
          } else {
            this.currentLocation = "Unable to retrieve address";
            this.detectIcon.style.display = 'none';
          }
        } catch (error) {
          this.currentLocation = "Error retrieving address";
          this.detectIcon.style.display = 'none';
        }
      },
      openCardDetails(data){
        this.isLoading = true; 
        localStorage.setItem('selectedRestaurant', JSON.stringify(data));
        localStorage.setItem('selectedItemsData', JSON.stringify(this.menuItemData));
        setTimeout(() => {
          this.$router.push({ name: 'ItemDetail', params: { itemName: data.name.toLowerCase().replace(/\s+/g, '') } });
          this.isLoading = false;
        }, 500);
      },
      showToast(msg, status) {
        if (this.toaster) {
            this.toaster.show(msg, status);
        } else {
            console.error("Toaster instance not initialized.");
        }
    },
    applyFilter(filterType) {
      this.isLoading = true;
      this.selectedFilter = filterType;
      setTimeout(()=>{
        this.isLoading = false;
      },1000)
      if (filterType === "All") {
        this.restaurants = [...this.originalRestaurants];
      } else {
        this.restaurants = this.originalRestaurants.filter((restaurant) => restaurant.type === filterType);
      }
      this.restaurants = [...new Set(this.restaurants)];
    },
    isSelected(filterType) {
    return this.selectedFilter === filterType;
  },
  resetFilters() {
    this.selectedFilter = "All";
    this.restaurants = [...this.originalRestaurants];
  },
}
};
</script>

<style scoped>
.navbar-brand {
    transition: 0.5s;
    cursor: pointer;
}
.navbar-brand:hover{
  transform: scale(1.10);
}
.footer-content-text{
    display: flex;
    align-items: center;
}
.footer-content-text:hover{
   color: #877c7c;
}
.input-icon {
    margin-right: 10px;
}
.animation{
    transition: 0.5s;
}
.animation:hover{
    transform: scale(1.10);
}
.main{
    height: 100vh;
    padding: 0 10px;
    margin-top: 10px;

}
.home {
  height: 400px;
  width: 100%;
  background: url('../assets/home/background.jpg') center center no-repeat; 
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  border-radius: 20px;
}

.home-content {
  color: white;
  padding: 20px;
  border-radius: 10px;
}
.cardHeaderText{
  color: #262626;
  font-weight: 500;
  margin-bottom: 25px;
}

.display-4 {
  background: aqua;
  color: teal;
  border: 1px solid aqua;
  border-radius: 10px;
  font-family: auto;
  }

.lead {
  font-family: auto;
}

.carHeaderhr{
    margin: 20px 0px;
    height: 2px;
    background-color: #1e1e1e;
    border: none;
}
.paragraphHeight{
    height: 100px;
    text-transform: capitalize;
    margin-top: 20px;
}
.restaurant_no{
    display: flex;
    flex-direction: column;
  align-items: center;
  justify-content: center;
}
.restaurant_no_content{
    margin-top: 20px;
    font-size: 30px;
    text-align: center;
    color:#fd5a51;
}
.restaurant_no_image{
    height: 350px;
    width: 100%;
    
}
.filterOption{
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-bar-main{
  max-width: 800px;
  width: 800px;
  padding: 10px;
  font-size: 16px;
  height: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: white;
}

  .search-bar {
    border: none;
    width:500px;
    max-width: 500px;
}

.search-bar:focus {
  border-color: #007bff;
  outline: none;
}

.search-bar input:disabled,
.search-bar button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.select-dropdown {
    border: none;
    width: 300px;
    max-width: 300px;
}

.card-fetch{
    cursor: pointer;
}
.card-body-height{
    height: 400px; 
    border: 2px solid #71ed00;
    border-radius: 5px;
}
.card-title{
 font-weight: bold;
  color: #e71f1f;
  text-decoration: underline;
}
.card-title-image{
    display: flex;
    align-items: center;
   justify-content: space-between;
   margin-bottom: 20px;
}
.card-image-height{
    height: 150px;
    width:100vw;
}
.horizontalLine{
    color: rgb(33, 32, 32);
    height: 25px;
}

.w-100{
    width: 100%;
}

.h-100{
    height: 100%;
}

.card-line {
    margin-top: 10px;
    width: 50%;
    float: right;
}

.height-2 {
    height: 2px;
}

.red-background {
    background: #fd5a51;
   
}
.turncate{
  display: -webkit-box;
  -webkit-line-clamp: 3; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: capitalize;
}
.turncate1{
    white-space: nowrap; 
    overflow: hidden;   
    text-overflow: ellipsis; 
    max-width: 250px;
    text-transform: capitalize;
}

.appdownload{
    margin: auto auto;
    margin-top: 50px;
    font-size: max(3vw,20px);
    text-align: center;
    font-weight: 500;
}
.appdownload-platform{
    display: flex;
    justify-content: center;
    gap: max(2vw,10px);
}
.appdownload-platform img{
    width: max(30vw,120px);
    max-width: 180px;
    transition: 0.5s;
    cursor: pointer;
}
.appdownload-platform img:hover{
    transform: scale(1.05);
}
.footer{
    color: #d9d9d9;
    background-color: #323232;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 8vw;
    padding-top: 40px;
    border-radius: 10px;
}
.footer-content{
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 80px;
}
.footer-content-left, .footer-content-right, .footer-content-center{
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20px;
}
.footer-content-left li, .footer-content-right li, .footer-content-center li{
   list-style: none;
   margin-bottom: 10px;
   cursor: pointer;
}
.footer-content-right h2, .footer-content-center h2{
    color: white;
 }
 .footer-social-icons img{
    width: 40px;
    margin-right: 15px;
    cursor: pointer;
     transition: 0.5s;
 }
.footer-social-icons img:hover{
  transform: scale(1.15);
}
 .footer hr{
    width: 100%;
    height: 2px;
    margin: 20px 0px;
    background-color: gray;
    border: none;
 }
 .logoImageContent{
    font-weight: 800;
    font-size: 30px;
    text-align: center;
    color: #fd5a51;
 }

 .pl-0{
    padding-left: 0px !important;
 }

 .footer-copyright{
        font-size: 18px;
        text-align: center;
    }

.filter-section {
  background-color: #d5d5d5;
  padding: 1rem;
  border-radius: 10px;
}
.filter-section1 {
  margin-bottom: 50px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px; 
  margin: 10px 0;
}

.filter-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s, background-color 0.3s;
  background-color: #f9f9f9;
  width: 100px; 
}

.filter-card img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 8px;
}

.filter-card p {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: #555;
}

.filter-card:hover {
  background-color: #eaeaea;
  transform: scale(1.05);
}

.filter-card.selected {
  background-color:  #429dff;
  color: white;
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .filter-options {
    flex-wrap: nowrap; 
    overflow-x: auto; 
    padding: 10px;
  }

  .filter-card {
    flex: 0 0 auto; 
    width: 70px; 
  }

  .filter-card img {
    width: 35px;
    height: 35px; 
  }
}
    

 @media (max-width: 992px) {
    .main {
        padding: 0 10px;
        width: 100%;
        margin: 0;
    }

    .home {
        padding: 10px;
    }

    .home-content {
        padding: 10px;
    }

    .display-4 {
        font-size: 18px;
        font-weight: 700;
    }

    .lead {
        font-size: 14px;
        line-height: 1.4;
        font-weight: 500;
    }

    .search-bar-main {
        width: 100%;
        padding: 8px 0;
        max-width: 650px;
        font-size: 14px;
    }
    
    .select-dropdown, .search-bar {
        width: 100%;
    }

    .card-fetch {
        width: 100%;
        margin-bottom: 15px;
    }

    .card-body-height {
        padding: 15px;
    }

    .card-title-image img {
        width: 100%;
        height: auto;
        max-height: 150px;
    }

    .card-title {
        font-size: 18px;
        margin: 8px 0;
    }

    .paragraphHeight {
        font-size: 14px;
        margin-top: 8px;
    }

    .card-line {
        margin-top: 12px;
    }

    .restaurant_no_image {
        width: 100%;
    }

    .restaurant_no_content {
        font-size: 20px;
        text-align: center;
        margin-top: 12px;
    }

    .footer{
      padding-top: 0px;
      gap: 0px;
      margin-top: 0px;
    }

    .footer-content {
        display: flex;
        flex-direction: column;
        padding: 15px;
        gap:20px;
    }
    .footer-social-icons{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .footer-copyright{
        font-size: 18px;
        text-align: center;
    }
    
    .appdownload {
        text-align: center;
        padding: 20px;
        margin-top: 0px;
    }

    .appdownload-platform img {
        width: 100px;
        margin: 8px;
    }
    .filter-options {
    flex-wrap: nowrap; 
    overflow-x: auto; 
    padding: 10px;
  }

  .filter-card {
    flex: 0 0 auto; 
    width: 80px; 
  }

  .filter-card img {
    width: 45px;
    height: 45px; 
  }
}
 @media (max-width:440px) {
    .search-bar-main{
        max-width: 500px;
        font-size: 12px;
        padding: 5px;
    }
    .display-4 {
        font-size: 17px;
        font-weight: 400;
    }
    .lead{
        font-size: 12px;
        line-height: 1;
    }
    .form-select{
        font-size: 12px !important;
    }
    .carHeaderhr {
        margin: 20px 0px;
        height: 1px;  
    }
    .restaurant_no_content {
        font-size: 18px;
    }
    .footer-content-text{
        font-size: 16px;
    }
    .footer-content-right h2, .footer-content-center h2{
        font-size: 20px !important;
    }
  
    .logoImageContent{
        font-size: 24px;
    }
    .filter-card {
    width: 60px; 
  }

  .filter-card img {
    width: 30px;
    height: 30px; 
  }
  }
</style>

