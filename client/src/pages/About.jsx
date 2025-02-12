// Import necessary libraries
import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-green-400 mb-10">
          About Us
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative flex justify-center">
            <img
              src="https://media.istockphoto.com/id/612262390/photo/body-building-workout.jpg?s=612x612&w=0&k=20&c=zsRgRf3tuStA7dN5bdFS_x1ud-XdU-dJC7B6iuq_AZk="
              alt="Our Gym"
              className="rounded-lg shadow-xl w-[80%] md:w-[70%] hover:scale-105 transform transition-transform duration-300"
            />
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <p className="text-gray-300 text-lg leading-relaxed">
              At <span className="font-bold text-green-400">Anurag</span>, we
              believe fitness is more than just a routine—it's a lifestyle. Our
              mission is to empower you to achieve your goals, whether you're a
              beginner or an advanced athlete.
            </p>
            <ul className="space-y-4">
              {[
                "State-of-the-art facilities and equipment",
                "Certified and experienced trainers",
                "Personalized fitness programs",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-300">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-16 w-full flex flex-col md:flex-row items-center">
          <div className="md:w-3/4 space-y-8">
            <h3 className="text-2xl font-semibold text-green-400 text-center md:text-left">
              Our Journey
            </h3>
            {[
              {
                year: "2020",
                text: "Founded with the vision to inspire healthier lifestyles.",
              },
              {
                year: "2022",
                text: "Expanded to include new training programs and services.",
              },
              {
                year: "2023",
                text: "Awarded Best Fitness Center in the city.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative pl-8 border-l-4 border-green-500"
              >
                <div className="absolute left-[-10px] w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                <p className="text-lg font-bold text-green-400">{item.year}</p>
                <p className="text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="md:w-1/4 flex justify-center mt-10 md:mt-0">
            <img
              className="rounded-lg shadow-xl w-[80%] md:w-[70%] hover:scale-105 transform transition-transform duration-300"
              src="https://img.freepik.com/free-vector/corporate-business-growth-arrow-showing-upward-trend_1017-53556.jpg"
              alt="Growth"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
