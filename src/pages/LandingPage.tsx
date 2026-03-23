import Footer from "../components/Footer";
import ContactUs from "../components/LandingPageComponents/ContactUs";
import Hero from "../components/LandingPageComponents/Hero";
import HowItWorks from "../components/LandingPageComponents/HowItWorks";
import WhyChooseUs from "../components/LandingPageComponents/WhyChooseUs";

export default function LandingPage(){

    return (
        <main>
            <section>
                <Hero />
            </section>

            <section>
                <HowItWorks />
            </section>

            <section>
                <WhyChooseUs />
            </section>

            <section>
                <ContactUs />
            </section>

            <section>
                <Footer />
            </section>
        </main>
    )
}