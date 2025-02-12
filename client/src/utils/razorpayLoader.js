// Function to dynamically load Razorpay JS SDK
const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay); // Return the Razorpay object if already loaded
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js"; // Razorpay SDK URL
      script.onload = () => resolve(window.Razorpay); // Resolve the Razorpay object after loading
      script.onerror = (error) => reject(error); // Handle loading errors
      document.head.appendChild(script); // Add the script to the head of the document
    }
  });
};

export default loadRazorpay;
