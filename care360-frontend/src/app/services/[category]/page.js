'use client'; // Needed for useParams hook

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; 
import styles from './category.module.css'; 

const allServicesData = {
  repair: {
    displayName: 'Car Repair Services',
    services: [
      { id: '6809030a58fa43a90ca0a247', name: 'Engine diagnostics and repair', description: 'Comprehensive engine checks and expert repairs.', price: 15000, duration: 8 },
      { id: '6809035458fa43a90ca0a24a', name: 'Brake inspection and replacement', description: 'Ensuring your brakes are safe and responsive.', price: 1500, duration: 2 },
      { id: '6809038c58fa43a90ca0a24c', name: 'Battery check and replacement', description: 'Testing and replacing car batteries as needed.', price: 8000, duration: 1 },
      { id: '680903a858fa43a90ca0a24e', name: 'AC repair and maintenance', description: 'Keeping your car cool with AC servicing and repairs.', price: 1200, duration: 2 },
      { id: '680903cc58fa43a90ca0a250', name: 'Suspension and alignment', description: 'Improving ride comfort and handling with suspension checks and wheel alignment.', price: 180, duration: 3 },
    ]
  },
  detailing: {
    displayName: 'Car Detailing Services',
    services: [
      { id: '680903f458fa43a90ca0a252', name: 'Exterior wash and wax', description: 'Giving your car a brilliant shine and protection.', price: 500, duration: 1 },
      { id: '6809040f58fa43a90ca0a254', name: 'Interior deep cleaning', description: 'Thorough cleaning of carpets, upholstery, and surfaces.', price: 900, duration: 2 },
      { id: '6809043558fa43a90ca0a256', name: 'Ceramic coating', description: 'Long-lasting paint protection with a glossy finish.', price: 3000, duration:3  },
      { id: '6809046658fa43a90ca0a259', name: 'Paint protection film (PPF)', description: 'Applying a clear film to protect paint from chips and scratches.', price: 40000, duration: 9 },
      { id: '6809048458fa43a90ca0a25b', name: 'Headlight restoration', description: 'Restoring clarity to foggy or yellowed headlights.', price: 6000, duration: 1 },
    ]
  },
  pdi: {
    displayName: 'Car PDI (Inspection)',
    services: [
      { id: '6809049f58fa43a90ca0a25d', name: 'Comprehensive vehicle checkup', description: 'A thorough inspection before you take delivery of a new or used car.', price: 100, duration: 2 },
      { id: '680904c158fa43a90ca0a25f', name: 'Tire and brake inspection', description: 'Detailed check of tire condition, pressure, and brake system components.', price: 700, duration: 1 },
      { id: '680904d958fa43a90ca0a261', name: 'Electrical system check', description: 'Verifying lights, battery, alternator, and other electrical components.', price: 80, duration: 1 },
      { id: '680904f458fa43a90ca0a263', name: 'Fluid levels and leak check', description: 'Checking engine oil, coolant, brake fluid, and other essential fluids for levels and leaks.', price: 500, duration: 1 },
      { id: '6809051558fa43a90ca0a265', name: 'Test drive and performance analysis', description: 'Assessing the vehicle\'s performance and handling during a test drive.', price: 90, duration: 1 },
    ]
  }
};

// Category Detail Page Component (Static Version)
export default function StaticCategoryDetailPage() {
  const params = useParams(); 
  const categoryId = params.category; 

// Find the data for the current category from the hardcoded object
  const categoryData = allServicesData[categoryId];

//Render Error State if category is invalid
  if (!categoryData) {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.pageTitle}>Error</h1>
            <p className={`${styles.errorMessage} text-center`}>
                Invalid service category: '{categoryId}'. Please go back and select a valid category.
            </p>
            <div className="text-center mt-8">
                <Link href="/services" className="text-blue-600 hover:underline">
                    &larr; Back to Service Categories
                </Link>
            </div>
        </div>
    );
  }

//Render Category Services
  return (
    <div className={styles.pageContainer}>
      {/* Use the displayName from the hardcoded data */}
      <h1 className={styles.pageTitle}>{categoryData.displayName}</h1>

      {/* Check if any services are defined for this category */}
      {!categoryData.services || categoryData.services.length === 0 ? (
        <p className="text-center text-gray-500 italic">No specific services listed for this category yet.</p>
      ) : (
        <section className={styles.categorySection}>
          <ul className={styles.serviceList}>
            {/* Map through the hardcoded services for this category */}
            {categoryData.services.map((service) => (
              // Use the hardcoded 'id' as the key (replace with real _id later)
              <li key={service.id} className={styles.serviceItem}>
                <div className={styles.serviceDetails}>
                  <h3 className={styles.serviceName}>{service.name}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <p className={styles.serviceMeta}>
                    Price: Rs{service.price} | Duration: {service.duration} hrs
                  </p>
                </div>
                <Link
                  // *** IMPORTANT: This uses the hardcoded service.id ***  
                  href={`/book?serviceId=${encodeURIComponent(service.id)}&serviceName=${encodeURIComponent(service.name)}&category=${encodeURIComponent(categoryData.displayName)}&price=${encodeURIComponent(service.price)}`}
                  className={styles.bookButton}
                >
                  Book Now
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
       {/* Link back to the main services overview */}
       <div className="text-center mt-8">
            <Link href="/services" className="text-blue-600 hover:underline">
                &larr; Back to Service Categories
            </Link>
       </div>
    </div>
  );
}
