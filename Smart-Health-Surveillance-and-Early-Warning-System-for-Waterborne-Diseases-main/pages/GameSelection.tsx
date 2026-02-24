
import React from 'react';
import { ArrowLeft, Play, Star, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATE_GAMES = [
  {
    id: 'AS',
    name: 'Assam',
    title: 'Rhino Guardian Chronicles',
    image: 'https://images.unsplash.com/photo-1589041120968-35cb6766c757?q=80&w=1000&auto=format&fit=crop', // Tea/Nature vibe
    color: 'from-green-500 to-emerald-700',
    icon: '🦏'
  },
  {
    id: 'AR',
    name: 'Arunachal Pradesh',
    title: 'Dawn of the Mountains',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1000&auto=format&fit=crop', // Mountain/Monastery vibe
    color: 'from-orange-500 to-red-700',
    icon: '🏔️'
  },
  {
    id: 'MN',
    name: 'Manipur',
    title: 'Jewel of the Lake',
    image: 'https://images.unsplash.com/photo-1605628964970-13d1c920536c?q=80&w=1000&auto=format&fit=crop', // Lake/Cultural vibe
    color: 'from-indigo-500 to-blue-700',
    icon: '💃'
  },
  {
    id: 'ML',
    name: 'Meghalaya',
    title: 'Cloud Walker Odyssey',
    image: 'https://images.unsplash.com/photo-1594813959826-6b2229419b45?q=80&w=1000&auto=format&fit=crop', // Waterfall/Cloud vibe
    color: 'from-teal-500 to-cyan-700',
    icon: '☁️'
  },
  {
    id: 'MZ',
    name: 'Mizoram',
    title: 'Bamboo Dance Rhythm',
    image: 'https://images.unsplash.com/photo-1533552837286-90769363a033?q=80&w=1000&auto=format&fit=crop', // Hills/Forest vibe
    color: 'from-pink-500 to-rose-700',
    icon: '🎍'
  },
  {
    id: 'NL',
    name: 'Nagaland',
    title: 'Warrior\'s Festival',
    image: 'https://images.unsplash.com/photo-1606992323719-79ba672629b3?q=80&w=1000&auto=format&fit=crop', // Tribal/Cultural vibe
    color: 'from-red-600 to-red-900',
    icon: '🛡️'
  },
  {
    id: 'TR',
    name: 'Tripura',
    title: 'Palace of Legends',
    image: 'https://images.unsplash.com/photo-1596530467368-2432a26732f7?q=80&w=1000&auto=format&fit=crop', // Architecture/History vibe
    color: 'from-yellow-500 to-amber-700',
    icon: '🏰'
  },
  {
    id: 'SK',
    name: 'Sikkim',
    title: 'Snow Peak Quest',
    image: 'https://images.unsplash.com/photo-1549646536-22444c9794cb?q=80&w=1000&auto=format&fit=crop', // Snow/Himalaya vibe
    color: 'from-blue-400 to-blue-600',
    icon: '❄️'
  }
];

const GameSelection = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-1.5 rounded-full shadow-lg">
            <Trophy className="w-4 h-4 text-white" />
            <span className="font-bold text-sm">Level 1</span>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] tracking-tight mb-4">
            SELECT YOUR REGION
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Embark on a unique environmental quest across the 8 states of North East India.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATE_GAMES.map((game) => {
            // SPECIFIC LOGIC: Arunachal Pradesh gets the new Runner Game URL
            const gameUrl = game.id === 'AR' 
                ? 'https://jal-suraksha-kavach-runner-584828094434.us-west1.run.app/'
                : 'https://infinite-heroes-584828094434.us-west1.run.app/';

            return (
            <div key={game.id} className="group relative h-[400px] w-full perspective-1000 cursor-pointer">
              {/* Card Container */}
              <div className="relative w-full h-full rounded-2xl transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 shadow-2xl">
                
                {/* Image Layer */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${game.id}/400/600`
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${game.color} opacity-40 mix-blend-multiply transition-opacity group-hover:opacity-30`}></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                </div>

                {/* Glossy Reflection */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-white/10"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start z-10">
                  {/* State Badge */}
                  <div className="flex items-center gap-2 mb-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xl">{game.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">{game.name}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black text-white leading-tight mb-4 drop-shadow-md group-hover:text-yellow-300 transition-colors">
                    {game.title}
                  </h3>

                  {/* Play Button - Dynamic Link based on State */}
                  <a 
                    href={gameUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-white/10 hover:bg-white text-white hover:text-black backdrop-blur-md border border-white/30 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    PLAY NOW
                  </a>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                   <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
                </div>

              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
