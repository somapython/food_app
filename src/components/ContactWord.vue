<template>
    <div class="contact-us-container">
        <div class="contact-info">
            <h1 class="animation"><img src="./assets/contact/contacts.png" alt='contacts_icon' loading="lazy"/>Contact Us</h1>
            <p>Not sure what you need? The team at Square Events will be happy to
                listen to you and suggest event ideas you hadn't considered.</p>
            <ul>
                <li class="animation"><img src="./assets/contact/message.png" alt='message_icon' loading="lazy"/> somnathbagale12@gmail.com</li>
                <li class="animation"><img src="./assets/contact/call.png" alt='call_icon' loading="lazy"/> (+91) 8459305176</li>     
            </ul>
        </div>
        <div class="contact-form">
            <h2>We'd love to hear from you!<br />Let's get in touch</h2>
                <div class="form-group">
                    <div class="input-container">
                      <img :class="['input-icon', { 'submitted': errors.fullName && isSubmitted }]" src="./assets/contact/user.png" alt='user_icon' loading="lazy"/>
                        <input v-model="fullName" type="text" placeholder="Full Name" required />
                        <span v-if="errors.fullName" class="error1">{{ errors.fullName }}</span>
                    </div>
                    <div class="input-container">
                        <img :class="['input-icon', { 'submitted': errors.fullName && isSubmitted }]" src="./assets/contact/restaurant.png" alt='restaurant_icon' loading="lazy"/>
                        <input v-model="restaurantName" type="text" placeholder="Restaurant Name" />
                    </div>
                </div>
                <div class="input-container">
                    <img :class="['input-icon', { 'submitted': errors.email && isSubmitted }]" src="./assets/contact/email.png" alt='email_icon' loading="lazy"/>
                    <input v-model="email" type="email" placeholder="Email" required/>
                    <span v-if="errors.email" class="error1">{{ errors.email }}</span>
                </div>
                <div class="input-container">
                    <img :class="['input-icon', { 'submitted': errors.phone && isSubmitted }]" src="./assets/contact/phone.png" alt='phone_icon' loading="lazy"/>
                    <input v-model="phone" type="text" placeholder="Phone Number" required />
                    <span v-if="errors.phone" class="error1">{{ errors.phone }}</span>
                </div>
                <div class="input-container">
                    <img class="input-icon" src="./assets/contact/location.png" alt='location_icon' loading="lazy"/>
                    <input v-model="address" type="text" placeholder="Address" />
                </div>
                <div class="input-container">
                    <!-- <i :class="['fas', 'fa-comment-dots', 'input-icon1', { 'submitted': isSubmitted }]"></i> -->
                    <img :class="['input-icon1', { 'submitted': isSubmitted }]" src="./assets/contact/chat.png" alt='chat_icon' loading="lazy"/>
                    <textarea v-model="message" placeholder="Type your message here"></textarea>
                </div>
                <button type="submit" class="btn-send" @click="submitForm" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <span class="d-flex align-items-center justify-content-center" v-else><img src="./assets/contact/send.png" alt='send_icon' class="send-btn-img" loading="lazy"/>Send Message</span>
                </button>
        </div>
    </div>
    <CreateLogsWord @logCreated="addLogToLogs" ref="createLogsComponent" />
    <ToasterWord ref="toaster" />
    <LoaderWord :loading="isLoading" />
</template>

<script>
import ToasterWord from './ToasterWord.vue';
import CreateLogsWord from './CreateLogsWord.vue';
import LoaderWord from './LoaderWord.vue';
import axios from 'axios';

  export default{
    name: 'ContactWord',
    components: {
    ToasterWord,
    CreateLogsWord,
    LoaderWord,
  },
    data(){
      return{
        fullName: '',
        restaurantName: '',
        email: '',
        phone: '',
        address: '',
        message: '',
        errors: {},
        isSubmitted: false,
        contactFormData:{},
        isLoading: false,
        isSubmitting: false,
      };
    },
    mounted(){
        this.toaster = this.$refs.toaster;
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
    },
    methods:{
    validateForm() {
      this.errors = {};
      let isValid = true;
      if (!this.fullName) {
        this.errors.fullName = "Full name is required.";
        isValid = false;
      }
      if (!this.email) {
        this.errors.email = "Email is required.";
      } else if (!this.validEmail(this.email)) {
        this.errors.email = "Invalid email format.";
        isValid = false;
      }
      if (!this.phone) {
        this.errors.phone = "Phone number is required.";
        isValid = false;
      }
      return isValid;
    },
    validEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async submitForm() {
        this.isLoading = true;
        this.isSubmitting = true;
      if (this.validateForm()) {
              try {
                const response = await axios.post('http://localhost:3000/auth/send-message', {
                        fullName: this.fullName,
                        restaurantName: this.restaurantName,
                        email: this.email,
                        phone: this.phone,
                        address: this.address,
                        message: this.message,
                  });
          
                this.contactFormData = response.data;
                this.$refs.createLogsComponent.createLog('Message send successfully','Admin', '');
            if (response.status === 200) {
                this.clearForm();
                this.showToast('Message sent successfully!', 'success');
                return
            } else {
                this. clearForm();
                this.showToast('Error sending message. Please try again later.', 'error');
                return
            }
          } catch (error) {
              this.$refs.createLogsComponent.createLog('Message failed','Admin', '');
              this.clearForm();
              this.showToast('An unexpected error occurred. Please try again later.', 'error');
              return
          }
          finally {
            setTimeout(() => {
              this.isSubmitting = false;
              this.isLoading = false;
            }, 1000);
          }
      }
        else{
          this.isSubmitted = true;
          setTimeout(() => {
            this.isSubmitting = false;
            this.isLoading = false;
          }, 1000);
          this.showToast('Please fill the form !', 'error');
          return
        }
    },
    clearForm() {
      this.fullName = '';
      this.restaurantName = '';
      this.email = '';
      this.phone = '';
      this.address = '';
      this.message = '';
    },
    addLogToLogs(log) {
      console.log(log)
    },
    showToast(msg, status) {
        if (this.toaster) {
            this.toaster.show(msg, status);
        } 
    },
    }
  }
