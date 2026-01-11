
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus, ImageFile, AnalysisResult } from './types';
import { analyzeImageAndFindShops } from './services/geminiService';
import { 
  CameraIcon, 
  MapPinIcon, 
  SearchIcon, 
  ShoppingBagIcon, 
  UploadIcon, 
  XIcon, 
  ExternalLinkIcon,
  Loader2Icon
} from './components/icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn("Location access denied. Search results may be less accurate.", err)
      );
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedImage({ file, base64 });
      setResult(null);
      setError(null);
      setStatus(AppStatus.IDLE);
    };
    reader.readAsDataURL(file);
  };

  const handleFindNearby = async () => {
    if (!selectedImage) return;

    setStatus(AppStatus.ANALYZING);
    setError(null);

    try {
      const data = await analyzeImageAndFindShops(
        selectedImage.base64,
        selectedImage.file.type,
        location
      );
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during the search.");
      setStatus(AppStatus.ERROR);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-zinc-800 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
            <ShoppingBagIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            ShopSeeker AI
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
          <MapPinIcon className={`w-3 h-3 ${location ? 'text-green-500' : 'text-zinc-500'}`} />
          {location ? 'Location Active' : 'Location Hidden'}
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full p-4 md:p-8 flex flex-col gap-8">
        {status === AppStatus.IDLE && !result && (
          <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto text-center py-12">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Found something <span className="text-indigo-400">stunning?</span> 
              <br />Find where it's sold.
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-md">
              Upload an image of any fashion, home decor, or tech item. We'll identify it and locate nearby shops for you.
            </p>

            <div className="w-full flex flex-col gap-4">
              {!selectedImage ? (
                <label className="group relative w-full h-64 border-2 border-dashed border-zinc-800 hover:border-indigo-500/50 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer bg-zinc-900/30 hover:bg-indigo-500/5">
                  <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 group-hover:scale-110 transition-transform">
                    <UploadIcon className="w-8 h-8 text-indigo-400" />
                  </div>
                  <span className="mt-4 font-semibold text-zinc-300">Choose an image</span>
                  <span className="mt-1 text-sm text-zinc-500">or drag and drop</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
                  <img src={URL.createObjectURL(selectedImage.file)} className="w-full h-auto max-h-[400px] object-contain bg-zinc-900" alt="Preview" />
                  <button onClick={reset} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors">
                    <XIcon className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <button 
                      onClick={handleFindNearby}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]"
                    >
                      <SearchIcon className="w-5 h-5" />
                      Find Nearby Shops
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {status === AppStatus.ANALYZING && (
          <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
              <SearchIcon className="w-8 h-8 absolute inset-0 m-auto text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Analyzing your discovery...</h3>
            <p className="text-zinc-400">We're identifying the item and scanning local inventory.</p>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="flex-grow flex flex-col items-center justify-center py-20">
            <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-3xl max-w-md text-center">
              <h3 className="text-xl font-bold text-red-400 mb-2">Search Failed</h3>
              <p className="text-zinc-400 mb-6">{error}</p>
              <button onClick={reset} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium">Try Another Image</button>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left: Identified Item */}
            <div className="flex flex-col gap-6 sticky top-28">
              <div className="rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
                <img src={selectedImage ? URL.createObjectURL(selectedImage.file) : ''} className="w-full h-auto object-cover max-h-[500px]" alt="Original" />
              </div>
              <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">AI Description</h3>
                <p className="text-lg text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {result.description}
                </p>
                <button onClick={reset} className="mt-8 text-sm font-medium text-zinc-500 hover:text-zinc-300 flex items-center gap-2">
                  <XIcon className="w-4 h-4" /> Start New Search
                </button>
              </div>
            </div>

            {/* Right: Shops */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">Nearby Shops</h3>
                <span className="text-sm text-zinc-500">{result.shops.length} results found</span>
              </div>

              {result.shops.length > 0 ? (
                <div className="space-y-4">
                  {result.shops.map((shop, idx) => (
                    <div key={idx} className="group p-6 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-indigo-500/30 rounded-3xl transition-all">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <h4 className="text-xl font-bold text-white mb-2">{shop.title}</h4>
                          {shop.snippet && (
                            <p className="text-sm text-zinc-400 line-clamp-2 italic mb-4">
                              "{shop.snippet}"
                            </p>
                          )}
                        </div>
                        <a 
                          href={shop.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-3 bg-zinc-800 group-hover:bg-indigo-600 rounded-2xl text-zinc-400 group-hover:text-white transition-all shadow-lg"
                        >
                          <ExternalLinkIcon className="w-5 h-5" />
                        </a>
                      </div>
                      <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                         <MapPinIcon className="w-3 h-3 text-indigo-500" />
                         Click the icon to view directions & hours
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
                  <p className="text-zinc-500 mb-2">No specific stores found in our local database.</p>
                  <p className="text-sm text-zinc-600">Try zooming out your search or using a different angle.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-xs text-zinc-600 border-t border-zinc-900 mt-12 bg-black/40">
        <p>© 2025 ShopSeeker AI. Powered by Gemini 2.5 Flash & Google Maps Grounding.</p>
      </footer>
    </div>
  );
};

export default App;
