
const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#0d1117] to-[#161b22]">
      <div className="absolute top-[30%] left-[15%] h-[200px] w-[200px] rounded-full bg-green-400 opacity-45 blur-3xl" />

      <div className="absolute right-[25%] bottom-[20%] h-[250px] w-[250px] rounded-full bg-pink-500 opacity-40 blur-3xl" />

      <div className="absolute top-[10%] right-[40%] h-[180px] w-[180px] rounded-full bg-cyan-400 opacity-35 blur-3xl" />

      <div className="absolute bottom-[60%] left-[70%] h-[160px] w-[160px] rounded-full bg-yellow-400 opacity-30 blur-3xl" />

      <div className="absolute inset-0 bg-black/15 backdrop-blur-[6px]" />
    </div>
  );
};

export default AmbientBackground;