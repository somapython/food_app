<template>
    <div class="logs-container">
        <SidebarWord />
        <div class="main-content">
            <div class="logs-container1">
                <div class="ptb-20">    
                    <div class="date-filter search-bar">
                        <h3>Logs</h3>
                        <date-picker v-model:value="dateRange" range :default-value="[threeMonthsAgo, currentDate]"
                              :disabled-date="disabledFutureDates"  @change="validateDateRange" :editable="false"  format="DD/MM/YYYY HH:mm:ss"
                              value-format="YYYY-MM-DD HH:mm:ss" :clearable="false" />
                        <div class="search-actions-first">
                            <input type="text" v-model="searchQuery" placeholder="Search logs..." @input="filterLogs" style="font-size: 20px;"/>
                            <button @click="toggleSortOrder" class="d-flex align-items-center">
                                <span class="sortText">Sort</span> 
                                <img :src="sortOrder === 'asc' ? sortDesc : sortAsc" alt="sort_icon" class="image_icon" loading="lazy"/>
                            </button>
                            <button @click="showFilterModal">
                                <img src="../assets/dashboard/filter.png" alt='filter_icon' class="image_icon" loading="lazy"/>
                            </button>
                        </div>
                        <div class="search-actions-second" >
                            <button class="d-flex align-items-center filterIconsLowerScreen" :disabled="isSubmitting" @click="toggleSortOrder">
                                <img v-if="isSubmittingSort" :src="sortOrder === 'asc' ? sortDesc : sortAsc" alt="sort_icon" class="image_icon" loading="lazy"/>
                                <span v-if="isSubmittingSort">Sort</span>
                                <span v-else class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            </button> 
                            <button @click="showFilterModal">
                                <img src="../assets/dashboard/filter.png" alt='filter_icon' class="image_icon" loading="lazy"/>
                            </button>
                        </div>
                    </div>
                    <div class="search-bar-second">
                        <input type="text" v-model="searchQuery" placeholder="Search logs..." @input="filterLogs" style="font-size: 16px;"/>
                    </div>
                </div>
                <div class="logs-table-wrapper">
                    <table class="logs-table">
                        <thead>
                            <tr>
                                <th>SR No.</th>
                                <th>User</th> 
                                <th>Description</th>
                                <th>Event</th>
                                <th>Device</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="filteredLogs.length==0">
                                <td colspan="6" class="no-data">No Data Found</td>
                            </tr>
                            <tr v-for="(log,index) in paginatedLogs" :key="log.id" v-else>
                                <td>{{ currentPage * pageSize + index + 1 }}</td>
                                <td class="text-truncate-user">{{ log.user }}</td>
                                <td class="text-truncate-description">{{ log.description }}</td> 
                                <td>{{ log.event }}</td>
                                <td>{{ log.device }}</td>
                                <td>{{ formatDateTime(log.time) }}</td>       
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination"  v-if="filteredLogs.length > 0 ">
                    <button @click="changePage(-1)" :disabled="currentPage === 0">
                        <span v-if="isSubmittingPrev" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Previous</span>
                    </button>
                    <span>Page {{ currentPage + 1 }} of {{ totalPages }}</span>
                    <button @click="changePage(1)" :disabled="currentPage === totalPages - 1">
                        <span v-if="isSubmittingNext" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Next</span>
                    </button>
                </div>
                <div v-if="isFilterModalVisible" class="modal-overlay">                        
                    <div class="modal-content">
                        <h4 class="mb-10"><img src="../assets/dashboard/filter.png" alt='filter_icon' class="image1_icon" loading="lazy"/>Filter Events</h4>
                        <div class="subTitle">
                            <h6><img src="../assets/dashboard/list-1.png" alt='event_icon' class="event_icon" loading="lazy"/>Event Type</h6>
                            <div class="select-all">
                                <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
                                <label>Select All</label>
                            </div>
                        </div>
                        <div class="eventList">
                            <div v-for="event in availableEvents" :key="event" class="checkboxFilter">
                                <input type="checkbox" v-model="selectedEvents" :value="event"  @change="updateSelectedEvents"/> {{ event }}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button @click="applyFilters" :disabled="isSubmittingApply">
                                <span v-if="isSubmittingApply" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                <span v-else>Apply</span>
                            </button>
                        </div>          
                    </div>
                </div>
            </div>
        </div>
    </div>
  <ToasterWord ref="toaster" />
  <LoaderWord :loading="isLoading" />
  <CreateLogsWord ref="createLogs" @logCreated="handleNewLog"/>
