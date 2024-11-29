import { createRouter, createWebHistory } from 'vue-router';
import HomeWord from '../components/HomeWord.vue';
import MenuWord from '../components/dashboard/MenuWord.vue';
import AdminWord from '../components/AdminWord.vue';
import CartWord from '../components/CartWord.vue';
import ItemDetail from '../components/ItemDetails.vue';
import ContactWord from '../components/ContactWord.vue';
import PaymentWord from '../components/PaymentWord.vue';
import OrderTracking from '../components/OrderTracking.vue';
import DashboardWord from '../components/dashboard/DashboardWord.vue';
import DownloadWord from '../components/dashboard/DownloadWord.vue';
import OrderListWord from '../components/dashboard/OrderListWord.vue';
import TeamsWord from '../components/dashboard/TeamsWord.vue';
import MessagesWord from '../components/dashboard/MeassagesWord.vue';
import LogsWord from '../components/dashboard/LogsWord.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeWord },
  { path: '/menu', name: 'Menu', component: MenuWord},
  { path: '/admin', name: 'Admin', component: AdminWord },
  { path: '/cart', name: 'Cart', component: CartWord },
  { path: '/dashboard', name: 'Order', component: DashboardWord },
  { path: '/download', name: 'Download', component: DownloadWord },
  { path: '/order_list', name: 'Order_List', component: OrderListWord },
  { path: '/teams', name: 'Teams', component: TeamsWord },
  { path: '/messages', name: 'Messages', component: MessagesWord },
  { path: '/logs', name: 'Logs', component: LogsWord },
  { path: '/:itemName', name: 'ItemDetail', component: ItemDetail, props: true},
  { path: '/contact', name: 'Contact', component: ContactWord },
  { path: '/payment', name: 'Payment', component: PaymentWord },
  { path: '/track-order', name: 'OrderTracking', component: OrderTracking,}, 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
