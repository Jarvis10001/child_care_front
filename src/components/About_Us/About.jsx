import React from "react";
// import aboutimg from "./aboutimg.jpg";
import aboutimg from "../../assets/aboutimg.jpg";


function About() {
    return (
        <div id="about" className="relative bg-white overflow-hidden mt-16">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                        fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                        <polygon points="50,0 100,0 50,100 0,100"></polygon>
                    </svg>

                    <div className="pt-1"></div>

                    <main className="text-left mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="text-left sm:text-center lg:text-left">
                            <h2 className="text-left my-6 text-2xl tracking-tight font-extrabold text-gray-900 sm:text-3xl md:text-4xl">
                                About Us
                            </h2>

                            <p class="w-full text-left text-base font-medium text-gray-700">
                            At FLowBite, we are dedicated to providing the highest standards of expertise in pediatric therapy. Our team of experienced professionals is committed 
                            to <br />
                            delivering results-driven interventions tailored to each child's unique needs.
                            <br/>
                            We believe in setting customized SMART goals—Specific, Measurable, Achievable, Relevant, and 
                            Time-bound—to ensure meaningful progress. This approach allows parents to track their child's development in real-time, 
                            fostering confidence and clarity in their therapy journey.
                            Our mission is to empower children with the <br />
                            skills they need to thrive, using evidence-based 
                            techniques and a <br />compassionate, child-centered approach. Whether it's speech therapy, <br />occupational therapy, or developmental 
                            support, we are here to guide every <br />step of the way.
                            Join us in building a brighter future for your child.
                            </p>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img className="h-56 w-full object-cover object-top sm:h-70 md:h-70 lg:h-96 xl:h-[550px]"
                    // src="https://cdn.pixabay.com/photo/2016/03/23/04/01/woman-1274056_960_720.jpg"
                    src={aboutimg}
                    alt="Woman Portrait"
                />
            </div>
        </div>
    );
}

export default About;
