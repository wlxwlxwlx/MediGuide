import React, { useState, useEffect } from 'react';
import { MapPin, Hospital, Search, Loader2, Navigation, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getNearbyHospitals } from '@/src/lib/gemini';
import { cn } from '@/src/lib/utils';

interface HospitalInfo {
  title: string;
  uri: string;
}

export default function HospitalFinder() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findHospitals = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getNearbyHospitals(lat, lng);
      const chunks = result.groundingChunks;
      
      const foundHospitals: HospitalInfo[] = chunks
        .filter((chunk: any) => chunk.maps?.uri)
        .map((chunk: any) => ({
          title: chunk.maps.title || "未知医院",
          uri: chunk.maps.uri,
        }));

      setHospitals(foundHospitals);
    } catch (err) {
      console.error(err);
      setError("无法获取附近医院信息，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("您的浏览器不支持地理位置服务。");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        findHospitals(latitude, longitude);
      },
      (err) => {
        console.error(err);
        setError("无法获取您的位置，请确保已开启定位权限。");
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
            <MapPin size={24} />
          </div>
          <div>
            <h2 className="font-display font-semibold text-slate-800">附近医院查询</h2>
            <p className="text-xs text-slate-500">基于您的位置推荐三甲医院</p>
          </div>
        </div>
        <button
          onClick={handleGetLocation}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all text-sm font-medium shadow-md shadow-emerald-200"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          {location ? "重新定位" : "获取位置"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-4 flex items-start gap-3"
          >
            <div className="mt-0.5 shrink-0">⚠️</div>
            <p>{error}</p>
          </motion.div>
        )}

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-slate-400"
          >
            <Loader2 size={40} className="animate-spin mb-4 text-emerald-500" />
            <p className="text-sm font-medium">正在为您寻找附近的医疗机构...</p>
          </motion.div>
        ) : hospitals.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {hospitals.map((hospital, idx) => (
              <motion.a
                key={idx}
                href={hospital.uri}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg text-emerald-500 shadow-sm group-hover:bg-emerald-50 transition-colors">
                    <Hospital size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-medium text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">
                      {hospital.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">点击查看详情与导航</p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        ) : !isLoading && location && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200"
          >
            <Search size={32} className="mx-auto mb-3 text-slate-300" />
            <p className="text-sm text-slate-500">未找到附近的推荐医院，请尝试手动搜索。</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!location && !isLoading && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Navigation size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm text-slate-500">点击上方按钮，发现您身边的优质医疗资源</p>
        </div>
      )}
    </div>
  );
}
