<template>
    <div class="messages-container">
        <SidebarWord />
            <div class="main-content" style="padding: 20px;">
                <div class="message-content">
                    <div class="messages-section">
                        <div class="messages-container1">
                            <div class="message-tabs">
                                <button :class="{ active: activeTab === 'latest' }" @click="setTab('latest')">Latest Posts</button>
                                <button :class="{ active: activeTab === 'starred' }" @click="setTab('starred')">Starred Posts</button>
                                <button :class="{ active: activeTab === 'read' }" @click="setTab('read')">Read Posts</button>
                                <button :class="{ active: activeTab === 'liked' }" @click="setTab('liked')">Liked Posts</button>
                            </div>
                            <div v-if="filteredMessages.length == 0" style="padding: 50px">
                                <div class="no-message-item">
                                    No Data Found        
                                </div>      
                            </div>
                            <div class="messages-list" v-else>
                                <div v-for="(message, index) in filteredMessages" :key="index" class="message-item" :class="{read: message.isRead}">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="message-user-info">
                                            <img :src="message.avatar || defaultAvatar" alt="Profile Image" class="avatar" loading="lazy">
                                                <h4 class="user-details1 mr-10">{{ message.name }}</h4>
                                                <div class="message-date mr-10">{{ formatDate(message.date) }}</div>
                                                <div class="rating">
                                                    <span v-for="n in 5" :key="n" :class="{ 'filled-star': n <= message.rating }">★</span>
                                                </div>
                                        </div>
                                        <div>
                                            <div class="message-actions">
                                                <span @click="toggleLike(index)" :class="{ liked: message.isLiked }" class="d-flex align-items-center justify-content-center" style="font-size: 20px !important;">
                                                    {{ message.isLiked ? '❤️' : '🤍' }}
                                                </span>
                                                <span @click="toggleStar(index)" :class="{ starred: message.isStarred }">★</span>
                                                <span @click="openModal(index)" :class="{read: message.isRead}">⋮</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="message-content">
                                        <p>{{ message.comment }}</p>
                                    </div>
                                </div>
                            </div>
                            <div v-if="showModal" class="message-modal">
                                <div class="modal-content">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <h4 style="color: #db04d5;">{{ selectedMessage.name }}</h4>
                                        <span class="close" @click="closeModal">&times;</span>
                                    </div>
                                    <div class="modal-date">{{ formatDate(selectedMessage.date) }}</div>
                                    <div class="d-flex align-items-center justify-content-between">
                                        <p class="modalMessage">{{ selectedMessage.comment }}</p>
                                        <div class="ratingModal">
                                            <span v-for="n in 5" :key="n" :class="{ 'filled-star': n <= selectedMessage.rating }">★</span>
                                        </div>
                                    </div>
                                    <div class="comment-input d-flex align-items-center">
                                        <img class="emoji-icon" src="../assets/dashboard/emoji.png" alt="emoji_icon" loading="lazy" @click="toggleEmojiPicker"/>
                                        <div v-if="showEmojiPicker" class="emoji-picker">
                                            <span v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)" class="emoji">{{ emoji }}</span>
                                        </div>
                                        <img class="attachment-icon" src="../assets/dashboard/attachment.png" alt="attachment_icon" loading="lazy" @click="triggerFileUpload()"/>
                                        <input type="file" ref="fileInput" @change="addAttachment" style="display: none;" />
                                        <input type="text" v-model="newComment" placeholder="Write a comment..." @input="checkComment" class="input-box" />
                                        <button v-if="newComment.length > 0" @click="sendComment" class="send-button">Send</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        <CreateLogsWord @logCreated="addLogToLogs" ref="createLogsComponent" />
        <LoaderWord :loading="isLoading" />
        <ToasterWord ref="toaster" />
    </div>
</template>
<script>
import SidebarWord from '../SidebarWord.vue';
import ToasterWord from '../ToasterWord.vue';
import CreateLogsWord from '../CreateLogsWord.vue';
import LoaderWord from '../LoaderWord.vue';

