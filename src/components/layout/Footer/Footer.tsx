import React from "react";
import { Link } from "react-router-dom";
import { Package, Mail, Phone, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const linkVariants = {
    rest: { x: 0 },
    hover: {
      x: 4,
      transition: { duration: 0.2, ease: "easeOut" as const },
    },
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-4 group w-fit"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Package className="w-7 h-7" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                GiftCards
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Your trusted source for gift cards. Instant delivery, 24/7
              support, and secure transactions guaranteed.
            </p>
            <motion.div
              className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500"
              whileHover={{ scale: 1.02 }}
            >
              <span>Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              </motion.div>
              <span>for our customers</span>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5 relative inline-block">
              Quick Links
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/products", label: "Browse Cards" },
                { to: "/about", label: "About Us" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <motion.li
                  key={link.to}
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <Link
                    to={link.to}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5 relative inline-block">
              Support
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: "/help", label: "Help Center" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/refund", label: "Refund Policy" },
              ].map((link) => (
                <motion.li
                  key={link.to}
                  variants={linkVariants}
                  initial="rest"
                  whileHover="hover"
                >
                  <Link
                    to={link.to}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary-600 dark:bg-primary-400 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5 relative inline-block">
              Contact Us
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-transparent"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </h3>
            <ul className="space-y-4 text-sm">
              <motion.li
                className="flex items-start gap-3 group"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-shrink-0 w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                  <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="pt-1.5">
                  <a
                    href="mailto:nothing@giftcards.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    nothing@giftcards.com
                  </a>
                </div>
              </motion.li>
              <motion.li
                className="flex items-start gap-3 group"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-shrink-0 w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                  <Phone className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="pt-1.5">
                  <a
                    href="tel:+84111111111"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    +84 111 111 111
                  </a>
                </div>
              </motion.li>
              <motion.li
                className="flex items-start gap-3 group"
                whileHover={{ x: 2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-shrink-0 w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
                  <MapPin className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="pt-1.5">
                  <span className="text-gray-600 dark:text-gray-400">
                    Ho Chi Minh City, Vietnam
                  </span>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-gray-300 dark:border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              &copy; {currentYear} GiftCards. All rights reserved.
            </motion.p>

            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              {/* Payment Methods Icons (Optional) */}
              <div className="flex items-center gap-2">
                {["💳", "🏦", "💰"].map((icon, index) => (
                  <motion.div
                    key={index}
                    className="w-10 h-7 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center text-lg shadow-sm"
                    whileHover={{ y: -2, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
