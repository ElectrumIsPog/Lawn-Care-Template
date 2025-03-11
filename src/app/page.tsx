import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-lawn.jpg"
            alt="Beautiful lawn"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Lawn Care Services
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Transform your outdoor space with our expert lawn care and landscaping services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/services" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Our Services
            </Link>
            <Link 
              href="/contact" 
              className="bg-white hover:bg-gray-100 text-green-800 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
              <div className="h-48 relative">
                <Image
                  src="/lawn-mowing.jpg"
                  alt="Lawn Mowing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-green-800">Lawn Mowing</h3>
                <p className="text-gray-700 mb-4">
                  Regular lawn mowing services to keep your grass healthy and looking great year-round.
                </p>
                <Link 
                  href="/services#lawn-mowing" 
                  className="text-green-600 font-semibold hover:text-green-800"
                >
                  Learn More →
                </Link>
              </div>
            </div>
            
            {/* Service Card 2 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
              <div className="h-48 relative">
                <Image
                  src="/landscaping.jpg"
                  alt="Landscaping"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-green-800">Landscaping</h3>
                <p className="text-gray-700 mb-4">
                  Professional landscaping design and installation to transform your outdoor living space.
                </p>
                <Link 
                  href="/services#landscaping" 
                  className="text-green-600 font-semibold hover:text-green-800"
                >
                  Learn More →
                </Link>
              </div>
            </div>
            
            {/* Service Card 3 */}
            <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
              <div className="h-48 relative">
                <Image
                  src="/fertilization.jpg"
                  alt="Lawn Fertilization"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-green-800">Fertilization</h3>
                <p className="text-gray-700 mb-4">
                  Lawn fertilization and weed control treatments for a lush, green, and healthy lawn.
                </p>
                <Link 
                  href="/services#fertilization" 
                  className="text-green-600 font-semibold hover:text-green-800"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/services" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Experienced Professionals</h3>
              <p className="text-gray-700">
                Our team has years of experience in lawn care and landscaping services.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Reliable Service</h3>
              <p className="text-gray-700">
                We pride ourselves on being punctual and reliable for every appointment.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Affordable Pricing</h3>
              <p className="text-gray-700">
                Competitive rates with no hidden fees and free estimates for all projects.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="text-center">
              <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
              <p className="text-gray-700">
                We stand behind our work with a 100% satisfaction guarantee on all services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Lawn?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today for a free consultation and estimate for your lawn care needs.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-green-800 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors text-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
