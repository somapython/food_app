<template>
    <div class="teams-container">
        <SidebarWord />
        <div class="main-content">
            <div class="team-page">
                <div class="d-flex align-items-center justify-content-between">
                    <h2>Our Team</h2>
                    <button @click="showModal = true" class="add-employee-btn" >
                        <img  v-if="!isSubmitting" class="mright-5" src="../assets/dashboard/plus.png" 
                            alt="plus" loading="lazy"/> Add Employee
                    </button>
                </div>
                <div v-if="showModal" class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">Add New Employee</h3>
                            <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close"
                                @click.prevent="close('add')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <input v-model="newEmployee.name" placeholder="Name" required />
                        <input v-model="newEmployee.position" placeholder="Position" required />
                        <input v-model="newEmployee.department" placeholder="Department" required />
                        <input v-model="newEmployee.email" type="email" placeholder="Email" required />
                        <input v-model="newEmployee.phone" placeholder="Phone" required />
                        <input v-model="newEmployee.about" placeholder="About us (optional)" />
                        <input type="file" @change="onFileChange" />
                        <button @click="addEmployee" class="modalButton" :disabled="isSubmitting">
                            <img  v-if="!isSubmitting" class="mright-5" src="../assets/dashboard/plus.png" 
                                alt="plus" loading="lazy"/>
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            <span v-else>Add Employee</span>
                        </button>
                    </div>
                </div>
                <div v-if="viewProfileModal" class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <span class=mright-5>{{ selectedEmployee.name }}</span>
                                <span>( {{ selectedEmployee.position }})</span>
                            </h3>
                            <button type="button" class="close buttonClose" @click="close('view')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class='d-flex align-items-center justify-content-center mtop-5'>
                            <img :src="selectedEmployee.image || defaultImage" alt="Profile Image" class="employee-img" loading="lazy">
                        </div> 
                        <div class="cardData plr-20">
                            <span class="mr-10"><strong>Department :</strong></span>
                            <span>{{ selectedEmployee.department }}</span>
                        </div>
                        <div class="cardData plr-20">
                            <span class="mr-10"><strong>Email :</strong></span>
                            <span>{{ selectedEmployee.email }}</span>
                        </div>
                        <div class="cardData plr-20">
                            <span class="mr-10"><strong>Phone :</strong></span>
                            <span>{{ selectedEmployee.phone }}</span>
                        </div>
                        <div class="cardData plr-20">
                            <span class="mr-10"><strong>About:</strong></span>
                            <span> Some information about the employee, details, etc. More information can go here. </span>
                        </div>
                    </div>    
                </div>
                <div v-if="employees.length === 0" class="empty-state">
                    <p>No team members found. Add new employees to populate the team.</p>
                </div>
                <div class="team-cards-container">
                    <div class="team-card" v-for="(employee,index) in employees" :key="employee.id" :class="{ 'no-transform': isViewingProfile }">
                        <img :src="employee.image || defaultImage" alt="Employee Image" class="employee-img" loading="lazy">
                        <div class="cardData">
                            <span class="mr-10"><h3>{{ employee.name }}</h3></span>
                            <span class="d-flex align-items-center justify-content-center"><h5>( {{ employee.position }} )</h5></span>
                        </div>
                        <div class="cardData">
                            <span class="mr-10"><strong>Department :</strong></span>
                            <span>{{ employee.department }}</span>
                        </div>
                        <div class="cardData">
                            <span class="mr-10"><strong>Email :</strong></span>
                            <span>{{ employee.email }}</span>
                        </div>
                        <div class="cardData">
                            <span class="mr-10"><strong>Phone :</strong></span>
                            <span>{{ employee.phone }}</span>
                        </div>
                        <div class="d-flex align-items-center justify-content-between mt-50">
                            <button @click="viewProfile(employee)" :disabled="viewingId === employee.id" class="view-btn">
                                <img  v-if="viewingId !== employee.id" class="mright-5" 
                                      src="../assets/dashboard/view.png" alt="view" loading="lazy"/>
                                <span v-if="viewingId === employee.id" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                <span v-else>View Profile</span>
                            </button>
                            <button  @click="deleteEmployee(index, employee)" :disabled="deletingId === employee.id" class="delete-btn">
                                <img  v-if="deletingId !== employee.id" class="mright-5" 
                                      src="../assets/dashboard/delete.png" alt="delete"  loading="lazy"/>
                                <span v-if="deletingId === employee.id" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true">Deleting...</span>
                                <span v-else>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="showDeleteModal" class="modal-overlay">
                    <div class="modal-content">
                        <h3>Do you want to delete this employee?</h3>
                        <p><strong>Name:</strong> {{ employeeToDelete?.name }}</p>
                        <p><strong>Position:</strong> {{ employeeToDelete?.position }}</p>
                        <div class="modal-actions" >
                            <button @click="deleteConfirmed" class="modal-ok-btn">OK</button>
                            <button @click="cancelDelete" class="modal-cancel-btn">Cancel</button>
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
import SidebarWord from '../SidebarWord.vue';
import ToasterWord from '../ToasterWord.vue';
import CreateLogsWord from '../CreateLogsWord.vue';
import LoaderWord from '../LoaderWord.vue';
//   import axios from 'axios';

