import "./globals.css"; 

// Import shared components
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

// Import the AuthProvider to wrap the application
import { AuthProvider } from "../context/AuthContext"; 

export const metadata = {
  title: "Care360",
  description: "Protect, Repair, Inspect your vehicle with Care360.",
};

// RootLayout component
export default function RootLayout({ children }) {
  return (
    <html lang="en">      
      <body className="flex flex-col min-h-screen"> 
        {/* Wrap the core application structure with AuthProvider */}
        {/* This makes auth state available to all child components */}
        {/* --- V V V --- 2. Ensure AuthProvider wraps Navbar, main, and Footer --- V V V --- */}
        <AuthProvider>
          <Navbar /> 
          <main className="flex-grow container mx-auto px-4 py-8"> {/* Basic container */}
            {children} {/* Page content renders here */}
          </main>
          <Footer /> {/* Footer can also be inside */}
        </AuthProvider>
        

      </body>
    </html>
  );
}
