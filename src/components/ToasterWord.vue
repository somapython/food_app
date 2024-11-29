<template>
  <div v-if="visible" class="toaster" :class="type">
    <span class="icon">
      <template v-if="type === 'success'">&#x2714;</template> <!-- Check mark -->
      <template v-else-if="type === 'error'">&#9888;</template> <!-- error -->
      <template v-else-if="type === 'warning'">&#9888;</template> <!-- Warning -->
      <template v-else>&#8505;</template> <!-- Info icon -->
    </span> 
    <span>{{ message }}</span>
    <button class="close-btn" @click="close">&times;</button>
  </div>
</template>

<script>
export default {
  name: 'ToasterWord',
  data() {
    return {
      visible: false,
      message: '',
      type: 'info', // or 'success', 'error', 'warning', etc.
      timer: null,
    };
  },
  methods: {
    show(message, type = 'success') {
      this.message = message;
      this.type = type;
      this.visible = true;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.visible = false;
      }, 4500);
    },
    close() {
      this.visible = false;
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
  },
};
</script>

<style scoped>
.toaster {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 5px;
  color: #fff;
  font-weight: bold;
  z-index: 9999;
  background-color: #333; 
  opacity: 0.9;
  transition: opacity 0.5s ease;
  display: flex;
  align-items: center;
  max-width: 350px; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}
.toaster.info { background-color: #007bff; }
.toaster.success { background-color: #28a745; }
.toaster.error { background-color: #dc3545; }
.toaster.warning {background-color: #ffc107; color: #000; 
}

.icon {
  margin-right: 10px;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  margin-left: auto; 
  cursor: pointer;
  margin-left: 25px;
}

.close-btn:hover {
  color: #ccc;
}

@media (max-width: 768px) {
  .toaster {
    top: 10px; 
    right: 10px; 
    padding: 8px 12px; 
    max-width: 90%; 
    font-size: 14px; 
  }

  .icon {
    font-size: 16px;
  }

  .close-btn {
    font-size: 18px; 
  }
}

@media (max-width: 480px) {
  .toaster {
    padding: 6px 10px;
    top: 5px; 
    right: 5px; 
  }

  .icon {
    font-size: 14px; 
  }

  .close-btn {
    font-size: 16px;
  }
}
</style>
