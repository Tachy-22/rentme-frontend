import Link from "next/link";

export default function SecurityPage() {
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
                        Security
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400">
                        How we keep your data and transactions secure
                    </p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Data Protection</h2>
                        <p className="text-gray-300 mb-4">
                            We use encryption and secure protocols to protect your personal information and 
                            ensure safe communication between students and agents.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Payment Security</h2>
                        <p className="text-gray-300 mb-4">
                            All payment transactions are processed through secure, encrypted channels with 
                            fraud protection and dispute resolution mechanisms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Account Security</h2>
                        <p className="text-gray-300 mb-4">
                            We recommend using strong passwords and keeping your account information secure. 
                            Report any suspicious activity immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium mb-4">Verification Process</h2>
                        <p className="text-gray-300 mb-4">
                            All users undergo identity verification to ensure a safe marketplace for students 
                            and legitimate real estate professionals.
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
                <p>© 2024 Rentme. Connecting students with trusted accommodation across Nigeria.</p>
            </footer>
        </div>
    );
}