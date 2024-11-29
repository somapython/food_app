<template>
    <div class="container">
        <div id="map" class="map"></div>
    </div>
    <div class="d-flex align-items-center justify-content-between remainingPart">
        <div class="row">
            <div class="col sideData"><img class="iconHeight" src="./assets/orderTracking/startIcon.png" alt="startIcon" loading="lazy">Start : Pune</div>
            <div class="col sideData destDisplay"><img class="iconHeight" src="./assets/orderTracking/destinationIcon.png" alt="destinationIcon" loading="lazy"> Destination : {{ deliveryAddress }}</div>
        </div>
        <div class="d-flex align-items-center justify-content-center countdownTimer">
            <div class="timer">{{ countdown }}</div>
        </div>
        <div class="summaryDiv">
            <div class="summary" >
                <div class="mt-10">
                    <p class="d-flex align-items-center">🚗 <strong class="summaryDetail"> Distance : </strong> {{ parseInt(routeInfo.distance/1000) }} Km</p>
                    <p class="d-flex align-items-center">⏳ <strong class="summaryDetail"><span class="estimated">Estimated </span> Time : </strong> {{ formatTime(routeInfo.time) }}</p>
                </div>             
                <div class="featuresButton">
                    <button class="callIconButton"  @click="openCallUi">
                        <img src='./assets/orderTracking/telephone.png' alt="callIcon" style="width: 24px;" loading="lazy">
                    </button>
                    <button class="chatIconButton"  @click="openChatModal">
                        <img src='./assets/orderTracking/messenger.png' alt="chatIcon" style="width: 24px;" loading="lazy">
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isCallUiOpen" class="call-ui-modal">
        <div class="call-ui-content">
            <button class="close-button" @click="closeCallUi">×</button>
            <div class="call-ui-center">
                <img src='./assets/orderTracking/userIcon.png' alt="userCalling" class="call-user-icon" loading="lazy"/>
                <h2>{{ callText }}</h2>
                <button @click="disconnectCall()" class="disconnect-button" :disabled="isDisconnected">
                    <img src='./assets/orderTracking/disconnect.png' alt="disconnect" class="disconnect-icon" loading="lazy"/>
                </button>
            </div>
        </div>
    </div>
    <div v-if="isChatOpen" class="chat-modal">
        <div class="chat-box">
            <div class="chat-header">
                <img src="./assets/orderTracking/userIcon.png" alt="Avatar" class="avatar" loading="lazy" />
                <div class="chat-info">
                    <h3>{{ botName }}</h3>  
                </div>
                <button @click="closeChatModal" class="close-btn">×</button>
            </div>
            <p class="status-message wavy-border" >{{ statusMessage }}</p>
            <div class="message-area">
                <div v-for="message in messages" :key="message.id" class="message-container" :class="{ 'user-message': message.sender === 'user', 'bot-message': message.sender === 'bot' }">
                    <p style="margin-bottom: 0;">{{ message.text }} </p>
                    <img v-if="message.attachment && message.attachmentType === 'image'" :src="message.attachment" alt="Attachment" class="message-attachment" loading="lazy"/>
                    <a v-if="message.attachment && message.attachmentType !== 'image'" :href="message.attachment" target="_blank" class="attachment-link">
                        View Attachment
                    </a>
                    <span v-if="message.sender === 'user'" class="message-tick">
                        <!-- Sent (single tick) -->
                        <i v-if="message.status === 'sent'">&#10003;</i>
                        <!-- Delivered (double tick) -->
                        <i v-if="message.status === 'delivered'">&#10003;&#10003;</i>
                        <!-- Read (blue double tick) -->
                        <i v-if="message.status === 'read'" class="read-tick">&#10003;&#10003;</i>
                    </span>
                </div>
            </div>
            <div class="input-area">
                <input type="text" v-model="newMessage" placeholder="Enter your message...">
                <div class="input-icons">
                    <img src="./assets/orderTracking/emoji.png" alt="Emoji" 
                      class="emoji-icon emojiIconStyle" @click="toggleEmojiPicker"  />
                    <label for="cameraInput" style="cursor: pointer;" @click="openCamera">
                        <img src="./assets/orderTracking/camera.png" alt="Camera" class="cameraIconStyle" />
                    </label>
                    <div v-if="isCameraOpen" class="camera-modal">
                        <video class="cameraVideo" ref="cameraStream" autoplay></video>
                        <button class="cameraButton" @click="capturePhoto">Capture</button>
                        <button class="cameraButton" @click="closeCamera">Close</button>
                    </div>
                    <label for="fileInput" style="cursor: pointer;">
                        <img src="./assets/orderTracking/attachment.png" alt="Attachment" 
                            class="attachment-icon attachmentIconStyle" />
                    </label>
                    <input type="file" id="cameraInput" accept="image/*" capture="environment" @change="handleAttachment" hidden />
                    <input type="file" id="fileInput" accept="image/*, .pdf" @change="handleAttachment" hidden />
                </div>
                <button @click="sendMessage" class="send-btn">➤</button>
            </div>
            <transition name="slide">
                <div v-if="emojiPickerVisible" class="emoji-picker">
                    <span v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)" class="emoji-item">
                        {{ emoji }}
                    </span>
                    <button class="emoji-close-btn" @click="toggleEmojiPicker">
                        ✕
                    </button>
                </div>
            </transition>
        </div>
    </div>
    <CreateLogsWord @logCreated="addLogToLogs" ref="createLogsComponent" />
    <LoaderWord :loading="isLoading" />
    <ToasterWord ref="toaster" />