</template>
<script>   
import SidebarWord from '../SidebarWord.vue';
import ToasterWord from '../ToasterWord.vue';
import CreateLogsWord from '../CreateLogsWord.vue';
import DatePicker from 'vue-datepicker-next';
import LoaderWord from '../LoaderWord.vue';
import 'vue-datepicker-next/index.css';
import sortAsc from '../assets/dashboard/sort-asc.png';
import sortDesc from '../assets/dashboard/sort-desc.png';
// import axios from 'axios';

export default {
  name: 'LogsWord',
  components: {
    ToasterWord,
    CreateLogsWord,
    SidebarWord,
    DatePicker,
    LoaderWord,
  },
  data() {
      const currentDate = new Date();
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      return {
              logs: [
                  { id: 1, time: '2024-10-20 10:30:00', event: 'Login', device: 'PC', user: 'Alice', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 2, time: '2024-10-20 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', description: 'User logged out successfully. User attempted to log in with incorrect credentials.' },
                  { id: 3, time: '2024-10-21 09:45:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 4, time: '2024-10-19 10:20:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 5, time: '2024-10-20 11:30:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully. User attempted to log in with incorrect credentials.' },
                  { id: 6, time: '2024-10-21 09:15:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 7, time: '2024-10-18 10:30:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 8, time: '2024-10-17 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully.' },
                  { id: 9, time: '2024-10-21 09:00:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 10, time: '2024-10-22 10:30:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully.' },
                  { id: 11, time: '2024-10-10 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully.' },
                  { id: 12, time: '2024-10-21 12:45:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 13, time: '2024-11-10 10:20:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 14, time: '2024-11-20 11:30:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully. User attempted to log in with incorrect credentials.' },
                  { id: 15, time: '2024-11-21 09:15:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 16, time: '2024-11-18 10:30:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 17, time: '2024-11-17 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully.' },
                  { id: 18, time: '2024-11-18 10:30:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 19, time: '2024-11-17 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully.' },
                  { id: 20, time: '2024-11-21 09:00:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 21, time: '2024-11-22 10:30:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully.' },
                  { id: 22, time: '2024-11-10 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully.' },
                  { id: 23, time: '2024-11-21 12:45:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 24, time: '2024-11-11 10:20:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 25, time: '2024-11-21 11:30:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully. User attempted to log in with incorrect credentials.' },
                  { id: 26, time: '2024-11-22 09:15:00', event: 'Failed Login', device: 'Tablet', user: 'Charlie', status: 'Failed', description: 'User attempted to log in with incorrect credentials.' },
                  { id: 27, time: '2024-11-19 10:30:00', event: 'Login', device: 'PC', user: 'Alice', status: 'Success', description: 'User logged in successfully. User attempted to log in with incorrect credentials.' },
                  { id: 28, time: '2024-11-18 11:00:00', event: 'Logout', device: 'Mobile', user: 'Bob', status: 'Success', description: 'User logged out successfully.' },
              ],
          filteredLogs: [],
          dateRange: [threeMonthsAgo, currentDate],
          searchQuery: '',
          sortAsc,
          sortDesc,
          sortOrder: 'asc',
          currentPage: 0,
          totalPages: 0,
          pageSize: 7, 
          isFilterModalVisible: false,
          isAllSelected: true,
          availableEvents: ['Login', 'Logout', 'Signup','Failed Login'],
          selectedEvents: [],
          paginatedLogs: [],
          filteredEvents: [],
          currentDate,
          threeMonthsAgo,
          isLoading: false,
          isSubmitting: false,
          isSubmittingSort: true,
          isSubmittingApply: false,
          isSubmittingPrev: false,
          isSubmittingNext: false,
          isSubmittingDate: false,
      };
  },
  computed: {
   
  },
  mounted() {
      this.toaster = this.$refs.toaster;
      this.isLoading = true;
      this.filteredLogs = [...this.logs];
      setTimeout(() => {
          this.isLoading = false;
          this.sortLogs();
          this.paginateLogs();
          this.selectedEvents = [...this.availableEvents];
    } , 2000);     
  },
  methods: { 
    showToast(msg, status) {
        if (this.$refs.toaster) {
          this.$refs.toaster.show(msg, status);
        }
      },
      formatDateTime(time) {
          return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          }).format(new Date(time));
      },
      validateDateRange() {
          const [startDate, endDate] = this.dateRange;
          const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

          if (diffInDays > 90) {
              this.showToast('Please select a date range within 3 months.', 'error');
              this.dateRange = [this.threeMonthsAgo, this.currentDate];
          } else {
            this.isLoading = true;
              this.isSubmittingDate = true;
              setTimeout(()=>{
                this.isLoading = false;
                this.isSubmittingDate = false;
                this.filterLogsByDate();
              },1000) 
          }
      },
      filterLogsByDate() {
          const [startDate, endDate] = this.dateRange;
          this.filteredLogs = this.logs.filter(log => {
              const logDate = new Date(log.time);
              return logDate >= startDate && logDate <= endDate;
          });
      },
      filterLogs() {
          this.filteredLogs = this.logs;
          let filtered =  this.filteredLogs;
          if (this.searchQuery && this.searchQuery.length >= 3) {
            this.isLoading = true;
            this.isSubmitting = true;
            setTimeout(() => {
                this.isLoading = false;
                this.isSubmitting = false;
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(log => {
                    return (
                        log.user.toLowerCase().includes(query) ||
                        log.event.toLowerCase().includes(query) ||
                        log.device.toLowerCase().includes(query) ||
                        log.description.toLowerCase().includes(query)
                    );
                });
                this.filteredLogs = filtered; 
                this.currentPage = 0; 
                this.sortLogs(); 
                this.paginateLogs();
            }, 500);
          } else if (this.searchQuery && this.searchQuery.length < 3) {
              this.showToast('Minimum 3 characters required', 'warning');
              return;
          }
          if (this.selectedEvents.length > 0) {
              this.createLog("Login", "Mobile Device", 1);
              filtered = filtered.filter(log => this.selectedEvents.includes(log.event));
              this.filteredLogs = filtered; 
              this.currentPage = 0; 
              this.sortLogs(); 
              this.paginateLogs();
          }
      },
      toggleSortOrder() {
              this.isLoading = true;
              this.isSubmittingSort = false;
              setTimeout(()=>{
                this.isLoading = false;
                this.isSubmittingSort = true;
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                this.sortLogs(); 
              },1000)       
      },
      sortLogs() {
          this.filteredLogs.sort((a, b) => {
              const dateA = new Date(a.time);
              const dateB = new Date(b.time);
             return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
          });
          this.paginateLogs();
      },
      showFilterModal() {
          if (this.selectedEvents.length === 0) {
              this.selectedEvents = [...this.availableEvents];  
          }
          this.isFilterModalVisible = true;
      },
      closeFilterModal() {
          this.isFilterModalVisible = false;
      },
      applyFilters() {
          if (this.selectedEvents.length > 0) {
              this.isLoading = true;
              this.isSubmittingApply = true;
              setTimeout(()=>{
                this.isLoading = false;
                this.isSubmittingApply = false;
                this.closeFilterModal();
                this.filterLogs();
              },1000)
              
          } else {
              this.filteredEvents = []; 
              this.showToast('Please select atleast one filter event','error');
              return
          }
      },
      disabledFutureDates(date) {
          return date > this.currentDate;
      },
      createLog(event,device,id) {
          this.$refs.createLogs.createLog(event,device,id); 
      },
      handleNewLog(newLog) {
          this.filteredLogs.push(newLog); 
          this.logs.push(newLog); 
          this.paginateLogs();
      },
      changePage(direction) {
        if(direction == "-1"){
          this.isSubmittingPrev = true;
        }else{
          this.isSubmittingNext = true;
        }
        this.isLoading = true;
        setTimeout(()=>{
          this.isLoading = false;
          this.isSubmittingPrev = false;
          this.isSubmittingNext = false;
          this.currentPage += direction;
          this.paginateLogs();
        },1000)
      },
      paginateLogs() {
          const start = this.currentPage * this.pageSize;
          this.paginatedLogs = this.filteredLogs.slice(start, start + this.pageSize);
          this.totalPages= Math.ceil(this.filteredLogs.length / this.pageSize); 
      },
      toggleSelectAll() {
          if (this.isAllSelected) {
              this.selectedEvents = [];
              this.isAllSelected = false;
          } else {
              this.selectedEvents = [...this.availableEvents];
              this.isAllSelected = true;
          }    
      },
       updateSelectedEvents() {
          this.isAllSelected = this.availableEvents.every(event => this.selectedEvents.includes(event));
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

.logs-container {
display: flex;
height: 100vh;
overflow: hidden;
background-color: #f5f5f5;
}

.main-content {
flex-grow: 1;
padding: 10px;
overflow-y: auto;
background-color: #ffffff;
border-left: 1px solid #ddd;
transition: margin-left 0.3s ease, width 0.3s ease;

}

.logs-container1 {
display: flex;
flex-direction: column;
gap: 10px;
}

.ptb-20 {
padding: 10px 0;
}

.date-filter {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1.0rem;
}

.date-filter h3 {
font-size: 24px;
font-weight: bold;
margin: 0;
}

.subTitle{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0px 10px;
}

.mb-10{
  margin-bottom: 10px;
}

.mr-10{
  margin-right: 10px;
}

.logs-header h3 {
font-size: 1.5rem;
margin-bottom: 1rem;
}

.no-data {
text-align: center;
padding: 20px;
font-size: 16px;
color: #666;
font-weight: bold;
}

.image_icon{
  width: 18px;
  height: auto;
}

.image1_icon{
  width: 16px;
  height: auto;
  margin-bottom: 5px;
  margin-right: 5px;
}

.event_icon{
width:14px;
margin-right: 10px;
}

.mx-datepicker-range {
  width: 420px;
}

.mx-input{
  font-size: 20px !important;
}
.date-filter {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 1.0rem;
}

.search-actions-first {
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.search-actions-second{
display: none;
}

.search-actions-first input {
  margin-left: auto; 
}

.search-bar {
  gap: 10px;
}

.search-bar-second{
display: none;
}

.sortText{
margin-right: 5px;
}

.logs-table-wrapper {
overflow-x: auto;
border: 1px solid #a79f9f;
border-radius: 5px;
margin: 0px 15px;
}

.eventList{
  border: 1px solid #a79f9f;
  border-radius: 5px;
}
.logs-table {
width: 100%;
border-collapse: collapse;
margin-bottom: 20px;
}

.logs-table th, .logs-table td {
padding: 12px;
text-align: left;
border-bottom: 1px solid #ddd;
}

.logs-table th {
background-color: #f4f4f4;
font-weight: bold;
}

.text-truncate-description {
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
display: block; 
width:250px;
}

.text-truncate-user{
white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;

}

.modal-content {
background: white;
padding: 20px;
border-radius: 5px;
display: flex;
width: 400px;
}

.select-all {
display: flex;
align-items: center;
font-size: 20px;
}

.select-all input {
margin-right: 10px;
}

.checkboxFilter {
  padding: 0px 20px 10px 20px;
}

.checkboxFilter input {
margin-right: 10px; 

}

.modal-footer {
display: flex;
justify-content: flex-end; 
border: none !important;
}

.modal-footer button {
padding: 8px 15px;
background-color: #4CAF50; 
color: white; 
border: none;
border-radius: 4px;
cursor: pointer;
}

.modal-footer button:hover {
background-color: #45a049;
}

.date-filter h3 {
font-weight: bold;
margin-right: 10px;
}
.pagination {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-top: 10px; 
}

.pagination button {
  padding: 10px 15px; 
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc; 
  cursor: not-allowed;
}

@media (max-width: 1078px) {
.text-truncate-description {
width:330px;
}
.sortText{
font-size: 14px;
margin-right: 5px;
}

.sortText img{
width: 14px;
}

.search-actions-first input {
  width: 100%;
}

.search-actions-second{
  display: none;
}

.search-bar-second{
display: none;
}

.logs-table-wrapper {
  margin-top: 15px;
}

.text-truncate-user{
  max-width: 80px;
}
}

@media (max-width: 986px) {
.text-truncate-description {
  width:200px;
}

.search-actions-first input {
  width: 100%;
}

.search-actions-second{
  display: none;
}

.search-bar-second{
display: none;
}

.text-truncate-user{
  max-width: 70px;
}

.logs-table-wrapper {
  margin-top: 0px;
  margin: 0px 10px;
  font-size: 14px;
}

.logs-table th{
  padding: 10px;
}
}

@media (max-width: 768px) {
.ptb-20{
  padding: 0px;
}

.date-filter h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.mx-input-wrapper{
width: 300px !important;
}

.text-truncate-user{
  max-width: 50px;
}

.mx-input{
font-size: 12px;
}

.text-truncate-description {
 width: 140px;
}

.image_icon{
width: 16px;
}

.search-actions-first{
  display: none;
}

.search-actions-second{
  display: flex;
  flex-direction: row;
}

.search-bar-second{
display: flex;
align-items: center;
justify-content: center;
width: 100%;
gap: 10px;
font-size: 18px;
}

.date-filter{
display: flex;
justify-content: space-around;
}

.filterIconsLowerScreen{
margin-right: 10px;
}
.mx-datepicker-range {
  width: 270px;
}

.logs-table-wrapper{
  margin: 0;
}
.search-bar {
  gap:0px;
}
.logs-table th,
.logs-table td {
  font-size: 12px;
  padding: 8px;
}

.pagination button {
  font-size: 12px;
  padding: 8px 10px;
}

.modal-content {
  padding: 15px;
}
}

@media (max-width: 468px) {
.date-filter {
  gap: 10px;
}

.date-filter h3 {
  font-size: 18px;
}

.search-bar {
  width: 100%;
}

.filterIconsLowerScreen {
  margin-right: 5px;
}

.text-truncate-user{
  max-width: 40px;
}

.search-actions-first{
  display: none;
}

.search-actions-second{
  display: flex;
  flex-direction: row;
}

.search-bar-second{
display: flex;
align-items: center;
justify-content: center;
width: 100%;
gap: 10px;
font-size: 18px;
}

.logs-table-wrapper {
  margin: 5px 0;
  font-size: 10px;
}

.logs-table th,
.logs-table td {
  font-size: 10px;
  padding: 5px;
}

.text-truncate-description {
  width: 150px;
  font-size: 12px;
  height: 41px;
}

.pagination {
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.pagination button {
  font-size: 12px;
  padding: 6px 8px;
  width: 100%;
}

.modal-content {
  width: 90%;
  padding: 10px;
}

.modal-content h4 {
  font-size: 18px;
}

.checkboxFilter {
  font-size: 12px;
}

.select-all {
  font-size: 12px;
}

.mx-datepicker-range {
  width: 100%;
}

.mx-input {
  font-size: 12px !important;
}

.logs-container1 {
  gap: 10px;
}

.ptb-20 {
  padding: 10px 0;
}

.logs-table th {
  font-size: 14px;
  padding: 8px;
}

.search-bar input {
  width: 100%;
  font-size: 14px;
}

.modal-footer button {
  font-size: 12px;
  padding: 5px 10px;
}
}
</style>