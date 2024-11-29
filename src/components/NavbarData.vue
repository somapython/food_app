<template>
    <div class="backdrop" :class="{ show: togglerActive }" @click="closeNavbar"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container d-flex align-items-center justify-content-between">
            <router-link class="navbar-brand" to="/">
                <img src="./assets/home/logo.png" alt="FoodApp Logo" style="height: 40px;" loading="lazy">
            </router-link>
            <button class="navbar-toggler" type="button" @click="toggleNavbar" :class="{ active: togglerActive }">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div :class="{'collapse navbar-collapse': true, show: !isNavCollapsed}" id="navbarNav">
                <ul class="navbar-nav mx-auto justify-content-center">
                    <li class="nav-item" :class="{ active: $route.path === '/' }">
                        <router-link class="nav-link navbar-text" to="/" @click="closeNavbar"><img src="./assets/home/home.png" alt='home_icon' class="input-icon" v-if="!isNavCollapsed" loading ="lazy"/>Home</router-link>
                    </li>
                    <li class="nav-item" :class="{ active: $route.path === '/admin' }">
                        <router-link class="nav-link navbar-text" to="/admin" @click="closeNavbar"><img src="./assets/home/admin.png" alt='admin_icon' class="input-icon" v-if="!isNavCollapsed" loading ="lazy"/>Admin</router-link>
                    </li>
                    <li class="nav-item" :class="{ active: $route.path === '/dashboard' }">
                        <router-link class="nav-link navbar-text" to="/dashboard" @click="closeNavbar"><img src="./assets/home/dashboard.png" alt='dashboard_icon' class="input-icon" v-if="!isNavCollapsed" loading ="lazy"/>Dashboard</router-link>
                    </li>
                    <li class="nav-item" :class="{ active: $route.path === '/contact' }">
                        <router-link class="nav-link navbar-text" to="/contact" @click="closeNavbar"><img src="./assets/home/contact.png" alt='contact_icon' class="input-icon" v-if="!isNavCollapsed" loading ="lazy"/>Contact Us</router-link>
                    </li>
                </ul>
            </div>
            <div class="d-flex align-items-center">
                <router-link to="/cart" class="nav-link">
                    <img src="./assets/home/shopping-cart.png" alt="Cart" width="32" class="mr-3">
                </router-link>
                <div v-if="isLoggedIn" class="position-relative">
                    <img  :src="loginForm.profileImage" alt="Profile" class="profile-icon" 
                        id="profileIcon" @click="openProfile()" width="40" 
                        style="cursor:pointer;border-radius: 50px; margin-left: 15px;" loading="lazy">
                    <div v-if="isDropdownOpen" class="dropdown-content position-absolute" style="top: 50px; right: 0;">
                        <a href="#" @click.prevent="selectOption('username')"><img src="./assets/home/changeProf.png" alt='changeProf_icon' class="input-icon-dropdown" loading="lazy"/>Change Profile</a>
                        <a href="#" @click.prevent="selectOption('changePassword')"><img src="./assets/home/changePass.png" alt='changePass_icon' class="input-icon-dropdown" loading="lazy"/>Change Password</a>
                        <a href="#" @click.prevent="selectOption('logout')"><img src="./assets/home/logout.png" alt='logout_icon' class="input-icon-dropdown" loading="lazy"/>Logout</a>
                    </div>
                </div>
                <button v-else class="btn btn-primary ml-3" type="button" 
                        id="navbarLoginButton" @click="openModal('login')">
                    <span>Login</span> 
                </button>
            </div>
        </div>
    </nav>
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true"
        ref="loginModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="loginModalLabel"><img src="./assets/home/login.png" alt='login_icon' class="input-icon1" loading="lazy"/>Login</h5>
                    <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close"
                        @click.prevent="closeModal('login')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email address <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="loginEmail" placeholder="Enter email" v-model="loginForm.email" required>
                            <div class="invalid-feedback">
                                Please enter a valid email address.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password<span class="text-danger">*</span></label>
                            <input type="password" class="form-control" id="loginPassword" placeholder="Enter Password" v-model="loginForm.password"
                                required minlength="6">
                            <div class="invalid-feedback">
                                Password must be at least 6 characters long.
                            </div>
                        </div>
                        <div class="form-group">
                            <a class="forgot-button" href="#" @click.prevent="forgotPassword()">Forgot Password?</a>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="loginButton" :disabled="isSubmitting">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Login</span>
                    </button>
                    <p class="mb-0">Don't have an account? <a href="#" @click.prevent="openModal('signup')">Sign Up</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="signupModal" tabindex="-1" aria-labelledby="signupModalLabel" aria-hidden="true"
        ref="signupModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="signupModalLabel"><img src="./assets/home/signup.png" alt='signup_icon' class="input-icon1" loading="lazy"/>Sign Up</h5>
                    <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close"
                        @click.prevent="closeModal('signup')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="signupForm">
                        <div class="form-group">
                            <label for="signupFirstName">First Name<span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="signupFirstName" placeholder="Enter First Name"
                                v-model="signupForm.firstname" required>
                            <div class="invalid-feedback">
                                 Please enter First name.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="signupLastName">Last Name<span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="signupLastName" placeholder="Enter Last Name"
                                v-model="signupForm.lastname" required>
                            <div class="invalid-feedback">
                                 Please enter Last name.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email address<span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="signupEmail" placeholder="Enter email"
                                v-model="signupForm.email" required>
                            <div class="invalid-feedback">
                                Please enter a valid email address.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password<span class="text-danger">*</span></label>
                            <input type="password" class="form-control" id="signupPassword" placeholder="Password"
                                v-model="signupForm.password" required minlength="6">
                            <div class="invalid-feedback">
                                Password must be at least 6 characters long.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="signupMobile">Mobile No<span class="text-danger">*</span></label>
                            <input type="number" class="form-control" id="signupMobile" placeholder="Enter mobile no."
                                v-model="signupForm.mobile" required minlength="10">
                            <div class="invalid-feedback">
                                 Please enter a valid Mobile number.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="signupPhoto">Upload Photo</label>
                            <input type="file" class="form-control" id="signupPhoto" @change="onFileChange('signup')"
                                accept="image/*">
                        </div>
                    </form>
                    </div>
                    <div class="modal-footer justify-content-end">
                        <button type="submit" class="btn btn-primary" id="signupButton" :disabled="isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            <span v-else>Sign Up</span>
                        </button>
                        <p class="mb-0">Already have an account? <a href="#" @click.prevent="openModal('login')">Login</a></p>
                    </div> 
            </div>
        </div>
    </div>
    <div class="modal fade" id="changePassModal" tabindex="-1" aria-labelledby="changePassModalLabel" aria-hidden="true"
        ref="changePassModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changePassLabel"><img src="./assets/home/changePassword.png" alt='changePassword_icon' class="input-icon1" loading="lazy"/>Change Password</h5>
                    <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close"
                        @click.prevent="closeModal('changePass')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="changePassForm">
                        <div class="form-group">
                            <label for="changePassEmail">Email address<span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="changePassEmail" placeholder="Enter email" v-model="changePass.email"
                              disabled>
                        </div>
                        <div class="form-group" v-if="requiresOldPassword">
                            <label for="changePassOldPassword">Old Password<span class="text-danger">*</span></label>
                            <input type="password" class="form-control" id="changePassOldPassword"
                                placeholder="Please enter Old Password" required minlength="6" v-model="changePass.oldPass">
                            <div class="invalid-feedback">
                                Password must be at least 6 characters long.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="changePassNewPassword">New Password<span class="text-danger">*</span></label>
                            <input type="password" class="form-control" id="changePassNewPassword"
                                placeholder="Please enter New Password" required minlength="6" v-model="changePass.newPass">
                            <div class="invalid-feedback">
                                Password must be at least 6 characters long.
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-end">
                    <button type="submit" class="btn btn-primary" id="changePassUpdateButton" :disabled="isSubmitting" @click="openModal('changePass')">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Update</span>
                    </button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting" id="changePassCloseButton"
                        @click.prevent="closeModal('changePass')">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Close</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="changeProfileModal" tabindex="-1" aria-labelledby="changeProfileModalLabel"
        aria-hidden="true" ref="changeProfileModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changeProfileModalLabel"><img src="./assets/home/profile.png" alt='profile_icon' class="input-icon1" loading="lazy"/>Profile</h5>
                    <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close"
                        @click.prevent="closeModal('changeProfile')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="changeProfileForm">
                        <div class="form-group">
                            <label for="changeProfileFirstName">First Name<span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="changeProfileFirstName"
                                placeholder="Enter First Name" v-model="currentUser.firstname" required>
                            <div class="invalid-feedback">
                                Please enter First name.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="changeProfileLastName">Last Name<span class="text-danger">*</span></label>
                            <input type="text" class="form-control" id="changeProfileLastName"
                                placeholder="Enter Last Name" v-model="currentUser.lastname" required>
                            <div class="invalid-feedback">
                                Please enter Last name.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="changeProfileEmail">Email address<span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="changeProfileEmail" placeholder="Enter email" v-model="currentUser.email"
                                disabled>
                        </div>
                        <div class="form-group">
                            <div class="changeProfilePhotoDiv">
                                <label class="changeProfilePhotoLabel" for="changeProfilePhoto">Upload Photo</label>
                                <input type="file" class="form-control changeProfilePhotoInput"
                                    id="changeProfilePhoto" @change="onFileChange('changeProfile')">
                            </div>
                             <img v-if="currentUser.profileImage" :src="currentUser.profileImage" alt="Profile Image" width="100" loading="lazy">
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-end">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting" id="changeProfileUpdateButton"
                    @click="openModal('changeProfileupdate')">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Update</span>
                    </button>
                    <button type="submit" class="btn btn-secondary" :disabled="isSubmitting" id="changeProfileCloseButton"
                    @click.prevent="closeModal('changeProfile')">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Close</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="forgotPassModal" tabindex="-1" aria-labelledby="forgotPassModalLabel" aria-hidden="true"
        ref="forgotPassModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="forgotPassModalLabel"><img src="./assets/home/forgotPassword.png" alt='forgotPassword_icon' class="input-icon1" loading="lazy"/>Forgot Password</h5>
                    <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close"
                        @click.prevent="closeModal('forgotPass')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="forgotPassForm">
                        <div class="form-group">
                            <label for="forgotPassEmail">Email address<span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="forgotPassEmail" placeholder="Enter email"
                                disabled v-model="forgotPass.email">
                            <div class="invalid-feedback">
                                Please enter a valid email address.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="forgotPassNumber">Mobile No<span class="text-danger">*</span></label>
                            <input type="number" class="form-control" id="forgotPassMobile"
                                placeholder="Enter mobile no." minlength="10" disabled v-model="forgotPass.mobile">
                            <div class="invalid-feedback">
                                Please enter a valid Mobile number.
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="forgotPassOTP">OTP<span class="text-danger">*</span></label>
                            <input type="number" class="form-control" id="forgotPassOTP" placeholder="Enter OTP."
                                required v-model="forgotPass.otp">
                            <div class="invalid-feedback">
                                Please enter a valid OTP.
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer justify-content-end">
                    <button type="submit" class="btn btn-success" :disabled="isSubmitting" id="forgotPassUpdateButton"
                    @click="openModal('forgotPass')">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Verify OTP</span>
                    </button>
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting" id="forgotPassCloseButton"
                    @click.prevent="closeModal('forgotPass')">
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <span v-else>Close</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal fade" id="otpModal" tabindex="-1" aria-labelledby="otpModalLabel" aria-hidden="true" ref="otpModal">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title modalHeader" id="loginModalLabel"><img src="./assets/home/otp.png" alt='otp_icon' class="input-icon1" loading="lazy"/>OTP Verification</h5>
              <button type="button" class="close buttonClose" data-dismiss="modal" aria-label="Close" @click.prevent="closeModal('otp')">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p class="modalParagraph" v-if="isOtpSend"> OTP Send Successfully to {{ loginForm.email }} </p>
              <p class="modalParagraph1" v-else> OTP Send Failed please retry after sometimes.</p>
            </div>
            <div class="modal-footer">
                <button type="submit" class="btn btn-success" :disabled="isSubmitting" id="addedSuccessButton" @click.prevent="closeModal('otp')">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span v-else>OK</span>
                </button>
            </div>
          </div>
        </div>
      </div>
    <ToasterWord ref="toaster" />
