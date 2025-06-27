import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';

const AmazonHomePage = () => {
  const navigate = useNavigate();



  const categories = [
    {
      name: 'Electronics',
      image: 'https://www.shutterstock.com/image-illustration/3d-variety-home-appliances-concept-600nw-2048419898.jpg',
    },
    {
      name: 'Home Decor',
      image: 'https://images.ctfassets.net/bjlp9d7o6h1o/7b0YKFSA3pKq9sRBzyBuOe/73f1ee3d0b2e029411f86b2992b9fb1f/Opendoor_2024_Home_Decor_Report_Blog_Header_2.jpg',
    },
    {
      name: 'kids',
      image: 'https://i.pinimg.com/originals/ea/87/38/ea873836677caa79714a3cbb49f2f018.jpg',
    },
    {
      name: 'Fashion',
      image: 'https://www.kalkifashion.com/blogs/wp-content/uploads/2023/12/Traditionally_Cool_Men_And_Women_Outfit_Ideas_for_Republic_Day-768x489.jpg',
    },
  ];

  const products = [
    {
      name: 'Wireless Headphones',
      price: '$59.99',
      image: 'https://m.media-amazon.com/images/I/612-xSgZ3vL.jpg',
    },
    {
      name: 'Eco-Friendly Plant Pot',
      price: '$14.99',
      image: 'https://images.meesho.com/images/products/546274890/q25ee_1200.jpg',
    },
    {
      name: 'Modern Sofa',
      price: '$399.00',
      image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQNMxuCN0Imqu3D4ha-yflYHrGSgBwMKvUBQMz4JnTtJrJjZ5AXNzb8u_ibGSUuxrrnaR7zsxW1LOYroVqO81mHswFUqplnpaE9mqYhEjpEqb8S09DOCDEEHg',
    },
    {
      name: 'Smart Watch',
      price: '$99.99',
      image: 'https://suprememobiles.in/cdn/shop/files/NoisePulse2ProSmartWatch-Blue.png?v=1732195380',
    },
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Top Banner */}
      <div className="w-full mb-6 ">
        <div className="bg-[url('/bg.png')] bg-cover bg-center h-190 flex items-center justify-center rounded-md bg-no-repeat">
  {/* your content */}

          <div className="text-center text-black bg-opacity-40 rounded">
            
            <button
              onClick={() => window.location.href = '/signup'}
              className="mt-140 px-6 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition"
            >
              Join Zenvue Now
            </button>
          </div>
        </div>
      </div>

{/* Small Box Advertisement Cards */}
<div className=" mb-19">

  <div className="grid grid-cols-2 sm:grid-cols-4 ">
    {[
      'https://rukminim2.flixcart.com/fk-p-flap/480/300/image/293b27988e44a530.jpg?q=90',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStpeMejxiSdT-sfdcRvCZKwBJs4qCUWGc5uQ&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Kz2m-pxY_REQ4-AHvy2DR2Ps-bmOvtMsSA&s',
      'https://img.freepik.com/free-vector/fashion-store-banner-template_1361-1248.jpg?semt=ais_hybrid&w=740',
    ].map((img, i) => (
      <div key={i} className=" rounded shadow hover:shadow-md">
        <img src={img} alt={`Ad ${i}`} className="h-60 w-full object-cover rounded" />
      </div>
    ))}
  </div>
</div>



      {/* Categories */}
      <div className="mb-10">
        <h2 className="text-3xl font-semibold mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/products/category/${encodeURIComponent(cat.name)}`)}
              className=" shadow rounded overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200"
            >
              <img src={cat.image} alt={cat.name} className="h-90 w-full object-cover rounded" />
              <p className="text-center p-2 font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className=" pb-10">
        <h2 className="text-3xl font-semibold mb-4">Featured Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products.map((prod, i) => (
            <div key={i} className="bg-white shadow rounded p-3">
              <img src={prod.image} alt={prod.name} className="h-40 w-full object-contain rounded" />
              <h3 className="text-sm mt-2 font-medium">{prod.name}</h3>
              <p className="text-orange-600 font-semibold">{prod.price}</p>
              <button className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-sm py-1 rounded">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmazonHomePage;
