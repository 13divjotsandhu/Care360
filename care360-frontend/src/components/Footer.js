import React from 'react';
import { useRouter } from 'next/router';
import styles from './Footer.module.css'; 

function Footer() {
  const router = useRouter();
  const path = router.pathname; // This gives dynamic route pattern e.g. /chat/booking/[bookingId]

  // Hide footer if the path starts with /chat/booking
  if (path.startsWith('/chat/booking')) {
    return null;
  }

  return (
    <footer className={styles.footer}> {/* Apply the footer class */}
      <div className={styles.container}> {/* Apply the container class */}
        © {new Date().getFullYear()} Care360: Protect, Repair, Inspect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