</template>

<script>
import { Modal } from 'bootstrap';
import ToasterWord from './ToasterWord.vue';
import axios from 'axios';

export default {
    components: {
        ToasterWord,
    },
    data() {
        return {
            isNavCollapsed: true,
            togglerActive: false,
            isSubmitting: false,
            loginModal: null,
            signupModal: null,
            changePassModal: null,
            changeProfileModal: null,
            forgotPassModal: null,
            toaster: null,
            isLoggedIn: false,
            isDropdownOpen: false,
            modal: null,
            modalInstance: null,
            modalChangePass: null,
            modalchangeProfileModal: null,
            modalforgotPassModal: null,
            loginFormId: null,
            loginButtonId: null,
            signupFormId: null,
            signupButtonId: null,
            navbarLoginButtonText: null,
            profileIcon: null,
            changeButtonFormId: null,
            changeProfileFormId: null,
            forgotPassFormId: null,
            loginForm: { email: '', password: '', firstname: '', lastname: '', profileImage: '' },
            signupForm: { firstname: '', lastname: '', email: '', password: '',mobile: ''},
            profileImage: null,
            defaultImage: require('./assets/user_latest.png'),
            signupFormData: {},
            currentUser: { firstname: '', lastname: '', email:'', profileImage: '' },
            selectedFile: null,
            changePass:{ email: '', oldPass: '', newPass: ''},
            changePassData: {}, 
            forgotPass:{ email:'', mobile:'',otp:'',},
            otpModal: null,
            isOtpSend:false,
            orgotPassData: {},
            requiresOldPassword: true,
        };
    },
    mounted() {
        this.modal = new Modal(this.$refs.loginModal);
        this.modalInstance = new Modal(this.$refs.signupModal);
        this.modalChangePass = new Modal(this.$refs.changePassModal);
        this.modalchangeProfileModal = new Modal(this.$refs.changeProfileModal);
        this.modalforgotPassModal = new Modal(this.$refs.forgotPassModal);
        this.otpModal = new Modal(this.$refs.otpModal);
        this.toaster = this.$refs.toaster;

        this.loginFormId = document.getElementById('loginForm');
        this.loginButtonId = document.getElementById('loginButton');
        this.signupFormId = document.getElementById('signupForm');
        this.signupButtonId = document.getElementById('signupButton');
        this.changeButtonFormId = document.getElementById('changePassForm');
        this.changeProfileFormId = document.getElementById('changeProfileForm');
        this.forgotPassFormId = document.getElementById('forgotPassForm');
        this.profileIcon = document.getElementById('profileIcon');
        this.navbarLoginButtonText = document.getElementById('navbarLoginButton');
    },
    methods: {
        toggleNavbar() {
            this.isNavCollapsed = !this.isNavCollapsed;
            this.togglerActive = !this.togglerActive;
        },
        closeNavbar() {
            this.isNavCollapsed = true;
            this.togglerActive = false;
        },
        openModal(modalType) {
            if (modalType === 'login') {
                this.loginForm = {};
                this.handleFormErrors("firstTime",this.loginFormId);
                this.modal.show();
                this.modalInstance.hide();  
                this.loginButtonId.removeEventListener('click', this.loginButtonHandler);
                this.loginButtonHandler = (event) => {
                event.preventDefault();
                this.clearInvalidClasses(this.loginFormId);
                if (this.loginFormId.checkValidity()) {
                    this.submitSignupForm('login');
                } else {
                    this.handleFormErrors("error", this.loginFormId);
                    this.showToast('Please do form validation!', 'error');
                }
            };
            this.loginButtonId.addEventListener('click', this.loginButtonHandler);
            } else if (modalType === 'signup') {
                this.signupForm = {};
                this.profileImage = '';
                this.handleFormErrors("firstTime",this.signupFormId);
                this.modalInstance.show();
                this.modal.hide();
                this.signupButtonId.removeEventListener('click', this.signupButtonHandler);
                this.signupButtonHandler = (event) => {
                event.preventDefault();
                this.clearInvalidClasses(this.signupFormId);
                if (this.signupFormId.checkValidity()) {
                    this.submitSignupForm('signup');
                } else {
                    this.handleFormErrors("error", this.signupFormId);
                    this.showToast('Please do form validation!', 'error');
                }
            };
            this.signupButtonId.addEventListener('click', this.signupButtonHandler);
            } else if (modalType === 'changePass') {
                this.handleFormErrors("firstTime",this.changeButtonFormId);
                this.clearInvalidClasses(this.changeButtonFormId);
                if (this.changeButtonFormId.checkValidity()) {
                    this.submitSignupForm('changePass');
                } else {
                    this.handleFormErrors("error",this.changeButtonFormId);
                    this.showToast('Please do form validation!', 'error');
                }
            } else if (modalType === 'changeProfileupdate') {
                this.clearInvalidClasses(this.changeProfileFormId);
                if (this.changeProfileFormId.checkValidity()) {
                        this.submitSignupForm('changeProfileupdate');
                } else {
                    this.handleFormErrors("error",this.changeProfileFormId);
                    this.showToast('Please do form validation!', 'error');
                }
            } else if (modalType === 'forgotPass') {
                this.clearInvalidClasses(this.forgotPassFormId);
                if (this.forgotPassFormId.checkValidity()) {
                    this.submitSignupForm('forgotPass');
                } else {
                    this.handleFormErrors("error",this.forgotPassFormId);
                    this.showToast('Please do form validation!', 'error');
                }
            }
        },
        async submitSignupForm(type) {
            this.isSubmitting = true;
            if(type == 'login'){
                try {
                    const response = await axios.post('http://localhost:3000/auth/login', {
                    email: this.loginForm.email,
                    password: this.loginForm.password
                    });
                    this.isLoggedIn = true;
                    this.loginForm.profileImage = response.data.user.profileImage;
                    setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                    this.closeModal('login');
                    this.showToast('Login Successfully!', 'success');
                    return
                    
                } catch (error) {
                    setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                    this.showToast('Login failed!', 'error');
                    return
                }
            }
            else if(type == 'signup'){
                if(this.profileImage == ''){
                  this.profileImage = await this.loadDefaultImage();
                } 
                try {
                    const formdata = new FormData();
                    formdata.append('firstname', this.signupForm.firstname);
                    formdata.append('lastname', this.signupForm.lastname);
                    formdata.append('email', this.signupForm.email);
                    formdata.append('password', this.signupForm.password);
                    formdata.append('mobile', this.signupForm.mobile);
                    formdata.append('profileImage', this.profileImage);
                const response = await axios.post('http://localhost:3000/auth/signup',formdata,{
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                this.signupFormData = response.data;
                setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                this.closeModal('signup');
                this.showToast('User Saved Successfully!', 'success');
                return
           
            } catch (error) {
                setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                this.showToast('Signup failed!', 'error');
                return
            }
            }
            else if(type == 'changeProfileupdate'){
                if(this.selectedFile == ''){
                   this.selectedFile = await this.loadDefaultImage();
                }
                    const formData = new FormData();

                    formData.append('firstname', this.currentUser.firstname);
                    formData.append('lastname', this.currentUser.lastname);
                    formData.append('email', this.currentUser.email);

                    if (this.selectedFile) {
                        formData.append('profileImage', this.selectedFile);
                    }
                    try {
                    const response = await axios.post('http://localhost:3000/auth/change-profile', formData, {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    });
 
                    this.showToast('Profile Updated Successfully!', 'success');
                    this.currentUser.profileImage = response.data.user.profileImage;
                    this.loginForm.profileImage = this.currentUser.profileImage;
                    setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                    this.closeModal('changeProfile');
                    return

                    } catch (error) {
                    setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                    this.showToast("Failed to update profile. Please try again.", "error");
                    return
                    }
            }
            else if(type == 'changePass'){
                if(this.requiresOldPassword){
                    try {
                        const response = await axios.post('http://localhost:3000/auth/change-pass', {
                        email: this.changePass.email,
                        oldPass: this.changePass.oldPass,
                        newPass: this.changePass.newPass
                        });
                        this.changePassData = response.data;
                        setTimeout(() => {
                            this.isSubmitting = false;
                        }, 500);
                        this.closeModal('changePass');
                        this.showToast('Password Changed Successfully!', 'success');
                        return
                    
                    } catch (error) {
                        setTimeout(() => {
                            this.isSubmitting = false;
                        }, 500);
                        this.showToast('Password Changed failed!', 'error');
                        return
                    }  
                }
                else{
                    try {
                        const response = await axios.post('http://localhost:3000/auth/change-pass', {
                        email: this.changePass.email,
                        newPass: this.changePass.newPass
                        });
                        this.changePassData = response.data;
                        setTimeout(() => {
                            this.isSubmitting = false;
                        }, 500);
                        this.closeModal('changePass');
                        this.showToast('Password Changed Successfully!', 'success');
                        return
                    
                    } catch (error) {
                        this.closeModal('changePass');
                        setTimeout(() => {
                            this.isSubmitting = false;
                        }, 500);
                        this.showToast('Password Changed failed !', 'error');
                        return
                    }  
                }             
            } 
            else if(type == 'forgotPass'){
                try {
                    const response = await axios.post('http://localhost:3000/auth/verify-otp', {
                    email: this.forgotPass.email,
                    otp: this.forgotPass.otp
                    });
                    this.forgotPassData = response.data;
                    this.requiresOldPassword = false;
                    setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                    this.closeModal('forgotPass');
                    this.selectOption('changePassword');
                    this.showToast('OTP Verified Successfully!!', 'success');
                    return
                    
                } catch (error) {
                    setTimeout(() => {
                        this.isSubmitting = false;
                    }, 500);
                    this.closeModal('forgotPass');
                    this.showToast('OTP is Wrong!', 'error');
                    return
                }
            }
           
        },
        async onFileChange(type) {
            if (type == 'signup') {
                const file = event.target.files[0]; 
                if (file) {
                    this.profileImage = file; 
                } else {
                    this.profileImage = null; 
                }
            }
            else if(type =='changeProfile'){
                const file = event.target.files[0];
                this.selectedFile = file;
            }
        },
        async loadDefaultImage() {
            const response = await fetch(require('./assets/user_latest.png'));
            const blob = await response.blob(); 
            const file = new File([blob], 'user_latest.png', { type: 'image/png' }); 
            return file;
        },
        closeModal(type) {
            if (type === 'login') {
                this.modal.hide();
            } else if (type === 'signup') {
                this.modalInstance.hide();
            } else if (type === 'changePass') {
                this.modalChangePass.hide();
            } else if (type === 'changeProfile') {
                this.modalchangeProfileModal.hide();
            } else if (type === 'forgotPass') {
                this.modalforgotPassModal.hide();
                this.modal.hide();
            } else if (type === 'otp') {
                if(this.isOtpSend == true)
                {
                    this.otpModal.hide();
                    this.handleFormErrors("firstTime",this.forgotPassFormId);
                    this.forgotPass.email =  this.loginForm.email;
                    this.forgotPass.mobile = "8459305176"; 
                    this.forgotPass.otp = '';
                    this.modalforgotPassModal.show();  
                }
                else{
                    this.otpModal.hide();
                    this.modal.show();
                } 
            } 
        },
        openProfile() {
            this.requiresOldPassword = true;
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        showToast(msg, status) {
            if (this.toaster) {
                this.toaster.show(msg, status);
            } 
        },
        selectOption(option) {
            this.isDropdownOpen = false;
            if (option === 'changePassword') { 
                this.changePass = {};
                this.changePass.email = this.loginForm.email;     
                this.modalChangePass.show();
                this.handleFormErrors("firstTime",this.changeButtonFormId);
            } else if (option === 'username') {
                this.currentUser = {};
                this.currentUser.email = this.loginForm.email;
                this.selectedFile = '';
                this.modalchangeProfileModal.show();
                this.handleFormErrors("firstTime",this.changeProfileFormId);
            } else if (option === 'logout') {
                    this.isLoggedIn = false;
            }
        },
        
        async forgotPassword() {
            let email = this.loginForm.email;
            if (!email) {
                this.showToast('Please enter your email to reset your password.', 'error');
                return;
                }
                try {
                        const response = await axios.post('http://localhost:3000/auth/forgot-password', {
                        email
                        });
                        setTimeout(() => {
                            this.isSubmitting = false;
                        }, 500);
                        if (response.status === 200) {
                            this.isOtpSend = true;
                            this.modal.hide();
                            this.otpModal.show();
                            setTimeout(() => {
                                this.closeModal('otp');
                            }, 5000);
                        this.showToast(response.data.message, 'success');
                        return
                        } else {
                            this.isOtpSend = false;
                            this.modal.hide();
                            this.otpModal.show();
                            setTimeout(() => {
                                this.closeModal('otp');
                            }, 5000);
                        this.showToast(response.data.message, 'error');
                        return
                        }
                    } catch (error) {
                        setTimeout(() => {
                            this.isSubmitting = false;
                        }, 500);
                        this.isOtpSend = false;
                            this.modal.hide();
                            this.otpModal.show();
                            setTimeout(() => {
                                this.closeModal('otp');
                            }, 5000);
                        this.showToast("Error resetting password.", "error");
                        return
                    }

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
    },
};
</script>

<style scoped>
.modal-dialog {
    max-width: 500px;
    margin: 1rem auto;
}

.modal-content {
    display: flex;
    flex-direction: column;
    max-height: 100vh; 
}
.modal-header,
.modal-footer {
    flex-shrink: 0; 
    padding: 1rem;
}
.modal-body {
    overflow-y: auto; 
    flex-grow: 1; 
    padding: 1rem;
    margin-bottom: 0; 
}
.changeProfilePhotoDiv{
    display:flex;
    align-items: center;
    width:100%;
}
.changeProfilePhotoLabel{
    width: 30%;
    margin-top: 5%;
}
.changeProfilePhotoInput{
    width: 70%;
    margin-top: 5%;
}

.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999; 
    display: none; 
}

.backdrop.show {
    display: block; 
    transition: opacity 0.3s ease;
}

.navbar-nav {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    margin-left: auto;
}

.navbar {
  padding: 10px;
  background-color: #333;
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  transition: 0.5s;
  cursor: pointer;
}

.navbar-toggler {
  background-color: transparent;
  border: none;
  font-size: 24px;
  color: #fff;
  margin-left: auto;
}
.navbar-toggler.active {
    border: 2px solid #fff; 
    border-radius: 5px;
    padding: 5px;
}
.nav-link {
    color: #fff;
    text-align: left;
    width: 100%;
    font-size: 18px;
}
.nav-link:hover {
    background-color: #555;
    border-radius: 4px;
}
.input-icon {
    margin-right: 10px;
    padding-left: 10px;
}
.input-icon-dropdown{
    margin-right: 5px;
}
.input-icon1 {
    width: 32px;
    height: 32px;
    margin-right: 0.5rem;
    vertical-align: middle;
}
.navbar-text{
    display: flex;
    align-items: center;
}

.navbar-collapse {
  width: 50%;
  display: none; 
  flex-direction: column;
  background-color: #333;
    top: 70px; 
    right: 0; 
}

.navbar-collapse.show {
  display: flex !important;
  align-items: flex-end;
}

.dropdown-content {
  position: absolute;
  background-color: #f9f9f9;
  min-width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  right: 0;
  margin-top: 10px;
}

.dropdown-content a {
  color: black;
  padding: 10px 10px;
  display: block;
  text-decoration: none;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}
.modal-title{
    font-weight: 600;
}

.buttonClose {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: #333;
    transition: color 0.3s ease, transform 0.3s ease;
}

.buttonClose:hover {
    color: #007bff;
}

.forgot-button {
    font-size: 0.9rem;
    color: #007bff;
    text-decoration: none;
}

.forgot-button:hover {
    text-decoration: underline;
    color: #0056b3;
}

.form-group label i {
    margin-right: 0.5rem;
    color: #007bff;
}
@media (max-width: 480px) {
    .navbar-brand img{
        width: 70px;
        height: 30px !important;
    }
    .modal-content {
        max-height: 80vh; 
    }
}

@media (max-width: 991px) {
  .navbar-collapse {
    display: none;
  }

 .navbar-nav {
    display: block;
    margin-top: 10px;
    width: 100%;
}

 .navbar-toggler {
    display: inline-block;
}

.navbar-collapse.show {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: absolute;
  }
  .modal-dialog {
    margin: 1rem auto;
    max-width: 95%;
    width: 100%;
}
.modal-content {
    max-height: 90vh; 
}

.modal-header,.modal-body ,.modal-footer {
    padding: 1rem;
}

.dropdown-content {
     min-width: 135px; 
 }
.dropdown-content a {
    font-size: 12px;
    padding: 5px 5px;
}

.dropdown-content a img{
    height: 20px;
    width: 20px;
}

.modal-footer {
    flex-direction: column;
    align-items: center;
}

.btn-primary,.btn-secondary {
    width: 100%;
}

.changeProfilePhotoLabel{
    width: 35%;
    margin-top: 5%;
}
}
@media (min-width: 992px) {
  .navbar-collapse {
    display: flex !important;
    justify-content: space-between;
  }

  .navbar-nav {
    flex-direction: row;
  }
}
</style>