export default {
    name: 'TeamsWord',
    components: {
        ToasterWord,
        SidebarWord,
        CreateLogsWord,
        LoaderWord,
    },
    data() {
        return {
            showModal: false,
            viewProfileModal: false,
            isLoading: false,
            isSubmitting: false,
            viewingId: null,
            deletingId:null,
            showDeleteModal: false,
            employeeToDelete: null,
            employees: [
                        {
                            id: 1,
                            name: "Siddharth Kamble",
                            position: "Admin",
                            department: "Management",
                            email: "sidharth.kamble@gmail.com",
                            phone: "9852014512",
                            image: "https://randomuser.me/api/portraits/men/9.jpg"
                        },
                        {
                            id: 2,
                            name: "Niranjan Gavnd",
                            position: "Aachari",
                            department: "Hotel",
                            email: "Niranjan.g@gmail.com",
                            phone: "8752018502",
                            image: "https://randomuser.me/api/portraits/men/14.jpg"
                        },
                        {
                            id: 3,
                            name: "Kavya Ingale",
                            position: "Account",
                            department: "Hotel",
                            email: "account.kavya@gmail.com",
                            phone: "9876854105",
                            image: "https://randomuser.me/api/portraits/women/9.jpg"
                        },
                        {
                            id: 4,
                            name: "Prathmesh Kale",
                            position: "Owner",
                            department: "Hotel",
                            email: "prathmesh.kale@gmail.com",
                            phone: "9850136105",
                            image: "https://randomuser.me/api/portraits/men/6.jpg"
                        },
                    ],
            newEmployee: {id: null, name: "", position: "", department: "", email: "", phone: "", image: "", about: "",},
            selectedEmployee: null,
            defaultImage: "https://randomuser.me/api/portraits/men/1.jpg",
            isViewingProfile: false,
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
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.newEmployee.image = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    },
    addEmployee() {
        if (this.newEmployee.name && this.newEmployee.position && this.newEmployee.department && this.newEmployee.email && this.newEmployee.phone) {
            this.isSubmitting = true; 
            this.isLoading = true;
            setTimeout(() => { 
                const newId = this.employees.length ? this.employees[this.employees.length - 1].id + 1 : 1;
                this.newEmployee.id = newId;
                this.employees.push({ ...this.newEmployee });
                this.showToast('New Employee added successfully', 'success');
                this.showModal = false;
                this.resetForm(); 
                this.isSubmitting = false; 
                this.isLoading = false;
            }, 1000);
        } else {
            this.showToast('Please fill in all required fields.','error')
        }
    },
    deleteEmployee(index,employee) {
        this.employeeToDelete = { ...employee, index };
        this.showDeleteModal = true; 
    },
    deleteConfirmed() {
        const index = this.employeeToDelete.index;
        this.isLoading = true;
        setTimeout(() => { 
            this.employees.splice(index, 1);
            this.showToast('Employee deleted successfully', 'success');
            this.isLoading = false;
            this.cancelDelete();
        }, 1000);  
    },
    cancelDelete() {
        this.showDeleteModal = false; 
        this.employeeToDelete = null; 
    },
    resetForm() {
    this.newEmployee = {id: null, name: "", position: "", department: "", email: "", phone: "", image: "", about: "",};
    },
    close(type){
        if(type == 'add'){
            this.showModal = false; 
            this.resetForm();
        } else if(type == 'view'){
            this.isViewingProfile= false;
            this.viewProfileModal = false;
        }    
    },
    viewProfile(employee) {
        this.viewingId = employee.id; 
        this.isLoading = true;
        setTimeout(() => { 
            this.isLoading = false;
            this.isViewingProfile = true;
            this.selectedEmployee = employee;
            this.viewProfileModal = true;
            this.viewingId = null;     
        }, 500); 
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

.teams-container {
display: flex;
}

.main-content {
flex-grow: 1;
padding: 10px;

}

.team-page {
text-align: center;
max-width: 1200px;
margin: 0 auto;
padding: 10px;
}

.team-cards-container {
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 20px;
padding: 10px;
}

.team-card {
background-color: #e0f7fa; 
border: 1px solid #ddd;
border-radius: 10px;
padding: 20px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
align-items: center;
transition: transform 0.2s;
text-align: center;

}

.employee-img {
width: 100px;
height: 100px;
border-radius: 50%;
margin-bottom: 15px;
object-fit: cover;
}

.cardData {
margin: 5px 0;
text-align: start;
margin-bottom: 0.5rem !important; 
}

.mt-50 {
margin-top: 10px;
}

h2 {
font-size: 2em;
margin-bottom: 20px;
}

h5{
font-size: 18px;
font-weight: bold;
}

p{
margin-bottom: 0.5rem !important;
}

.mr-10{
margin-right: 10px;
}

.mright-5{
margin-right: 5px;
margin-bottom: 3px;
}

.mtop-5{
margin-top: 5px;
}

.plr-20{
padding: 0px 20px;
}
.add-employee-btn {
margin-bottom: 20px;
background-color: #42b983;
color: white;
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
}

.add-employee-btn:hover {
background-color: #38a770;
}

.team-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 20px;
}

.team-card:hover {
transform: translateY(-10px);
}

.no-transform {
transform: none !important;
}

button {
padding: 10px;
margin-top: 10px;
background-color: #42b983;
color: white;
border: none;
border-radius: 5px;
cursor: pointer;
}

button:hover {
background-color: #38a770;
}

.delete-btn {
background-color: red;
}

.delete-btn:hover {
background-color: darkred;
}

.modal-overlay {
position: fixed;
top: 50px;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
}

.about-us-section {
margin-top: 20px;
}

.about-us-content {
width: 100%;
height: 100px; 
max-width: 100%; 
background-color: #f2f2f2; 
border-radius: 8px;
padding: 10px;
overflow: auto; 
white-space: pre-wrap; 
word-wrap: break-word; 
}

.modal-content {
background-color: white;
padding: 20px;
border-radius: 10px;
width: 400px;
text-align: center;
}

input {
width: 90%;
padding: 5px;
margin: 10px 0;
border-radius: 5px;
border: 1px solid #ccc;
}

.close-btn {
background-color: #555;
}

.close-btn:hover {
background-color: #333;
}

.modal-header {
flex-shrink: 0;
padding:0.5rem 0.5rem !important;
}

.buttonClose {
border: none;
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

.modal-actions {
display: flex;
justify-content: space-around;
gap: 10px;
}

.modal-ok-btn {
background: green; 
color: #fff;
border: none;
padding: 10px 20px;
border-radius: 4px;
font-size: 14px;
cursor: pointer;
transition: background-color 0.3s;
}

.modal-ok-btn:hover {
background: darkgreen;
}

.modal-cancel-btn {
background:gray; 
color: #fff;
border: none;
padding: 10px 20px;
border-radius: 4px;
font-size: 14px;
cursor: pointer;
transition: background-color 0.3s;
}

.modal-cancel-btn:hover {
background: darkgray; 
}
input[type="text"],input[type="email"],input[type="file"] {
width: 100%;
margin: 10px 0;
padding: 8px;
border: 1px solid #ccc;
border-radius: 5px;
}

.spinner-border {
vertical-align: middle;
}

@media (max-width: 1040px) {
.team-cards-container {
grid-template-columns: repeat(2, 1fr);
}

h3 {
  font-size: 20px;
}

h5 {
  font-size: 18px;
}

.cardData {
  font-size: 14px;
}

.add-employee-btn {
  padding: 8px 16px;
  font-size: 14px;
  display: block;
  margin: 0px;
  width: 200px;
}

button {
  padding: 10px;
  font-size: 14px;
  margin: 0px;
  width: 140px;
}
}

@media (max-width: 768px) {
.main-content {
padding: 10px;
}

.team-cards-container {
grid-template-columns: repeat(1, 1fr);
}

h2 {
font-size: 1.5em;
text-align: center;
}

.add-employee-btn {
padding: 8px 16px;
font-size: 14px;
display: block;
margin: 0px;
width: 250px;
}

.team-cards-container {
flex-direction: column; 
align-items: center; 
gap: 15px; 
}

.employee-img {
width: 80px; 
height: 80px;
}

h3 {
font-size: 16px;
}

h5 {
font-size: 14px;
}

.cardData {
font-size: 14px;
}

button {
padding: 8px;
font-size: 14px;
margin: 0px;
width: 200px;
}

.buttonClose{
width:50px !important;
}

.modal-content {
width: 90%; 
padding: 15px;
}

.modalButton{
width: 100% !important;
}

input {
width: 100%; 
}

.about-us-content {
height: auto; 
max-height: 150px;
}
}

@media (max-width: 480px) {
h2 {
font-size: 1.2em;
}

.add-employee-btn {
font-size: 12px;
padding: 6px 12px;
width: 130px;
margin: 0px;
}

.employee-img {
width: 60px; 
height: 60px;
}

h3 {
font-size: 14px;
}

h5 {
font-size: 12px;
}

.cardData {
font-size: 12px;
}

button {
padding: 6px;
font-size: 12px;
width: 125px;
}

.buttonClose{
width:30px !important;
}

.modal-content {
padding: 10px;
}

.modalButton{
width: 100% !important;
}

input {
padding: 4px;
font-size: 12px;
}

.modal-ok-btn{
width: 60px;
padding: 5px;
font-size: 14px;
}

.modal-cancel-btn {
  width: 80px;
  padding: 5px;
  font-size: 14px;
}
}
</style>
