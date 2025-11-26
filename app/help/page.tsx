import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <nav className="py-4 px-4 md:px-8">
                <Link href="/" className="inline-flex items-center text-white hover:text-gray-300 transition-colors">
                    <span className="text-lg">← Back to Home</span>
                </Link>
            </nav>

            <main className="pt-20 px-4 md:px-8 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-thin mb-6">
                        Help Center
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        Find answers to common questions about Rentme
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">Getting Started</h2>
                        <div className="space-y-4">
                            <AccordionItem value="signup" className="border-gray-700 bg-orange-200/20 rounded-lg px-6">
                                <AccordionTrigger className="text-white hover:text-gray-300 text-left text-lg font-medium py-6">
                                    How do I sign up?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                                    Use your gmail to create an account. We&apos;ll verify your student status before granting access to listings.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="documents" className="border-gray-700 bg-orange-200/20 rounded-lg px-6">
                                <AccordionTrigger className="text-white hover:text-gray-300 text-left text-lg font-medium py-6">
                                    What documents do I need?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                                    You&apos;ll need your student ID and gmail for verification. Additional documents may be required when applying for properties.
                                </AccordionContent>
                            </AccordionItem>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">Finding Accommodation</h2>
                        <div className="space-y-4">
                            <AccordionItem value="search" className="border-gray-700 bg-orange-200/20 rounded-lg px-6">
                                <AccordionTrigger className="text-white hover:text-gray-300 text-left text-lg font-medium py-6">
                                    How do I search for properties?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                                    Browse listings by location, price range, and amenities. All properties are near Nigerian university campuses.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="verification" className="border-gray-700 bg-orange-200/20 rounded-lg px-6">
                                <AccordionTrigger className="text-white hover:text-gray-300 text-left text-lg font-medium py-6">
                                    Are agents verified?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                                    Yes, all real estate agents undergo background checks and maintain ratings from previous student interactions.
                                </AccordionContent>
                            </AccordionItem>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-white">Safety & Security</h2>
                        <div className="space-y-4">
                            <AccordionItem value="payments" className="border-gray-700 bg-orange-200/20 rounded-lg px-6">
                                <AccordionTrigger className="text-white hover:text-gray-300 text-left text-lg font-medium py-6">
                                    How are payments protected?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                                    All transactions go through person to person payments with physical contracts and fraud protection.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="issues" className="border-gray-700 bg-orange-200/20 rounded-lg px-6">
                                <AccordionTrigger className="text-white hover:text-gray-300 text-left text-lg font-medium py-6">
                                    What if something goes wrong?
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base leading-relaxed pb-6">
                                    Contact our support team immediately. We have dispute resolution processes for verified transactions.
                                </AccordionContent>
                            </AccordionItem>
                        </div>
                    </div>
                </Accordion>

                <div className="text-center mt-16">
                    <p className="text-gray-400 mb-6">Still need help?</p>
                    <a href="https://wa.me/2348146225874" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-colors">
                        Contact Support
                    </a>
                </div>
            </main>

            <footer className="mt-20 border-t border-gray-800 py-8 text-center text-gray-500">
                <p>© 2024 Rentme. Connecting students with trusted accommodation across Nigeria.</p>
            </footer>
        </div>
    );
}