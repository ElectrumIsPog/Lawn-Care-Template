import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Our Services - Lawn Care Pro',
  description: 'Professional lawn care and landscaping services including lawn mowing, landscaping, fertilization, and more.',
};

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/services-hero.jpg"
            alt="Lawn care services"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Professional lawn care and landscaping services for residential and commercial properties
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-12 text-center">
              At Lawn Care Pro, we offer a comprehensive range of lawn care and landscaping services to keep your outdoor space looking its best year-round. Our team of experienced professionals is dedicated to providing high-quality service and exceptional results.
            </p>
          </div>

          {/* Service 1: Lawn Mowing */}
          <div id="lawn-mowing" className="max-w-6xl mx-auto mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 md:h-full">
                <Image
                  src="/lawn-mowing.jpg"
                  alt="Lawn Mowing Service"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-4">Lawn Mowing</h2>
                <p className="text-gray-700 mb-4">
                  Our professional lawn mowing service ensures your lawn maintains a healthy, manicured appearance. We use high-quality equipment and proper mowing techniques to promote healthy grass growth and prevent damage.
                </p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                  <li>Regular scheduled mowing (weekly, bi-weekly, or custom)</li>
                  <li>Precision edging along walkways and driveways</li>
                  <li>Trimming around obstacles and tight spaces</li>
                  <li>Cleanup of clippings and debris</li>
                  <li>Seasonal adjustments to mowing height</li>
                </ul>
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Service 2: Landscaping */}
          <div id="landscaping" className="max-w-6xl mx-auto mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2 relative h-64 md:h-full">
                <Image
                  src="/landscaping.jpg"
                  alt="Landscaping Service"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-bold text-green-800 mb-4">Landscaping</h2>
                <p className="text-gray-700 mb-4">
                  Transform your outdoor space with our professional landscaping services. We design and implement beautiful, functional landscapes that enhance the beauty and value of your property.
                </p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                  <li>Custom landscape design</li>
                  <li>Plant selection and installation</li>
                  <li>Mulching and decorative stone</li>
                  <li>Flower bed creation and maintenance</li>
                  <li>Tree and shrub planting</li>
                  <li>Hardscape features (patios, walkways, retaining walls)</li>
                </ul>
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Service 3: Fertilization */}
          <div id="fertilization" className="max-w-6xl mx-auto mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 md:h-full">
                <Image
                  src="/fertilization.jpg"
                  alt="Lawn Fertilization Service"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-4">Fertilization & Weed Control</h2>
                <p className="text-gray-700 mb-4">
                  Our fertilization and weed control programs provide your lawn with the nutrients it needs while keeping unwanted weeds at bay. We use environmentally responsible products and application methods.
                </p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                  <li>Customized fertilization programs</li>
                  <li>Pre-emergent and post-emergent weed control</li>
                  <li>Soil testing and pH balancing</li>
                  <li>Environmentally friendly options</li>
                  <li>Seasonal applications</li>
                </ul>
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Service 4: Lawn Aeration */}
          <div id="aeration" className="max-w-6xl mx-auto mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2 relative h-64 md:h-full">
                <Image
                  src="/aeration.jpg"
                  alt="Lawn Aeration Service"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="md:order-1">
                <h2 className="text-3xl font-bold text-green-800 mb-4">Lawn Aeration</h2>
                <p className="text-gray-700 mb-4">
                  Lawn aeration is essential for maintaining a healthy, lush lawn. Our aeration service reduces soil compaction, allowing water, air, and nutrients to reach the roots of your grass.
                </p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                  <li>Core aeration to reduce soil compaction</li>
                  <li>Improved water and nutrient absorption</li>
                  <li>Enhanced root development</li>
                  <li>Reduced thatch buildup</li>
                  <li>Overseeding options available</li>
                </ul>
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Service 5: Seasonal Cleanup */}
          <div id="cleanup" className="max-w-6xl mx-auto mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 md:h-full">
                <Image
                  src="/seasonal-cleanup.jpg"
                  alt="Seasonal Cleanup Service"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-4">Seasonal Cleanup</h2>
                <p className="text-gray-700 mb-4">
                  Our seasonal cleanup services prepare your lawn and landscape for the changing seasons, ensuring it looks its best year-round and stays healthy through every season.
                </p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                  <li>Spring cleanup (debris removal, bed preparation)</li>
                  <li>Fall leaf removal and disposal</li>
                  <li>Pruning and trimming of shrubs and small trees</li>
                  <li>Gutter cleaning</li>
                  <li>Winter preparation</li>
                </ul>
                <Link 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-700">
            Contact us today for a free consultation and estimate for your lawn care and landscaping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              href="/gallery" 
              className="bg-white hover:bg-gray-100 text-green-800 border border-green-600 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 