<template>
    <div class="download-container">
        <SidebarWord />
        <div class="main-content">
            <div class="dashboard">
                <h2>Download Overview</h2>
                <div class="card-container">
                    <div class="card" v-for="card in dashboardCards" :key="card.id">
                        <div class="card-icon">
                            <img :src="card.image" :alt="card.title" loading="lazy"/>
                        </div>
                        <div class="card-details">
                            <h3>{{ card.title }}</h3>
                            <p>{{ card.value }}</p>
                        </div>
                        <div class="card-details1">
                            <p class="card-details1-value1">{{ card.value1 }}</p>
                        </div>
                        <button :disabled="isSubmitting[card.id]" @click="downloadData(card.id)">
                            <span v-if="isSubmitting[card.id]" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            <span v-else>Download {{ card.title }}</span>
                        </button>
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
  import SidebarWord from '../SidebarWord.vue';
  import ToasterWord from '../ToasterWord.vue';
  import CreateLogsWord from '../CreateLogsWord.vue';
  import LoaderWord from '../LoaderWord.vue';
  import axios from 'axios';
  
  export default {
    name: 'DownloadWord',
    components: {
      ToasterWord,
      SidebarWord,
      CreateLogsWord,
      LoaderWord,
    },
    data() {
      return {
        isLoading: false,
        isSubmitting: {},
        dashboardCards: [
        { 
            id:"messages",
            title: "Messages", 
            value: "150 Messages", 
            image: "/assets/download/email.png",
            value1: "150",
        },
        { 
            id:"monthly_orders",
            title: "Monthly Orders", 
            value: "1,500 Orders",
            image: "/assets/download/orders.png",
            value1: "1500",
        },
        { 
            id:"monthly_revenue",
            title: "Monthly Revenue", 
            value: "₹ 12,500 Revenue",
            image: "/assets/download/chart.png",
            value1: "₹ 12,500",
        },
        { 
            id:"daily_orders",
            title: "Daily Orders", 
            value: "45 Orders",
            image: "/assets/download/orders_daily.png",
            value1: "45", 
        },
        { 
            id:"daily_revenue",
            title: "Daily Revenue", 
            value: "₹ 500 Revenue",
            image: "/assets/download/coins.png",
            value1: "₹ 500", 
        },
        { 
            id:"attendance",
            title: "Attendance Logs", 
            value: "100% Attendance", 
            image: "/assets/download/calender.png",
            value1: "100%", 
        },
        { 
            id:"salary",
            title: "Employee Salary", 
            value: "₹ 50,000 Paid",
            image: "/assets/download/rupee.png",
            value1: "₹ 50,000",  
        },
        { 
            id: "customer_feedback",
            title: "Customer Feedback", 
            value: "200 Feedbacks", 
            image: "/assets/download/feedback.png",
            value1: "200",
        },
        { 
            id: "pending_payments",
            title: "Pending Payments", 
            value: "₹ 15,000 Pending",
            image: "/assets/download/pending.png",
            value1: "₹ 15,000",
        },
        { 
            id: "delivery_performance",
            title: "Delivery Performance", 
            value: "98% On-Time Deliveries",
            image: "/assets/download/delivery.png",
            value1: "98%",
        },
      ]
      };
    },
    mounted() {
      this.toaster = this.$refs.toaster;
      this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
        }, 2000);
    },
    methods: {
        async downloadData(id) {
            this.isSubmitting[id] = true;
            if(id == 'messages'){
                try {
                    const response = await axios.get('http://localhost:3000/auth/download-csv', {
                        responseType: 'blob', 
                    });
                    const blob = new Blob([response.data], { type: 'text/csv' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'contact_messages.csv';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(()=>{
                        this.isSubmitting[id] = false;
                    },500)
                    this.showToast('Messages downloaded Successfully!', 'success');
                    return
                } catch (error) {
                    console.error('Error downloading CSV:', error);
                    setTimeout(()=>{
                        this.isSubmitting[id] = false;
                    },500)
                    this.showToast('Error downloading CSV', 'error');
                    return
                }
                  
            }else if(id == 'monthly'){
                console.log("1111")
                setTimeout(()=>{
                    this.isSubmitting[id] = false;
                    this.showToast('Monthly Orders downloaded Successfully!', 'success');
                },500)

            }else if(id == 'daily'){
                setTimeout(()=>{
                    this.isSubmitting[id] = false;
                    this.showToast('Daily Orders downloaded Successfully!', 'success');
                },500)
            }else if(id == 'attendance'){
                setTimeout(()=>{
                    this.isSubmitting[id] = false;
                    this.showToast('Attendance Logs downloaded Successfully!', 'success');
                },500)
            }else if(id == 'salary'){
                setTimeout(()=>{
                    this.isSubmitting[id] = false;
                    this.showToast('Salary CSV downloaded Successfully!', 'success');
                },500)
            }
    },
      showToast(msg, status) {
          if (this.$refs.toaster) {
            this.$refs.toaster.show(msg, status);
          }
        },
    }
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

.download-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
}
  
.card-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;
    box-sizing: border-box;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
  width: 100%; 
  max-width: 300px; 
  margin: 10px;
}

.card:hover {
  transform: translateY(-10px);
}

.card-icon {
  font-size: 40px;
  color: #42b983;
  margin-bottom: 10px;
}

.card-details {
  margin-bottom: 15px;
}

.card-details1{
    display: none;
}

h2{
  text-align: center;
}

h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

p {
  font-size: 14px;
  color: #555;
}

button {
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #38a770;
}

@media (max-width: 768px) {
  .card {
    width: 90%;
    margin: 10px auto; 
  }

  .card-icon {
    font-size: 30px; 
  }

  .card-details1{
    display: none;
}

  h3 {
    font-size: 16px; 
  }

  p {
    font-size: 12px; 
  }

  button {
    font-size: 12px; 
    padding: 8px; 
  }
}
@media (max-width: 468px) {
  .card-container {
    flex-direction: column; 
    align-items: center; 
    margin-top: 10px;
  }

  .main-content {
    padding: 10px 20px;
}

  .card1 {
    width: 100%; 
    max-width: 100%; 
    margin: 10px 0; 
    padding: 15px; 
  }

  .card {
    display: flex;
    flex-direction: row; 
    align-items: center; 
    width: 90%; 
    margin: 5px 0; 
    padding: 10px; 
    box-sizing: border-box;
    justify-content: space-between;
  }

  .card-icon {
    margin-bottom: 10px; 
  }

  .card-icon img{
    width: 40px;
  }

  .card-details {
    display: none;
  }

  .card-details1{
    display: flex;
  }

  h2{
    text-align: center;
    font-size: 22px;
  }

  p{
    margin-bottom: 0px;
  }

  .card-details1-value1{
    border: 1px solid #0b0bf7;
    border: 1px solid #38a770;
    border-radius: 50%;
    height: 60px;
    width: 60px;
    align-items: center;
    justify-content: center;
    display: flex;
    background-color: #38a770;
    color: white;
  }

  button {
    font-size: 12px; 
    width: 120px; 
  }
}
  </style>
  