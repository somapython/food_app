<template>
    <div class="orderList-container">
        <SidebarWord />
        <div class="main-content">
            <div class="section">
                <div class="order-header">
                    <h2 style="color: #27ae60;">New Orders</h2>
                    <div v-if="newOrders.length > 0" class="order-count">{{ newOrders.length }}</div>
                    <div v-else class="no-order-card">
                        <div class="no-order-message">
                            No new orders available
                        </div>
                    </div>
                </div>
                <table v-if="newOrders.length > 0" class="order-table new-orders">
                    <thead>
                        <tr>
                            <th>Bill No</th>
                            <th>Ordered By</th>
                            <th>Payment</th>
                            <th>Duration</th>
                            <th>Amount</th>
                            <th>Token No</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in newOrders" :key="order.id" class="order-card">
                            <td>
                                <div class="token-header">{{ order.billNo }}</div>
                                <div class="token-number">View Order</div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.orderedBy }}</div>
                                <div class="token-number">{{ order.address }}</div>
                            </td>
                            <td>
                                <div class="token-container">
                                    <div class="token-avatar1" :class="getPaymentClass(order.payment)">
                                        <img :src="getPaymentIcon(order.payment)" alt="Payment Icon" class="payment-icon" />
                                    </div>
                                    <div class="token-header">{{ order.payment}}</div>
                                </div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.duration }}</div>
                                <div class="token-number">{{ order.time }}</div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.amount }}</div>
                                <div :class="getPaymentStatusClass(order.paymentStatus)">{{ order.paymentStatus }}</div>
                            </td>
                            <td>
                                <div class="token-container">
                                    <div class="token-avatar">{{ order.quantity }}</div>
                                    <div class="token-header">{{ order.tokenNo}}</div>
                                </div>
                            </td>
                            <td>
                                <button class="action-btn" :class="order.btnStatus">{{ order.action }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="section">
                <div class="order-header">
                    <h2  style="color: #e67e22;">Preparing</h2>
                    <div v-if="preparingOrders.length > 0" class="order-count">{{ preparingOrders.length }}</div>
                    <div v-else class="no-order-card">
                        <div class="no-order-message">
                            No preparing orders available
                        </div>
                    </div>
                </div>
                <table v-if="preparingOrders.length > 0" class="order-table">
                    <thead>
                        <tr>
                            <th>Bill No</th>
                            <th>Ordered By</th>
                            <th>Payment</th>     
                            <th>Duration</th>
                            <th>Amount</th>
                            <th>Token No</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in preparingOrders" :key="order.id" class="order-card">
                            <td> 
                                <div class="token-header">{{ order.billNo }}</div>
                                <div class="token-number">View Order</div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.orderedBy }}</div>
                                <div class="token-number">{{ order.address }}</div>
                            </td>
                            <td>
                                <div class="token-container">
                                    <div class="token-avatar1" :class="getPaymentClass(order.payment)">
                                        <img :src="getPaymentIcon(order.payment)" alt="Payment Icon" class="payment-icon" />
                                    </div>
                                    <div class="token-header">{{ order.payment}}</div>
                                </div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.duration }}</div>
                                <div class="token-number">{{ order.time }}</div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.amount }}</div>
                                <div :class="getPaymentStatusClass(order.paymentStatus)">{{ order.paymentStatus }}</div>
                            </td>
                            <td>
                                <div class="token-container">
                                    <div class="token-avatar">{{ order.quantity }}</div>
                                    <div class="token-header">{{ order.tokenNo}}</div>
                                </div>
                            </td>
                            <td>
                                <button class="action-btn" :class="order.btnStatus">{{ order.action }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="section">
                <div class="order-header">
                    <h2 style="color: red;">Ready for Delivery</h2>
                    <div v-if="readyOrders.length > 0" class="order-count">{{ readyOrders.length }}</div>
                    <div v-else class="no-order-card">
                        <div class="no-order-message">
                            No ready orders available
                        </div>
                    </div>
                </div>
                <table v-if="readyOrders.length > 0" class="order-table">
                    <thead>
                        <tr>
                            <th>Bill No</th>
                            <th>Ordered By</th>
                            <th>Payment</th>               
                            <th>Duration</th>
                            <th>Amount</th>
                            <th>Token No</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in readyOrders" :key="order.id" class="order-card">
                            <td> 
                                <div class="token-header">{{ order.billNo }}</div>
                                <div class="token-number">View Order</div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.orderedBy }}</div>
                                <div class="token-number">{{ order.address }}</div>
                            </td>
                            <td>
                                <div class="token-container">
                                    <div class="token-avatar1" :class="getPaymentClass(order.payment)">
                                        <img :src="getPaymentIcon(order.payment)" alt="Payment Icon" class="payment-icon" />
                                    </div>
                                    <div class="token-header">{{ order.payment}}</div>
                                </div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.duration }}</div>
                                <div class="token-number">{{ order.time }}</div>
                            </td>
                            <td>
                                <div class="token-header">{{ order.amount }}</div>
                                <div :class="getPaymentStatusClass(order.paymentStatus)">{{ order.paymentStatus }}</div>
                            </td>
                            <td>
                                <div class="token-container">
                                    <div class="token-avatar">{{ order.quantity }}</div>
                                    <div class="token-header">{{ order.tokenNo}}</div>
                                </div>
                            </td>
                            <td>
                                <button class="action-btn" :class="order.btnStatus">{{ order.action }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
  
  export default {
    name: 'OrderListWord',
    components: {
      SidebarWord,
      ToasterWord,
      CreateLogsWord,
      LoaderWord,
    },
    data() {
      return {
        orders:[
        {
          id: "1",
          status: 'New Orders',
          billNo: 978656,
          tokenNo: 123,
          quantity: 5,
          payment: 'UPI',
          orderedBy: 'Omkar K',
          address: 'Solapur',
          duration: '00:30:00',
          time: '02:30 PM',
          amount: '₹ 259',
          paymentStatus: 'Paid',
          action: 'View',
          btnStatus: 'New',
        },
        {
          id: "2",
          status: 'Preparing',
          billNo: 888656,
          tokenNo: 123,
          quantity: 10,
          payment: 'COD',
          orderedBy: 'Samantha',
          address: 'Kolhapur',
          duration: '00:30:00',
          time: '02:30 PM',
          amount: '₹ 255',
          paymentStatus: 'Pending',
          action: 'Ready',
          btnStatus: 'Preparing',
        },
        {
          id: "3",
          status: 'Ready for Delivery',
          billNo: 543216,
          tokenNo: 123,
          quantity: 8,
          payment: 'Card',
          orderedBy: 'Changie Hugins',
          address: 'Pune',
          duration: '00:30:00',
          time: '02:30 PM',
          amount: '₹ 2509',
          paymentStatus: 'Cancelled',
          action: '0.5km away',
          btnStatus: 'Ready',
        },
        {
          id: "4",
          status: 'Preparing',
          billNo: 898657,
          tokenNo: 124,
          quantity: 7,
          payment: 'Net Banking',
          orderedBy: 'Anna Smith',
          address: 'PCMC',
          duration: '00:35:00',
          time: '02:30 PM',
          amount: '₹ 305',
          paymentStatus: 'Paid',
          action: 'Ready',
          btnStatus: 'Preparing'
        },
        {
          id: "5",
          status: 'New Orders',
          billNo: 878657,
          tokenNo: 124,
          quantity: 7,
          payment: 'Net Banking',
          orderedBy: 'Somnath',
          address: 'PCMC',
          duration: '00:35:00',
          time: '02:30 PM',
          amount: '₹ 305',
          paymentStatus: 'Paid',
          action: 'View',
          btnStatus: 'New Orders'
        },
        {
          id: "6",
          status: 'Preparing',
          billNo: 342874,
          tokenNo: 567,
          quantity: 3,
          payment: 'COD',
          orderedBy: 'Mohan Kumar',
          address: 'Mumbai',
          duration: '00:40:00',
          time: '01:30 PM',
          amount: '₹ 459',
          paymentStatus: 'Paid',
          action: 'Ready',
          btnStatus: 'Preparing'
        },
        {
          id: "7",
          status: 'Preparing',
          billNo: 975643,
          tokenNo: 789,
          quantity: 1,
          payment: 'Card',
          orderedBy: 'Priya Sharma',
          address: 'Thane',
          duration: '00:25:00',
          time: '11:00 AM',
          amount: '₹ 100',
          paymentStatus: 'Paid',
          action: 'Ready',
          btnStatus: 'Preparing'
        },
        {
          id: "8",
          status: 'New Orders',
          billNo: 234876,
          tokenNo: 345,
          quantity: 4,
          payment: 'UPI',
          orderedBy: 'Rajesh Mehta',
          address: 'Ahmedabad',
          duration: '00:20:00',
          time: '12:15 PM',
          amount: '₹ 345',
          paymentStatus: 'Pending',
          action: 'View',
          btnStatus: 'New'
        },
        {
          id: "9",
          status: 'Ready for Delivery',
          billNo: 654321,
          tokenNo: 678,
          quantity: 6,
          payment: 'Net Banking',
          orderedBy: 'Aman Gupta',
          address: 'Nagpur',
          duration: '00:50:00',
          time: '03:00 PM',
          amount: '₹ 675',
          paymentStatus: 'Paid',
          action: '1.0km away',
          btnStatus: 'Ready'
        },
        {
          id: "10",
          status: 'Preparing',
          billNo: 452876,
          tokenNo: 890,
          quantity: 8,
          payment: 'Card',
          orderedBy: 'Reena Dsouza',
          address: 'Hyderabad',
          duration: '00:45:00',
          time: '02:45 PM',
          amount: '₹ 900',
          paymentStatus: 'Pending',
          action: 'Ready',
          btnStatus: 'Preparing'
        },
        {
          id: "11",
          status: 'Preparing',
          billNo: 109876,
          tokenNo: 112,
          quantity: 2,
          payment: 'COD',
          orderedBy: 'Sameer Patel',
          address: 'Vadodara',
          duration: '00:10:00',
          time: '04:15 PM',
          amount: '₹ 220',
          paymentStatus: 'Pending',
          action: 'Ready',
          btnStatus: 'Preparing'
        },
        {
          id: "12",
          status: 'New Orders',
          billNo: 675421,
          tokenNo: 334,
          quantity: 9,
          payment: 'UPI',
          orderedBy: 'Kavita Jadhav',
          address: 'Lonavala',
          duration: '00:35:00',
          time: '05:00 PM',
          amount: '₹ 870',
          paymentStatus: 'Paid',
          action: 'View',
          btnStatus: 'New'
        },
        {
          id: "13",
          status: 'New Orders',
          billNo: 980123,
          tokenNo: 456,
          quantity: 3,
          payment: 'COD',
          orderedBy: 'Tarun Singh',
          address: 'Delhi',
          duration: '00:15:00',
          time: '11:45 AM',
          amount: '₹ 300',
          paymentStatus: 'Pending',
          action: 'View',
          btnStatus: 'New'
        },
        {
          id: "14",
          status: 'Preparing',
          billNo: 786543,
          tokenNo: 567,
          quantity: 5,
          payment: 'Net Banking',
          orderedBy: 'Rohit Das',
          address: 'Chennai',
          duration: '00:20:00',
          time: '01:45 PM',
          amount: '₹ 450',
          paymentStatus: 'Pending',
          action: 'Ready',
          btnStatus: 'Preparing'
        },
        {
          id: "15",
          status: 'Ready for Delivery',
          billNo: 123456,
          tokenNo: 789,
          quantity: 4,
          payment: 'Card',
          orderedBy: 'Ankit Rana',
          address: 'Bangalore',
          duration: '00:25:00',
          time: '03:30 PM',
          amount: '₹ 520',
          paymentStatus: 'Paid',
          action: '2.5km away',
          btnStatus: 'Ready'
        },
        ],
        orders1: [
          {
            id: "1",
            status: 'New Orders',
            billNo: 878656,
            tokenNo: 123,
            quantity: 5,
            payment: 'UPI',
            orderedBy: 'Somnath',
            address: 'Solapur',
            duration: '00:30:00',
            time: '02:30 PM',
            amount: '₹ 259',
            paymentStatus: 'Paid',
            action: 'View',
            btnStatus: 'New',
          },
          {
            id: "2",
            status: 'Preparing',
            billNo: 878656,
            tokenNo: 123,
            quantity: 10,
            payment: 'COD',
            orderedBy: 'Samantha',
            address: 'Kolhapur',
            duration: '00:30:00',
            time: '02:30 PM',
            amount: '₹ 255',
            paymentStatus: 'Pending',
            action: 'Ready',
            btnStatus: 'Preparing',
          },
          {
            id: "3",
            status: 'Ready for Delivery',
            billNo: 543216,
            tokenNo: 123,
            quantity: 8,
            payment: 'Card',
            orderedBy: 'Changie Hugins',
            address: 'Pune',
            duration: '00:30:00',
            time: '02:30 PM',
            amount: '₹ 2509',
            paymentStatus: 'Cancelled',
            action: '0.5km away',
             btnStatus: 'Ready',
          },
          {
            id: "4",
            status: 'Preparing',
            billNo: 878657,
            tokenNo: 124,
            quantity: 7,
            payment: 'Net Banking',
            orderedBy: 'Anna Smith',
            address: 'PCMC',
            duration: '00:35:00',
            time: '02:30 PM',
            amount: '₹ 305',
            paymentStatus: 'Paid',
            action: 'Ready',
             btnStatus: 'Preparing'
          },
          {
            id: "5",
            status: 'New Orders',
            billNo: 878657,
            tokenNo: 124,
            quantity: 7,
            payment: 'Net Banking',
            orderedBy: 'Somnath',
            address: 'PCMC',
            duration: '00:35:00',
            time: '02:30 PM',
            amount: '₹ 305',
            paymentStatus: 'Paid',
            action: 'View',
             btnStatus: 'New Orders'
          }
        ],
        isLoading: false,
        isSubmitting: false,
      };
    },
    computed: {
      newOrders() {
        return this.orders.filter(order => order.status === 'New Orders');
      },
      preparingOrders() {
        return this.orders.filter(order => order.status === 'Preparing');
      },
      readyOrders() {
        return this.orders.filter(order => order.status === 'Ready for Delivery');
      },
    },
    mounted() {
      this.toaster = this.$refs.toaster;
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    methods: {
      showToast(msg, status) {
        if (this.$refs.toaster) {
          this.$refs.toaster.show(msg, status);
        }
      },
      getPaymentStatusClass(status) {
        switch (status) {
            case 'Paid':
            return 'status-paid';
            case 'Pending':
            return 'status-pending';
            case 'Cancelled':
            return 'status-cancelled';
            default:
            return '';
        }
    },
    getPaymentIcon(payment) {
    switch (payment) {
      case 'UPI':
        return '/assets/dashboard/upi.png';  
      case 'Card':
        return '/assets/dashboard/card.png';  
      case 'Net Banking':
        return '/assets/dashboard/banking-1.png'; 
      case 'COD':
        return '/assets/dashboard/cod.png';  
      default:
        return '/assets/dashboard/default.png';  
    }
  },
  getPaymentClass(payment) {
    switch (payment) {
      case 'UPI':
        return 'upi-bg'; 
      case 'Card':
        return 'card-bg';
      case 'Net Banking':
        return 'netbank-bg'; 
      case 'COD':
        return 'cod-bg'; 
      default:
        return 'default-bg'; 
    }
  },
  addLogToLogs(log) {
      // Optionally, handle the log when it's created (for Vuex store or local usage)
      console.log('Log Created:', log);
    },
    },
  };
  </script>
  
  <style scoped>
 /* General Styles */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.orderList-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  padding: 10px;
  background-color: #f2f2f2;
  overflow-y: auto;
}

/* Section Styles */
.section {
  margin-bottom: 20px;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-count {
  background-color: #3909f9;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.no-order-card {
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.no-order-message {
  font-size: 18px;
  font-style: italic;
  color: #7f8c8d;
}

/* Table Styles */
.order-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.order-table th,
.order-table td {
  padding: 12px;
  text-align: left;
  width: 14.28%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-table th {
  color: white;
  background-color: #8b07c1d1;
}

.order-card {
  background-color: white;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Token Styles */
.token-header {
  font-weight: bold;
}

.token-number {
  font-size: 12px;
  color: gray;
}

.token-container {
  display: flex;
  align-items: center;
}

.token-avatar {
  background-color: #ffe004;
  color: black;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
}

.payment-icon {
  width: 25px;  
  height: auto;
}

.token-avatar1 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.upi-bg { background-color: #27ae60; }
.card-bg { background-color: #3498db; }
.netbank-bg { background-color: #f39c12; }
.cod-bg { background-color: #8e44ad; }

/* Status Colors */
.status-paid {
  color: #27ae60;
  font-weight: bold;
}

.status-pending {
  color: #e67e22;
  font-weight: bold;
}

.status-cancelled {
  color: red;
  font-weight: bold;
}

/* Button Styles */
.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.action-btn.New { background-color: #27ae60; }
.action-btn.Preparing { background-color: #e67e22; }
.action-btn.Ready { background-color: red; }

/* Responsive Styles */
@media (max-width: 768px) {
  .order-table th,
  .order-table td {
    font-size: 12px;
    padding: 8px;
  }

  h2 {
    font-size: 18px;
  }

  .order-count {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .token-avatar,
  .token-avatar1 {
    width: 30px;
    height: 30px;
  }

  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }

  .token-number {
    font-size: 10px;
    color: gray;
}

.payment-icon {
  width: 20px;  
  height: auto;
}
}

@media (max-width: 480px) {
  .main-content {
    padding: 5px;
  }

  h2 {
    font-size: 16px;
  }

  .order-table th,
  .order-table td {
    font-size: 10px;
  }

  .order-count {
    width: 25px;
    height: 25px;
    font-size: 10px;
  }

  .payment-icon {
  width: 16px; 
  height: auto;
}

.token-avatar,
  .token-avatar1 {
    width: 25px;
    height: 25px;
  }

  .action-btn {
    font-size: 10px;
    padding: 4px 8px;
  }

  .token-number {
    font-size: 8px;
    color: gray;
}
}

  </style>
  