import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const AmazonHomePage = () => {
  const navigate = useNavigate();

const { addToCart } = useAuth();

  const categories = [
    {
      name: 'Electronics',
      image: 'https://www.shutterstock.com/image-illustration/3d-variety-home-appliances-concept-600nw-2048419898.jpg',
    },
    
    {
      name: 'kids',
      image: 'https://cdn.tatlerasia.com/tatlerasia/i/2022/01/07130738-03-fendi-kids-ss22-collection-special-images_cover_1250x1473.jpg',
    },
    {
      name: 'Accessories',
      image: 'https://img.freepik.com/free-photo/model-career-kit-still-life_23-2150229754.jpg?semt=ais_hybrid&w=740',
    },
    {
      name: 'Men',
      image: 'https://wwd.com/wp-content/uploads/2025/01/CANALI_FW25_Lookbook_Hero01-2.jpg?w=1000&h=563&crop=1',
    },
  ];

  const trendingDeals = [
    {
      title: "Summer Electronics Sale",
      description: "Up to 50% off on headphones, smartwatches & more!",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxtM204Bxej5AwnZHP9-qO81vrfM6QnZ9tLm9QSboHaw4za44ZULr-8N-hTq3xEviZ8Fs&usqp=CAU"
    },
    {
      title: "Furniture Mega Offer",
      description: "Modern sofas and chairs at unbeatable prices.",
      image: "https://cdn.prod.website-files.com/5f2b10811da7064399ed3a1c/67640c8522c8591272b1b65f_1.webp",
    },
    {
      title: "New Gadgets Launch",
      description: "Check out the latest tech gadgets in our store.",
      image: "https://static.vecteezy.com/system/resources/thumbnails/048/639/114/small_2x/smartphone-mockup-background-free-photo.jpg",
    },
    {
      title: "Top Accessories",
      description: "Trending fashion & mobile accessories on sale.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfhq9K4Q8T6UEFKYN3i90IdsoEB7IZKb3VgQ&s",
    },
    {
      title: "New Home Decors",
      description: "Because every corner deserves beauty.",
      image: "https://d3mbwbgtcl4x70.cloudfront.net/new_home_essentials_01_496d1c58c5.webp",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  

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
      'https://d3995ea24pmi7m.cloudfront.net/fit-in/640x285/media/wysiwyg/special-offers/TeesFLAT60.jpg',
      'https://sencowebfiles.s3.ap-south-1.amazonaws.com/contents/banner/kXSAXF5HX58hOOTmqhKtX6JZ77UVTaj6QBLPG7Q6.jpeg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6Kz2m-pxY_REQ4-AHvy2DR2Ps-bmOvtMsSA&s',
      'https://img.freepik.com/free-vector/fashion-store-banner-template_1361-1248.jpg?semt=ais_hybrid&w=740',
    ].map((img, i) => (
      <div key={i} className=" rounded shadow hover:shadow-md">
        <img src={img} alt={`Ad ${i}`} className="h-40 w-full object-cover rounded" />
      </div>
    ))}
  </div>
</div>



      {/* Categories */}
      <div className="mb-10">
        <h2 className="text-3xl  font-bold mb-15 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => navigate(`/products/category/${encodeURIComponent(cat.name)}`)}
              className=" shadow rounded overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-transform duration-200"
            >
              <img src={cat.image} alt={cat.name} className="h-60 w-full object-cover rounded" />
              <p className="text-center p-2 font-medium">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>


      <section className="py-16 px-4 bg-blue-100 sm:px-10">
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
    💬 What Our Customers Say
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <p className="text-gray-700 italic">
        "Tech Haven has the best prices and amazing customer service!"
      </p>
      <div className="mt-4 text-right">
        <span className="font-semibold text-gray-900">— Alex</span>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <p className="text-gray-700 italic">
        "Fast shipping and great product quality. Highly recommended!"
      </p>
      <div className="mt-4 text-right">
        <span className="font-semibold text-gray-900">— Jamie</span>
      </div>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
      <p className="text-gray-700 italic">
        "Amazing experience! I always find what I need here."
      </p>
      <div className="mt-4 text-right">
        <span className="font-semibold text-gray-900">— Priya</span>
      </div>
    </div>
  </div>
</section>



{/* Trending Deals Carousel */}
      <div className="py-16 ">
        <h2 className="text-3xl font-bold text-center text-black-800 mb-10">🔥 Trending Deals</h2>
        <div className="max-w-6xl mx-auto px-4">
          <Slider {...sliderSettings}>
            {trendingDeals.map((deal, i) => (
              <div key={i} className="px-3 ">
                <div className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-lg transition duration-300 h-full">
                  <img src={deal.image} alt={deal.title} className="h-40 w-full object-contain rounded mb-3" />
                  <h3 className="text-lg font-semibold text-black mb-1">{deal.title}</h3>
                  <p className="text-sm text-gray-600">{deal.description}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>



     
    </div>
  );
};

export default AmazonHomePage;
