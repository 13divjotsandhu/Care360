import React from 'react';
import { useRouter } from 'next/router';
import styles from './Footer.module.css'; 

function Footer() {
  const router = useRouter();
  const hideOnPaths = ['/chat']; // Add paths you want to hide footer on

  if (hideOnPaths.includes(router.pathname)) {
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