</script>
<style scoped>
.contact-us-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background-color: #f9f9fb;
  font-family: 'Poppins', sans-serif;
  gap: 30px;
  margin-top:0px;
  flex-wrap: wrap;
}
.animation{
    transition: 0.5s;
}
.animation:hover{
    transform: scale(1.05);
}
.error1 {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}

.contact-info {
  flex: 1;
  background-color: #3f3068;
  padding: 40px;
  border-radius: 10px;
  color: white;
}

.contact-info h1 {
  font-size: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}
.contact-info h1 img {
  width: 48px;
  margin-right: 10px;
}

.contact-info p {
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 1.5;
  height: 310px;
}

.contact-info ul {
  list-style: none;
  padding: 0;
}

.contact-info ul li {
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.contact-info ul li i {
  margin-right: 12px;
  color: #ffdc62;
  font-size: 18px;
}
  .contact-info ul li img{
  margin-right: 12px;
  color: #ffdc62;
  font-size: 18px;
}

.contact-form {
  flex: 2;
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.contact-form h2 {
  font-size: 26px; 
  margin-bottom: 20px;
  color: #3f3068;
}

.form-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap; 
}

.form-group .input-container {
  position: relative;
  width: 48%;
}

.input-container {
  position: relative;
  margin-bottom: 15px;
}
.input-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}

.input-icon1{
  position: absolute;
  top: 25%;
  left: 12px;
  transform: translateY(-50%);
  color: #999;
  font-size: 16px;
}
.input-icon.submitted {
  top: 35%; 
}
.input-icon1.submitted{
  top:25%;
}
input[type='text'],
input[type='number'],
input[type='email'],
textarea {
  width: 100%;
  padding: 14px 14px 14px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

input:focus,
textarea:focus {
  border-color: #3f3068;
  box-shadow: 0 4px 10px rgba(63, 48, 104, 0.2);
}

textarea {
  height: 100px;
  resize: none;
}

.btn-send {
  background-color: #3f3068;
  color: white;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(63, 48, 104, 0.2);
  width: 100%; 
  margin-top: 10px;
}
.btn-send:hover {
  background-color: #5a35bb;
  box-shadow: 0 6px 20px rgba(63, 48, 104, 0.3);
}

.btn-send:active {
  transform: translateY(2px);
}

.send-btn-img{
  width: 18px;
  margin-right: 5px;

}
@media (max-width: 768px) {
  .contact-us-container {
    flex-direction: column;
    gap: 20px;
  }

  .contact-info {
    flex: 1;

  }
  .contact-form {
  flex: 2;
  width: 100%;
}

  .form-group {
    flex-direction: column;
    gap: 15px;
  }

  .form-group .input-container {  
    width: 100%;
}

  .btn-send {
    padding: 10px;
    font-size: 14px;
  }

  .contact-info h1 {
    font-size: 26px; 
  }

  .contact-info p {
    font-size: 12px;
    height: 100px;
  }

  .contact-info li {
    font-size: 14px;
  }

  input[type='text'],
  input[type='number'],
  input[type='email'],
  textarea {
    font-size: 12px; 
  }
}

@media (max-width: 480px) {
  .contact-info h1 {
    font-size: 18px; 
  }
  .contact-info {
    padding: 20px;
  }
  .contact-info ul li {
    font-size: 12px;
}
  .contact-info p {
    font-size: 12px;
    margin-bottom: 15px;
    height: 50px;  
  }
  .contact-form h2 {
    font-size: 20px;
  }
  .btn-send {
    padding: 8px;
    font-size: 12px;
  }
  .form-group .input-container {  
    width: 100%;
  }
}

</style>