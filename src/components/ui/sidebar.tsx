"use client";
// import { cn } from "@/lib/utils";
// import React, { useState, createContext, useContext } from "react";
// import { AnimatePresence, motion } from "motion/react";
// import { IconMenu2, IconX } from "@tabler/icons-react";

// interface Links {
//   label: string;
//   href: string;
//   icon: React.JSX.Element | React.ReactNode;
// }

// interface SidebarContextProps {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   animate: boolean;
// }

// const SidebarContext = createContext<SidebarContextProps | undefined>(
//   undefined
// );

// export const useSidebar = () => {
//   const context = useContext(SidebarContext);
//   if (!context) {
//     throw new Error("useSidebar must be used within a SidebarProvider");
//   }
//   return context;
// };

// export const SidebarProvider = ({
//   children,
//   open: openProp,
//   setOpen: setOpenProp,
//   animate = true,
// }: {
//   children: React.ReactNode;
//   open?: boolean;
//   setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
//   animate?: boolean;
// }) => {
//   const [openState, setOpenState] = useState(false);

//   const open = openProp !== undefined ? openProp : openState;
//   const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

//   return (
//     <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const Sidebar = ({
//   children,
//   open,
//   setOpen,
//   animate,
// }: {
//   children: React.ReactNode;
//   open?: boolean;
//   setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
//   animate?: boolean;
// }) => {
//   return (
//     <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
//       {children}
//     </SidebarProvider>
//   );
// };

// export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
//   return (
//     <>
//       <DesktopSidebar {...props} />
//       <MobileSidebar {...(props as React.ComponentProps<"div">)} />
//     </>
//   );
// };

// export const DesktopSidebar = ({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<typeof motion.div>) => {
//   const { open, setOpen, animate } = useSidebar();
//   return (
//     <>
//       <motion.div
//         className={cn(
//           "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
//           className
//         )}
//         animate={{
//           width: animate ? (open ? "300px" : "60px") : "300px",
//         }}
//         onMouseEnter={() => setOpen(true)}
//         onMouseLeave={() => setOpen(false)}
//         {...props}
//       >
//         {children}
//       </motion.div>
//     </>
//   );
// };

// export const MobileSidebar = ({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<"div">) => {
//   const { open, setOpen } = useSidebar();
//   return (
//     <>
//       <div
//         className={cn(
//           "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
//         )}
//         {...props}
//       >
//         <div className="flex justify-end z-20 w-full">
//           <IconMenu2
//             className="text-neutral-800 dark:text-neutral-200"
//             onClick={() => setOpen(!open)}
//           />
//         </div>
//         <AnimatePresence>
//           {open && (
//             <motion.div
//               initial={{ x: "-100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0 }}
//               transition={{
//                 duration: 0.3,
//                 ease: "easeInOut",
//               }}
//               className={cn(
//                 "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
//                 className
//               )}
//             >
//               <div
//                 className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
//                 onClick={() => setOpen(!open)}
//               >
//                 <IconX />
//               </div>
//               {children}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export const SidebarLink = ({
//   link,
//   className,
//   ...props
// }: {
//   link: Links;
//   className?: string;
// }) => {
//   const { open, animate } = useSidebar();
//   return (
//     <a
//       href={link.href}
//       className={cn(
//         "flex items-center justify-start gap-2  group/sidebar py-2",
//         className
//       )}
//       {...props}
//     >
//       {link.icon}

//       <motion.span
//         animate={{
//           display: animate ? (open ? "inline-block" : "none") : "inline-block",
//           opacity: animate ? (open ? 1 : 0) : 1,
//         }}
//         className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
//       >
//         {link.label}
//       </motion.span>
//     </a>
//   );
// };
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Community', href: '/community' },
  { label: 'Contact', href: '/contact' },
];

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('.nav-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-800 shadow-md' : 'bg-transparent'}`}>
      <div className="nav-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          {/* <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Brand
            </Link>
          </div> */}
          <div className="flex items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600"
          >
            <span className="text-2xl">callm</span>
            <span className="text-blue-400 text-xl">★</span>
          </Link>
        </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-blue-200 hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
            <SignedOut>
            <SignInButton>
            <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
              Sign In
            </span>
            </SignInButton>

            <SignUpButton>
            <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
              Sign Up
            </span>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSwitchSessionUrl='/'/>
            </SignedIn>
          </nav>
        {/* Mobile menu button */}

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}

      <div className={`md:hidden bg-white absolute w-full shadow-md transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full opacity-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-base font-medium text-gray-600 hover:bg-indigo-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
          <div className="px-4 py-4">
            <SignedOut>
            <SignInButton>
            <span className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200">
              Sign In
            </span>
            </SignInButton>
            <SignUpButton>
            <span className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors duration-200">
              Sign Up
            </span>
            </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSwitchSessionUrl='/'/>
            </SignedIn>
          </div>
        </div>
      </div>
      
    
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40" onClick={toggleMenu}></div>
      )}
    </header>
  );
};

export default Navbar;