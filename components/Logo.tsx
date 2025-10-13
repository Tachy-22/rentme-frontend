"use client"
const Logo = () => {
    return (
        <div className="relative w-16 h-16 flex items-center justify-center mb-8">
            {/* Ripple circles */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full border border-stone-400 opacity-10"></div>
                <div className="absolute w-24 h-24 rounded-full border border-stone-400 opacity-20"></div>
                <div className="absolute w-18 h-18 rounded-full border border-stone-400 opacity-30"></div>
                <div className="absolute w-14 h-14 rounded-full border border-stone-400 opacity-40"></div>
                <div className="absolute w-10 h-10 rounded-full border border-stone-400 opacity-50"></div>
            </div>

            {/* Arrow icon */}
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
            >
                <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                />
            </svg>
        </div>
    );
};

export default Logo;
