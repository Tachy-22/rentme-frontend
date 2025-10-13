const DecorativeLines = () => {
  return (
    <div className="fixed left-0 top-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {/* Vertical line */}
      <div className="absolute left-[20%] top-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-30"></div>
      
      {/* Horizontal line */}
      <div className="absolute left-0 top-[35%] w-[25%] h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30"></div>
      
      {/* Vertical line on right */}
      <div className="absolute right-[20%] top-0 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-20"></div>
    </div>
  );
};

export default DecorativeLines;