export default {
  name: 'MessagesWord',
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
      activeTab: 'latest',
      defaultAvatar: 'https://randomuser.me/api/portraits/men/3.jpg', 
      showModal: false,
      selectedMessage: {},
      newComment: "",
      newCommentImage: "",
      showEmojiPicker: false, 
      emojis: ['😀', '😂', '😍', '😎', '😢', '👍', '🙌', '❤️'],
      messages: [
        {
          name: "Rushikesh Vaidya",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg", 
          comment: "Hey guys, I've been informed about our meeting schedule... Hey guys, I've been informed about our meeting schedule... Hey guys, I've been informed about our meeting schedule...",
          rating: 3.8,
          date: new Date(),
          newComment: "",
          isStarred: false,
          isLiked: false,
          isRead: false
        },
        {
          name: "Pooja Ichage",
          avatar: "https://randomuser.me/api/portraits/women/5.jpg", 
          comment: "Great, the new date should fit everyone! Great, the new date should fit everyone! Great, the new date should fit everyone! Great, the new date should fit everyone! Great, the new date should fit everyone! Great, the new date should fit everyone! Great, the new date should fit everyone!",
          rating: 4.2,
          date: new Date(),
          newComment: "",
          isStarred: false,
          isLiked: false,
          isRead: false
        },
        {
          name: "Swaraj Yelgunde",
          avatar: "https://randomuser.me/api/portraits/men/8.jpg",
          comment: "We are thinking about organizing a ski trip... Great, the new date should fit everyone! Great, the new date should fit everyone!",
          rating: 3.5,
          date: new Date(),
          newComment: "",
          isStarred: false,
          isLiked: false,
          isRead: false
        },
        {
          name: "Omkar Kasture",
          avatar: "https://randomuser.me/api/portraits/men/4.jpg",
          comment: "Great, the new date should fit everyone! Great, the new date should fit everyone! Great, the lorem We are thinking about organizing a ski trip... Great, the new date should fit everyone! Great, the new date should fit everyone!",
          rating: 4.5,
          date: new Date(),
          newComment: "",
          isStarred: false,
          isLiked: false,
          isRead: false
        },
      ],
    };
  },
  computed: {
    filteredMessages() {
      if (this.activeTab === 'starred') {
        return this.messages.filter(message => message.isStarred);
      } else if (this.activeTab === 'read') {
        return this.messages.filter(message => message.isRead);
      }
      else if (this.activeTab === 'liked') {
        return this.messages.filter(message => message.isLiked);
      }
      return this.messages;
    }
  },
  mounted() {
    this.toaster = this.$refs.toaster;
    this.isLoading = true;
    setTimeout(() => {
        this.isLoading = false;
    }, 2000);
    
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    setTab(tab) {
      this.activeTab = tab;
    },
    toggleStar(index) {
      this.messages[index].isStarred = !this.messages[index].isStarred;
      const message = this.messages[index].isStarred ? 'Starred!' : 'UnStarred!';
      this.showToast(message, 'success');
    },
    toggleLike(index) {
      this.messages[index].isLiked = !this.messages[index].isLiked;
      const message = this.messages[index].isLiked ? 'Liked!' : 'Unliked!';
      this.showToast(message, 'success');
    },
    openModal(index) {
      this.selectedMessage = this.messages[index];
      this.showModal = true;
      this.messages[index].isRead = true;
    },
    sendComment() {
      if (this.selectedMessage && this.newComment.trim()) {
          this.selectedMessage.comment += `\n${this.newComment}`;
          this.newComment = '';
          this.showToast('Messages sent successfully','success');
          this.closeModal();
      }
    },
    sortMessages(criteria) {
        if (criteria === 'date') {
            this.messages.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (criteria === 'rating') {
            this.messages.sort((a, b) => b.rating - a.rating);
        } else if (criteria === 'name') {
            this.messages.sort((a, b) => a.name.localeCompare(b.name));
        }
    },
    closeModal() {
      this.showModal = false;
    },
    addAttachment(event) {
      const file = event.target.files[0];
      if (file) {
        this.newComment += `  ${file.name}`;
          this.newCommentImage = file;
      }
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    addEmoji(emoji) {
      this.newComment += emoji;
      this.showEmojiPicker = false; 
    },
    triggerFileUpload() {
      this.$refs.fileInput.click(); 
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

.messages-container {
  display: flex;
}

.main-content {
  flex-grow: 1;
  padding: 10px;
}
 
.messages-container1 {
  width: 100%; 
  padding: 15px;
  background-color: #becce1;
  border-radius: 5px;
}

.mr-10{
   margin-right: 30px !important;
}

.message-tabs {
  display: flex;
  flex-wrap: wrap; 
  justify-content: center;
  gap: 10px; 
}

.message-tabs button {
  background-color: transparent;
  border: none;
  font-size: 16px;
  padding: 10px;
  cursor: pointer; 
}

.message-tabs button.active {
  border-bottom: 2px solid #007bff;
}

.messages-list {
  gap: 20px;
}

.message-item1 {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-item {
  padding: 15px; 
  font-size: 14px; 
}

.no-message-item{
   background-color: #ffffff;
  padding: 100px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 600;
  color: #2f0ced;
}

.message-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.user-details1{
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.message-date {
  color: #888888;
  font-size: 12px;
}

.rating {
  color: #d5d3d3;
  font-size: 20px;
}

.rating .filled-star {
  color: gold;
} 

.ratingModal {
 color: #d5d3d3;
  font-size: 16px;
}

.ratingModal .filled-star {
  color: gold;
}

.message-actions .liked {
  color: red;
}

.message-actions {
  display: flex;
  gap: 10px;
  font-size: 30px;
  cursor: pointer;
}

.message-actions .starred {
  color: gold;
}

.message-actions .read{
    color:darkgray
}

.modalMessage{
    margin-bottom: 1rem;
    color: #4747f3;
}

.message-content {
  font-size: 16px;
  color: #333333;
}

.message-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
  font-size: 14px; 
}

.close {
  font-size: 24px;
  cursor: pointer;
  float: right;
}

.modal-date {
  font-size: 14px;
  margin-bottom: 10px;
  color: #ef1313;
}

.comment-input {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.attachment-icon {
  font-size: 20px;
  color: #888;
  cursor: pointer;
  margin-right: 10px;
}

.emoji-icon {
  font-size: 20px;
  color: #cda710; 
  cursor: pointer;
  margin-right: 10px;
}

.input-box {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

.input-box:focus {
  border-color: #007bff;
}

.send-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #218838;
}

.emoji-picker {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  margin-left: 20px;
}

.emoji {
  font-size: 16px;
  padding: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .messages-container {
    flex-direction: row; 
  }

  .message-user-info {
    flex-direction: column; 
    align-items: flex-start; 
}

  .main-content {
    padding: 20px;
  }

  .messages-container1 {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  .message-tabs button {
    font-size: 16px;
    padding: 10px;
  }

  .avatar {
    width: 50px;
    height: 50px;
  }

  .message-item {
    padding: 20px;
    font-size: 16px;
  }

  .comment-input {
    flex-direction: row; 
    align-items: center;
    gap: 0;
  }

  .send-button {
    width: auto; 
  }

  .input-box {
    width: 100%;
}
}

@media (max-width: 468px) {
  .user-details1 {
    font-size: 14px;
    font-weight: 500;
}
.message-date {
    font-size: 11px;
}

.message-tabs button{
        font-size: 14px;
        padding: 8px;
    }
.rating {
    font-size: 18px;
}
.message-actions {
    gap: 5px;
    font-size: 24px;
}
.message-tabs{
    flex-wrap: nowrap;
    gap:5px;
}
}
</style>
