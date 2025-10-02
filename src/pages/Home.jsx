
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaBolt, FaHeart, FaMobileAlt, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LandingPage = () => {
  // Animation controls
  const controls = useAnimation();
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [stepsRef, stepsInView] = useInView({ threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.1 });
  const [restaurantsRef, restaurantsInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (heroInView) controls.start('visible');
  }, [controls, heroInView]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section with Animation */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-r from-orange-500 to-[#FF4C29] text-white py-20 md:py-32"
      >
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.8 }
              }
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Delicious Food <br /> Delivered Fast
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-lg">
              Order from your favorite restaurants with just a few taps. Quick, easy, and delicious!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="bg-white text-[#FF4C29] px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300 text-center transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-20 transition duration-300 text-center transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8,
                delay: 0.3
              }
            } : {}}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Delicious food" 
                className="rounded-lg shadow-2xl w-full max-w-md transform rotate-2 hover:rotate-0 transition duration-500"
              />
              <motion.div 
                className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg hidden md:block"
                initial={{ scale: 0 }}
                animate={heroInView ? { 
                  scale: 1,
                  transition: { 
                    delay: 0.8,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }
                } : {}}
              >
                <div className="flex items-center">
                  <div className="bg-[#FF4C29] p-2 rounded-full mr-3">
                    <FaBolt className="text-white text-lg" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">30 min delivery</p>
                    <p className="text-sm text-gray-600">Guaranteed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Restaurant Showcase */}
      {/* <section ref={restaurantsRef} className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial="hidden"
            animate={restaurantsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            Popular Restaurants Near You
          </motion.h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Burger Palace",
                cuisine: "American • Burgers",
                rating: 4.8,
                deliveryTime: "20-30 min",
                image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "Sushi World",
                cuisine: "Japanese • Sushi",
                rating: 4.9,
                deliveryTime: "25-35 min",
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              },
              {
                name: "Pizza Heaven",
                cuisine: "Italian • Pizza",
                rating: 4.7,
                deliveryTime: "15-25 min",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
              }
            ].map((restaurant, index) => (
              <motion.div
                key={restaurant.name}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
                initial="hidden"
                animate={restaurantsInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.5,
                      delay: index * 0.1
                    }
                  }
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center shadow">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="font-bold text-sm">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{restaurant.name}</h3>
                  <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                  <div className="flex items-center text-gray-500">
                    <FaClock className="mr-1" />
                    <span className="text-sm mr-4">{restaurant.deliveryTime}</span>
                    <FaMapMarkerAlt className="mr-1" />
                    <span className="text-sm">1.2 miles</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={restaurantsInView ? { 
              opacity: 1,
              transition: { delay: 0.4 }
            } : {}}
          >
            <Link 
              to="/register" 
              className="inline-block border-2 border-[#FF4C29] text-[#FF4C29] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#FF4C29] hover:text-white transition duration-300"
            >
              View All Restaurants
            </Link>
          </motion.div>
        </div>
      </section> */}

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            Why Choose QuickPlate?
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <FaBolt className="text-4xl mb-4 text-[#FF4C29]" />,
                title: "Lightning Fast",
                description: "Get your food delivered in under 30 minutes or get it for free."
              },
              {
                icon: <FaUtensils className="text-4xl mb-4 text-[#FF4C29]" />,
                title: "100+ Restaurants",
                description: "Choose from a wide variety of cuisines and restaurants."
              },
              {
                icon: <FaHeart className="text-4xl mb-4 text-[#FF4C29]" />,
                title: "Healthy Options",
                description: "We offer plenty of healthy and dietary-specific meal choices."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white rounded-xl hover:shadow-lg transition duration-300"
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.5,
                      delay: index * 0.2
                    }
                  }
                }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "1",
                icon: <FaMobileAlt className="text-2xl" />,
                title: "Browse Restaurants",
                description: "Explore restaurants and menus in your area."
              },
              {
                number: "2",
                icon: <FaUtensils className="text-2xl" />,
                title: "Choose Your Meal",
                description: "Select your favorite dishes and add to cart."
              },
              {
                number: "3",
                icon: <FaBolt className="text-2xl" />,
                title: "Fast Delivery",
                description: "Track your order in real-time until it arrives."
              }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                className="bg-gray-50 p-8 rounded-lg hover:shadow-md transition duration-300 relative"
                initial="hidden"
                animate={stepsInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { 
                      duration: 0.5,
                      delay: index * 0.15
                    }
                  }
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-[#FF4C29] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-[#FF4C29] mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-gray-800"
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            What Our Customers Say
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah Johnson",
                rating: 5,
                review: "QuickPlate has completely changed how I order food. The delivery is always on time and the food arrives hot!",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Michael Chen",
                rating: 4,
                review: "Great selection of restaurants and the app is so easy to use. My go-to for food delivery now.",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg"
              },
              {
                name: "Emma Rodriguez",
                rating: 5,
                review: "I love the healthy options available. Makes eating well so convenient when I'm busy.",
                avatar: "https://randomuser.me/api/portraits/women/63.jpg"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                initial="hidden"
                animate={testimonialsInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, x: index % 2 === 0 ? -30 : 30 },
                  visible: { 
                    opacity: 1, 
                    x: 0,
                    transition: { 
                      duration: 0.6,
                      delay: index * 0.2
                    }
                  }
                }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FF4C29] text-white">
        <motion.div 
          className="container mx-auto px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8 }
          }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Try QuickPlate?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying delicious meals delivered to their doorstep.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-[#FF4C29] px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition duration-300 transform hover:scale-105"
          >
            Sign Up Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;


