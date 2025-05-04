import React from 'react';
import Link from 'next/link'; 
import styles from './page.module.css'; 
import Image from 'next/image';
const serviceCategories = [
  { id: 'repair', name: 'Car Repair Services', description: 'Expert diagnostics, maintenance, and repairs for all your car troubles.', icon: '🔧', link: '/services' },
  { id: 'detailing', name: 'Car Detailing Services', description: 'Restore your car beauty with our comprehensive detailing packages.', icon: '✨', link: '/services' },
  { id: 'pdi', name: 'Car PDI (Inspection)', description: 'Ensure your vehicle is in perfect condition before purchase or long trips.', icon: ' :)', link: '/services' },
];

// Homepage component
export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Welcome to Care360
        </h1>
        <p className={styles.heroSubtitle}>
          Your trusted partner for comprehensive car care. We Protect, Repair, and Inspect your vehicle with expertise and convenience.
        </p>
        <Link href="/services" className={styles.heroButton}>
          Book a Service
        </Link>
        <br></br><br></br>
        {/*<p style={{color:"white"}}>Scroll To Explore </p>*/}
        <div className={styles.scrollIndicator} > {/* Hide from screen readers */}
    <span>↓</span>
  </div>

      </section>

      {/* Video Slider Section (Placeholder) */}
      <section className={`${styles.section} ${styles.videoSliderSection}`}>
        <div className={styles.container}> {/* Optional container */}
          <h2 className={styles.sectionTitle}>See Us In Action</h2>
          {/* Placeholder for video slider - implement with library later */}
          <div className={styles.videoPlaceholder}>
           <video 
                    autoPlay
                    muted
                    fill="true"
                    loop 
                    preload="auto"
                    playsInline >
           <source src="/videos/Audi_Type_Change_Video_Ready.mp4" type="video/mp4" />
            Your browser does not support the video tag. {/* Fallback text */}
            </video>
          </div>
        </div>
      </section>

      {/* Picture Section (Placeholder) */}
      <section className={`${styles.section} ${styles.pictureSection}`}>
         <div className={styles.container}> {/* Optional container */}
            <h2 className={styles.sectionTitle}>Gallery</h2>
            <div className={styles.pictureGrid}>
              <div className={styles.picturePlaceholder}>
              <Image 
                 src="/images/clarity-coat-qu9XY-kl1oU-unsplash.jpg"
                 alt="Car Image 1"
                 fill                                
                />              
              </div>
              <div className={styles.picturePlaceholder}>
              <Image
                    src="/images/tekton-O_ufcLVTAYw-unsplash.jpg" 
                    alt="Car Image 2" 
                    fill
                />
              </div>
              <div className={styles.picturePlaceholder}>
                <Image
                    src="/images/kate-ibragimova-bEGTsOCnHro-unsplash.jpg" 
                    alt="Car Image 3"
                    fill                    
                 />
              </div>
              <div className={styles.picturePlaceholder}>
                <Image
                    src="/images/istockphoto-1203343517-612x612.jpg" 
                    alt="Car Image 4" 
                    fill                    
                 />
              </div>
              <div className={styles.picturePlaceholder}>
                <Image
                    src="/images/david-glessner-works-c-ebQX7w9FI-unsplash.jpg" 
                    alt="car Image 5" 
                    fill                    
                 />
              </div>
              <div className={styles.picturePlaceholder}>
                <Image
                    src="/images/istockphoto-1130307955-612x612.jpg" 
                    alt="Car image 6" 
                    fill  
                />
               </div>
              
              {/* Add more picture placeholders or use <Image> or Next.js <Image> */}
            </div>
         </div>
      </section>

      {/* Slogan Section */}
      <section className={styles.sloganSection}>
         <div className={styles.container}> {/* Optional container */}
            <p className={styles.sloganText}>
            Protect, Repair, Inspect: We have Got Your Vehicle Covered.
            
            </p>
         </div>
      </section>

      {/* About Us Section (Placeholder) */}
      <section className={`${styles.section} ${styles.aboutSection}`}>
         <div className={styles.container}> {/* Optional container */}
            <h2 className={styles.sectionTitle}>About Care360</h2>
            <div className={styles.aboutContent}>
                <h3>Our Mission</h3>
                <p>
                We aim to simplify the car service experience by offering convenient online booking, transparent communication, and expert service for all your vehicle needs 
                and to be the most trusted and convenient platform for car owners, delivering exceptional protection, repair, and inspection services with integrity and care.
                </p>
                <h3 className="mt-4">Why Choose Us?</h3>
                <p>
                   Convenience: Book appointments, track your service in real-time, and communicate directly with technicians—all from our easy-to-use platform.<br></br><br></br> Expertise and Customer Focused:  
                   We are dedicated to providing a convenient, reliable, and high-quality experience for every car owner and our network includes certified professionals dedicated to providing top-quality repairs, detailing, and inspections.  <br></br><br></br>
Effortless Booking: Schedule your required service—Protect, Repair, or Inspect—in just a few clicks. <br></br><br></br> Communication: Connect instantly with service providers via live chat for any questions or updates.<br></br><br></br> 
 Quality Assured: We partner with skilled technicians committed to excellence.<br></br><br></br> Comprehensive Services: From protective detailing and PDI to complex repairs, we cover all your needs. 
                </p>
            </div>
         </div>
      </section>

      {/* Service Highlights Section (Moved Down) */}
      <section className={`${styles.section} ${styles.servicesSection}`}>
        {/* Container added for consistency */}
        <div className={styles.container}>
            <h2 className={styles.servicesTitle}>Our Core Services</h2>
            <div className={styles.servicesGrid}>
              {serviceCategories.map((category) => (
                <div key={category.id} className={styles.serviceCard}>
                  <span className={styles.serviceIcon}>{category.icon}</span>
                  <h3 className={styles.serviceName}>{category.name}</h3>
                  <p className={styles.serviceDescription}>{category.description}</p>
                  <Link href={category.link} className={styles.serviceLink}>
                   Book Now
                  </Link>
                </div>
              ))}
            </div>
        </div>
      </section>
    </>
  );
}
