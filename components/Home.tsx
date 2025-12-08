"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect, ReactNode } from "react";
import {
    DraggableCardBody,
    DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { LampContainer } from "@/components/ui/lamp";
import Image from "next/image";

interface StoryData {
    page: number;
    title: string;
    subtitle: string;
    content: string;
    image: string;
}

interface StoryCardProps {
    story: StoryData;
    index: number;
}

function StoryCard({ story, index }: StoryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Individual card mouse tracking
    const cardMouseX = useMotionValue(0);
    const cardMouseY = useMotionValue(0);

    const cardMouseXSpring = useSpring(cardMouseX);
    const cardMouseYSpring = useSpring(cardMouseY);

    const cardRotateX = useTransform(cardMouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const cardRotateY = useTransform(cardMouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        cardMouseX.set(xPct);
        cardMouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        cardMouseX.set(0);
        cardMouseY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            key={index}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onHoverStart={() => setIsHovered(true)}
            style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                transformStyle: "preserve-3d",
            }}
            className="flex-none w-screen sm:w-[320px] md:w-[450px] h-[550px] relative cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <motion.div
                className="relative w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-sm shadow-2xl overflow-hidden"
                animate={{
                    boxShadow: isHovered
                        ? "0 50px 100px -20px rgba(0, 0, 0, 0.5)"
                        : "0 20px 40px -10px rgba(0, 0, 0, 0.3)",
                }}
                transition={{ duration: 0.3 }}
                style={{
                    transform: "translateZ(50px)",
                }}
            >
                {/* Elegant border animations */}
                <motion.div
                    className="absolute inset-0 border border-black/10"
                    animate={{
                        opacity: isHovered ? 0.3 : 0.1,
                    }}
                />

                {/* Top geometric accent */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent"
                    animate={{
                        scaleX: isHovered ? 1 : 0.5,
                        opacity: isHovered ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-100"
                    style={{
                        backgroundImage: `url(${story.image})`,
                    }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Main content */}
                <div className="relative h-full flex flex-col justify-between p-4 md:p-8">
                    {/* Brand section */}
                    <motion.div
                        className="space-y-6"
                        animate={{
                            y: isHovered ? -5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Page number logo */}
                        <motion.div
                            className="text-center"
                            animate={{
                                y: isHovered ? -5 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 border-2 border-white/40 flex items-center justify-center"
                                animate={{
                                    rotate: isHovered ? 90 : 0,
                                    scale: isHovered ? 1.1 : 1,
                                    borderColor: isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                                }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <motion.div
                                    className="text-white font-bold text-xl"
                                    animate={{
                                        rotate: isHovered ? -90 : 0,
                                    }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    {story.page}
                                </motion.div>
                            </motion.div>

                            <motion.h1
                                className="text-lg md:text-xl font-thin tracking-[0.3em] text-white mb-2"
                                animate={{
                                    letterSpacing: isHovered ? "0.4em" : "0.3em",
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {story.title.toUpperCase()}
                            </motion.h1>

                            <motion.div
                                className="w-24 h-px bg-white/60 mx-auto"
                                animate={{
                                    scaleX: isHovered ? 1.5 : 1,
                                    backgroundColor: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
                                }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.div>

                        {/* Content showcase */}
                        <motion.div
                            className="text-center space-y-4"
                            animate={{
                                y: isHovered ? -10 : 0,
                            }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                        >
                            <motion.p
                                className="text-xs tracking-widest text-gray-300 uppercase"
                                animate={{
                                    opacity: isHovered ? 1 : 0.8,
                                    color: isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
                                }}
                            >
                                {story.subtitle}
                            </motion.p>

                            <motion.p
                                className="text-xs md:text-sm text-white/90 leading-relaxed px-2 md:px-4"
                                animate={{
                                    scale: isHovered ? 1.02 : 1,
                                    opacity: isHovered ? 1 : 0.9,
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {story.content}
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Bottom section */}
                    <motion.div
                        className="space-y-6"
                        animate={{
                            y: isHovered ? 10 : 0,
                        }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Animated lines */}
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    animate={{
                                        scaleX: isHovered ? [0, 1, 0.7][i] : [0.3, 0.6, 0.4][i],
                                        opacity: isHovered ? 0.9 : 0.5,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Call to action */}
                        <motion.div
                            className="text-center"
                            animate={{
                                opacity: isHovered ? 1 : 0.8,
                            }}
                        >
                            <motion.p
                                className="text-xs tracking-[0.2em] text-gray-300 uppercase mb-4"
                                animate={{
                                    letterSpacing: isHovered ? "0.25em" : "0.2em",
                                    color: isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.6)",
                                }}
                            >
                                Chapter {story.page}
                            </motion.p>

                            <motion.div
                                className="w-8 h-8 mx-auto border border-white/40 flex items-center justify-center"
                                animate={{
                                    rotate: isHovered ? 45 : 0,
                                    borderColor: isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)",
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-3 h-3 border-t border-r border-white/60 transform rotate-45" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Subtle shimmer effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{
                        x: isHovered ? ["-100%", "100%"] : "-100%",
                        opacity: isHovered ? [0, 0.5, 0] : 0,
                    }}
                    transition={{
                        duration: isHovered ? 1.5 : 0,
                        ease: "easeOut",
                    }}
                />

                {/* Background depth layers */}
                <motion.div
                    className="absolute inset-0 bg-white/5 rounded-sm -m-2"
                    style={{
                        transform: "translateZ(-25px)",
                    }}
                    animate={{
                        scale: isHovered ? 1.02 : 1,
                        opacity: isHovered ? 0.8 : 0.3,
                    }}
                />

                <motion.div
                    className="absolute inset-0 bg-white/3 rounded-sm -m-4"
                    style={{
                        transform: "translateZ(-50px)",
                    }}
                    animate={{
                        scale: isHovered ? 1.04 : 1,
                        opacity: isHovered ? 0.6 : 0.2,
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageSequenceRef = useRef<HTMLDivElement>(null);
    const bookSectionRef = useRef<HTMLDivElement>(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 3D effects are now handled per card individually

    // Award-winning principle: Image sequence animation like Apple
    const totalFrames = 120; // Simulated frames for smooth animation

    // const { scrollYProgress } = useScroll({
    //     target: containerRef,
    //     offset: ["start start", "end end"]
    // });

    // Smooth scroll progress - Award-winning: Natural movement
    // const smoothProgress = useSpring(scrollYProgress, {
    //     stiffness: 100,
    //     damping: 30,
    //     restDelta: 0.001
    // });

    // Image sequence scroll-driven animation - Apple's signature technique
    const imageSequenceProgress = useScroll({
        target: imageSequenceRef,
        offset: ["start center", "end center"]
    });

    // Hero section - Subtle fade only
    // const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);

    // Product reveal - One element at a time, like Apple
    const productScale = useTransform(imageSequenceProgress.scrollYProgress, [0, 0.5], [0.8, 1]);
    const productOpacity = useTransform(imageSequenceProgress.scrollYProgress, [0, 0.3], [0, 1]);

    // Horizontal book scroll - simple working version
    const bookScrollProgress = useScroll({
        target: bookSectionRef,
        offset: ["start start", "end end"]
    });

    // Calculate responsive transform values
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const bookX = useTransform(
        bookScrollProgress.scrollYProgress,
        [0, 1],
        isMobile ? ["0%", "-83%"] : ["1%", "-95%"]
    );


    // Image sequence frame calculation
    useEffect(() => {
        const unsubscribe = imageSequenceProgress.scrollYProgress.on("change", (latest) => {
            const frame = Math.round(latest * (totalFrames - 1));
            setCurrentFrame(frame);
        });
        return unsubscribe;
    }, [imageSequenceProgress.scrollYProgress]);

    // Generate image sequence URLs (simulated)
    const getImageUrl = (frame: number) => {
        // Using different Unsplash images to simulate frame sequence
        const imageIds = [
            "students_searching_the_rentme_platform.png", // Forest
            "students_searching_the_rentme_platform.png", // Mountain
            "student_meeting_agents.png", // Mountain
            "student_moving_in.png", // Forest
        ];
        const imageIndex = Math.floor((frame / totalFrames) * imageIds.length);
        const selectedId = imageIds[Math.min(imageIndex, imageIds.length - 1)];
        return `${selectedId}`;
    };

    const navItems = [
        {
            name: "Features",
            link: "#features",
        },
        {
            name: "Stories",
            link: "#stories",
        },
        {
            name: "How it Works",
            link: "#how-it-works",
        },
        {
            name: "Contact",
            link: "#contact",
        },
    ];

    return (
        <div className="relative w-full  flex flex-col ">
            {/* Navbar */}
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo>
                        <div className="flex items-center space-x-2 ">
                            <Image src="/logo.png" alt="Rentme Logo" width={1324} height={300} className="w-[6rem] h-auto " />
                            {/* <span className="text-xl font-bold text-stone-200">Rent<span className="text-orange-400">me</span></span> */}
                        </div>
                    </NavbarLogo>
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4 ">
                        <NavbarButton variant="gradient" href="/auth">Sign up</NavbarButton>
                        <NavbarButton variant="primary" href="/auth">Log in</NavbarButton>
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo>
                            <div className="flex items-center space-x-2">
                                <Image src="/logo.png" alt="Rentme Logo" width={1320} height={320} className=" w-[5rem] h-auto " />
                            </div>
                        </NavbarLogo>
                        <div className="text-white ">
                            <MobileNavToggle
                                isOpen={isMobileMenuOpen}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            />
                        </div>
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="flex flex-col gap-4 px-4 py-6 w-full">
                            {navItems.map((item, idx) => (
                                <a
                                    key={`mobile-link-${idx}`}
                                    href={item.link}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-black text-lg font-medium hover:text-orange-500 transition-colors py-2"
                                >
                                    {item.name}
                                </a>
                            ))}

                            <div className="pt-6 border-t border-gray-200">
                                <div className="space-y-4">
                                    <NavbarButton
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        variant="secondary"
                                        className="w-full bg-gray-100 hover:bg-gray-200 border-gray-300 !text-black"
                                        href="/auth"
                                    >
                                        Sign up
                                    </NavbarButton>
                                    <NavbarButton
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        variant="primary"
                                        className="w-full bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                                        href="/auth"
                                    >
                                        Log in                                    </NavbarButton>
                                </div>
                            </div>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>

            {/* Main Content */}
            <div
                ref={containerRef}
                className="bg-black text-white min-h-[300vh] flex flex-col"
            >
                {/* Hero Section with Lamp */}
                <section className="h-screen relative overflow-hidden">
                    <LampContainer>
                        <motion.div
                            initial={{ opacity: 0.5, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.3,
                                duration: 0.8,
                                ease: "easeInOut",
                            }}
                            className="text-center max-w-5xl mx-auto px-6 md:px-8 relative z-10"
                        >
                            {/* Enhanced typography with subtle effects */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                                className="relative items-center flex justify-center"
                            >
                                <TextMorph />
                            </motion.div>

                            <motion.p
                                className="text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            >
                                Connecting verified students with trusted agents around Nigerian campuses.
                                <motion.span
                                    className="text-white/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                >
                                    {" "}Find your perfect off-campus home.
                                </motion.span>
                            </motion.p>

                            {/* Elegant feature highlights */}
                            <motion.div
                                className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 md:mb-16"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                            >
                                {["Verified Students", "Trusted Agents", "Nigerian Campuses"].map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center space-x-2 text-gray-500 text-xs md:text-sm"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.2 + i * 0.1, duration: 0.6 }}
                                        whileHover={{
                                            scale: 1.05,
                                            color: "#ffffff",
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <motion.div
                                            className="w-1.5 h-1.5 bg-white/40 rounded-full"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.4, 0.8, 0.4],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                            }}
                                        />
                                        <span>{feature}</span>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Hero CTA Buttons */}
                            <motion.div
                                className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 md:px-0"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4, duration: 0.8 }}
                            >
                                <motion.a
                                    href="/auth"
                                    className="px-5 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm md:text-base font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-center shadow-lg"
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                >
                                    Sign up
                                </motion.a>
                                <motion.a
                                    href="/auth"
                                    className="px-5 py-2 md:px-6 md:py-2.5 border-2 border-white/40 text-white rounded-full text-sm md:text-base font-medium hover:border-white hover:bg-white/10 transition-all duration-300 text-center backdrop-blur-sm"
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                >
                                    Log in                                </motion.a>
                            </motion.div>

                            {/* Enhanced scroll indicator */}
                            <motion.div
                                className="absolute -bottom-12 translate-y-40 left-1/2 transform -translate-x-1/2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.8, duration: 0.8 }}
                            >
                                <motion.div
                                    className="flex flex-col items-center space-y-2 cursor-pointer group"
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <span className="text-xs text-gray-500 uppercase tracking-wider mb-2 group-hover:text-white transition-colors">
                                        Scroll to explore
                                    </span>
                                    <motion.div
                                        className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2 relative overflow-hidden group-hover:border-white/50 transition-colors"
                                        animate={{
                                            boxShadow: [
                                                "0 0 0 rgba(255,255,255,0.1)",
                                                "0 0 20px rgba(255,255,255,0.2)",
                                                "0 0 0 rgba(255,255,255,0.1)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <motion.div
                                            className="w-1 h-3 bg-white/60 rounded-full"
                                            animate={{ y: [0, 8, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </LampContainer>
                </section>

                {/* Image Sequence Section - Apple's signature technique */}
                <section
                    ref={imageSequenceRef}
                    className="h-[120vh] relative"
                >
                    {/* Sticky container for image sequence */}
                    <div className="sticky top-0 h-screen flex items-center justify-center">
                        <motion.div
                            style={{
                                scale: productScale,
                                opacity: productOpacity,
                            }}
                            className="relative w-[95vw] md:w-[90vw] max-w-6xl h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden mx-4 md:mx-0"
                        >
                            {/* Image sequence canvas */}
                            <motion.img
                                src={getImageUrl(currentFrame)}
                                alt="Product showcase"
                                className="w-full h-full object-cover"
                                style={{
                                    filter: `brightness(${0.7 + (currentFrame / totalFrames) * 0.3})`,
                                }}
                            />

                            {/* Overlay content that appears/disappears */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="text-center text-white"
                                    animate={{
                                        opacity: currentFrame > 30 && currentFrame < 90 ? 1 : 0,
                                        y: currentFrame > 30 && currentFrame < 90 ? 0 : 20,
                                    }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                >
                                    <h2 className="text-2xl md:text-4xl lg:text-6xl font-thin mb-4">
                                        {currentFrame < 40 ? "Search" :
                                            currentFrame < 70 ? "Connect" : "Move In"}
                                    </h2>
                                    <p className="text-sm md:text-lg text-white/90 px-4 md:px-0">
                                        {currentFrame < 40 ? "Browse verified listings near your campus" :
                                            currentFrame < 70 ? "Chat with trusted real estate agents" : "Secure your perfect student accommodation"}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Progress indicator */}
                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-white rounded-full"
                                        style={{
                                            width: `${(currentFrame / totalFrames) * 100}%`,
                                        }}
                                        transition={{ duration: 0.1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Feature Text - Subtle reveal */}
                <section className="h-[50vh] lg:h-fit pb-40 flex items-center justify-center overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center max-w-4xl mx-auto px-4 md:px-8"
                    >
                        {/* Apple-style scroll reveal for heading */}
                        <motion.h2
                            className="text-3xl md:text-5xl lg:text-6xl font-thin mb-6 md:mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            viewport={{ once: true }}
                        >
                            Housing Made Simple
                        </motion.h2>

                        {/* Paragraph with staggered reveals */}
                        <motion.div className="text-lg md:text-xl text-gray-400 leading-relaxed mb-12 md:mb-16">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                No more endless searching. No more unreliable agents.
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                Just verified students connecting with trusted professionals.
                            </motion.p>
                        </motion.div>

                        {/* Feature grid with cool scroll-driven reveals */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {[
                                { title: "Verified", desc: "Only authenticated students" },
                                { title: "Trusted", desc: "Pre-screened real estate agents" },
                                { title: "Transparent", desc: "Clear process, fair pricing" },
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 60, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.2,
                                        ease: [0.25, 0.1, 0.25, 1],
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    className="text-center relative group"
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.3, type: "spring", stiffness: 300 }
                                    }}
                                >
                                    {/* Animated background glow */}
                                    <motion.div
                                        className="absolute inset-0 bg-white/5 rounded-xl blur-xl"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 0.5, scale: 1.2 }}
                                        transition={{ duration: 1, delay: i * 0.2 + 0.5 }}
                                        whileHover={{ opacity: 0.8, scale: 1.3 }}
                                    />

                                    {/* Icon circle with rotation animation */}
                                    <motion.div
                                        className="w-16 h-16 mx-auto mb-4 border border-white/20 rounded-full flex items-center justify-center relative"
                                        initial={{
                                            borderColor: "rgba(255,255,255,0.1)",
                                            rotate: 0
                                        }}
                                        whileInView={{
                                            borderColor: "rgba(255,255,255,0.3)",
                                            rotate: 360
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            delay: i * 0.2 + 0.3,
                                            ease: "easeOut"
                                        }}
                                        whileHover={{
                                            borderColor: "rgba(255,255,255,0.5)",
                                            rotate: 720,
                                            transition: { duration: 0.6 }
                                        }}
                                    >
                                        <motion.div
                                            className="w-6 h-6 bg-white/30 rounded-full"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.2 + 0.6,
                                                type: "spring",
                                                stiffness: 200
                                            }}
                                            whileHover={{
                                                scale: 1.2,
                                                backgroundColor: "rgba(255,255,255,0.5)"
                                            }}
                                        />
                                    </motion.div>

                                    <motion.h3
                                        className="text-lg font-medium mb-2"
                                        initial={{ letterSpacing: "0.1em" }}
                                        whileInView={{ letterSpacing: "0.15em" }}
                                        transition={{ duration: 0.6, delay: i * 0.2 + 0.4 }}
                                        whileHover={{ letterSpacing: "0.2em" }}
                                    >
                                        {feature.title}
                                    </motion.h3>
                                    <motion.p
                                        className="text-sm text-gray-500"
                                        initial={{ opacity: 0.5 }}
                                        whileInView={{ opacity: 1 }}
                                        transition={{ duration: 0.6, delay: i * 0.2 + 0.5 }}
                                        whileHover={{ opacity: 1, color: "rgba(255,255,255,0.9)" }}
                                    >
                                        {feature.desc}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* Horizontal Scroll - Book Opening Animation */}
                <section
                    id="stories"
                    ref={bookSectionRef}
                    className="relative h-[400vh] md:h-[300vh] bg-black"
                >
                    <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                        <div className="w-full">
                            {/* Section header */}
                            <motion.div
                                className="text-center mb-12 md:mb-16 px-4 md:px-8"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                                viewport={{ once: true, amount: 0.3 }}
                            >
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin mb-4 md:mb-6">
                                    Your Journey Starts Here
                                </h2>
                                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                                    Discover the story of students finding their perfect homes
                                </p>
                            </motion.div>

                            {/* Horizontal scrolling container */}
                            <motion.div
                                style={{ x: bookX }}
                                className="flex gap-4 md:gap-8 w-max"
                            >
                                {[
                                    {
                                        page: 1,
                                        title: "The Search",
                                        subtitle: "Every journey begins with a dream",
                                        content: "Thousands of students across Nigeria begin their quest for independence, seeking that perfect place to call home.",
                                        image: "the_search.png",
                                    },
                                    {
                                        page: 2,
                                        title: "The Connection",
                                        subtitle: "Where trust meets opportunity",
                                        content: "Verified students connect with trusted agents through Rentme's secure platform, building lasting relationships.",
                                        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=800&fit=crop&crop=center",
                                    },
                                    {
                                        page: 3,
                                        title: "The Discovery",
                                        subtitle: "Finding home in unexpected places",
                                        content: "From cozy studios near UNILAG to spacious apartments around UI campus, every student finds their match.",
                                        image: "the_discovery.png",
                                    },
                                    {
                                        page: 4,
                                        title: "The Negotiation",
                                        subtitle: "Fair deals, transparent process",
                                        content: "Secure negotiations, transparent pricing, and digital contracts ensure every student gets the best deal possible.",
                                        image: "the_negociation.png",
                                    },
                                    {
                                        page: 5,
                                        title: "The Beginning",
                                        subtitle: "Where memories are made",
                                        content: "Move-in day arrives, keys are exchanged, and another student begins their journey of growth and independence.",
                                        image: "the_begining.png",
                                    },
                                    {
                                        page: 6,
                                        title: "Your Chapter",
                                        subtitle: "Ready to write your story?",
                                        content: "Join thousands who have found their perfect accommodation through Rentme. Your perfect home awaits.",
                                        image: "your_chapter.png",
                                    }
                                ].map((story, index) => {
                                    return (
                                        <StoryCard key={story.page} story={story} index={index} />
                                    );
                                })}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Dive In Section */}
                <section className="py-16 md:py-20 bg-black text-white overflow-x-hidden">
                    <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <motion.h2
                                className="text-4xl md:text-6xl lg:text-7xl font-thin mb-6 md:mb-8"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                                viewport={{ once: true }}
                            >
                                Let&apos;s Dive In
                            </motion.h2>
                            {/* <div className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto">
                                <TextGenerateEffect words="" />
                            </div> */}
                            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                                Experience the seamless journey of finding your perfect student accommodation. Every scroll brings you closer to home. Discover verified agents, secure payments, and trusted connections across Nigerian universities.                                </p>

                            {/* Scroll indicator */}
                            {/* <motion.div
                                className="flex flex-col items-center space-y-4"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-sm text-gray-500 uppercase tracking-wider">
                                    Keep scrolling for the experience
                                </span>
                                <motion.div
                                    className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2"
                                    animate={{
                                        boxShadow: [
                                            "0 0 0 rgba(255,255,255,0.1)",
                                            "0 0 20px rgba(255,255,255,0.2)",
                                            "0 0 0 rgba(255,255,255,0.1)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <motion.div
                                        className="w-1 h-3 bg-white/60 rounded-full"
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.div>
                            </motion.div> */}
                        </motion.div>
                    </div>
                </section>

                {/* Trippy Scroll Section */}
                {/* <TrippyScroll /> */}
                {/* Text Parallax Section */}
                <section id="features" className="overflow-x-hidden">
                    <TextParallaxContentExample />
                </section>

                {/* Product Features - Scroll-driven reveals */}
                <section id="how-it-works" className="py-8 overflow-x-hidden max-w-[100vw]">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        {/* Section header */}
                        <motion.div
                            className="text-center mb-12 md:mb-20"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin mb-4 md:mb-6">
                                How Rentme Works
                            </h2>
                            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                                Three simple steps to your perfect student accommodation
                            </p>
                        </motion.div>

                        {/* Feature blocks */}
                        <div className="space-y-20 md:space-y-32">
                            {[
                                {
                                    title: "Create Your Profile",
                                    description: "Join as a verified student with your gmail. Set your preferences, budget, and location near your campus Then verify your self by submitting your Student Id",
                                    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center",
                                    reverse: false
                                },
                                {
                                    title: "Browse & Connect",
                                    description: "Explore verified listings from trusted real estate agents. Chat directly with agents and schedule viewings.",
                                    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center",
                                    reverse: true
                                },
                                {
                                    title: "Secure Your Home",
                                    description: "Complete secure payments directly with the agents, sign contracts, and get your keys. Move into your perfect student accommodation.",
                                    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop&crop=center",
                                    reverse: false
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center ${feature.reverse ? 'lg:grid-flow-col-dense' : ''
                                        }`}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: 0.2,
                                        ease: [0.25, 0.1, 0.25, 1]
                                    }}
                                    viewport={{ once: true, amount: 0.3 }}
                                >
                                    {/* Text content */}
                                    <div className={feature.reverse ? 'lg:col-start-2' : ''}>
                                        <motion.h3
                                            className="text-2xl md:text-3xl lg:text-4xl font-thin mb-4 md:mb-6"
                                            initial={{ opacity: 0, x: feature.reverse ? 30 : -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.4 }}
                                            viewport={{ once: true }}
                                        >
                                            {feature.title}
                                        </motion.h3>
                                        <motion.p
                                            className="text-base md:text-lg text-gray-400 leading-relaxed"
                                            initial={{ opacity: 0, x: feature.reverse ? 30 : -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: 0.6 }}
                                            viewport={{ once: true }}
                                        >
                                            {feature.description}
                                        </motion.p>
                                    </div>

                                    {/* Image */}
                                    <motion.div
                                        className={`relative ${feature.reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                                            <img
                                                src={feature.image}
                                                alt={feature.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Student Stories - Draggable Cards */}
                {/* <section className="py-16 md:py-20 bg-gray-900/30 relative overflow-x-hidden max-w-screen">
                    <motion.div
                        className="text-center mb-12 md:mb-16 relative z-20 px-4"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-thin mb-4 md:mb-6">
                            Industry Recognition
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400">
                            Quotes from real estate giants
                        </p>
                    </motion.div>

                    <DraggableTestimonials />
                </section> */}



                {/* Technical Specs - Apple-style layout */}
                <section className="py-20 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto px-8">
                        <motion.div
                            className="text-center mb-20"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-7xl font-thin mb-6">
                                Platform Stats
                            </h2>
                            <p className="text-xl text-gray-400">
                                Trusted by students across Nigerian universities
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: "Active Students", value: "100+", unit: "Verified" },
                                { label: "Partner Agents", value: "20+", unit: "Trusted" },
                                { label: "Universities", value: "1", unit: "Campuses" },
                                { label: "Success Rate", value: "96%", unit: "Matched" }
                            ].map((spec, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                >
                                    <motion.div
                                        className="text-4xl md:text-5xl font-thin text-white mb-2"
                                        whileInView={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                        viewport={{ once: true }}
                                    >
                                        {spec.value}
                                    </motion.div>
                                    <div className="text-sm text-gray-400 uppercase tracking-wider">
                                        {spec.label}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {spec.unit}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section id="contact" className="py-16 md:py-20 overflow-x-hidden">
                    <motion.div
                        className="text-center max-w-4xl mx-auto px-4 md:px-8"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-thin mb-6 md:mb-8">
                            Ready to Find Your Home?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 md:mb-12 leading-relaxed">
                            Join students who&apos;ve already found their perfect
                            <br />
                            off-campus accommodation through Rentme.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 md:px-0">
                            <motion.a
                                href="/auth"
                                className="px-8 py-3 bg-white text-black rounded-full text-lg font-medium hover:bg-gray-100 transition-colors text-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                Sign up
                            </motion.a>
                            <motion.a
                                href="/auth"
                                className="px-8 py-3 border border-white/30 text-white rounded-full text-lg font-medium hover:border-white/50 transition-colors text-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            >
                                Log in
                            </motion.a>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-8 md:py-12">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="font-medium mb-4">For Students</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <motion.a
                                        href="/auth"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Browse Listings
                                    </motion.a>
                                    <motion.a
                                        href="#how-it-works"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        How It Works
                                    </motion.a>
                                    <motion.a
                                        href="#features"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Safety Tips
                                    </motion.a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">For Agents</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <motion.a
                                        href="/auth"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        List Property
                                    </motion.a>
                                    <motion.a
                                        href="#features"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Agent Resources
                                    </motion.a>
                                    <motion.a
                                        href="#stories"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Success Stories
                                    </motion.a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">Support</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <motion.a
                                        href="/help"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Help Center
                                    </motion.a>
                                    <motion.a
                                        href="https://wa.me/2348146225874"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Contact Us
                                    </motion.a>
                                    <motion.a
                                        href="https://wa.me/2348146225874"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Report Issue
                                    </motion.a>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-4">Legal</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <motion.a
                                        href="/privacy"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Privacy
                                    </motion.a>
                                    <motion.a
                                        href="/terms"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Terms
                                    </motion.a>
                                    <motion.a
                                        href="/security"
                                        className="block hover:text-white transition-colors"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        Security
                                    </motion.a>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-white/10 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-sm text-gray-500">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            >
                                © 2025 Rentme. Connecting students with trusted accommodation across Nigeria.
                            </motion.p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}


const TextParallaxContentExample = () => {
    return (
        <div className="bg-white pt-10">
            <TextParallaxContent
                imgUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                subheading="Verified Students"
                heading="Built for Trust."
            >
                <RentmeContent
                    title="Student Verification System"
                    description="Every student on Rentme is verified through their university details and student ID. This ensures that agents are connecting with genuine students, creating a safer marketplace for everyone."
                // buttonText="Learn About Verification"
                // buttonLink="/features"
                />
            </TextParallaxContent>
            <TextParallaxContent
                imgUrl="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                subheading="Quality Assurance"
                heading="Never Compromise."
            >
                <RentmeContent
                    title="Trusted Real Estate Agents"
                    description="We partner only with licensed and verified real estate agents across Nigerian universities. Each agent undergoes thorough background checks and maintains high ratings from students."
                // buttonText="View Partner Agents"
                // buttonLink="/auth"
                />
            </TextParallaxContent>
            <TextParallaxContent
                imgUrl="https://images.unsplash.com/photo-1571055107559-3e67626fa8be?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                subheading="Modern Living"
                heading="Home Away From Home."
            >
                <RentmeContent
                    title="Quality Accommodations"
                    description="From modern studios to shared apartments, every listing is verified for quality, safety, and proximity to campus. Find your perfect student accommodation with confidence."
                    buttonText="Browse Listings"
                    buttonLink="/auth"
                />
            </TextParallaxContent>
        </div>
    );
};

const IMG_PADDING = 12;

const TextParallaxContent = ({
    imgUrl,
    subheading,
    heading,
    children,
}: {
    imgUrl: string;
    subheading: string;
    heading: string;
    children: ReactNode;
}) => {
    return (
        <div
            style={{
                paddingLeft: IMG_PADDING,
                paddingRight: IMG_PADDING,
            }}
        >
            <div className="relative h-[100vh] lg:h-[100vh]">
                <StickyImage imgUrl={imgUrl} />
                <OverlayCopy heading={heading} subheading={subheading} />
            </div>
            {children}
        </div>
    );
};

const StickyImage = ({ imgUrl }: { imgUrl: string }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["end end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    return (
        <motion.div
            style={{
                backgroundImage: `url(${imgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: `calc(100vh - ${IMG_PADDING * 2}px)`,
                top: IMG_PADDING,
                scale,
            }}
            ref={targetRef}
            className="sticky z-0 overflow-hidden rounded-3xl "
        >
            <motion.div
                className="absolute inset-0 bg-neutral-950/70"
                style={{
                    opacity,
                }}
            />
        </motion.div>
    );
};

const OverlayCopy = ({
    subheading,
    heading,
}: {
    subheading: string;
    heading: string;
}) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
    const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

    return (
        <motion.div
            style={{
                y,
                opacity,
            }}
            ref={targetRef}
            className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
        >
            <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
                {subheading}
            </p>
            <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
        </motion.div>
    );
};

const RentmeContent = ({
    title,
    description,
    buttonText,
    buttonLink
}: {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}) => (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pb-24 lg:pt-12 md:grid-cols-12">
        <h2 className="col-span-1 text-3xl font-bold md:col-span-4 text-black">
            {title}
        </h2>
        <div className="col-span-1 md:col-span-8">
            <p className="mb-8 text-xl text-neutral-600 md:text-2xl leading-relaxed">
                {description}
            </p>
            {buttonText && <a
                href={buttonLink}
                className="inline-block w-full rounded bg-neutral-900 px-9 py-4 text-xl text-white transition-colors hover:bg-neutral-700 md:w-fit text-center"
            >
                {buttonText} <span className="inline ml-2">→</span>
            </a>}
        </div>
    </div>
);

const TextMorph = () => {
    const [index, setIndex] = useState(0);

    const words = [
        "Home",
        "Trust",
        "Meet",
        "Safe"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [words.length]);

    return (
        <motion.div
            className="text-5xl md:text-7xl lg:text-9xl font-thin tracking-tight mb-6 md:mb-8 relative justify-center flex"
            // whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <span className="relative inline ">
                Rent<span className="text-orange-400">me</span>
                {/* Subtle text glow for Rentme */}
                <motion.div
                    className="absolute inset-0 text-white/20 blur-sm"
                    animate={{
                        opacity: [0, 0.3, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    Rent<span className="text-orange-400/20">me</span>
                </motion.div>
            </span>

            <span className="text-gray-400 ml-2 md:ml-6 inline-block relative align-top  min-w-[130px] md:min-w-[330px]" style={{ lineHeight: '1' }}>
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{
                            opacity: i === index ? 1 : 0,
                            y: i === index ? 0 : 20,
                            filter: i === index ? "blur(0px)" : "blur(10px)"
                        }}
                        transition={{
                            duration: 0.5,
                            ease: [0.25, 0.1, 0.25, 1]
                        }}
                        className="absolute left-0 top-0 text-nowrap  "
                        style={{ lineHeight: '1' }}
                    >
                        - {word}
                    </motion.span>
                ))}
            </span>
        </motion.div>
    );
};

const DraggableTestimonials = () => {
    const testimonials = [
        {
            name: "Adaora Okwu",
            university: "FUTA",
            course: "Engineering",
            quote: "Rentme made finding accommodation so easy! The agents were verified and trustworthy.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face",
            className: "absolute top-10 left-[5%] rotate-[-5deg]",
        },
        {
            name: "Kemi Adebayo",
            university: "University of Ibadan",
            course: "Medicine",
            quote: "No more dealing with unreliable agents or fake listings. Rentme connected me with legitimate options.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
            className: "absolute top-40 left-[25%] rotate-[-7deg]",
        },
        {
            name: "Chidubem Eze",
            university: "University of Nigeria",
            course: "Business",
            quote: "The verification process gave me peace of mind. Both students and agents are screened.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            className: "absolute top-5 left-[45%] rotate-[8deg]",
        },
        {
            name: "Funmi Adesanya",
            university: "Obafemi Awolowo University",
            course: "Psychology",
            quote: "Found my perfect student apartment in just one week. The whole process was seamless!",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
            className: "absolute top-32 left-[70%] rotate-[10deg]",
        },
        {
            name: "David Okonkwo",
            university: "University of Benin",
            course: "Computer Science",
            quote: "Secure payments and digital contracts made everything transparent. Highly recommend!",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            className: "absolute top-16 left-[15%] rotate-[2deg]",
        },
        {
            name: "Sarah Bello",
            university: "Federal University of Technology",
            course: "Electrical Engineering",
            quote: "Finally, a platform that connects real students with trusted agents. Game changer!",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
            className: "absolute top-48 left-[50%] rotate-[-3deg]",
        },
    ];

    return (
        <DraggableCardContainer className="relative flex h-[400px] md:h-[500px] w-full items-center justify-center overflow-hidden">
            {/* <motion.p
        className="absolute top-1/2 mx-auto max-w-lg -translate-y-1/2 text-center text-xl font-thin text-white/60 md:text-2xl z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Drag the cards to explore student experiences across Nigerian universities
      </motion.p> */}

            {testimonials.map((testimonial, index) => (
                <DraggableCardBody key={index} className={testimonial.className}>
                    <div className="bg-white rounded-2xl p-4 shadow-2xl w-full h-full backdrop-blur-sm">
                        <div className="flex items-center mb-4">
                            {/* <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            /> */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                                <p className="text-sm text-gray-600">{testimonial.course}</p>
                                <p className="text-xs text-gray-500">{testimonial.university}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm mb-4">
                            &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <div className="flex text-orange-400">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-lg">★</span>
                            ))}
                        </div>
                    </div>
                </DraggableCardBody>
            ))}
        </DraggableCardContainer>
    );
};

