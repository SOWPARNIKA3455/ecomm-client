import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RootLayout from './layout/RootLayout'; // Includes Navbar
import AdminLayout from './layout/AdminLayout'; // No Navbar

// Pages
import Home from './pages/Home';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import ProductList from './pages/user/ProductList';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './components/Cart';
import PaymentPage from './pages/user/PaymentPage';
import PaymentSuccess from './pages/user/PaymentSuccess';
import Checkout from './pages/user/CheckOut';
import OrderHistory from './pages/user/OrderHistory';
import Wishlist  from './pages/user/Wishlist';
import PaymentCancelled from './pages/user/paymentCancelled';
import UserDashboard from './pages/user/UserDashboard';

import ProtectedRoutes from './layout/ProtectedRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManage from './pages/admin/ProductManage';
import UserManage from './pages/admin/UserManage';
import OrderManage from './pages/admin/OrderManage';

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerOrderManage from './pages/seller/SellerOrderManage';
import ProductSell from './pages/seller/ProductSell';
import BecomeSeller from './pages/seller/BecomeSeller';
import SellerLayout from './layout/SellerLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public and User/Seller Layout */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/category/:category" element={<ProductList />} />
          <Route path="products/:productId" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/user/wishlist" element={<Wishlist />} />
          <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="userdashboard" element={<UserDashboard />} />
          <Route path="seller/register" element={<BecomeSeller />} />
          <Route path="/orders" element={<OrderHistory />} />
          {/* Seller Protected Routes */}
          <Route element={<ProtectedRoutes sellerOnly={true} />}>
            <Route path="sellerdashboard" element={<SellerDashboard />} />
            <Route path="sellerdashboard/sell" element={<SellerLayout><ProductSell /></SellerLayout>} />
            <Route path="sellerdashboard/orders" element={<SellerLayout><SellerOrderManage /></SellerLayout>} />
          </Route>
        </Route>

        {/* Admin Routes use AdminLayout (no Navbar) */}
        <Route element={<ProtectedRoutes adminOnly={true} />}>
          <Route path="/admindashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admindashboard/products" element={<AdminLayout><ProductManage /></AdminLayout>} />
          <Route path="/admindashboard/users" element={<AdminLayout><UserManage /></AdminLayout>} />
          <Route path="/admindashboard/orders" element={<AdminLayout><OrderManage /></AdminLayout>} />
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