</template>
<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import destinationIcon from './assets/orderTracking/redLocation.jpeg';
import startingIcon from './assets/orderTracking/greenLocation.jpeg';
import vehicleIcon from './assets/orderTracking/vehicle.png';
import ToasterWord from './ToasterWord.vue';
import CreateLogsWord from './CreateLogsWord.vue';
import LoaderWord from './LoaderWord.vue';
export default {
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryCoords: {
      type: Array,
      required: true,
    },
  },
  components: {
    ToasterWord,
    CreateLogsWord,
    LoaderWord,
  },
  data() {
    return {
      isLoading: false,
      isSubmitting: false,
      isCameraOpen: false,
      cameraStream: null,
      map: null,
      countdown: '',
      intervalId: null,
      vehicleMarker: null,
      routeInfo: { distance: 0, time: 0 },
      isCallUiOpen: false,
      phoneNumber: '8459305176',
      callText: '',
      audioFile: '',
      audioFileDisconnect: '',
      audioFileBusy: '',
      isDisconnected: false,
      interval: null,
      isChatOpen: false,        
      botName: "Somnath Bagale", 
      botAvatar: "/assets/orderTracking/userIcon.png", 
      statusMessage: "We typically reply in a few minutes.",
      messages: [             
        { id: 1, text: "Hey, I want to know more about you. 🌍", sender: 'user' },
        { id: 2, text: "How are you", sender: 'bot' },
      ],
      quickReplies: [
        { id: 1, text: "Shipping rates to EU countries" },
        { id: 2, text: "Shipping rates to USA" }
      ],
      newMessage: '' ,            
      emojiPickerVisible: false,
      emojis: [
        "😀", "😁", "😂", "😃", "😄", "😅", "😆", "😉", "😊", "😋", 
        "😎", "😍", "😘", "🤗", "😑", "😏", "😣", "😢", "😭", "😡",
        "🤬", "😱", "😨", "😴", "🥵", "🥶", "🤯", "🤔", "🙄", "😐"
      ],
      attachment: null,
      attachmentType: "",
    };
  },
  mounted() {
    this.initializeMap();
    this.startRouting();
    this.toaster = this.$refs.toaster;
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
    if (this.audioFile) {
        this.audioFile.removeEventListener('ended', this.playSecondAudio);
    }
    clearInterval(this.interval);
  },
  methods: {
    initializeMap() {
      const myDiv = document.getElementById('map');
      myDiv.style.opacity = '0.2';
      this.map = L.map('map').setView([this.latitude, this.longitude], 13);
     

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);
    this.addMarker(this.deliveryCoords, `Destination: ${this.deliveryAddress}`, 'destination-icon');
    this.addMarker([this.latitude, this.longitude], 'Start: Pune', 'start-icon');
    },

    addMarker(coords, message, iconType) {
      const icon = this.getIcon(iconType);
      L.marker(coords, { icon }).addTo(this.map)
        .bindPopup(message)
        .openPopup();
        const documentLatest = document.getElementsByClassName('leaflet-control-attribution');
        documentLatest[0].style.display = 'none';
    },

    getIcon(type) {
      return L.icon({
        iconUrl: type === 'destination-icon' ? destinationIcon : (type === 'start-icon' ? startingIcon : vehicleIcon),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    },

    startRouting() {
      const destinationLatLng = L.latLng(this.deliveryCoords);
    const deliveryLatLng = L.latLng([this.latitude, this.longitude]);

      const routingControl = L.Routing.control({
        waypoints: [deliveryLatLng, destinationLatLng],
        lineOptions: {
          styles: [{ color: 'blue', opacity: 1, weight: 4, dashArray: '5, 5' }] 
        },
        createMarker: () => null, 
        addWaypoints: false,
        routeWhileDragging: false,
        show: false, 
        fitSelectedRoutes: true,
        router: L.Routing.osrmv1({
          serviceUrl: `https://router.project-osrm.org/route/v1`
        }),
      }).addTo(this.map);

      routingControl._altContainer.style.display = 'none';
      routingControl.hide();

      routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        const routeCoordinates = route.coordinates;
        
        this.routeInfo = {
          distance: route.summary.totalDistance,
          time: route.summary.totalTime,
        };

        this.startTimer();
        this.vehicleMarker = L.marker(this.deliveryCoords, { icon: this.getIcon('vehicle-icon') }).addTo(this.map);

        this.animateVehicle(routeCoordinates);
      });
    },

    animateVehicle(routeCoordinates) {
      let currentIndex = 0;
      const moveInterval = setInterval(() => {
        if (currentIndex >= routeCoordinates.length) {
          clearInterval(moveInterval);
          this.vehicleMarker.bindPopup("Delivery Arrived at Pune!").openPopup();
        } else {
          this.vehicleMarker.setLatLng(routeCoordinates[currentIndex]);
          currentIndex++;
        }
      }, 500);
    },
    startTimer() {
        let distance = Math.floor(this.routeInfo.time / 60);
        if (distance <= 0) {
            this.countdown = "Delivery time not available.";
            return;
        }

    let endTime = new Date().getTime() + distance * 60 * 1000;

    this.intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const remainingTime = endTime - currentTime;

    if (remainingTime < 0) {
      clearInterval(this.intervalId);
      this.countdown = "Delivery has arrived!";
    } else {
      const totalMinutes = Math.floor(remainingTime / (1000 * 60));  
      const hours = Math.floor(totalMinutes / 60); 
      const minutes = totalMinutes % 60;  
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);  
      this.countdown = `${hours}h ${minutes}m ${seconds}s remaining`;
    }
  }, 1000); 
},
   
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minutes`;
    },
    startBlinkingDots() {
        let dotCount = 0;
        this.interval = setInterval(() => {
            dotCount = (dotCount + 1) % 4; 
            this.callText = 'Calling' + '.'.repeat(dotCount); 
        }, 500); 
    },
    openCallUi() {
        this.startBlinkingDots();
        this.audioFile = new Audio(require('./assets/orderTracking/call.mp3')); 
        this.audioFile.play();
        this.isCallUiOpen = true; // Show the call UI
        this.isDisconnected = false; 
        this.audioFile.addEventListener('ended', this.playSecondAudio);
        this.makeCall();
    },
    async makeCall() {
        const callData = {
          message: 'Your order has been confirmed and is on its way!',
          to: '+919096670573',  
        };

          try {
            const response = await fetch('http://localhost:3000/make-call', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(callData),
            });

            const result = await response.json();
            if (result.success) {
              console.log('Call placed successfully:', result.sid);
            } else {
              console.error('Failed to place call:', result.error);
            }
          } catch (error) {
            console.error('Error placing call:', error);
          }
},
    playSecondAudio() {
        this.audioFile = new Audio(require('./assets/orderTracking/busy.mp3'));
        this.audioFile.play();
        this.callText = 'Call Busy';
        clearInterval(this.interval);
        this.audioFile.addEventListener('ended', this.disconnectCallNew);   
    },
    disconnectCallNew(){
        this.callText = 'Call Ended';
        this.audioFileDisconnect = new Audio(require('./assets/orderTracking/disconnect.mp3')); 
        this.audioFileDisconnect.play();
        clearInterval(this.interval); 
        this.audioFileDisconnect.addEventListener('ended', this.disconnectCallEnd);     
    },

    disconnectCallEnd(){
        this.isCallUiOpen = false;
    },
    closeCallUi() {
        this.audioFile.pause();
        this.isCallUiOpen = false; 
        this.callText = '';
        clearInterval(this.interval); 

    },
    disconnectCall() {
        this.callText = 'Disconnected';
        clearInterval(this.interval); 
        this.audioFile.pause();
        this.audioFileDisconnect = new Audio(require('./assets/orderTracking/disconnect.mp3')); 
        this.audioFileDisconnect.play();
        this.isDisconnected = true; 
   
    },
    openChatModal() {
      this.isChatOpen = true;
    },
    closeChatModal() {
      this.isChatOpen = false;
    },
    toggleEmojiPicker() {
      this.emojiPickerVisible = !this.emojiPickerVisible;
    },
    addEmoji(emoji) {
      this.newMessage += emoji;
    },
    async openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.cameraStream = stream;
            this.isCameraOpen = true;
            this.$refs.cameraStream.srcObject = stream; 
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please check your permissions.");
        }
    },
    capturePhoto() {
        const video = this.$refs.cameraStream;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/png");
        this.messages.push({
            sender: 'user',
            text: '',
            attachment: imageData,
            attachmentType: 'image',
            status: 'sent',
        });

        this.closeCamera();
    },
    closeCamera() {
        if (this.cameraStream) {
            const tracks = this.cameraStream.getTracks();
            tracks.forEach((track) => track.stop()); 
        }
        this.isCameraOpen = false;
    },
    sendMessage() {
        if (this.newMessage || this.attachment) {
                this.messages.push({ 
                        id: this.messages.length + 1,
                        text: this.newMessage, 
                        attachment: this.attachment,
                        attachmentType: this.attachmentType,
                        sender: 'user',
                        status: 'sent' 
                    });
                    this.emojiPickerVisible = false;
                    setTimeout(() => {
                        this.messages[this.messages.length - 1].status = 'delivered';
                    }, 2000);

                    setTimeout(() => {
                    this.messages[this.messages.length - 1].status = 'read';
                    }, 4000);
                    this.newMessage = ''; 
                    this.attachment = null;
                    this.attachmentType = '';
                }
    },
    handleAttachment(event) {
    const file = event.target.files[0];
      if (file) {
        this.attachmentType = file.type.startsWith('image') ? 'image' : 'file';
        if (this.attachmentType === 'image') {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.attachment = e.target.result; 
          };
          reader.readAsDataURL(file);
        } else {
          this.attachment = URL.createObjectURL(file);
        }
        this.newMessage = file.name;
      }
    },
    showToast(msg, status) {
        if (this.$refs.toaster) {
          this.$refs.toaster.show(msg, status);
        }
      },
  },
};
</script>
<style scoped>
.row{
  display: block;
}

.chat-modal {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
 background: radial-gradient(circle at left, #243bde, #137ded);
  color: white;
  border-radius: 20px 20px 0 0;
  position: relative;
} 
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.chat-info {
  flex-grow: 1;
}

.mt-10{
    margin-top: 5px;
}

.callIconButton{
    margin-top: 3px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: green;
    display: flex;
    align-items: center;
    justify-content: center;
    border:1px solid green;
}

.chatIconButton{
    margin-top: 5px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color:blue;
    display: flex;
    align-items: center;
    justify-content: center;
    border:1px solid blue;
}
.status-message1 {
  background-color: #4285F4; 
  color: white; 
  padding: 15px 20px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  position: relative;
  overflow: hidden;
}
 .wavy-border {
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
    background-color: #4285F4; 
    color: white; 
    padding: 10px;
    background-image: url('data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 120 10%22%3E%3Cpath fill%3D%22none%22 stroke%3D%22%23ADD8E6%22 stroke-width%3D%221%22 d%3D%22M0 5 Q 30 10 60 5 T 120 5%22 /%3E%3C/svg%3E');
    background-size: cover; 
  }

  .wavy-border::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10px; 
    background: url('data:image/svg+xml,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 viewBox%3D%220 0 120 10%22%3E%3Cpath fill%3D%22none%22 stroke%3D%22%23000000%22 stroke-width%3D%221%22 d%3D%22M0 5 Q 30 10 60 5 T 120 5%22 /%3E%3C/svg%3E') repeat-x;
    background-size: 120px 10px;
  }

  .message-tick {
  font-size: 12px;
  color: white;
}

.read-tick {
  color: rgb(133, 216, 9);
  float:right;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.message-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f4f4f4;
}

.message-area::-webkit-scrollbar {
  width: 8px; 
}

.message-area::-webkit-scrollbar-thumb {
  background-color: #ccc; 
  border-radius: 4px; 
}

.message-area::-webkit-scrollbar-track {
  background-color: #f4f4f4; 
}

.message-container {
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  background: radial-gradient(circle at left, #243bde, #137ded);
}

.bot-message {
  align-self: flex-start;
  background-color: #ffffff;
}

.quick-response-buttons {
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-wrap: wrap;
}

.quick-reply-btn {
  margin-right: 10px;
  background-color: #E8EAF6;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  color: #4285F4;
}

.input-area {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 0 0 20px 20px;
  background-color: #f4f4f4;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
}

.input-icons {
  display: flex;
  gap:5px;
}

.emoji-icon, .attachment-icon,
.attachment-icon {
  color: #666;
  cursor: pointer;
}

.emojiIconStyle{
    width: 20px; 
    height: 20px;
}

.cameraIconStyle{
    width: 20px;
     height: 20px; 
     margin-bottom: 5px;
}

.attachmentIconStyle{
    margin-right: 5px; 
    width: 15px; 
    height: 15px;
    margin-bottom: 5px;
}

.message-attachment {
  max-width: 100%;
  margin-top: 10px;
}

.attachment-link {
  margin-top: 10px;
  display: block;
  text-decoration: underline;
  color: blue;
}

.emoji-picker {
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  gap: 10px;
  overflow: auto;
  border-radius: 10px;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f4f4f4;
  position: relative;
  background-color: #f1f1f1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.emoji-picker span {
  cursor: pointer;
  font-size: 1.5rem;
}

.emoji-picker::-webkit-scrollbar {
  width: 6px; 
}

.emoji-picker::-webkit-scrollbar-thumb {
  background-color: #ccc; 
  border-radius: 4px; 
}

.emoji-picker::-webkit-scrollbar-track {
  background-color: #f4f4f4; 
}

.emoji-item {
    font-size: 20px;
    cursor: pointer;
    margin-right: 10px;
    transition: transform 0.2s ease;
}

.emoji-item:hover {
    transform: scale(1.2);
}

.emoji-close-btn {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: none; 
    background-color: #0f0f0f;
    color: white;
    border: none;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 14px;
    cursor: pointer;
    z-index: 10;
    transition: opacity 0.3s ease;
}

.emoji-picker:hover .emoji-close-btn {
    display: block;  
}
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter, .slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.send-btn {
  background: radial-gradient(circle at left, #243bde, #137ded);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
}

.call-ui-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 15px;
  box-sizing: border-box;
}

.call-ui-content {
    background-color: #242a2f; 
    border-radius: 15px;
    width: 90%; 
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease-in-out;
    max-width: 400px;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
    color: #928585;
}

.close-button:hover {
    color: #fcfbfb;
}

.call-ui-center {
    display: flex;
    flex-direction: column;
    align-items: center;
     gap: 15px;
}

.call-user-icon {
    border-radius: 50%;
    width: 100px;
    height: 100px;
}

h2 {
    font-size: 22px;
    margin: 15px 0;
    color:#fff
}

.disconnect-button {
    background: #ff4040;
    border: none;
    border-radius: 50%;
    transition: background-color 0.3s ease;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
}

.disconnect-button:disabled {
    background: grey;
    cursor: not-allowed;
}

.disconnect-icon {
    width: 25px;
}

.disconnect-button:hover {
    background-color: #db5757;
}

.cancel-button {
    background-color: transparent;
    border: 2px solid #555;
    color: #fcfbfb;
    padding: 5px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin-top: 10px;
}

.cancel-button:hover {
    background-color: #242323;
    color: #1b1b1b;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  max-width: 1200px; 
  width: 100%;
  margin: 0 auto;
  background-color:greenyellow;
}

.map {
  width: 100%;
  height: 310px;
  background-color: #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
}

.timer {
    font-weight: bold;
  font-size: 28px;
  color: #f30606;
  background-color: #c3bcbc;
  padding: 10px 20px;
  border-radius: 50px;
  animation: pulse 1s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remainingPart{
    padding: 10px 20px;
    background-color: #810e0e;
    color: white;
    margin: 10px;
    border-radius: 10px;
}
.dimensions{
    width:16px;
}

.sideData{
    display: flex;
    align-items: flex-start;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 1rem;
}

.iconHeight{
    height: 28px;
    width: 28px;
    margin-right: 5px;
    
}

.summaryDiv{
  background-color: #fff;
  border-radius: 10px;
  max-width: 360px;
  width: 100%;
  border-radius: 10px;
}

.summary {
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: all 0.5s ease;
  display: flex;
  justify-content: space-between;
  color: black; 
}

.summaryDetail{
  margin-left: 10px;
  font-size: 18px;
}

.featuresButton{
    display: flex;
    flex-direction: column;
    
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.camera-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.cameraVideo {
    width: 90%;
    max-width: 500px;
    border: 2px solid white;
    border-radius: 10px;
}

.cameraButton {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}


@media (max-width: 990px) {
  .container {
    padding: 10px; 
    width: 100%; 
    max-width: 950px; 
    margin: 0 auto; 
    background-color: greenyellow;
  }

  .map {
    height: 300px; 
    width: 100%; 
    background-color: #ddd; 
    border-radius: 8px; 
    margin-bottom: 15px; 
  }

  .timer {
    font-size: 18px; 
    margin-bottom: 50px;
    margin-top: 20px;
  }

  .summaryDiv {
    max-width: 320px;
    width: 100%;
  }

  .summary{
    padding: 5px;
  }

  .summaryDetail {
    margin-left: 10px;
    font-size: 16px;
}

.remainingPart{
  padding: 5px 10px;
}

.sideData{
  font-size: 16px;
  font-weight: 500;
}
}

@media (max-width: 800px) {
    .call-ui-content {
        padding: 15px;
        width: 100%; 
        max-width: 350px;
    }

    .call-user-icon {
        width: 70px;
        height: 70px;
    }

    .disconnect-button {
        padding: 8px;
    }

    .disconnect-icon {
        width: 18px;
    }

    .container {
      padding: 5px; 
    }

    .map {
        height: 320px;
    }

    .summaryDiv{
      max-width: 290px;
      width: 100%;
    }

    .estimated{
      display: none;
    }

    .summary {
        padding: 5px;   
        text-align: center; 
        margin-top: 5px;   
    }

    .row{
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: column;
    }

    .featuresButton {
        flex-direction: row; 
        justify-content: center;
        gap: 10px; 
    }

    .sideData {
        font-size: 14px; 
        margin-bottom: 5px; 
        display: flex;
        align-items: center;
    }

    .timer {
        font-size: 14px;
        padding: 10px 10px;
        margin-bottom: 10px;
    }

    .summaryDetail{
      margin-left: 5px;
      font-size: 14px;
    }
}
@media (max-width: 680px) {
    .call-ui-content {
        width: 100%; 
        max-width: 250px;
        padding: 10px;
    }

    .call-user-icon {
        width: 60px;
        height: 60px;
    }

    h2 {
        font-size: 1rem;
    }

    .container {
      padding: 0px; 
    }

    .estimated{
      display: none;
    }

    .map {
        height: 240px; 
    }
    
    .summary {
        padding: 8px;  
        font-size: 14px; 
    }

    .remainingPart {
        flex-direction: column; 
        align-items: flex-start; 
    }

    .row {
        flex-direction: row; 
        width:100%;
    }

    .destDisplay{
        justify-content: flex-end
    }

    .featuresButton {
      margin-right: 10px;
    }

    .countdownTimer{
        width: 100%;
    }

    .timer {
        font-size: 16px; 
        margin-top: 5px;
    }
    .summaryDiv{
      width: 100%;
      max-width: 400px;
      margin-top: 10px;
    }
}
@media (max-width: 480px) {
    .call-ui-content {
        width: 100%; 
        max-width: 250px;
        padding: 10px;
    }

    .call-user-icon {
        width: 60px;
        height: 60px;
    }

    h2 {
        font-size: 1rem;
    }

    .container {
      padding: 0px; 
    }

    .map {
        height: 260px; 
    }

    .summary {
        padding: 8px;  
        font-size: 14px; 
    }

    .featuresButton {
        flex-wrap: wrap; 
        gap: 8px;
    }

    .timer {
        font-size: 16px; 
    }

    .sideData {
        font-size: 10px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
    }

    .iconHeight {
        height: 16px;
        width: 16px;
        margin-right: 2px;
    }

    .chat-modal{
        width: 300px;
        height: 450px;
    }
    .chat-box {
        height: 100%;
        border-radius: 0; 
    }

    .status-message {
        font-size: 0.8rem;
        padding: 5px;
    }

    .input-area input[type="text"] {
        font-size: 0.9rem;
        padding: 5px;
    }

    .emoji-picker {
        bottom: 70px;
        left: 5px;
        padding: 5px;
        font-size: 1rem;
    }

    .input-icons{
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .emojiIconStyle{
        width: 15px; 
        height: 15px;
    }

    .cameraIconStyle{
        width: 15px;
        height: 15px; 
        margin-bottom: 5px;
    }

    .cameraVideo {
        width: 90%;
        max-width: 300px;
        border: 2px solid white;
        border-radius: 10px;
    }

    .cameraButton {
        margin-top: 10px;
        padding: 5px 10px;
        font-size: 14px;
        cursor: pointer;
    }

    .attachmentIconStyle{
        margin-right: 2px; 
        width: 12px; 
        height: 12px;
        margin-bottom: 5px;
    }
    .send-btn {
        padding: 2px;
    }
}
</style>
