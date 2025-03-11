import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Us - Lawn Care Pro',
  description: 'Learn about Lawn Care Pro, our history, our team, and our commitment to quality lawn care and landscaping services.',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.jpg"
            alt="Our team at work"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About Us
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Professional lawn care with a personal touch
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-8">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative h-64 md:h-80">
                <Image
                  src="/company-history.jpg"
                  alt="Company History"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <p className="text-gray-700 mb-4">
                  Founded in 2010, Lawn Care Pro began with a simple mission: to provide exceptional lawn care services with integrity, reliability, and attention to detail. What started as a small operation with just one truck and a few loyal customers has grown into a full-service lawn care and landscaping company serving the entire region.
                </p>
                <p className="text-gray-700">
                  Our founder, John Smith, started mowing lawns in his neighborhood as a teenager. His passion for creating beautiful outdoor spaces led him to study horticulture and landscape design before launching Lawn Care Pro. Today, our team of professionals shares that same passion and commitment to excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Quality</h3>
              <p className="text-gray-700 text-center">
                We take pride in our work and never cut corners. Our team is committed to delivering the highest quality service on every job, no matter the size.
              </p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Reliability</h3>
              <p className="text-gray-700 text-center">
                When we make a commitment, we keep it. Our customers can count on us to show up on time, communicate clearly, and deliver as promised.
              </p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Sustainability</h3>
              <p className="text-gray-700 text-center">
                We're committed to environmentally responsible practices that protect our planet while creating beautiful outdoor spaces for our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="/team-member-1.jpg"
                  alt="John Smith - Founder & CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">John Smith</h3>
                <p className="text-green-600 font-medium mb-4">Founder & CEO</p>
                <p className="text-gray-700 text-sm">
                  With over 20 years of experience in lawn care and landscaping, John leads our team with passion and expertise.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="/team-member-2.jpg"
                  alt="Sarah Johnson - Operations Manager"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
                <p className="text-green-600 font-medium mb-4">Operations Manager</p>
                <p className="text-gray-700 text-sm">
                  Sarah ensures our day-to-day operations run smoothly and that every customer receives exceptional service.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="/team-member-3.jpg"
                  alt="Mike Williams - Lead Landscaper"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Mike Williams</h3>
                <p className="text-green-600 font-medium mb-4">Lead Landscaper</p>
                <p className="text-gray-700 text-sm">
                  Mike's creative vision and attention to detail bring our landscape designs to life with stunning results.
                </p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <Image
                  src="/team-member-4.jpg"
                  alt="Lisa Chen - Customer Relations"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">Lisa Chen</h3>
                <p className="text-green-600 font-medium mb-4">Customer Relations</p>
                <p className="text-gray-700 text-sm">
                  Lisa is dedicated to ensuring our customers have the best possible experience with Lawn Care Pro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-green-800 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-green-700 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  <span>★★★★★</span>
                </div>
              </div>
              <p className="italic mb-6">
                "Lawn Care Pro has been maintaining our property for over 3 years now, and we couldn't be happier with their service. Our lawn has never looked better!"
              </p>
              <p className="font-bold">- Robert & Mary Johnson</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-green-700 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  <span>★★★★★</span>
                </div>
              </div>
              <p className="italic mb-6">
                "The landscaping team transformed our backyard into a beautiful outdoor living space. Their attention to detail and creative ideas exceeded our expectations."
              </p>
              <p className="font-bold">- Jennifer Adams</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-green-700 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400">
                  <span>★★★★★</span>
                </div>
              </div>
              <p className="italic mb-6">
                "Professional, reliable, and thorough. They show up when they say they will and always leave our property looking immaculate. Highly recommended!"
              </p>
              <p className="font-bold">- David Wilson</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-700">
            Contact us today to schedule a consultation and learn how we can help with your lawn care and landscaping needs.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
} 