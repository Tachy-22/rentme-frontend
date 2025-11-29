import Link from "next/link";

export default function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        Terms and conditions for using Rentme
                    </p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Acceptance of Terms</h2>
                        <p className="text-gray-300 mb-4">
                            By using Rentme, you agree to these terms of service and our privacy policy.
                            These terms apply to all users of the platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">User Responsibilities</h2>
                        <p className="text-gray-300 mb-4">
                            Users must provide accurate information, maintain account security, and follow
                            platform guidelines when interacting with other users.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Platform Rules</h2>
                        <p className="text-gray-300 mb-4">
                            All listings must be accurate, users must be verified students or licensed agents,
                            and transactions must comply with local laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Contact Information</h2>
                        <p className="text-gray-300 mb-4">
                            For questions about these terms, please contact our support team through the platform.
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