<template>
  <div class="sidebar-wrapper" :style="{ height: dynamicHeight + 'px' }">
    <!-- Sidebar -->
    <div class="sidebar" :class="{ open: isSidebarOpen || isLargeScreen }">
      <ul>
        <li :class="{ active: isActive('/dashboard') }">
          <router-link to="/dashboard">
            <img src="./assets/dashboard/sidebar/dashboard.png" alt="dashboard" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Dashboard</span>
          </router-link>
        </li>
        <li :class="{ active: isActive('/menu') }">
          <router-link to="/menu">
            <img src="./assets/dashboard/sidebar/menu.png" alt="menu" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Menu</span>
          </router-link>
        </li>
        <li :class="{ active: isActive('/order_list') }">
          <router-link to="/order_list">
            <img src="./assets/dashboard/sidebar/order_list.png" alt="order_list" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Order List</span>
          </router-link>
        </li>
        <li :class="{ active: isActive('/download') }">
          <router-link to="/download">
            <img src="./assets/dashboard/sidebar/downloads.png" alt="downloads" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Download</span>
          </router-link>
        </li>
        <li :class="{ active: isActive('/teams') }">
          <router-link to="/teams">
            <img src="./assets/dashboard/sidebar/teams.png" alt="teams" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Teams</span>
          </router-link>
        </li>
        <li :class="{ active: isActive('/messages') }">
          <router-link to="/messages">
            <img src="./assets/dashboard/sidebar/messages.png" alt="messages" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Messages</span>
          </router-link>
        </li>
        <li :class="{ active: isActive('/logs') }">
          <router-link to="/logs">
            <img src="./assets/dashboard/sidebar/logs.png" alt="logs" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Logs</span>
          </router-link>
        </li>
        <li @click="logout" class="logout">
          <a href="#"> <img src="./assets/dashboard/sidebar/logout.png" alt="logout" loading="lazy"/>
            <span v-if="isSidebarOpen || isLargeScreen">Log out</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SidebarWord',
  data() {
    return {
      isSidebarOpen: false,
      isLargeScreen: window.innerWidth > 768,
      dynamicHeight: 0,
    };
  },
  mounted() {
    this.setDynamicHeight();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
    logout() {
      this.$router.push('/');
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    setDynamicHeight() {
      const mainContent = document.querySelector('.main-content'); 
      this.dynamicHeight = mainContent ? mainContent.offsetHeight : window.innerHeight;
    },
    handleResize() {
      this.isLargeScreen = window.innerWidth > 768; 
      this.setDynamicHeight(); 
    },
  },
};
</script>
<style>
.sidebar-wrapper {
  display: flex;
  height: auto;
  position: relative;
  min-height: 100vh;
}
.sidebar {
  width: 80px;
  background-color: #2c2c2c;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.open {
  width: 250px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  position: relative;
}

.sidebar ul li a {
  display: flex;
  align-items: center;
  padding: 22px 20px;
  text-decoration: none;
  color: #cf8181;
  font-size: 16px;
  transition: background 0.3s ease;
  width: 100%;
}

.sidebar ul li a img {
  width:32px;
  height: auto;
}

.sidebar ul li:hover a {
  background-color: #444;
}

.sidebar ul li.active a {
  background-color: #bcc4ff;
}

.logout {
  margin-top: auto;
}

.sidebar ul li a span {
  display: none;
  opacity: 0;
  transition: opacity 0.3s;
}

.sidebar.open ul li a span {
  display: inline;
  opacity: 1;
  margin-left: 10px;
  font-size: 20px;
}

.sidebar ul li:hover a {
  background-color: #444;
}

.sidebar ul li.active a {
  background-color: #f1eeee;
}

.toggle-btn {
  position: absolute;
  top: 50%;
  left: 80px;
  transform: translateY(-50%);
  background-color: #2166c9;
  color: #fff;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease;
}

.sidebar.open + .toggle-btn {
  left: 250px;
}

.toggle-btn span {
  font-size: 18px;
  font-weight: bold;
}

@media screen and (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }

  .sidebar.open {
    width: 160px;
  }

  .sidebar.open ul li a span {
    margin-left: 8px;
    font-size: 16px;
  }

  .sidebar ul li a img {
    width: 26px;
    height: auto;
}

  .toggle-btn {
    left: 60px;
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .sidebar.open {
    width: 80px;
  }

  .sidebar ul li a span {
    display: none;
  }

  .toggle-btn {
    left: 60px;
  }

}

@media screen and (max-width: 480px) {
  .sidebar {
    width: 20px;
  }

  .sidebar.open {
    width: 50px;
  }

  .toggle-btn {
    left: 40px;
  }
  .sidebar ul li a img {
    width: 16px;
    height: auto;
}

.sidebar ul li a {
    padding: 25px 1px;
}
}
</style>