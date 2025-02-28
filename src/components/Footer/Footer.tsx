import { Instagram } from "lucide-react";

function Footer() {
  const openLink = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <footer className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-900 text-white p-6 text-center md:text-left">
      {/* Copyright Section */}
      <div className="flex flex-col items-center md:items-start">
        <span>&copy; 2025 Takshak Event Management. All rights reserved.</span>
      </div>

      {/* Social Media Section */}
      <div className="flex flex-col items-center">
        <span className="mb-2">Follow us on</span>
        <div className="flex gap-3">
          <Instagram onClick={() => openLink("https://www.instagram.com/takshak.agt")} className="cursor-pointer hover:opacity-70" />
          {/* <Facebook onClick={() => openLink("https://www.facebook.com")} className="cursor-pointer hover:opacity-70" />
          <Youtube onClick={() => openLink("https://www.youtube.com")} className="cursor-pointer hover:opacity-70" /> */}
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col items-center md:items-start">
        <span className="font-semibold">Get in touch with us</span>
        <span>Phone: +91 7005483524</span>
        <span>Email: chiagartala@gmail.com</span>
        <span>Address: Dhaleswar Kalyani, Agartala</span>
      </div>

      {/* Links Section */}
      <div className="col-span-1 md:col-span-3 flex flex-wrap justify-center gap-4 mt-4 border-t border-gray-700 pt-4">
        <a href="/privacy-policy" className="text-gray-400 hover:text-white">
          Privacy Policy
        </a>
        <a
          href="/terms-and-conditions"
          className="text-gray-400 hover:text-white"
        >
          Terms and Conditions
        </a>
        <a
          href="/cancellation-and-refund"
          className="text-gray-400 hover:text-white"
        >
          Cancellation and Refund
        </a>
        <a href="/about" className="text-gray-400 hover:text-white">
          About Us
        </a>
        <a href="/contact" className="text-gray-400 hover:text-white">
          Contact Us
        </a>
      </div>
    </footer>
  );
}

export default Footer;
