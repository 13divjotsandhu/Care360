import React from 'react';
import styles from './Footer.module.css'; 

function Footer() {

  return (
    <footer className={styles.footer}> {/* Apply the footer class */}
      <div className={styles.container}> {/* Apply the container class */}
        © {new Date().getFullYear()} Care360: Protect, Repair, Inspect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
