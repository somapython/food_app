<template>
    <div class="cart-container dashboard">
        <SidebarWord />
        <div class="main-content">
            <header>
                <div class="user-info">
                    <h4 style="color: black;">Welcome, Somnath 👋</h4>
                </div>
            </header>
            <section class="overviewSection">
                <div class="overview">
                    <div class="card revenue align-items-center justify-content-between" style="background-color:#48d390">
                        <div class="d-flex align-items-center justify-content-center">
                            <img class="card_image" src="../assets/dashboard/revenue-growth.png" alt="today_revenue" loading="lazy"/>
                        </div>
                        <div class="overview_header">
                            <h4>₹ {{ todayRevenue }}</h4>
                            <p>Today's Revenue</p>
                        </div>  
                    </div>
                    <div class="card orders align-items-center justify-content-between" style="background-color:#d38be5">
                        <div class="d-flex align-items-center justify-content-center">
                            <img class="card_image" src="../assets/dashboard/package.png" alt="today_order" loading="lazy"/>
                        </div>
                        <div class="overview_header">
                            <h4>{{ todayOrders }}</h4>
                            <p>Today's Orders</p>   
                        </div>   
                    </div>
                    <div class="card expense align-items-center justify-content-between" style="background-color:#7881f6">
                        <div class="d-flex align-items-center justify-content-center">
                            <img class="card_image" src="../assets/dashboard/revenue.png" alt="today_order" loading="lazy"/>
                        </div>
                        <div class="overview_header">
                            <h4>₹ {{ monthRevenue }}</h4>
                            <p>Monthly Revenue</p> 
                        </div> 
                    </div>
                    <div class="card avg-revenue align-items-center justify-content-between" style="background-color:#fe735f">
                        <div class="d-flex align-items-center justify-content-center">
                            <img class="card_image" src="../assets/dashboard/order.png" alt="today_order" loading="lazy"/>
                        </div>
                        <div class="overview_header">
                            <h4>{{ monthOrders }}</h4>
                            <p>Monthly Orders</p> 
                        </div>
                    </div>
                </div>
            </section> 
            <section class="sales-chart">
                <div class="sales-details">
                    <h5>Sales Details</h5>
                    <div class="sales-pie-chart">
                        <canvas id="salesPieChart"></canvas>
                        <select v-model="selectedSalesPeriod" @change="updateSalesChart">
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>
                </div>
                <div class="order-chart">
                    <h5>Order Chart</h5>
                    <div class="chart">
                        <canvas id="orderBarChart"></canvas>
                        <select v-model="selectedOrderPeriod" @change="updateOrderChart">
                            <option value="monthly">Monthly</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                        </select>
                    </div>
                </div>
            </section>
            <section class="trending-orders">
                <div class="d-flex align-items-center justify-content-between" style="padding: 20px 5px 0px 20px;">
                    <h5>Trending Orders</h5>
                    <div class="controls">
                        <button  :disabled="currentIndex === 0 || paginatedOrders.length === 0" @click="prevSlideFunc" class="control-button" style="float: right;margin-left: -40px;margin-right: 50px;">&lt;</button>
                        <button :disabled="currentIndex >= totalSlides - 1 || paginatedOrders.length === 0" @click="nextSlideFunc" class="control-button" style="float: right;">&gt;</button>
                     </div>
                </div>
                <div class="slider-wrapper">
                    <div class="slider">
                        <div v-if="paginatedOrders.length === 0" class="no-data-card">
                            <p>No Data Found</p>
                        </div>          
                        <div class="order-card" v-for="(order, index) in paginatedOrders" :key="index" v-else>
                            <img :src="order.imgUrl" alt="Order" loading="lazy" class="order-image">
                            <div class="order-details">
                                <p class="order-paragraph">{{ order.name }}</p>
                                <span>Rs. {{ order.price }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>    
    </div>
    <CreateLogsWord @logCreated="addLogToLogs" ref="createLogsComponent" />
    <LoaderWord :loading="isLoading" />
    <ToasterWord ref="toaster" />
</template>

<script>

import SidebarWord from '../SidebarWord.vue';
import { Chart, registerables } from 'chart.js';
import ToasterWord from '../ToasterWord.vue';
import CreateLogsWord from '../CreateLogsWord.vue';
import LoaderWord from '../LoaderWord.vue';

export default {
    name: 'OrderWord',
    components: {
      SidebarWord,
      ToasterWord,
      CreateLogsWord,
      LoaderWord,
    },
  data() {
    return {
        isLoading: false,
        isSubmitting: false,
        todayRevenue: '',
        todayOrders: '',
        monthRevenue: '',
        monthOrders: '',
        salesPieChart: null,
        orderBarChart: null,
        selectedSalesPeriod: 'monthly', 
        selectedOrderPeriod: 'monthly', 
        orders: [
        { imgUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Chicken Veg Thali", price: 150 },
        { imgUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Anda Thali", price: 120 },
        { imgUrl: "https://images.unsplash.com/photo-1581291519195-ef11498d1cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Pizza", price: 80 },
        { imgUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Pasta", price: 110 },
        { imgUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Veg Thali", price: 80 },
        { imgUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Noodles", price: 150 },
        { imgUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",name: "Burger",price: 100 },
        { imgUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Dal Kichadi", price: 80 },
        { imgUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Pulav", price: 90 },
        { imgUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Mixed Salad", price: 120 },
        { imgUrl: "https://images.unsplash.com/photo-1581291519195-ef11498d1cf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Dal Bati", price: 150 },
        { imgUrl: "https://images.unsplash.com/photo-1529042410759-befb1204b468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200", name: "Sandwich", price: 70 },
      ],
      currentIndex: 0,
      itemsPerSlide: 3, 
    };
  },
  computed: {
    totalSlides() {
      return Math.ceil(this.orders.length / this.itemsPerSlide);
    },
    paginatedOrders() {
      const start = this.currentIndex * this.itemsPerSlide;
      const end = start + this.itemsPerSlide;
      return this.orders.slice(start, end);
    }
  },
  mounted() {
    this.toaster = this.$refs.toaster;
    this.fetchData();
    this.isLoading = true;
    setTimeout(() => {
        this.isLoading = false;
        Chart.register(...registerables);
        this.initSalesPieChart();
        this.initOrderBarChart();
    }, 2000);
    
  },
  methods: {
    fetchData(){
        this.todayRevenue = '11,256';
        this.todayOrders = '245';
        this.monthRevenue = '60,556';
        this.monthOrders = '4227';
    },
    initSalesPieChart() {
      const salesPieCtx = document.getElementById('salesPieChart').getContext('2d');
      this.salesPieChart = new Chart(salesPieCtx, {
        type: 'pie',
        data: {
          labels: ['Total Order', 'Running Order', 'Customer Growth', 'Total Revenue'],
          datasets: [{
            data: [35, 22, 26, 17], 
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, 
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
    },
    initOrderBarChart() {
        if (this.orderBarChart) {
            this.orderBarChart.destroy();  
        }

      const orderBarCtx = document.getElementById('orderBarChart').getContext('2d');
      this.orderBarChart = new Chart(orderBarCtx, {
        type: 'bar',
        data: {
          labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{
            label: 'Orders',
            data: [100, 150, 200, 265, 220, 180, 240], 
            backgroundColor: '#36A2EB'
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          layout: {
                padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
                }
            }
        }
      });
    },
    updateSalesChart() {
        this.isLoading = true;
        if (!this.salesPieChart) return;
      let newData;
      if (this.selectedSalesPeriod === 'monthly') {
        newData = [35, 22, 26, 17]; 
      } else if (this.selectedSalesPeriod === 'daily') {
        newData = [10, 5, 8, 2]; 
      } else if (this.selectedSalesPeriod === 'weekly') {
        newData = [70, 50, 60, 30]; 
      }
    
        this.salesPieChart.data.datasets[0].data = newData;
        setTimeout(()=>{
            this.isLoading = false;
        try {
            this.salesPieChart.update(); 
        } catch (error) {
            this.salesPieChart.destroy();
            this.initSalesPieChart();
        }
        },1000) 
    },
    updateOrderChart1() {
        if (!this.orderBarChart) {
            console.error('Order Bar Chart is not initialized.');
            return;
        }

      let newData;
        if (this.selectedOrderPeriod === 'monthly') {
            newData = [100, 150, 200, 265, 220, 180, 240]; 
        } else if (this.selectedOrderPeriod === 'daily') {
            newData = [20, 30, 40, 60, 50, 35, 45]; 
        } else if (this.selectedOrderPeriod === 'weekly') {
            newData = [400, 600, 800, 1060, 850, 720, 960]; 
        }

      this.orderBarChart.data.datasets[0].data = newData;
    setTimeout(() => {
            try {
                this.orderBarChart.update();
            } catch (error) {
            console.error('Error updating salesPieChart:', error);
            }
        }, 200);
    },
    updateOrderChart() {
        this.isLoading = true;
            if (!this.orderBarChart) {
                console.error('Order Bar Chart is not initialized.');
                return;
            } 
            let newData;
            switch (this.selectedOrderPeriod) {
                case 'monthly':
                newData = [100, 150, 200, 265, 220, 180, 240]; 
                break;
                case 'daily':
                newData = [20, 30, 40, 60, 50, 35, 45]; 
                break;
                case 'weekly':
                newData = [400, 600, 800, 1060, 850, 720, 960]; 
                break;
                default:
               // console.log('Unknown period selected');
                return;
            }
            const currentData = this.orderBarChart.data.datasets[0].data;
            setTimeout(()=>{
                this.isLoading = false;
                if (currentData.length !== newData.length || currentData.some((val, index) => val !== newData[index])) {
                        this.orderBarChart.data.datasets[0].data = newData;

                try {
                        this.orderBarChart.update();
                    } 
                catch (error) {
                    console.error('Error updating orderBarChart:', error);
                    }
                } 
            },1000) 
    },
    nextSlideFunc() {
      if (this.currentIndex < this.totalSlides - 1) {
        this.currentIndex+=1;
      }
    },
    prevSlideFunc() {
      if (this.currentIndex > 0) {
        this.currentIndex-=1;
      }
    },
    showToast(msg, status) {
        if (this.toaster) {
            this.toaster.show(msg, status);
        } 
    },
    addLogToLogs(log) {
      console.log('Log Created:', log);
    },
  },
};
</script>
<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; 
  font-family: 'Arial', sans-serif;
}

.cart-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  padding: 20px;

}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

header .user-info h4 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card {
  border-radius: 10px;
  padding: 10px;
  color: white;
  display: flex;
  flex-direction: row;
  text-align: end;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card_image {
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
}

.card h4 {
  margin: 0;
  font-size: 1.2em;
}

.card p {
  margin-top: 5px;
  font-size: 0.8em;
} 

.sales-chart {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 40px;
}

.sales-details, .order-chart {
  flex: 1 1 calc(50% - 10px);
  padding: 20px;
  border-radius: 10px;
  background-color: #edbcbc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.sales-details h5, .order-chart h5 {
  font-size: 1.2rem;
  margin-bottom: 15px;
}

canvas {
  width: 100% !important;
  height: 250px !important;
}

select {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  border-radius: 5px;

}

.trending-orders {
  margin-top: 20px;
  border: 1px solid #ef6262;
  border-radius: 10px;
  background-color: #ef6262;
  overflow: hidden;
}

.trending-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.orders-grid {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.slider-wrapper {
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
}

.slider {
  display: flex;
  transition: transform 0.5s ease;
  justify-content: space-around;
  width: calc(100% * 2); 
}

.order-card {
  width: 30%;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #4d4545;
  height:150px;
}

.order-paragraph{
  margin-bottom: 0px !important;
}
.order-image {
  width: 100%;
  height: 110px;
  border-bottom: 1px solid #ddd;
  border-radius: 8px 8px 0 0;
  object-fit: cover; 
}

.order-details {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 5px;
  text-align: center;
  color: lawngreen;
}

button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    font-size: 18px;
  }

  button:disabled {
    cursor: not-allowed;
  }

.no-data-card {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    background-color: #b1c5d9;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 30%;
    margin-bottom: 10px;
}

.no-data-card p {
    font-size: 18px;
    font-weight: 700;
    color: red;
    margin-bottom: 0px !important;
}

@media screen and (max-width: 768px) {
  .overview {
    grid-template-columns: 1fr; 
  }

  .sales-chart {
    flex-direction: column; 
  }

  .sales-details, 
  .order-chart {
    flex: 1 1 100%; 
    margin-bottom: 20px;
  }

  .order-card {
    flex: 0 0 calc(50% - 20px); 
  }
}

@media screen and (max-width: 576px) {
  header {
    flex-direction: column; 
    text-align: center;
  }

  .overview_header h4 {
    font-size: 1.2rem; 
  }

  .overview {
    gap: 10px; 
  }

  .sales-details, 
  .order-chart {
    padding: 15px; 
  }

  .order-card {
    flex: 0 0 calc(100% - 20px); 
  }

  .slider-wrapper {
    overflow-x: auto; 
  }

  .control-button {
    font-size: 0.9rem; 
    padding: 5px;
  }
}

@media screen and (min-width: 1200px) {
  .overview_header h4 {
    font-size: 2rem;
  }

  .order-card {
    flex: 0 0 calc(25% - 15px); 
  }
}
</style>
