// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Search,
//   MapPin,
//   Star,
//   Briefcase,
//   ChevronLeft,
//   Heart,
// } from "lucide-react";
// import { EmployerNav } from "@/components/navigation/EmployerNav";

// const FILTERS = ["सब / All", "निकट / Nearest", "शीर्ष रेटेड / Top Rated"];

export default function SearchWorkersPage() {
//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState<string | null>(null);
//   const [favorites, setFavorites] = useState<string[]>([]);

//   const toggleFavorite = (id: string) => {
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

  //  return (
//     <div className="min-h-screen bg-linear-to-b from-blue-50 to-white pb-24">
//       {/* Header */}
//       <div className="sticky top-0 z-40 bg-blue-600 text-white shadow-sm">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
//           <Link href="/employer/home">
//             <ChevronLeft className="w-6 h-6 cursor-pointer" />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold">मजदूर खोजें</h1>
//             <p className="text-sm text-blue-100">Search workers</p>
//           </div>
//         </div>
//       </div>

//       {/* Search + Filter */}
//       <div className="max-w-4xl mx-auto px-4 py-4 space-y-3 sticky top-16 bg-white border-b z-30">
//         <div className="relative">
//           <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-500" />
//           <Input
//             placeholder="नाम या कौशल खोजें..."
//             className="pl-10 h-10 rounded-lg"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//         </div>

//         <div className="flex gap-2 overflow-x-auto pb-1">
//           {FILTERS.map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(filter === f ? null : f)}
//               className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
//                 filter === f
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-100 text-gray-700"
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Count */}
//       <div className="max-w-4xl mx-auto px-4 pt-4 text-sm text-gray-600">
//         {workers.length} मजदूर मिले / {workers.length} workers found
//       </div>

//       {/* Worker Cards */}
//       <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
//         {workers.map((w) => (
//           <div
//             key={w.id}
//             className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition"
//           >
//             <div className="p-4">
//               {/* Top */}
//               <div className="flex justify-between mb-3">
//                 <div className="flex gap-3">
//                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl">
//                     {w.image}
//                   </div>

//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-semibold">{w.name}</h3>
//                       {w.verified && <span className="text-blue-600">✓</span>}
//                     </div>
//                     <p className="text-sm text-gray-600">{w.skill}</p>
//                   </div>
//                 </div>

//                 <button onClick={() => toggleFavorite(w.id)}>
//                   <Heart
//                     className="w-5 h-5 text-gray-400"
//                     fill={favorites.includes(w.id) ? "currentColor" : "none"}
//                   />
//                 </button>
//               </div>

//               {/* Rating */}
//               <div className="flex justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                   <span className="font-semibold">{w.rating}</span>
//                   <span className="text-sm text-gray-600">
//                     ({w.reviews} reviews)
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-1 text-gray-600">
//                   <MapPin className="w-4 h-4" />
//                   {w.distance} km
//                 </div>
//               </div>

//               {/* Bottom */}
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-xs text-gray-600">Daily Rate</p>
//                   <p className="text-lg font-bold text-green-600">₹{w.wage}</p>
//                 </div>

//                 <div className="flex gap-2">
//                   <Link href={`/employer/worker/${w.id}`}>
//                     <Button variant="outline" size="sm">
//                       View Profile
//                     </Button>
//                   </Link>

//                   <Button size="sm" className="bg-blue-600">
//                     <Briefcase className="w-3 h-3 mr-1" />
//                     Hire
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <EmployerNav />
//     </div>
  // );
 }
