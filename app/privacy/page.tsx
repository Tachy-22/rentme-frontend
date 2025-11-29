import Link from "next/link";

export default function PrivacyPage() {
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
                        Privacy Policy
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        How we protect and handle your personal information
                    </p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Information We Collect</h2>
                        <p className="text-gray-300 mb-4">
                            We collect information you provide when creating an account, including your university email,
                            student ID verification, and accommodation preferences.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">How We Use Your Information</h2>
                        <p className="text-gray-300 mb-4">
                            Your information is used to verify your student status, match you with suitable accommodations,
                            and facilitate secure communications with real estate agents.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Data Security</h2>
                        <p className="text-gray-300 mb-4">
                            We implement industry-standard security measures to protect your personal information and
                            ensure secure transactions on our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
                        <p className="text-gray-300 mb-4">
                            If you have questions about this privacy policy, please contact us through our support channels.
                        </p>
                    </section>
                </div>

                <div className="text-center mt-16">
                    <Link href="/" className="inline-block px-8 py-3 border border-white/30 text-white rounded-full text-lg font-medium hover:border-white/50 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </main>

            <footer className="mt-20 border-t border-gray-800 py-8 text-center text-gray-500">
                <p>© 2025 Rentme. Connecting students with trusted accommodation across Nigeria.</p>
            </footer>
        </div>
    );
}