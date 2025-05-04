import React from 'react';
import Link from 'next/link'; 
import styles from './services.module.css'; 

const mainCategories = [
  {
    id: 'repair', // This ID will be used in the URL path (e.g., /services/repair)
    name: 'Car Repair Services',
    description: 'Expert diagnostics, maintenance, and repairs for all your car troubles.',
    icon: '🔧', 
    link: '/services/repair', // Link to the dynamic route page for this category
  },
  {
    id: 'detailing', // Use 'detailing' as ID for the URL
    name: 'Car Detailing Services',
    description: 'Restore your car\'s beauty with our comprehensive detailing packages.',
    icon: '✨', 
    link: '/services/detailing', 
  },
  {
    id: 'pdi', // Use 'pdi' as ID for the URL
    name: 'Car PDI (Inspection)',
    description: 'Ensure your vehicle is in perfect condition before purchase or long trips.',
    icon: ':)', 
    link: '/services/pdi',
  },
];

// Services Overview Page Component
export default function ServicesOverviewPage() {
  return (
    // Apply page container style from the CSS module
    <div className={styles.pageContainer}>
      {/* Page Title */}
      <h1 className={styles.pageTitle}>Choose a Service Category</h1>
      <div className={styles.categoryGrid}>
        
        {/* Map through the mainCategories array to dynamically create a card for each */}

        {mainCategories.map((category) => (
          // Use Next.js Link component for the entire card to make it clickable
          <Link href={category.link} key={category.id} className={styles.categoryCard}>
            {/* Display category icon */}
            <span className={styles.categoryIcon}>{category.icon}</span>
            {/* Display category name */}
            <h2 className={styles.categoryName}>{category.name}</h2>
            {/* Display category description */}
            <p className={styles.categoryDescription}>{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
